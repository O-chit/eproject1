const { error } = require('../utils/response');

/**
 * Middleware phân quyền người dùng theo danh sách vai trò (Role-Based Access Control)
 * @param  {...string} allowedRoles - Danh sách vai trò được phép (ví dụ: 'admin', 'editor')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Phải đăng nhập trước (đã qua middleware authenticate)
    if (!req.user) {
      return error(res, 401, 'UNAUTHORIZED', 'Yêu cầu token xác thực Bearer hợp lệ để truy cập');
    }

    // 2. Kiểm tra vai trò của người dùng
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return error(
        res,
        403,
        'FORBIDDEN',
        `Bạn không có quyền thực hiện hành động này. Yêu cầu một trong các quyền: [${allowedRoles.join(', ')}]`
      );
    }

    next();
  };
};

module.exports = authorize;
