import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="craft-container py-24 text-center">
        <div className="w-10 h-10 border-2 border-[#B86B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="body-spec text-[#5A5854]">Đang xác thực phiên làm việc...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Chuyển hướng về trang đăng nhập và lưu lại vị trí trước đó
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
