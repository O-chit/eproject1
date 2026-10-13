import apiClient from './client.js';

/**
 * Lấy danh sách danh mục nghề từ Database Backend
 */
export async function getCategoriesApi() {
  const res = await apiClient.get('/categories');
  return res;
}

/**
 * Lấy danh sách chất liệu chế tác từ Database Backend
 */
export async function getMaterialsApi() {
  const res = await apiClient.get('/materials');
  return res;
}

/**
 * Lấy danh sách kỹ thuật chế tác từ Database Backend
 */
export async function getTechniquesApi() {
  const res = await apiClient.get('/techniques');
  return res;
}
