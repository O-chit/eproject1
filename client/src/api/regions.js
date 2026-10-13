import apiClient from './client.js';

/**
 * Lấy danh sách các vùng miền từ Database Backend
 */
export async function getRegionsApi() {
  const res = await apiClient.get('/regions');
  return res;
}

/**
 * Lấy danh sách sản phẩm thuộc một vùng cụ thể
 * @param {string|number} id - Region ID
 */
export async function getRegionCraftsApi(id) {
  const res = await apiClient.get(`/regions/${id}/crafts`);
  return res;
}

/**
 * Lấy danh sách các làng nghề (Craft Villages) kèm tọa độ WGS-84 từ Database Backend
 * @param {string|number} [regionId]
 */
export async function getVillagesApi(regionId = null) {
  const params = regionId && regionId !== 'all' ? { region: regionId } : {};
  const res = await apiClient.get('/regions/villages', { params });
  return res;
}
