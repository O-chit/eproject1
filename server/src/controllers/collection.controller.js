const db = require('../config/db');
const slugify = require('../utils/slugify');
const { success, error } = require('../utils/response');

/**
 * Helper hàm lấy chi tiết bộ sưu tập mùa hoàn chỉnh
 * @param {number} colId
 * @returns {Promise<object|null>}
 */
const fetchSeasonalCollectionDetail = async (colId) => {
  const colSql = `
    SELECT
      sc.id,
      sc.title,
      sc.slug,
      sc.archive_code AS code,
      sc.archive_code AS "archiveCode",
      sc.season_code AS "seasonCode",
      sc.year,
      sc.color_tone AS "colorTone",
      sc.banner_url AS "bannerUrl",
      sc.banner_url AS "bannerImage",
      sc.theme_concept AS "themeConcept",
      sc.theme_concept AS description,
      sc.philosophy_quote AS "philosophyQuote",
      sc.philosophy_quote AS "curatorPhilosophy",
      sc.quote_source AS "quoteSource",
      sc.quote_source AS "curatorName",
      sc.metrics,
      sc.process_steps AS "processSteps",
      sc.is_active AS "isActive",
      to_char(sc.start_date, 'YYYY-MM-DD') AS "startDate",
      to_char(sc.end_date, 'YYYY-MM-DD') AS "endDate"
    FROM seasonal_collections sc
    WHERE sc.id = $1
  `;

  const colRes = await db.query(colSql, [colId]);
  if (colRes.rowCount === 0) return null;

  const collection = colRes.rows[0];

  const craftsSql = `
    SELECT
      scc.curator_note AS "curatorNote",
      scc.highlight_badge AS "highlightBadge",
      scc.is_hero AS "isHero",
      scc.display_order,
      json_build_object(
        'id', c.id,
        'name', c.name,
        'slug', c.slug,
        'sku', c.code,
        'priceVnd', c.price_vnd,
        'region', r.name,
        'category', cat.name,
        'thumbnailUrl', c.thumbnail_url,
        'shortDescription', c.short_description,
        'isFeatured', c.is_featured,
        'materials', COALESCE(
          (
            SELECT json_agg(m.name)
            FROM craft_materials cm
            JOIN materials m ON cm.material_id = m.id
            WHERE cm.craft_id = c.id
          ),
          '[]'::json
        )
      ) AS craft
    FROM seasonal_collection_crafts scc
    JOIN crafts c ON scc.craft_id = c.id
    JOIN regions r ON c.region_id = r.id
    JOIN craft_categories cat ON c.category_id = cat.id
    WHERE scc.seasonal_collection_id = $1
    ORDER BY scc.is_hero DESC, scc.display_order ASC
  `;

  const craftsRes = await db.query(craftsSql, [colId]);

  const curatedCrafts = craftsRes.rows.map((row) => ({
    craft: row.craft,
    curatorNote: row.curatorNote,
    highlightBadge: row.highlightBadge,
    isHero: row.isHero,
    displayOrder: row.display_order,
  }));

  const heroItem = curatedCrafts.find((item) => item.isHero) || curatedCrafts[0] || null;
  collection.heroCraft = heroItem ? heroItem.craft : null;
  collection.curatedCrafts = curatedCrafts;
  collection.crafts = curatedCrafts.map(c => c.craft);

  return collection;
};

/**
 * Danh sách bộ sưu tập chuyên đề thông thường
 * GET /api/collections
 */
const getCollections = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        title,
        slug,
        description,
        banner_url AS "bannerUrl"
      FROM collections
      ORDER BY id ASC
    `);
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * Danh sách bộ sưu tập theo mùa (Xuân, Hạ, Thu, Đông)
 * GET /api/seasonal-collections
 */
const getSeasonalCollections = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        title,
        slug,
        archive_code AS code,
        season_code AS "seasonCode",
        year,
        color_tone AS "colorTone",
        banner_url AS "bannerUrl",
        banner_url AS "bannerImage",
        is_active AS "isActive"
      FROM seasonal_collections
      WHERE is_active = true
      ORDER BY year DESC, id DESC
    `);
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * Chi tiết bộ sưu tập mùa kèm tác phẩm Hero & Curated Crafts
 * GET /api/seasonal-collections/:id
 */
const getSeasonalCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const lookupRes = await db.query(
      `SELECT id FROM seasonal_collections WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR archive_code = $1)'}`,
      [id]
    );

    if (lookupRes.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy bộ sưu tập mùa với mã "${id}"`);
    }

    const collection = await fetchSeasonalCollectionDetail(lookupRes.rows[0].id);
    return success(res, collection);
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy bộ sưu tập mùa mới nhất (Active)
 * GET /api/seasonal-collections/latest
 */
const getSeasonalCollectionLatest = async (req, res, next) => {
  try {
    const latestRes = await db.query(`
      SELECT id FROM seasonal_collections 
      WHERE is_active = true 
      ORDER BY year DESC, start_date DESC, id DESC 
      LIMIT 1
    `);

    if (latestRes.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', 'Chưa có bộ sưu tập mùa nào đang phát hành');
    }

    const collection = await fetchSeasonalCollectionDetail(latestRes.rows[0].id);
    return success(res, collection);
  } catch (err) {
    next(err);
  }
};

/**
 * [Admin/Editor] Tạo mới bộ sưu tập theo mùa
 * POST /api/seasonal-collections
 */
const createSeasonalCollection = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const {
      code,
      title,
      slug,
      seasonCode,
      year,
      description,
      curatorPhilosophy,
      curatorName,
      bannerImage,
      heroCraftId,
      startDate,
      endDate,
      isActive = true,
      crafts,
    } = req.body;

    const details = [];
    if (!code) details.push({ field: 'code', issue: 'Mã lưu trữ bộ sưu tập không được để trống' });
    if (!title) details.push({ field: 'title', issue: 'Tiêu đề bộ sưu tập không được để trống' });
    if (!seasonCode) details.push({ field: 'seasonCode', issue: 'Mã mùa (seasonCode) không được để trống' });
    if (!year) details.push({ field: 'year', issue: 'Năm diễn ra không được để trống' });
    if (!bannerImage) details.push({ field: 'bannerImage', issue: 'Ảnh banner không được để trống' });

    if (details.length > 0) {
      return error(res, 400, 'BAD_REQUEST', 'Dữ liệu tạo bộ sưu tập mùa không hợp lệ', details);
    }

    // Kiểm tra trùng code
    const checkCode = await client.query('SELECT id FROM seasonal_collections WHERE archive_code = $1', [code.trim()]);
    if (checkCode.rowCount > 0) {
      return error(res, 400, 'DUPLICATE_CODE', `Mã bộ sưu tập "${code}" đã tồn tại`);
    }

    const colSlug = slug || slugify(title);
    const start = startDate || `${year}-01-01`;
    const end = endDate || `${year}-12-31`;

    await client.query('BEGIN');

    const insertSql = `
      INSERT INTO seasonal_collections (
        title, slug, season_code, year, theme_concept,
        philosophy_quote, quote_source, archive_code, banner_url,
        start_date, end_date, is_active
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12
      ) RETURNING id
    `;

    const colRes = await client.query(insertSql, [
      title.trim(),
      colSlug,
      seasonCode.toLowerCase(),
      year,
      description || null,
      curatorPhilosophy || null,
      curatorName || 'Ban Giám Tuyển CraftRoots',
      code.trim(),
      bannerImage,
      start,
      end,
      isActive,
    ]);

    const newColId = colRes.rows[0].id;

    // Liên kết tác phẩm
    if (Array.isArray(crafts) && crafts.length > 0) {
      for (let i = 0; i < crafts.length; i++) {
        const cItem = crafts[i];
        const isHero = cItem.isHero !== undefined ? cItem.isHero : (heroCraftId === cItem.craftId);
        await client.query(
          `INSERT INTO seasonal_collection_crafts (
            seasonal_collection_id, craft_id, is_hero, display_order, curator_note, highlight_badge
          ) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
          [
            newColId,
            cItem.craftId,
            isHero,
            cItem.displayOrder || (i + 1),
            cItem.curatorNote || null,
            cItem.highlightBadge || (isHero ? 'KIỆT TÁC SPOTLIGHT' : null),
          ]
        );
      }
    } else if (heroCraftId) {
      // Nếu chỉ truyền heroCraftId
      await client.query(
        `INSERT INTO seasonal_collection_crafts (
          seasonal_collection_id, craft_id, is_hero, display_order, highlight_badge
        ) VALUES ($1, $2, true, 1, 'KIỆT TÁC SPOTLIGHT') ON CONFLICT DO NOTHING`,
        [newColId, heroCraftId]
      );
    }

    await client.query('COMMIT');

    const fullCollection = await fetchSeasonalCollectionDetail(newColId);
    return res.status(201).json({
      success: true,
      message: 'Tạo mới bộ sưu tập mùa thành công',
      data: fullCollection,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

/**
 * [Admin/Editor] Cập nhật bộ sưu tập theo mùa
 * PUT /api/seasonal-collections/:id
 */
const updateSeasonalCollection = async (req, res, next) => {
  const { id } = req.params;
  const client = await db.pool.connect();
  try {
    const isNumeric = /^\d+$/.test(id);
    const existing = await client.query(
      `SELECT id FROM seasonal_collections WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR archive_code = $1)'}`,
      [id]
    );

    if (existing.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy bộ sưu tập mùa với định danh "${id}"`);
    }

    const colId = existing.rows[0].id;
    const {
      code,
      title,
      slug,
      seasonCode,
      year,
      description,
      curatorPhilosophy,
      curatorName,
      bannerImage,
      heroCraftId,
      startDate,
      endDate,
      isActive,
      crafts,
    } = req.body;

    await client.query('BEGIN');

    const updates = [];
    const values = [];

    if (title !== undefined) {
      values.push(title.trim());
      updates.push(`title = $${values.length}`);
    }
    if (code !== undefined) {
      values.push(code.trim());
      updates.push(`archive_code = $${values.length}`);
    }
    if (slug !== undefined) {
      values.push(slug);
      updates.push(`slug = $${values.length}`);
    }
    if (seasonCode !== undefined) {
      values.push(seasonCode.toLowerCase());
      updates.push(`season_code = $${values.length}`);
    }
    if (year !== undefined) {
      values.push(year);
      updates.push(`year = $${values.length}`);
    }
    if (description !== undefined) {
      values.push(description);
      updates.push(`theme_concept = $${values.length}`);
    }
    if (curatorPhilosophy !== undefined) {
      values.push(curatorPhilosophy);
      updates.push(`philosophy_quote = $${values.length}`);
    }
    if (curatorName !== undefined) {
      values.push(curatorName);
      updates.push(`quote_source = $${values.length}`);
    }
    if (bannerImage !== undefined) {
      values.push(bannerImage);
      updates.push(`banner_url = $${values.length}`);
    }
    if (startDate !== undefined) {
      values.push(startDate);
      updates.push(`start_date = $${values.length}`);
    }
    if (endDate !== undefined) {
      values.push(endDate);
      updates.push(`end_date = $${values.length}`);
    }
    if (isActive !== undefined) {
      values.push(isActive);
      updates.push(`is_active = $${values.length}`);
    }

    if (updates.length > 0) {
      values.push(colId);
      await client.query(
        `UPDATE seasonal_collections SET ${updates.join(', ')} WHERE id = $${values.length}`,
        values
      );
    }

    // Cập nhật danh sách tác phẩm nếu gửi lên
    if (Array.isArray(crafts)) {
      await client.query('DELETE FROM seasonal_collection_crafts WHERE seasonal_collection_id = $1', [colId]);
      for (let i = 0; i < crafts.length; i++) {
        const cItem = crafts[i];
        const isHero = cItem.isHero !== undefined ? cItem.isHero : (heroCraftId === cItem.craftId);
        await client.query(
          `INSERT INTO seasonal_collection_crafts (
            seasonal_collection_id, craft_id, is_hero, display_order, curator_note, highlight_badge
          ) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
          [
            colId,
            cItem.craftId,
            isHero,
            cItem.displayOrder || (i + 1),
            cItem.curatorNote || null,
            cItem.highlightBadge || (isHero ? 'KIỆT TÁC SPOTLIGHT' : null),
          ]
        );
      }
    }

    await client.query('COMMIT');

    const updatedCol = await fetchSeasonalCollectionDetail(colId);
    return res.status(200).json({
      success: true,
      message: 'Cập nhật bộ sưu tập mùa thành công',
      data: updatedCol,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

/**
 * [Admin Only] Xóa bộ sưu tập theo mùa
 * DELETE /api/seasonal-collections/:id
 */
const deleteSeasonalCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const existing = await db.query(
      `SELECT id FROM seasonal_collections WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR archive_code = $1)'}`,
      [id]
    );

    if (existing.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy bộ sưu tập mùa với định danh "${id}"`);
    }

    const colId = existing.rows[0].id;

    // Xóa liên kết trong seasonal_collection_crafts trước
    await db.query('DELETE FROM seasonal_collection_crafts WHERE seasonal_collection_id = $1', [colId]);
    await db.query('DELETE FROM seasonal_collections WHERE id = $1', [colId]);

    return res.status(200).json({
      success: true,
      message: 'Xóa bộ sưu tập thành công',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCollections,
  getSeasonalCollections,
  getSeasonalCollectionById,
  getSeasonalCollectionLatest,
  createSeasonalCollection,
  updateSeasonalCollection,
  deleteSeasonalCollection,
};
