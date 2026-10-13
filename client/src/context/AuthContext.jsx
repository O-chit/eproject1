import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khởi tạo trạng thái đăng nhập từ localStorage khi nạp ứng dụng
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('craftroots_token');
      const storedUser = localStorage.getItem('craftroots_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Lỗi khi đọc phiên đăng nhập từ localStorage:', err);
      localStorage.removeItem('craftroots_token');
      localStorage.removeItem('craftroots_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm Đăng Nhập
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập không thành công');
      }

      const receivedToken = data.token || data.data?.token;
      const receivedUser = data.user || data.data?.user;

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('craftroots_token', receivedToken);
      localStorage.setItem('craftroots_user', JSON.stringify(receivedUser));

      return { success: true, user: receivedUser };
    } catch (err) {
      // Trường hợp Backend chưa khởi chạy: Mock login dự phòng cho kiểm thử giao diện
      if (email === 'user@craftroots.test' && password === 'Craft@1234') {
        const mockUser = {
          id: 1,
          fullName: 'Người Yêu Thủ Công',
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

      throw err;
    }
  };

  // Hàm Đăng Ký
  const register = async (fullName, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng ký không thành công');
      }

      const receivedToken = data.token || data.data?.token;
      const receivedUser = data.user || data.data?.user;

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('craftroots_token', receivedToken);
      localStorage.setItem('craftroots_user', JSON.stringify(receivedUser));

      return { success: true, user: receivedUser };
    } catch (err) {
      throw err;
    }
  };

  // Hàm Đăng Xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('craftroots_token');
    localStorage.removeItem('craftroots_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
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
