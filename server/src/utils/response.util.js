/**
 * Tiện ích chuẩn hoá phản hồi API (Unified Response Envelope)
 * Tuân thủ theo hợp đồng docs/api-contract.yaml
 */

/**
 * Phản hồi thành công chuẩn hoá
 * @param {import('express').Response} res
 * @param {*} data - Dữ liệu trả về (object hoặc array)
 * @param {object} options
 * @param {string} [options.message] - Thông điệp mô tả (tùy chọn)
 * @param {number} [options.statusCode=200] - Mã trạng thái HTTP
 * @param {object} [options.pagination] - Siêu dữ liệu phân trang
 * @param {object} [options.extra] - Các trường phụ trợ (token, user, ...)
 */
const sendSuccess = (
  res,
  data = undefined,
  { message = null, statusCode = 200, pagination = null, extra = {} } = {}
) => {
  const payload = {
    success: true,
    ...extra,
  };

  if (message) {
    payload.message = message;
  }

  if (data !== undefined) {
    payload.data = data;
  }

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(statusCode).json(payload);
};

/**
 * Phản hồi lỗi chuẩn hoá ApiErrorResponse
 * @param {import('express').Response} res
 * @param {string} message - Thông điệp lỗi hiển thị
 * @param {object} options
 * @param {number} [options.statusCode=400] - Mã HTTP (400, 401, 403, 404, 409, 500)
 * @param {string} [options.error='BAD_REQUEST'] - Mã định danh lỗi (ERROR_CODE)
 * @param {Array<{field: string, issue: string}>} [options.details=[]] - Danh sách lỗi chi tiết
 */
const sendError = (
  res,
  message = 'Đã có lỗi xảy ra',
  { statusCode = 400, error = 'BAD_REQUEST', details = [] } = {}
) => {
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
  sendSuccess,
  sendError,
};
