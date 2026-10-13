const db = require('../config/db');
const { success } = require('../utils/response');

/**
 * Lấy danh sách danh mục phân loại nghề
 * GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, name, slug, icon_url FROM craft_categories ORDER BY id ASC'
    );
    const data = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      iconUrl: row.icon_url,
    }));
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy danh sách chất liệu chế tác
 * GET /api/materials
 */
const getMaterials = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name FROM materials ORDER BY id ASC');
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy danh sách kỹ thuật chế tác thủ công
 * GET /api/techniques
 */
const getTechniques = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name FROM techniques ORDER BY id ASC');
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getMaterials,
  getTechniques,
};
