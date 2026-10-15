const db = require('../config/db');
const slugify = require('../utils/slugify');
const { paginated, success, error } = require('../utils/response');
const { craftSummarySelect, craftSummaryFrom } = require('../utils/craftHelper');

/**
 * Helper hàm lấy chi tiết sản phẩm hoàn chỉnh theo ID
 * @param {number} craftId
 * @returns {Promise<object|null>}
 */
const fetchCraftDetail = async (craftId) => {
  const sql = `
    SELECT
      c.id,
      c.name,
      c.slug,
      c.code AS sku,
      c.code AS "refCode",
      c.thumbnail_url AS "thumbnailUrl",
      c.thumbnail_url AS "coverImage",
      c.short_description AS "shortDescription",
      c.short_description AS summary,
      c.cultural_context AS "culturalContext",
      c.price_vnd AS "priceVnd",
      c.tag,
      c.origin_line AS "originLine",
      c.era,
      c.dimensions,
      c.specs AS "techniqueSpecs",
      c.process_stages AS "processStages",
      c.tools,
      c.process,
      c.traditional_use AS "traditionalUse",
      c.is_spotlight AS "isSpotlight",
      c.is_featured AS "isFeatured",
      c.view_count AS "viewCount",
      c.created_at AS "createdAt",
      json_build_object(
        'id', r.id,
        'name', r.name,
        'code', r.code,
        'description', r.description,
        'imageUrl', r.image_url
      ) AS region,
      json_build_object(
        'id', cat.id,
        'name', cat.name,
        'slug', cat.slug,
        'iconUrl', cat.icon_url
      ) AS category,
      CASE 
        WHEN cv.id IS NOT NULL THEN json_build_object(
          'id', cv.id,
          'name', cv.name,
          'slug', cv.slug,
          'district', cv.district,
          'province', cv.province
        )
        ELSE NULL
      END AS village,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', ci.id,
            'url', ci.url,
            'altText', ci.alt_text,
            'caption', ci.caption
          ) ORDER BY ci.display_order ASC
        )
        FROM craft_images ci
        WHERE ci.craft_id = c.id
      ), '[]'::json) AS images,
      COALESCE((
        SELECT json_agg(ci.url ORDER BY ci.display_order ASC)
        FROM craft_images ci
        WHERE ci.craft_id = c.id
      ), '[]'::json) AS gallery,
      COALESCE((
        SELECT json_agg(
          json_build_object('id', m.id, 'name', m.name)
        )
        FROM craft_materials cm
        JOIN materials m ON cm.material_id = m.id
        WHERE cm.craft_id = c.id
      ), '[]'::json) AS materials,
      COALESCE((
        SELECT json_agg(
          json_build_object('id', t.id, 'name', t.name)
        )
        FROM craft_techniques ct
        JOIN techniques t ON ct.technique_id = t.id
        WHERE ct.craft_id = c.id
      ), '[]'::json) AS techniques,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', a.id,
            'artisanId', a.id,
            'name', a.name,
            'fullName', a.name,
            'title', a.title,
            'roleTitle', ca.role_title,
            'isLead', ca.is_lead,
            'avatarUrl', a.avatar_url
          ) ORDER BY ca.is_lead DESC, ca.display_order ASC
        )
        FROM craft_artisans ca
        JOIN artisans a ON ca.artisan_id = a.id
        WHERE ca.craft_id = c.id
      ), '[]'::json) AS artisans
    FROM crafts c
    JOIN regions r ON c.region_id = r.id
    JOIN craft_categories cat ON c.category_id = cat.id
    LEFT JOIN craft_villages cv ON c.village_id = cv.id
    WHERE c.id = $1
  `;
  const res = await db.query(sql, [craftId]);
  return res.rowCount > 0 ? res.rows[0] : null;
};

/**
 * Danh sách sản phẩm kèm tìm kiếm và bộ lọc đa diện
 * GET /api/crafts
 */
