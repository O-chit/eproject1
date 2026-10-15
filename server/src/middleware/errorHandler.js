const { error } = require('../utils/response');

/**
 * Middleware bắt lỗi tập trung (Global Centralized Error Handler)
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Occurred]:', err);

  // Lỗi cú pháp JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return error(res, 400, 'BAD_REQUEST', 'Định dạng dữ liệu JSON gửi lên không hợp lệ');
  }

  // Lỗi Unique Constraint của PostgreSQL (trùng lặp dữ liệu)
  if (err.code === '23505') {
    return error(res, 409, 'CONFLICT', 'Dữ liệu đã tồn tại trong hệ thống (Duplicate Key)');
  }

  // Lỗi Foreign Key Constraint của PostgreSQL
  if (err.code === '23503') {
    return error(res, 400, 'BAD_REQUEST', 'Tham chiếu khóa ngoại không hợp lệ hoặc bản ghi liên quan không tồn tại');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Đã xảy ra lỗi máy chủ nội bộ';
  const errorCode = err.errorCode || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');

  return error(res, statusCode, errorCode, message, err.details || null);
};

/**
 * Middleware xử lý khi không tìm thấy route (404 Not Found)
 */
const notFoundHandler = (req, res) => {
  return error(res, 404, 'NOT_FOUND', `Không tìm thấy endpoint ${req.method} ${req.originalUrl}`);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
