const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');
const db = require('../config/db');

/**
 * Middleware xác thực JWT token (BearerAuth)
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 401, 'UNAUTHORIZED', 'Yêu cầu token xác thực Bearer hợp lệ');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    
    // Kiểm tra xem người dùng có còn tồn tại và active trong DB không
    const userResult = await db.query(
      'SELECT id, full_name, email, role, avatar_url, is_active FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rowCount === 0 || !userResult.rows[0].is_active) {
      return error(res, 401, 'UNAUTHORIZED', 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa');
    }

    const row = userResult.rows[0];
    req.user = {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      avatarUrl: row.avatar_url,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 401, 'TOKEN_EXPIRED', 'Token xác thực đã hết hạn, vui lòng đăng nhập lại');
    }
    return error(res, 401, 'INVALID_TOKEN', 'Token xác thực không hợp lệ');
  }
};

/**
 * Middleware tùy chọn: Nếu có token thì giải mã, không có thì vẫn cho qua (dành cho các trang xem public nhưng ưu tiên user)
 */
const optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    const userResult = await db.query(
      'SELECT id, full_name, email, role, avatar_url, is_active FROM users WHERE id = $1',
      [decoded.id]
    );
    if (userResult.rowCount > 0 && userResult.rows[0].is_active) {
      const row = userResult.rows[0];
      req.user = {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        role: row.role,
        avatarUrl: row.avatar_url,
      };
    }
  } catch (err) {
    // Bỏ qua lỗi nếu token optional
  }
  next();
};

module.exports = {
  authenticate,
  optionalAuthenticate,
};
