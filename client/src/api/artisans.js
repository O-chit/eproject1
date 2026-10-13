import apiClient from './client.js';

/**
 * Lấy danh sách nghệ nhân từ Database Backend
 * @param {Object} params - { region, page, limit }
 */
export async function getArtisansApi(params = {}) {
  const res = await apiClient.get('/artisans', { params });
  return res;
}

/**
 * Xem hồ sơ chi tiết nghệ nhân kèm danh sách tác phẩm chế tác (N-N)
 * @param {string|number} id
 */
export async function getArtisanByIdApi(id) {
  const res = await apiClient.get(`/artisans/${id}`);
  return res;
}
