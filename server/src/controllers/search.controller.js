const db = require('../config/db');
const { error } = require('../utils/response');

/**
 * Tìm kiếm toàn diện đa thực thể
 * GET /api/search
 */
const search = async (req, res, next) => {
  try {
    const { q, type = 'all', limit = 6 } = req.query;

    if (!q || q.trim() === '') {
      return error(res, 400, 'BAD_REQUEST', 'Từ khóa tìm kiếm (q) không được để trống');
    }

    const keyword = `%${q.trim()}%`;
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 6));

    const result = {
      crafts: [],
      artisans: [],
      villages: [],
    };

    // Tìm kiếm Tác phẩm
    if (type === 'all' || type === 'crafts') {
      const craftsRes = await db.query(
        `SELECT
          c.id, c.name, c.slug, c.code AS sku, c.price_vnd AS "priceVnd",
          c.thumbnail_url AS "thumbnailUrl", c.short_description AS "shortDescription",
          r.name AS region, cat.name AS category
         FROM crafts c
         JOIN regions r ON c.region_id = r.id
         JOIN craft_categories cat ON c.category_id = cat.id
         WHERE c.name ILIKE $1 OR c.short_description ILIKE $1 OR c.cultural_context ILIKE $1
         LIMIT $2`,
        [keyword, limitNum]
      );
      result.crafts = craftsRes.rows;
    }

    // Tìm kiếm Nghệ nhân
    if (type === 'all' || type === 'artisans') {
      const artisansRes = await db.query(
        `SELECT
          a.id, a.name AS "fullName", a.code AS "refCode", a.slug,
          a.title, a.specialty, a.avatar_url AS "avatarUrl",
          r.name AS "regionName", cv.name AS "villageName"
         FROM artisans a
         LEFT JOIN regions r ON a.region_id = r.id
         LEFT JOIN craft_villages cv ON a.village_id = cv.id
         WHERE a.name ILIKE $1 OR a.specialty ILIKE $1 OR a.biography ILIKE $1
         LIMIT $2`,
        [keyword, limitNum]
      );
      result.artisans = artisansRes.rows;
    }

    // Tìm kiếm Làng nghề
    if (type === 'all' || type === 'villages') {
      const villagesRes = await db.query(
        `SELECT
          cv.id, cv.name, cv.slug, cv.district, cv.province,
          cv.century_label AS "centuryLabel", cv.summary,
          r.name AS "regionName", cat.name AS "categoryName"
         FROM craft_villages cv
         LEFT JOIN regions r ON cv.region_id = r.id
         LEFT JOIN craft_categories cat ON cv.category_id = cat.id
         WHERE cv.name ILIKE $1 OR cv.province ILIKE $1 OR cv.summary ILIKE $1
         LIMIT $2`,
        [keyword, limitNum]
      );
      result.villages = villagesRes.rows;
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  search,
};
