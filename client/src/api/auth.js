import apiClient from './client.js';

/**
 * Đăng nhập tài khoản qua Database Backend
 * @param {Object} credentials - { email, password }
 */
export async function loginApi({ email, password }) {
  const res = await apiClient.post('/auth/login', { email, password });
  return res;
}

/**
 * Đăng ký tài khoản mới vào Database Backend
 * @param {Object} payload - { fullName, email, password }
 */
export async function registerApi({ fullName, email, password }) {
  const res = await apiClient.post('/auth/register', { fullName, email, password });
  return res;
}

/**
 * Lấy thông tin tài khoản hiện tại từ JWT Token
 */
export async function getMeApi() {
  const res = await apiClient.get('/auth/me');
  return res;
}

/**
 * Đổi mật khẩu tài khoản
 * @param {Object} payload - { currentPassword, newPassword }
 */
export async function changePasswordApi({ currentPassword, newPassword }) {
  const res = await apiClient.put('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return res;
}
