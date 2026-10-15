/**
 * Chuyển đổi chuỗi tiếng Việt có dấu thành slug URL thân thiện
 * @param {string} text - Chuỗi cần chuyển đổi
 * @returns {string} slug
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu tiếng Việt
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '') // Xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // Đổi khoảng trắng thành gạch ngang
    .replace(/-+/g, '-'); // Tránh lặp dấu gạch ngang
}

module.exports = slugify;
