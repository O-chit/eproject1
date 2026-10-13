import apiClient from './client';

/**
 * Lấy danh sách sản phẩm yêu thích của người dùng hiện tại
 */
export async function getFavouritesApi() {
  return apiClient.get('/favourites');
}

/**
 * Thêm một sản phẩm vào danh sách yêu thích
 * @param {number|string} craftId
 */
export async function addFavouriteApi(craftId) {
  return apiClient.post('/favourites', { craftId });
}

/**
 * Xóa một sản phẩm khỏi danh sách yêu thích
 * @param {number|string} craftId
 */
export async function removeFavouriteApi(craftId) {
  return apiClient.delete(`/favourites/${craftId}`);
}

/**
 * Đồng bộ hóa danh sách yêu thích lưỡng thể (Hybrid Sync)
 * Khi khách đăng nhập, mảng ID lưu từ localStorage sẽ được gửi lên Backend để lưu vào PostgreSQL
 * @param {Array<number|string>} craftIds
 */
export async function syncFavouritesApi(craftIds = []) {
  if (!craftIds || craftIds.length === 0) return { success: true, data: [] };
  return apiClient.post('/favourites/sync', { craftIds });
}
