import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PublicOnlyRoute - Chỉ dành cho người dùng chưa đăng nhập (Login, Register)
 * Nếu người dùng đã đăng nhập thì tự động chuyển hướng về trang chính.
 */
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-canvas-linen flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">
          Đang xác thực phiên làm việc...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    // Nếu đã đăng nhập, chuyển về trang trước đó hoặc trang chủ
    const destination = location.state?.from?.pathname || '/';
    return <Navigate to={destination} replace />;
  }

  return children;
}
