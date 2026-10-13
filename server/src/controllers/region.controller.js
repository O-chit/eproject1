const db = require('../config/db');
const { success } = require('../utils/response');
const { craftSummarySelect, craftSummaryFrom } = require('../utils/craftHelper');

/**
 * Lấy danh sách các vùng miền và bản đồ văn hóa
 * GET /api/regions
 */
const getRegions = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, name, code, description, image_url FROM regions ORDER BY id ASC'
    );
    const data = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      description: row.description,
      imageUrl: row.image_url,
    }));
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy danh sách sản phẩm theo vùng miền
 * GET /api/regions/:id/crafts
 */
const getCraftsByRegion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const whereClause = isNumeric ? 'WHERE r.id = $1' : 'WHERE r.code = $1';

    const sql = `
      SELECT ${craftSummarySelect}
      ${craftSummaryFrom}
      ${whereClause}
      ORDER BY c.created_at DESC
    `;

    const result = await db.query(sql, [id]);
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRegions,
  getCraftsByRegion,
};
