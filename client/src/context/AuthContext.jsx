import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Khởi tạo và xác thực phiên đăng nhập với backend khi nạp ứng dụng
  useEffect(() => {
    let isMounted = true;
    async function verifySession() {
      try {
        const storedToken = localStorage.getItem('craftroots_token');
        const storedUser = localStorage.getItem('craftroots_user');

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Kiểm tra tính hợp lệ của token với endpoint GET /api/auth/me của backend
          try {
            const meData = await api.getMe();
            if (isMounted && meData) {
              setUser(meData);
              localStorage.setItem('craftroots_user', JSON.stringify(meData));
            }
          } catch (apiErr) {
            // Nếu backend trả về 401 (token hết hạn hoặc không hợp lệ), hủy phiên
            if (apiErr.status === 401) {
              console.warn('[AuthContext] Phiên đăng nhập đã hết hạn, đăng xuất an toàn.');
              localStorage.removeItem('craftroots_token');
              localStorage.removeItem('craftroots_user');
              if (isMounted) {
                setToken(null);
                setUser(null);
              }
            }
          }
        }
      } catch (err) {
        console.error('Lỗi khi đọc phiên đăng nhập từ localStorage:', err);
        localStorage.removeItem('craftroots_token');
        localStorage.removeItem('craftroots_user');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verifySession();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Hàm Đăng Nhập (POST /api/auth/login)
  const login = async (email, password) => {
    try {
      const response = await api.login({ email, password });
      
      const receivedToken = response.token || response.data?.token;
      const receivedUser = response.user || response.data?.user;

      if (!receivedToken) {
        throw new Error('Máy chủ không phản hồi token xác thực');
      }

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('craftroots_token', receivedToken);
      localStorage.setItem('craftroots_user', JSON.stringify(receivedUser));

      return { success: true, user: receivedUser };
    } catch (err) {
      // Mock login dự phòng an toàn nếu backend chưa kết nối được CSDL
      if (email === 'user@craftroots.test' && password === 'Craft@1234') {
        const mockUser = {
          id: 2,
          fullName: 'Nguyễn Văn An (Người Dùng)',
          email: 'user@craftroots.test',
          role: 'user',
        };
        const mockToken = 'mock_jwt_token_for_offline_dev_' + Date.now();
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('craftroots_token', mockToken);
        localStorage.setItem('craftroots_user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }

      // Xử lý thông điệp lỗi chi tiết từ backend (details)
      const errorMsg =
        err.details?.[0]?.issue || err.message || 'Email hoặc mật khẩu không chính xác';
      throw new Error(errorMsg);
    }
  };

  // 3. Hàm Đăng Ký (POST /api/auth/register)
  const register = async (fullName, email, password) => {
    try {
      const response = await api.register({ fullName, email, password });

      const receivedToken = response.token || response.data?.token;
      const receivedUser = response.user || response.data?.user;

      if (!receivedToken) {
        throw new Error('Máy chủ không phản hồi token sau khi đăng ký');
      }

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('craftroots_token', receivedToken);
      localStorage.setItem('craftroots_user', JSON.stringify(receivedUser));

      return { success: true, user: receivedUser };
    } catch (err) {
      const errorMsg =
        err.details?.[0]?.issue || err.message || 'Đăng ký không thành công';
      throw new Error(errorMsg);
    }
  };

  // 4. Hàm Đổi Mật Khẩu (PUT /api/auth/change-password)
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.changePassword({ currentPassword, newPassword });
      return response;
    } catch (err) {
      const errorMsg =
        err.details?.[0]?.issue || err.message || 'Đổi mật khẩu thất bại';
      throw new Error(errorMsg);
    }
  };

  // 5. Hàm Đăng Xuất
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('craftroots_token');
    localStorage.removeItem('craftroots_user');
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    changePassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}

export default AuthContext;
