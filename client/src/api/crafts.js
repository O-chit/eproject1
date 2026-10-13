import apiClient from './client.js';

/**
 * Lấy danh sách sản phẩm với các tham số lọc đa diện từ Database Backend
 * @param {Object} params - { q, category, region, material, technique, sort, page, limit }
 */
export async function getCrafts(params = {}) {
  const queryParams = { ...params };
  // Chuẩn hóa tham số: nếu category là 'all' thì không gửi lên query
  if (queryParams.category === 'all') {
    delete queryParams.category;
  }
  if (queryParams.region === 'all') {
    delete queryParams.region;
  }

  const res = await apiClient.get('/crafts', { params: queryParams });
  return res;
}

/**
 * Lấy chi tiết một sản phẩm theo ID hoặc Slug từ Database Backend
 * @param {string|number} id
 */
export async function getCraftById(id) {
  const res = await apiClient.get(`/crafts/${id}`);
  return res;
}

/**
 * Lấy danh sách sản phẩm liên quan từ Database Backend
 * @param {string|number} id
 */
export async function getRelatedCrafts(id) {
  const res = await apiClient.get(`/crafts/${id}/related`);
  return res;
}

/**
 * Lấy danh sách các tác phẩm tiêu biểu (Featured Crafts)
 * @param {number} limit
 */
export async function getFeaturedCrafts(limit = 6) {
  const res = await apiClient.get('/crafts', {
    params: { is_featured: true, limit },
  });
  return res;
}
