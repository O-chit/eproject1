/**
 * CraftRoots API Response Helpers
 * Chuẩn hóa cấu trúc phản hồi theo OpenAPI 3.0.3 Specification (docs/api-contract.yaml)
 */

/**
 * Trả về phản hồi thành công chung
 * @param {import('express').Response} res
 * @param {*} data - Dữ liệu trả về
 * @param {number} statusCode - Mã HTTP (mặc định 200)
 * @param {object} [extra] - Các trường mở rộng (ví dụ pagination, message)
 */
const success = (res, data, statusCode = 200, extra = {}) => {
  return res.status(statusCode).json({
    success: true,
    ...(data !== undefined ? { data } : {}),
    ...extra,
  });
};

/**
 * Trả về phản hồi phân trang chuẩn PaginationMeta
 * @param {import('express').Response} res
 * @param {Array} items - Danh sách bản ghi
 * @param {number} page - Trang hiện tại
 * @param {number} limit - Số bản ghi mỗi trang
 * @param {number} totalItems - Tổng số bản ghi
 */
const paginated = (res, items, page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return res.status(200).json({
    success: true,
    data: items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalItems: Number(totalItems),
      totalPages,
    },
  });
};

/**
 * Trả về phản hồi lỗi chuẩn ApiErrorResponse
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} error - Mã lỗi (e.g. BAD_REQUEST, NOT_FOUND)
 * @param {string} message - Thông điệp lỗi
 * @param {Array} [details] - Chi tiết lỗi các trường dữ liệu
 */
const error = (res, statusCode, error, message, details = null) => {
  const payload = {
    success: false,
    statusCode,
    error,
    message,
  };
  if (details && details.length > 0) {
    payload.details = details;
  }
  return res.status(statusCode).json(payload);
};

module.exports = {
  success,
  paginated,
  error,
};
