import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/auth';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || '/api';

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

  // Lắng nghe sự kiện token hết hạn từ api/client.js
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('craftroots:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('craftroots:unauthorized', handleUnauthorized);
  }, []);

  // Hàm Đăng Nhập
  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const receivedToken = res.data?.token || res.token;
    const receivedUser = res.data?.user || res.user;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('craftroots_token', receivedToken);
    localStorage.setItem('craftroots_user', JSON.stringify(receivedUser));

    return { success: true, user: receivedUser };
  };

  // Hàm Đăng Ký
  const register = async (fullName, email, password) => {
    const res = await registerApi({ fullName, email, password });
    const receivedToken = res.data?.token || res.token;
    const receivedUser = res.data?.user || res.user;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('craftroots_token', receivedToken);
    localStorage.setItem('craftroots_user', JSON.stringify(receivedUser));

    return { success: true, user: receivedUser };
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

export default AuthContext;
