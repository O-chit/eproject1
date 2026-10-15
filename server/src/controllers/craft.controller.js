const db = require('../config/db');
const { paginated, success, error } = require('../utils/response');
const { craftSummarySelect, craftSummaryFrom } = require('../utils/craftHelper');

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
      material,
      technique,
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

    // 4. Lọc theo chất liệu
    if (material) {
      values.push(parseInt(material, 10));
      conditions.push(
        `EXISTS (SELECT 1 FROM craft_materials cm WHERE cm.craft_id = c.id AND cm.material_id = $${values.length})`
      );
    }

    // 5. Lọc theo kỹ thuật
    if (technique) {
      values.push(parseInt(technique, 10));
      conditions.push(
        `EXISTS (SELECT 1 FROM craft_techniques ct WHERE ct.craft_id = c.id AND ct.technique_id = $${values.length})`
      );
    }

    // 6. Lọc sản phẩm nổi bật (is_featured)
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
      case 'latest':
      default:
        orderClause = 'ORDER BY c.created_at DESC';
        break;
    }

    // Đếm tổng số bản ghi
    const countSql = `
      SELECT COUNT(DISTINCT c.id) AS total
      ${craftSummaryFrom}
      ${whereClause}
    `;
    const countResult = await db.query(countSql, values);
    const totalItems = parseInt(countResult.rows[0]?.total || '0', 10);

    // Lấy dữ liệu phân trang
    values.push(limitNum);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    const dataSql = `
      SELECT ${craftSummarySelect}
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

    const craftCondition = isNumeric ? 'c.id = $1' : 'c.slug = $1';

    const sql = `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.thumbnail_url AS "thumbnailUrl",
        c.short_description AS "shortDescription",
        c.cultural_context AS "culturalContext",
        c.tools,
        c.process,
        c.traditional_use AS "traditionalUse",
        c.is_featured AS "isFeatured",
        c.view_count AS "viewCount",
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
              'name', a.name,
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
      WHERE ${craftCondition}
    `;

    const result = await db.query(sql, [id]);

    if (result.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', 'Không tìm thấy sản phẩm thủ công theo yêu cầu');
    }

    const craft = result.rows[0];

    // Tự động tăng lượt xem
    db.query('UPDATE crafts SET view_count = view_count + 1 WHERE id = $1', [craft.id]).catch(
      (e) => console.error('Lỗi tăng view_count:', e.message)
    );

    return success(res, craft);
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
      `SELECT id, category_id, region_id FROM crafts WHERE ${isNumeric ? 'id = $1' : 'slug = $1'}`,
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
};
