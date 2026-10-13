const db = require('../config/db');
const { success } = require('../utils/response');

/**
 * Thư viện ảnh tương tác Lightbox
 * GET /api/gallery
 */
const getGallery = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const sql = `
      SELECT
        ci.id,
        ci.craft_id AS "craftId",
        c.name AS "craftName",
        ci.url,
        ci.alt_text AS "altText",
        ci.caption
      FROM craft_images ci
      JOIN crafts c ON ci.craft_id = c.id
      ORDER BY ci.display_order ASC, ci.id ASC
      LIMIT $1 OFFSET $2
    `;

    const result = await db.query(sql, [limit, offset]);
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGallery,
};
