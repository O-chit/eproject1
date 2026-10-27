const db = require('../config/db');
const slugify = require('../utils/slugify');
const { paginated, success, error } = require('../utils/response');
const { craftSummarySelect, craftSummaryFrom } = require('../utils/craftHelper');

/**
 * Helper hàm lấy chi tiết hồ sơ nghệ nhân hoàn chỉnh theo ID
 * @param {number} artisanId
 * @returns {Promise<object|null>}
 */
const fetchArtisanDetail = async (artisanId) => {
  const sql = `
    SELECT
      a.id,
      a.name AS "fullName",
      a.name,
      a.code AS "refCode",
      a.slug,
      a.title,
      a.specialty,
      a.generation,
      a.years_of_experience AS "yearsOfExperience",
      a.age,
      a.avatar_url AS avatar,
      a.avatar_url AS "avatarUrl",
      a.biography AS bio,
      a.biography,
      a.quote AS philosophy,
      a.quote,
      a.signature_work AS "signatureWork",
      a.technique_summary AS "techniqueSummary",
      a.verification_label AS "verificationLabel",
      a.is_national_heritage AS "isNationalHeritage",
      a.visit_address AS "workshopAddress",
      a.visit_max_guests AS "visitMaxGuests",
      a.visit_lead_time_hours AS "visitLeadTimeHours",
      a.visit_open_days AS "visitOpenDays",
      a.visit_hours AS "visitHours",
      a.technique_specs AS specs,
      a.created_at AS "createdAt",
      json_build_object(
        'id', r.id,
        'name', r.name,
        'code', r.code,
        'description', r.description
      ) AS region,
      r.name AS "regionName",
      CASE 
        WHEN cv.id IS NOT NULL THEN json_build_object(
          'id', cv.id,
          'name', cv.name,
          'slug', cv.slug,
          'district', cv.district,
          'province', cv.province,
          'centuryLabel', cv.century_label
        )
        ELSE NULL
      END AS village,
      cv.name AS "villageName",
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', m.id,
            'year', m.year,
            'title', m.event,
            'event', m.event,
            'description', m.event
          ) ORDER BY m.sort_order ASC, m.year ASC
        )
        FROM artisan_milestones m
        WHERE m.artisan_id = a.id
      ), '[]'::json) AS milestones
    FROM artisans a
    LEFT JOIN regions r ON a.region_id = r.id
    LEFT JOIN craft_villages cv ON a.village_id = cv.id
    WHERE a.id = $1
  `;

  const res = await db.query(sql, [artisanId]);
  if (res.rowCount === 0) return null;

  const artisan = res.rows[0];

  // Lấy danh sách tác phẩm N-N
  const craftsSql = `
    SELECT ${craftSummarySelect}
    ${craftSummaryFrom}
    JOIN craft_artisans ca ON ca.craft_id = c.id
    WHERE ca.artisan_id = $1
    ORDER BY ca.is_lead DESC, c.created_at DESC
  `;
  const craftsRes = await db.query(craftsSql, [artisanId]);
  artisan.crafts = craftsRes.rows;

  return artisan;
};

/**
 * Lấy danh sách nghệ nhân & bậc thầy chế tác
 * GET /api/artisans
 */
