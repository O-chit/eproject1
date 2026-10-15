import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PrivateRoute - Bảo vệ các tuyến đường yêu cầu xác thực tài khoản
 * Nếu chưa đăng nhập, người dùng bắt buộc phải chuyển sang trang Đăng nhập / Đăng ký trước khi vào xem thông tin.
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-canvas-linen flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">
          ĐANG KIỂM TRA PHIÊN DI SẢN...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Chuyển hướng bắt buộc về trang đăng nhập, kèm theo vị trí trang đang cố truy cập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
