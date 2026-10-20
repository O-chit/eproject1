/**
 * API Service Client kết nối trực tiếp với PostgreSQL Backend qua Express REST API
 */
const API_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader() {
  try {
    const token = localStorage.getItem('craftroots_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    const errorMsg = data.message || `Lỗi máy chủ (${res.status})`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  
  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Sản phẩm thủ công
  getCrafts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    const qs = query.toString();
    return request(`/crafts${qs ? `?${qs}` : ''}`);
  },
  getCraftById: (id) => request(`/crafts/${id}`),
  getRelatedCrafts: (id) => request(`/crafts/${id}/related`),
  createCraft: (payload) => request('/crafts', { method: 'POST', body: JSON.stringify(payload) }),
  updateCraft: (id, payload) => request(`/crafts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCraft: (id) => request(`/crafts/${id}`, { method: 'DELETE' }),

  // Danh mục & Siêu dữ liệu
  getCategories: () => request('/categories'),
  getMaterials: () => request('/materials'),
  getTechniques: () => request('/techniques'),

  // Nghệ nhân
  getArtisans: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    const qs = query.toString();
    return request(`/artisans${qs ? `?${qs}` : ''}`);
  },
  getArtisanById: (id) => request(`/artisans/${id}`),
  createArtisan: (payload) => request('/artisans', { method: 'POST', body: JSON.stringify(payload) }),
  updateArtisan: (id, payload) => request(`/artisans/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteArtisan: (id) => request(`/artisans/${id}`, { method: 'DELETE' }),

  // Vùng miền
  getRegions: () => request('/regions'),
  getCraftsByRegion: (id) => request(`/regions/${id}/crafts`),

  // Bộ sưu tập & Bộ sưu tập mùa
  getCollections: () => request('/collections'),
  getSeasonalCollections: () => request('/seasonal-collections'),
  getSeasonalCollectionById: (id) => request(`/seasonal-collections/${id}`),

  // Gallery
  getGallery: () => request('/gallery'),

  // Yêu thích
  getFavourites: () => request('/favourites'),
  addFavourite: (craftId) => request(`/favourites/${craftId}`, { method: 'POST' }),
  removeFavourite: (craftId) => request(`/favourites/${craftId}`, { method: 'DELETE' }),
  syncFavourites: (craftIds) => request('/favourites/sync', { method: 'POST', body: JSON.stringify({ craftIds }) }),

  // Tin nhắn liên hệ
  submitContact: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),

  // Xác thực tài khoản (Auth) khớp chuẩn backend Express
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),
  changePassword: (payload) => request('/auth/change-password', { method: 'PUT', body: JSON.stringify(payload) }),
  // Phân hệ AI Chatbot (Ollama Local)
  chatAi: (payload) => request('/ai/chat', { method: 'POST', body: JSON.stringify(payload) }),
  getAiHistory: (sessionId) => request(`/ai/sessions/${sessionId}/history`),
  deleteAiHistory: (sessionId) => request(`/ai/sessions/${sessionId}`, { method: 'DELETE' }),
  getAiStatus: () => request('/ai/status'),
};

export default api;