const getArtisans = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, village, region } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const values = [];

    // Lọc theo vùng miền
    if (region) {
      if (/^\d+$/.test(region)) {
        values.push(parseInt(region, 10));
        conditions.push(`a.region_id = $${values.length}`);
      } else {
        values.push(region);
        conditions.push(`r.code = $${values.length}`);
      }
    }

    // Lọc theo làng nghề
    if (village) {
      if (/^\d+$/.test(village)) {
        values.push(parseInt(village, 10));
        conditions.push(`a.village_id = $${values.length}`);
      } else {
        values.push(village);
        conditions.push(`cv.slug = $${values.length}`);
      }
    }

    // Lọc theo danh mục sở trường
    if (category) {
      if (/^\d+$/.test(category)) {
        values.push(parseInt(category, 10));
        conditions.push(`cv.category_id = $${values.length}`);
      } else {
        values.push(category);
        conditions.push(`EXISTS (
          SELECT 1 FROM craft_categories cc 
          WHERE cc.id = cv.category_id AND cc.slug = $${values.length}
        )`);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM artisans a
      LEFT JOIN regions r ON a.region_id = r.id
      LEFT JOIN craft_villages cv ON a.village_id = cv.id
      ${whereClause}
    `;
    const countRes = await db.query(countSql, values);
    const totalItems = countRes.rows[0].total;

    values.push(limitNum);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    const dataSql = `
      SELECT
        a.id,
        a.name AS "fullName",
        a.name,
        a.code AS "refCode",
        a.code,
        a.code AS ref,
        a.slug,
        a.title,
        a.specialty,
        a.specialty AS "craft_category",
        a.age,
        a.generation,
        a.years_of_experience AS "yearsOfExperience",
        a.years_of_experience,
        a.biography,
        a.biography AS bio,
        a.quote,
        a.signature_work AS "signatureWork",
        a.signature_work AS "masterwork_name",
        a.technique_summary AS "techniqueSummary",
        a.technique_specs AS specs,
        a.verification_label AS "verificationLabel",
        a.is_national_heritage AS "isNationalHeritage",
        a.avatar_url AS "avatarUrl",
        a.avatar_url,
        a.avatar_url AS avatar,
        r.id AS "regionId",
        r.name AS "regionName",
        r.name AS province,
        cv.id AS "villageId",
        cv.name AS "villageName",
        cv.name AS village,
        cc.id AS "categoryId",
        cc.name AS "categoryName",
        cc.slug AS "categorySlug",
        cc.slug AS category,
        a.visit_address AS "workshopAddress",
        a.visit_max_guests AS "visitMaxGuests",
        a.visit_lead_time_hours AS "visitLeadTimeHours",
        a.visit_open_days AS "visitOpenDays",
        a.visit_hours AS "visitHours"
      FROM artisans a
      LEFT JOIN regions r ON a.region_id = r.id
      LEFT JOIN craft_villages cv ON a.village_id = cv.id
      LEFT JOIN craft_categories cc ON cv.category_id = cc.id
      ${whereClause}
      ORDER BY a.sort_order ASC, a.id ASC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const dataRes = await db.query(dataSql, values);
    return paginated(res, dataRes.rows, pageNum, limitNum, totalItems);
  } catch (err) {
    next(err);
  }
};

/**
 * Xem hồ sơ chi tiết nghệ nhân
 * GET /api/artisans/:id
 */
const getArtisanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const lookupRes = await db.query(
      `SELECT id FROM artisans WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR code = $1)'}`,
      [id]
    );

    if (lookupRes.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy hồ sơ nghệ nhân với mã "${id}"`);
    }

    const artisan = await fetchArtisanDetail(lookupRes.rows[0].id);
    return success(res, artisan);
  } catch (err) {
    next(err);
  }
};

/**
 * [Admin/Editor] Thêm mới hồ sơ nghệ nhân
 * POST /api/artisans
 */
const createArtisan = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const {
      refCode,
      fullName,
      slug,
      avatar,
      bio,
      philosophy,
      birthYear,
      yearsOfExperience,
      generation,
      roleTitle,
      villageId,
      workshopAddress,
      isNationalHeritage = true,
      visitOpenDays = [2, 3, 4, 5, 6, 7],
      visitMaxGuests = 6,
      visitLeadTimeHours = 48,
      visitTeaTalk = true,
      milestones,
      specs,
    } = req.body;

    const details = [];
    if (!refCode) details.push({ field: 'refCode', issue: 'Mã định danh REF không được để trống' });
    if (!fullName) details.push({ field: 'fullName', issue: 'Họ tên nghệ nhân không được để trống' });
    if (!avatar) details.push({ field: 'avatar', issue: 'Ảnh đại diện không được để trống' });
    if (!villageId) details.push({ field: 'villageId', issue: 'Làng nghề không được để trống' });

    if (details.length > 0) {
      return error(res, 400, 'BAD_REQUEST', 'Dữ liệu thêm nghệ nhân không hợp lệ', details);
    }

    // Kiểm tra trùng refCode
    const checkRef = await client.query('SELECT id FROM artisans WHERE code = $1', [refCode.trim()]);
    if (checkRef.rowCount > 0) {
      return error(res, 400, 'DUPLICATE_CODE', `Mã định danh "${refCode}" đã tồn tại`);
    }

    // Tra cứu regionId từ villageId
    const villageRes = await client.query('SELECT region_id FROM craft_villages WHERE id = $1', [villageId]);
    const regionId = villageRes.rowCount > 0 ? villageRes.rows[0].region_id : null;

    const artisanSlug = slug || slugify(fullName);
    const age = birthYear ? 2026 - birthYear : null;
    const techniqueSpecsJson = JSON.stringify(specs || {});

    // Chuyển đổi visitOpenDays nếu là mảng chữ cái ['tue', 'wed'...] sang mảng số nếu cần
    let openDaysArray = visitOpenDays;
    if (Array.isArray(visitOpenDays) && typeof visitOpenDays[0] === 'string') {
      const dayMap = { mon: 2, tue: 3, wed: 4, thu: 5, fri: 6, sat: 7, sun: 1 };
      openDaysArray = visitOpenDays.map(d => dayMap[d.toLowerCase()] || 2);
    }

    await client.query('BEGIN');

    const insertSql = `
      INSERT INTO artisans (
        name, slug, code, region_id, village_id, title, specialty,
        age, generation, years_of_experience, quote, biography,
        technique_specs, is_national_heritage, avatar_url,
        visit_max_guests, visit_lead_time_hours, visit_open_days,
        visit_address
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15,
        $16, $17, $18,
        $19
      ) RETURNING id
    `;

    const insertRes = await client.query(insertSql, [
      fullName.trim(),
      artisanSlug,
      refCode.trim(),
      regionId,
      villageId,
      roleTitle || 'Nghệ nhân',
      philosophy ? philosophy.slice(0, 100) : null,
      age,
      generation || 1,
      yearsOfExperience || 0,
      philosophy || null,
      bio || null,
      techniqueSpecsJson,
      isNationalHeritage,
      avatar,
      visitMaxGuests,
      visitLeadTimeHours,
      openDaysArray,
      workshopAddress || null,
    ]);

    const newArtisanId = insertRes.rows[0].id;

    // Lưu mốc son niên biểu (milestones)
    if (Array.isArray(milestones) && milestones.length > 0) {
      for (let i = 0; i < milestones.length; i++) {
        const m = milestones[i];
        const eventText = m.title ? (m.description ? `${m.title}: ${m.description}` : m.title) : (m.event || '');
        await client.query(
          `INSERT INTO artisan_milestones (artisan_id, year, event, sort_order) VALUES ($1, $2, $3, $4)`,
          [newArtisanId, String(m.year || '2026'), eventText, i + 1]
        );
      }
    }

    await client.query('COMMIT');

    const fullArtisan = await fetchArtisanDetail(newArtisanId);
    return res.status(201).json({
      success: true,
      message: 'Thêm hồ sơ nghệ nhân thành công',
      data: fullArtisan,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

/**
 * [Admin/Editor] Cập nhật hồ sơ nghệ nhân
 * PUT /api/artisans/:id
 */
const updateArtisan = async (req, res, next) => {
  const { id } = req.params;
  const client = await db.pool.connect();
  try {
    const isNumeric = /^\d+$/.test(id);
    const existing = await client.query(
      `SELECT id FROM artisans WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR code = $1)'}`,
      [id]
    );

    if (existing.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy hồ sơ nghệ nhân với định danh "${id}"`);
    }

    const artisanId = existing.rows[0].id;
    const {
      refCode,
      fullName,
      slug,
      avatar,
      bio,
      philosophy,
      birthYear,
      yearsOfExperience,
      generation,
      roleTitle,
      villageId,
      workshopAddress,
      isNationalHeritage,
      visitOpenDays,
      visitMaxGuests,
      visitLeadTimeHours,
      milestones,
      specs,
    } = req.body;

    await client.query('BEGIN');

    const updates = [];
    const values = [];

    if (fullName !== undefined) {
      values.push(fullName.trim());
      updates.push(`name = $${values.length}`);
    }
    if (refCode !== undefined) {
      values.push(refCode.trim());
      updates.push(`code = $${values.length}`);
    }
    if (slug !== undefined) {
      values.push(slug);
      updates.push(`slug = $${values.length}`);
    }
    if (avatar !== undefined) {
      values.push(avatar);
      updates.push(`avatar_url = $${values.length}`);
    }
    if (bio !== undefined) {
      values.push(bio);
      updates.push(`biography = $${values.length}`);
    }
    if (philosophy !== undefined) {
      values.push(philosophy);
      updates.push(`quote = $${values.length}`);
    }
    if (birthYear !== undefined) {
      values.push(2026 - birthYear);
      updates.push(`age = $${values.length}`);
    }
    if (yearsOfExperience !== undefined) {
      values.push(yearsOfExperience);
      updates.push(`years_of_experience = $${values.length}`);
    }
    if (generation !== undefined) {
      values.push(generation);
      updates.push(`generation = $${values.length}`);
    }
    if (roleTitle !== undefined) {
      values.push(roleTitle);
      updates.push(`title = $${values.length}`);
    }
    if (villageId !== undefined) {
      values.push(villageId);
      updates.push(`village_id = $${values.length}`);
      // Lấy region_id tương ứng
      const vRes = await client.query('SELECT region_id FROM craft_villages WHERE id = $1', [villageId]);
      if (vRes.rowCount > 0) {
        values.push(vRes.rows[0].region_id);
        updates.push(`region_id = $${values.length}`);
      }
    }
    if (workshopAddress !== undefined) {
      values.push(workshopAddress);
      updates.push(`visit_address = $${values.length}`);
    }
    if (isNationalHeritage !== undefined) {
      values.push(isNationalHeritage);
      updates.push(`is_national_heritage = $${values.length}`);
    }
    if (visitMaxGuests !== undefined) {
      values.push(visitMaxGuests);
      updates.push(`visit_max_guests = $${values.length}`);
    }
    if (visitLeadTimeHours !== undefined) {
      values.push(visitLeadTimeHours);
      updates.push(`visit_lead_time_hours = $${values.length}`);
    }
    if (visitOpenDays !== undefined) {
      let openDays = visitOpenDays;
      if (Array.isArray(visitOpenDays) && typeof visitOpenDays[0] === 'string') {
        const dayMap = { mon: 2, tue: 3, wed: 4, thu: 5, fri: 6, sat: 7, sun: 1 };
        openDays = visitOpenDays.map(d => dayMap[d.toLowerCase()] || 2);
      }
      values.push(openDays);
      updates.push(`visit_open_days = $${values.length}`);
    }
    if (specs !== undefined) {
      values.push(JSON.stringify(specs));
      updates.push(`technique_specs = $${values.length}`);
    }

    if (updates.length > 0) {
      values.push(artisanId);
      await client.query(
        `UPDATE artisans SET ${updates.join(', ')} WHERE id = $${values.length}`,
        values
      );
    }

    // Cập nhật milestones nếu gửi lên
    if (Array.isArray(milestones)) {
      await client.query('DELETE FROM artisan_milestones WHERE artisan_id = $1', [artisanId]);
      for (let i = 0; i < milestones.length; i++) {
        const m = milestones[i];
        const eventText = m.title ? (m.description ? `${m.title}: ${m.description}` : m.title) : (m.event || '');
        await client.query(
          `INSERT INTO artisan_milestones (artisan_id, year, event, sort_order) VALUES ($1, $2, $3, $4)`,
          [artisanId, String(m.year || '2026'), eventText, i + 1]
        );
      }
    }

    await client.query('COMMIT');

    const updatedArtisan = await fetchArtisanDetail(artisanId);
    return res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ nghệ nhân thành công',
      data: updatedArtisan,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

/**
 * [Admin Only] Xóa hồ sơ nghệ nhân
 * DELETE /api/artisans/:id
 */
const deleteArtisan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const existing = await db.query(
      `SELECT id FROM artisans WHERE ${isNumeric ? 'id = $1' : '(slug = $1 OR code = $1)'}`,
      [id]
    );

    if (existing.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy hồ sơ nghệ nhân với định danh "${id}"`);
    }

    const artisanId = existing.rows[0].id;

    // BR-05: Xóa nghệ nhân, các tác phẩm liên kết N-N vẫn được bảo toàn
    await db.query('DELETE FROM artisans WHERE id = $1', [artisanId]);

    return res.status(200).json({
      success: true,
      message: 'Xóa nghệ nhân thành công',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArtisans,
  getArtisanById,
  createArtisan,
  updateArtisan,
  deleteArtisan,
};
