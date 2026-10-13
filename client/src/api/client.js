import axios from 'axios';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:5000/api';

/**
 * Cấu hình Axios Client tập trung cho CraftRoots Frontend
 * - Tự động đính kèm Bearer JWT Token vào Header của các request
 * - Tự động giải phóng phản hồi theo Unified Response Envelope
 * - Xử lý tập trung mã lỗi 401 Unauthorized (hết hạn phiên đăng nhập)
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Đính kèm JWT Token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token =
        typeof window !== 'undefined' && typeof localStorage !== 'undefined'
          ? localStorage.getItem('craftroots_token')
          : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Không thể đọc token từ localStorage:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Chuẩn hóa Response Envelope & Bắt lỗi bảo mật
apiClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp envelope từ backend: { success, data, message, pagination }
    return response.data;
  },
  (error) => {
    // Trường hợp nhận phản hồi lỗi từ Backend
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Phiên đăng nhập hết hạn hoặc không hợp lệ -> Dọn dẹp storage
        try {
          localStorage.removeItem('craftroots_token');
          localStorage.removeItem('craftroots_user');
          window.dispatchEvent(new Event('craftroots:unauthorized'));
        } catch {
          // ignore
        }
      }

      // Ném lỗi với thông điệp rõ ràng từ Server Envelope
      const normalizedError = new Error(data?.message || `Lỗi máy chủ (${status})`);
      normalizedError.statusCode = status;
      normalizedError.response = error.response;
      normalizedError.data = data;
      return Promise.reject(normalizedError);
    }

    // Trường hợp lỗi mạng, máy chủ chưa bật hoặc timeout
    const networkError = new Error(
      error.code === 'ECONNABORTED'
        ? 'Hết thời gian chờ phản hồi từ máy chủ (Timeout 10s)'
        : 'Không thể kết nối đến máy chủ API. Vui lòng kiểm tra mạng hoặc dịch vụ backend.'
    );
    networkError.isNetworkError = true;
    return Promise.reject(networkError);
  }
);

export default apiClient;
