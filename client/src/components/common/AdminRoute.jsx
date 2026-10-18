import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminRoute - Bảo vệ các tuyến đường Quản trị CMS (SEC 6.3 RBAC)
 * Chỉ cho phép người dùng có vai trò 'admin' hoặc 'editor' truy cập.
 */
export default function AdminRoute({ children, requireAdminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-canvas-linen flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">
          ĐANG XÁC THỰC QUYỀN QUẢN TRỊ VIÊN...
        </p>
      </div>
    );
  }

  // 1. Chưa đăng nhập -> Chuyển về trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user?.role;
  const isAuthorized = requireAdminOnly ? role === 'admin' : role === 'admin' || role === 'editor';

  // 2. Đã đăng nhập nhưng không đủ quyền -> Hiển thị thông báo 403 Từ chối truy cập
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-canvas-linen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-surface-crisp border border-border-neutral p-8 shadow-sm">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-surface-subtle border border-accent-terracotta flex items-center justify-center text-accent-terracotta">
            <span className="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <span className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold block mb-2">
            403 · KHÔNG ĐỦ QUYỀN TRUY CẬP
          </span>
          <h1 className="font-serif text-2xl font-bold text-text-primary mb-3">
            Khu Vực Quản Trị Giới Hạn
          </h1>
          <p className="font-sans text-[13px] text-text-secondary leading-relaxed mb-6">
            Tài khoản của quý khách (<strong className="text-text-primary">{user?.email}</strong>) hiện có vai trò <em>{role || 'user'}</em>, không có quyền truy cập vào phân hệ Quản trị &amp; Biên tập Di sản CraftRoots.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-5 py-2.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[11px] uppercase tracking-wider font-semibold transition-colors"
            >
              ← Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
