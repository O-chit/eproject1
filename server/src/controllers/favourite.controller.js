const db = require('../config/db');
const { success, error } = require('../utils/response');
const { craftSummarySelect, craftSummaryFrom } = require('../utils/craftHelper');

/**
 * Lấy danh sách sản phẩm yêu thích của người dùng hiện tại
 * GET /api/favourites
 */
const getFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT ${craftSummarySelect}
      ${craftSummaryFrom}
      JOIN favourites f ON f.craft_id = c.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;

    const result = await db.query(sql, [userId]);
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * Thêm một sản phẩm vào danh sách yêu thích
 * POST /api/favourites/:craftId
 */
const addFavourite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const craftId = parseInt(req.params.craftId, 10);

    if (isNaN(craftId)) {
      return error(res, 400, 'BAD_REQUEST', 'Mã sản phẩm không hợp lệ');
    }

    // Kiểm tra sản phẩm có tồn tại không
    const craftCheck = await db.query('SELECT id FROM crafts WHERE id = $1', [craftId]);
    if (craftCheck.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', 'Sản phẩm không tồn tại');
    }

    await db.query(
      `INSERT INTO favourites (user_id, craft_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, craft_id) DO NOTHING`,
      [userId, craftId]
    );

    return res.status(201).json({
      success: true,
      message: 'Thêm vào danh sách yêu thích thành công',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Xóa sản phẩm khỏi danh sách yêu thích
 * DELETE /api/favourites/:craftId
 */
const removeFavourite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const craftId = parseInt(req.params.craftId, 10);

    if (isNaN(craftId)) {
      return error(res, 400, 'BAD_REQUEST', 'Mã sản phẩm không hợp lệ');
    }

    await db.query('DELETE FROM favourites WHERE user_id = $1 AND craft_id = $2', [
      userId,
      craftId,
    ]);

    return res.status(200).json({
      success: true,
      message: 'Xóa khỏi danh sách yêu thích thành công',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Đồng bộ mảng sản phẩm yêu thích từ LocalStorage sau khi đăng nhập
 * POST /api/favourites/sync
 */
const syncFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { craftIds } = req.body;

    if (!Array.isArray(craftIds)) {
      return error(res, 400, 'BAD_REQUEST', 'craftIds phải là một mảng các số nguyên');
    }

    const validIds = craftIds
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id) && id > 0);

    let syncedCount = 0;

    if (validIds.length > 0) {
      // Lọc các id tồn tại trong bảng crafts
      const existingCrafts = await db.query(
        'SELECT id FROM crafts WHERE id = ANY($1::int[])',
        [validIds]
      );
      const allowedIds = existingCrafts.rows.map((r) => r.id);

      for (const craftId of allowedIds) {
        const insertRes = await db.query(
          `INSERT INTO favourites (user_id, craft_id)
           VALUES ($1, $2)
           ON CONFLICT (user_id, craft_id) DO NOTHING`,
          [userId, craftId]
        );
        if (insertRes.rowCount > 0) {
          syncedCount++;
        }
      }
    }

    // Lấy toàn bộ danh sách id yêu thích hiện tại của user
    const totalFavRes = await db.query(
      'SELECT craft_id FROM favourites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    const totalFavourites = totalFavRes.rows.map((r) => r.craft_id);

    return res.status(200).json({
      success: true,
      message: `Đồng bộ thành công ${syncedCount} sản phẩm vào tài khoản`,
      syncedCount,
      totalFavourites,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Xóa toàn bộ sản phẩm khỏi danh sách yêu thích
 * DELETE /api/favourites
 */
const clearAllFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await db.query('DELETE FROM favourites WHERE user_id = $1', [userId]);

    return res.status(200).json({
      success: true,
      message: 'Đã xóa toàn bộ sản phẩm khỏi danh sách yêu thích',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFavourites,
  addFavourite,
  removeFavourite,
  syncFavourites,
  clearAllFavourites,
};
