import apiClient from './client.js';

/**
 * Lấy danh sách các bộ sưu tập theo mùa (Seasonal Collections)
 */
export async function getSeasonalCollectionsApi() {
  const res = await apiClient.get('/seasonal-collections');
  return res;
}

/**
 * Lấy chi tiết bộ sưu tập theo mùa kèm Hero Craft và danh sách tác phẩm
 * @param {string|number} id
 */
export async function getSeasonalCollectionByIdApi(id) {
  const res = await apiClient.get(`/seasonal-collections/${id}`);
  return res;
}

/**
 * Lấy bộ sưu tập mùa đang hoạt động (Active / Current Season)
 */
export async function getCurrentSeasonalCollectionApi() {
  try {
    const res = await apiClient.get('/seasonal-collections/current');
    return res;
  } catch {
    // Nếu endpoint /current chưa có, lấy bộ sưu tập đầu tiên
    const listRes = await getSeasonalCollectionsApi();
    const active = listRes?.data?.find((c) => c.isActive) || listRes?.data?.[0];
    if (active) {
      return getSeasonalCollectionByIdApi(active.id);
    }
    throw new Error('Chưa có bộ sưu tập mùa nào trên hệ thống');
  }
}