const getCrafts = async (req, res, next) => {
  try {
    const {
      q,
      region,
      category,
      village,
      material,
      technique,
      ids,
      sort = 'latest',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const values = [];

    // 1. Tìm kiếm Full-Text Search hoặc ILIKE
    if (q && q.trim() !== '') {
      values.push(`%${q.trim()}%`);
      const paramIdx = values.length;
      conditions.push(`(
        c.name ILIKE $${paramIdx} OR
        c.short_description ILIKE $${paramIdx} OR
        c.cultural_context ILIKE $${paramIdx}
      )`);
    }

    // 2. Lọc theo vùng miền (ID hoặc code)
    if (region) {
      if (/^\d+$/.test(region)) {
        values.push(parseInt(region, 10));
        conditions.push(`c.region_id = $${values.length}`);
      } else {
        values.push(region);
        conditions.push(`r.code = $${values.length}`);
      }
    }

    // 3. Lọc theo danh mục (ID hoặc slug)
    if (category) {
      if (/^\d+$/.test(category)) {
        values.push(parseInt(category, 10));
        conditions.push(`c.category_id = $${values.length}`);
      } else {
        values.push(category);
        conditions.push(`cat.slug = $${values.length}`);
      }
    }

    // 4. Lọc theo làng nghề (ID hoặc slug)
    if (village) {
      if (/^\d+$/.test(village)) {
        values.push(parseInt(village, 10));
        conditions.push(`c.village_id = $${values.length}`);
      } else {
        values.push(village);
        conditions.push(
          `EXISTS (SELECT 1 FROM craft_villages cv WHERE cv.id = c.village_id AND cv.slug = $${values.length})`
        );
      }
    }

    // 5. Lọc theo danh sách IDs (phục vụ danh sách yêu thích)
    if (ids && ids.trim() !== '') {
      const idList = ids.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      if (idList.length > 0) {
        values.push(idList);
        conditions.push(`c.id = ANY($${values.length}::int[])`);
      }
    }

    // 6. Lọc theo chất liệu
    if (material) {
      values.push(parseInt(material, 10));
      conditions.push(
        `EXISTS (SELECT 1 FROM craft_materials cm WHERE cm.craft_id = c.id AND cm.material_id = $${values.length})`
      );
    }

    // 7. Lọc theo kỹ thuật
    if (technique) {
      values.push(parseInt(technique, 10));
      conditions.push(
        `EXISTS (SELECT 1 FROM craft_techniques ct WHERE ct.craft_id = c.id AND ct.technique_id = $${values.length})`
      );
    }

    // 8. Lọc sản phẩm nổi bật (is_featured)
    if (req.query.is_featured !== undefined) {
      const isFeatured = req.query.is_featured === 'true' || req.query.is_featured === true;
      values.push(isFeatured);
      conditions.push(`c.is_featured = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sắp xếp
    let orderClause = 'ORDER BY c.created_at DESC';
    switch (sort) {
      case 'views':
        orderClause = 'ORDER BY c.view_count DESC, c.id DESC';
        break;
      case 'name_asc':
        orderClause = 'ORDER BY c.name ASC';
        break;
      case 'name_desc':
        orderClause = 'ORDER BY c.name DESC';
        break;
      case 'price_asc':
        orderClause = 'ORDER BY c.price_vnd ASC NULLS LAST';
        break;
      case 'price_desc':
        orderClause = 'ORDER BY c.price_vnd DESC NULLS LAST';
        break;
      case 'latest':
      default:
        orderClause = 'ORDER BY c.created_at DESC';
        break;
    }

    // Đếm tổng số bản ghi
    const countSql = `
      SELECT COUNT(*)::int AS total
      ${craftSummaryFrom}
      ${whereClause}
    `;
    const countResult = await db.query(countSql, values);
    const totalItems = countResult.rows[0].total;

    // Lấy dữ liệu phân trang
    values.push(limitNum);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    const dataSql = `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.code AS sku,
        c.price_vnd AS "priceVnd",
        c.tag,
        r.name AS region,
        cat.name AS category,
        cat.slug AS "categorySlug",
        c.thumbnail_url AS "thumbnailUrl",
        c.thumbnail_url AS image,
        c.short_description AS "shortDescription",
        c.short_description AS description,
        c.is_featured AS "isFeatured",
        c.is_spotlight AS "isSpotlight",
        COALESCE(
          (
            SELECT json_agg(m.name)
            FROM craft_materials cm
            JOIN materials m ON cm.material_id = m.id
            WHERE cm.craft_id = c.id
          ),
          '[]'::json
        ) AS materials
      ${craftSummaryFrom}
      ${whereClause}
      ${orderClause}
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const dataResult = await db.query(dataSql, values);
    return paginated(res, dataResult.rows, pageNum, limitNum, totalItems);
  } catch (err) {
    next(err);
  }
};

/**
 * Xem chi tiết sản phẩm thủ công
 * GET /api/crafts/:id
 */
const getCraftById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    // Tìm craft id
    const craftRow = await db.query(
      `SELECT id FROM crafts WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR code = $1)'}`,
      [id]
    );

    if (craftRow.rowCount === 0) {
      return error(res, 404, 'CRAFT_NOT_FOUND', `Không tìm thấy sản phẩm với định danh "${id}"`);
    }

    const craftId = craftRow.rows[0].id;

    // Tăng view_count bất đồng bộ
    db.query('UPDATE crafts SET view_count = view_count + 1 WHERE id = $1', [craftId]).catch(
      (err) => console.error('Lỗi tăng view_count:', err)
    );

    const fullCraft = await fetchCraftDetail(craftId);
    return success(res, fullCraft);
  } catch (err) {
    next(err);
  }
};

/**
 * [Admin/Editor] Tạo mới tác phẩm thủ công
 * POST /api/crafts
 */
const createCraft = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const {
      sku,
      name,
      slug,
      categoryId,
      villageId,
      regionId,
      priceVnd,
      coverImage,
      gallery,
      culturalContext,
      summary,
      techniqueSpecs,
      processStages,
      materialIds,
      techniqueIds,
      artisans,
      isSpotlight = false,
      status = 'published',
    } = req.body;

    // Kiểm tra các trường bắt buộc theo OpenAPI contract
    const details = [];
    if (!sku) details.push({ field: 'sku', issue: 'Mã SKU không được để trống' });
    if (!name) details.push({ field: 'name', issue: 'Tên tác phẩm không được để trống' });
    if (!categoryId) details.push({ field: 'categoryId', issue: 'Danh mục không được để trống' });
    if (!regionId) details.push({ field: 'regionId', issue: 'Vùng miền không được để trống' });
    if (priceVnd === undefined || priceVnd === null) details.push({ field: 'priceVnd', issue: 'Giá VND không được để trống' });
    if (!coverImage) details.push({ field: 'coverImage', issue: 'Ảnh đại diện không được để trống' });

    if (details.length > 0) {
      return error(res, 400, 'BAD_REQUEST', 'Dữ liệu tạo tác phẩm không hợp lệ', details);
    }

    // Kiểm tra SKU duy nhất
    const checkSku = await client.query('SELECT id FROM crafts WHERE code = $1', [sku.trim()]);
    if (checkSku.rowCount > 0) {
      return error(res, 400, 'DUPLICATE_SKU', `Mã SKU "${sku}" đã tồn tại trên hệ thống`);
    }

    const craftSlug = slug || slugify(name);
    const dimensions = techniqueSpecs?.dimensions || null;
    const specsJson = JSON.stringify(techniqueSpecs || {});
    const stagesJson = JSON.stringify(processStages || []);
    const tag = isSpotlight ? 'KIỆT TÁC SPOTLIGHT' : (status === 'draft' ? 'BẢN THẢO' : 'TIÊU BIỂU');

    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO crafts (
        name, slug, code, region_id, category_id, village_id,
        thumbnail_url, short_description, price_vnd, tag,
        dimensions, specs, process_stages, cultural_context,
        is_spotlight, is_featured
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16
      ) RETURNING id
    `;

    const craftRes = await client.query(insertQuery, [
      name.trim(),
      craftSlug,
      sku.trim(),
      regionId,
      categoryId,
      villageId || null,
      coverImage,
      summary || null,
      priceVnd,
      tag,
      dimensions,
      specsJson,
      stagesJson,
      culturalContext || null,
      isSpotlight,
      isSpotlight || status === 'published',
    ]);

    const newCraftId = craftRes.rows[0].id;

    // 1. Thư viện ảnh Gallery
    if (Array.isArray(gallery) && gallery.length > 0) {
      for (let i = 0; i < gallery.length; i++) {
        await client.query(
          `INSERT INTO craft_images (craft_id, url, alt_text, display_order) VALUES ($1, $2, $3, $4)`,
          [newCraftId, gallery[i], `${name} - Ảnh ${i + 1}`, i + 1]
        );
      }
    }

    // 2. Liên kết Chất liệu (N-N)
    if (Array.isArray(materialIds) && materialIds.length > 0) {
      for (const matId of materialIds) {
        await client.query(
          `INSERT INTO craft_materials (craft_id, material_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [newCraftId, matId]
        );
      }
    }

    // 3. Liên kết Kỹ thuật (N-N)
    if (Array.isArray(techniqueIds) && techniqueIds.length > 0) {
      for (const techId of techniqueIds) {
        await client.query(
          `INSERT INTO craft_techniques (craft_id, technique_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [newCraftId, techId]
        );
      }
    }

    // 4. Liên kết Nghệ nhân sáng tạo (N-N)
    if (Array.isArray(artisans) && artisans.length > 0) {
      for (const art of artisans) {
        await client.query(
          `INSERT INTO craft_artisans (craft_id, artisan_id, role_title, is_lead, display_order)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
          [
            newCraftId,
            art.artisanId,
            art.roleTitle || 'Nghệ nhân chủ trì chế tác',
            art.isLead !== undefined ? art.isLead : true,
            art.displayOrder || 1,
          ]
        );
      }
    }

    await client.query('COMMIT');

    const fullCraft = await fetchCraftDetail(newCraftId);
    return res.status(201).json({
      success: true,
      message: 'Tạo mới tác phẩm thủ công thành công',
      data: fullCraft,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

/**
 * [Admin/Editor] Cập nhật thông tin tác phẩm thủ công
 * PUT /api/crafts/:id
 */
const updateCraft = async (req, res, next) => {
  const { id } = req.params;
  const client = await db.pool.connect();
  try {
    const isNumeric = /^\d+$/.test(id);
    const existing = await client.query(
      `SELECT id FROM crafts WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR code = $1)'}`,
      [id]
    );

    if (existing.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy tác phẩm với định danh "${id}"`);
    }

    const craftId = existing.rows[0].id;
    const {
      sku,
      name,
      slug,
      categoryId,
      villageId,
      regionId,
      priceVnd,
      coverImage,
      gallery,
      culturalContext,
      summary,
      techniqueSpecs,
      processStages,
      materialIds,
      techniqueIds,
      artisans,
      isSpotlight,
      status,
    } = req.body;

    await client.query('BEGIN');

    const updates = [];
    const values = [];

    if (name !== undefined) {
      values.push(name.trim());
      updates.push(`name = $${values.length}`);
    }
    if (slug !== undefined) {
      values.push(slug);
      updates.push(`slug = $${values.length}`);
    }
    if (sku !== undefined) {
      values.push(sku.trim());
      updates.push(`code = $${values.length}`);
    }
    if (categoryId !== undefined) {
      values.push(categoryId);
      updates.push(`category_id = $${values.length}`);
    }
    if (villageId !== undefined) {
      values.push(villageId);
      updates.push(`village_id = $${values.length}`);
    }
    if (regionId !== undefined) {
      values.push(regionId);
      updates.push(`region_id = $${values.length}`);
    }
    if (priceVnd !== undefined) {
      values.push(priceVnd);
      updates.push(`price_vnd = $${values.length}`);
    }
    if (coverImage !== undefined) {
      values.push(coverImage);
      updates.push(`thumbnail_url = $${values.length}`);
    }
    if (culturalContext !== undefined) {
      values.push(culturalContext);
      updates.push(`cultural_context = $${values.length}`);
    }
    if (summary !== undefined) {
      values.push(summary);
      updates.push(`short_description = $${values.length}`);
    }
    if (techniqueSpecs !== undefined) {
      if (techniqueSpecs.dimensions) {
        values.push(techniqueSpecs.dimensions);
        updates.push(`dimensions = $${values.length}`);
      }
      values.push(JSON.stringify(techniqueSpecs));
      updates.push(`specs = $${values.length}`);
    }
    if (processStages !== undefined) {
      values.push(JSON.stringify(processStages));
      updates.push(`process_stages = $${values.length}`);
    }
    if (isSpotlight !== undefined) {
      values.push(isSpotlight);
      updates.push(`is_spotlight = $${values.length}`);
      values.push(isSpotlight);
      updates.push(`is_featured = $${values.length}`);
    }
    if (status !== undefined) {
      const tag = status === 'draft' ? 'BẢN THẢO' : (isSpotlight ? 'KIỆT TÁC SPOTLIGHT' : 'TIÊU BIỂU');
      values.push(tag);
      updates.push(`tag = $${values.length}`);
    }

    if (updates.length > 0) {
      values.push(craftId);
      await client.query(
        `UPDATE crafts SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length}`,
        values
      );
    }

    // Cập nhật Gallery nếu có gửi lên
    if (Array.isArray(gallery)) {
      await client.query('DELETE FROM craft_images WHERE craft_id = $1', [craftId]);
      for (let i = 0; i < gallery.length; i++) {
        await client.query(
          `INSERT INTO craft_images (craft_id, url, alt_text, display_order) VALUES ($1, $2, $3, $4)`,
          [craftId, gallery[i], `Ảnh minh họa ${i + 1}`, i + 1]
        );
      }
    }

    // Cập nhật Chất liệu nếu có gửi lên
    if (Array.isArray(materialIds)) {
      await client.query('DELETE FROM craft_materials WHERE craft_id = $1', [craftId]);
      for (const matId of materialIds) {
        await client.query(
          `INSERT INTO craft_materials (craft_id, material_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [craftId, matId]
        );
      }
    }

    // Cập nhật Kỹ thuật nếu có gửi lên
    if (Array.isArray(techniqueIds)) {
      await client.query('DELETE FROM craft_techniques WHERE craft_id = $1', [craftId]);
      for (const techId of techniqueIds) {
        await client.query(
          `INSERT INTO craft_techniques (craft_id, technique_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [craftId, techId]
        );
      }
    }

    // Cập nhật Nghệ nhân nếu có gửi lên
    if (Array.isArray(artisans)) {
      await client.query('DELETE FROM craft_artisans WHERE craft_id = $1', [craftId]);
      for (const art of artisans) {
        await client.query(
          `INSERT INTO craft_artisans (craft_id, artisan_id, role_title, is_lead, display_order)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
          [
            craftId,
            art.artisanId,
            art.roleTitle || 'Nghệ nhân',
            art.isLead !== undefined ? art.isLead : true,
            art.displayOrder || 1,
          ]
        );
      }
    }

    await client.query('COMMIT');

    const updatedCraft = await fetchCraftDetail(craftId);
    return res.status(200).json({
      success: true,
      message: 'Cập nhật tác phẩm thành công',
      data: updatedCraft,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

/**
 * [Admin Only] Xóa tác phẩm thủ công
 * DELETE /api/crafts/:id
 */
const deleteCraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const existing = await db.query(
      `SELECT id FROM crafts WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR code = $1)'}`,
      [id]
    );

    if (existing.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy tác phẩm với định danh "${id}"`);
    }

    const craftId = existing.rows[0].id;
    await db.query('DELETE FROM crafts WHERE id = $1', [craftId]);

    return res.status(200).json({
      success: true,
      message: 'Xóa tác phẩm thủ công thành công',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy danh sách sản phẩm liên quan
 * GET /api/crafts/:id/related
 */
const getRelatedCrafts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    // Lấy thông tin category_id và region_id của sản phẩm hiện tại
    const currentCraftRes = await db.query(
      `SELECT id, category_id, region_id FROM crafts WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR code = $1)'}`,
      [id]
    );

    if (currentCraftRes.rowCount === 0) {
      return success(res, []);
    }

    const current = currentCraftRes.rows[0];

    const sql = `
      SELECT ${craftSummarySelect}
      ${craftSummaryFrom}
      WHERE c.id != $1 AND (c.category_id = $2 OR c.region_id = $3)
      ORDER BY (c.category_id = $2) DESC, c.view_count DESC
      LIMIT 6
    `;

    const result = await db.query(sql, [current.id, current.category_id, current.region_id]);
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCrafts,
  getCraftById,
  getRelatedCrafts,
  createCraft,
  updateCraft,
  deleteCraft,
};
