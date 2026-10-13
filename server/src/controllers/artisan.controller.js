const db = require('../config/db');
const { success, error } = require('../utils/response');
const { craftSummarySelect, craftSummaryFrom } = require('../utils/craftHelper');

/**
 * Lấy danh sách nghệ nhân
 * GET /api/artisans
 */
const getArtisans = async (req, res, next) => {
  try {
    const sql = `
      SELECT
        a.id,
        a.name,
        a.title,
        a.specialty,
        a.years_of_experience AS "yearsOfExperience",
        r.name AS "regionName",
        a.avatar_url AS "avatarUrl"
      FROM artisans a
      LEFT JOIN regions r ON a.region_id = r.id
      ORDER BY a.id ASC
    `;

    const result = await db.query(sql);
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * Xem hồ sơ chi tiết nghệ nhân kèm danh sách tác phẩm N-N
 * GET /api/artisans/:id
 */
const getArtisanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const artisanSql = `
      SELECT
        a.id,
        a.name,
        a.title,
        a.specialty,
        a.years_of_experience AS "yearsOfExperience",
        r.name AS "regionName",
        a.avatar_url AS "avatarUrl",
        a.biography,
        a.contact_info AS "contactInfo"
      FROM artisans a
      LEFT JOIN regions r ON a.region_id = r.id
      WHERE a.id = $1
    `;

    const artisanRes = await db.query(artisanSql, [id]);

    if (artisanRes.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', 'Không tìm thấy hồ sơ nghệ nhân');
    }

    const artisan = artisanRes.rows[0];

    // Lấy danh sách tác phẩm mà nghệ nhân tham gia chế tác
    const craftsSql = `
      SELECT ${craftSummarySelect}
      ${craftSummaryFrom}
      JOIN craft_artisans ca ON ca.craft_id = c.id
      WHERE ca.artisan_id = $1
      ORDER BY ca.is_lead DESC, c.created_at DESC
    `;

    const craftsRes = await db.query(craftsSql, [id]);
    artisan.crafts = craftsRes.rows;

    return success(res, artisan);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArtisans,
  getArtisanById,
};
