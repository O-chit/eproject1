import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const roleLabel = isAdmin ? 'Administrator' : 'Editor (Biên Tập)';

  // Hàm sinh breadcrumb đơn giản dựa theo pathname
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/crafts/new')) return 'Thêm Mới Tác Phẩm';
    if (path.includes('/crafts/') && path.includes('/edit')) return 'Chỉnh Sửa Tác Phẩm';
    if (path.includes('/crafts')) return 'Quản Lý Sản Phẩm Di Sản';
    if (path.includes('/artisans/new')) return 'Thêm Mới Bậc Thầy';
    if (path.includes('/artisans/') && path.includes('/edit')) return 'Chỉnh Sửa Hồ Sơ Nghệ Nhân';
    if (path.includes('/artisans')) return 'Quản Lý Hồ Sơ Nghệ Nhân';
    return 'Bảng Điều Khiển Quản Trị';
  };

  return (
    <div className="min-h-screen bg-canvas-linen flex flex-col antialiased">
      {/* 1. TOP BANNER NHẬN DIỆN PHIÊN BẢN ADMIN */}
      <div className="bg-[#1C1B1A] text-white py-1.5 px-4 sm:px-6 flex items-center justify-between text-[11px] font-spec-code tracking-wider border-b border-[#2C2B29]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-terracotta text-white font-semibold uppercase text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            CMS PORTAL
          </span>
          <span className="hidden md:inline text-white/80">
            Hệ thống Quản trị &amp; Biên tập Di sản CraftRoots · SEC 6.3 RBAC
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/70 hidden sm:inline">
            Tài khoản: <strong className="text-accent-terracotta">{user?.email}</strong> ({roleLabel})
          </span>
          <Link
            to="/"
            className="text-accent-terracotta hover:underline font-semibold flex items-center gap-1"
          >
            <span>← Về Website Chính</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 2. SIDEBAR CỐ ĐỊNH TRÊN DESKTOP */}
        <aside className="w-64 bg-surface-crisp border-r border-border-neutral hidden lg:flex flex-col shrink-0 select-none">
          {/* Logo Thương Hiệu */}
          <div className="p-5 border-b border-border-neutral flex items-center gap-3">
            <Link to="/admin/crafts" className="flex items-center gap-3 group">
              <div className="w-9 h-9 border border-accent-terracotta bg-canvas-linen text-accent-terracotta flex items-center justify-center font-serif font-bold text-base tracking-widest shadow-xs">
                CR
              </div>
              <div className="flex flex-col">
                <span className="font-['Montserrat'] text-[13px] uppercase tracking-[0.25em] font-bold text-text-primary leading-tight group-hover:text-accent-terracotta transition-colors">
                  CraftRoots
                </span>
                <span className="font-spec-code text-[9px] uppercase tracking-[0.18em] text-accent-terracotta font-semibold mt-0.5">
                  Admin CMS Portal
                </span>
              </div>
            </Link>
          </div>

          {/* User Badge */}
          <div className="p-3.5 mx-3 mt-3 bg-surface-subtle border border-border-neutral flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent-terracotta text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-['Montserrat'] text-[11px] font-semibold text-text-primary truncate">
                {user?.fullName || 'Quản Trị Viên'}
              </span>
              <span className="font-spec-code text-[9px] text-tertiary font-medium uppercase tracking-wider">
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Menu Điều Hướng */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-spec-code uppercase tracking-[0.2em] text-text-secondary font-semibold">
              Quản Trị Di Sản
            </div>

            <NavLink
              to="/admin/crafts"
              end
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-['Montserrat'] font-medium transition-all ${
                  isActive
                    ? 'bg-surface-subtle text-accent-terracotta border-l-2 border-accent-terracotta'
                    : 'text-text-primary hover:text-accent-terracotta hover:bg-surface-subtle border-l-2 border-transparent'
                }`
              }
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[19px]">inventory_2</span>
                <span>Sản Phẩm Di Sản</span>
              </span>
            </NavLink>

            <NavLink
              to="/admin/crafts/new"
              className={({ isActive }) =>
                `w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-['Montserrat'] pl-9 transition-all ${
                  isActive
                    ? 'bg-surface-subtle text-accent-terracotta border-l-2 border-accent-terracotta font-semibold'
                    : 'text-text-secondary hover:text-accent-terracotta hover:bg-surface-subtle border-l-2 border-transparent'
                }`
              }
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>+ Thêm Tác Phẩm Mới</span>
            </NavLink>

            <NavLink
              to="/admin/artisans"
              end
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-['Montserrat'] font-medium transition-all ${
                  isActive
                    ? 'bg-surface-subtle text-accent-terracotta border-l-2 border-accent-terracotta'
                    : 'text-text-primary hover:text-accent-terracotta hover:bg-surface-subtle border-l-2 border-transparent'
                }`
              }
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[19px]">person_celebrate</span>
                <span>Hồ Sơ Nghệ Nhân</span>
              </span>
            </NavLink>

            <NavLink
              to="/admin/artisans/new"
              className={({ isActive }) =>
                `w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-['Montserrat'] pl-9 transition-all ${
                  isActive
                    ? 'bg-surface-subtle text-accent-terracotta border-l-2 border-accent-terracotta font-semibold'
                    : 'text-text-secondary hover:text-accent-terracotta hover:bg-surface-subtle border-l-2 border-transparent'
                }`
              }
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>+ Thêm Bậc Thầy Mới</span>
            </NavLink>

            <div className="pt-4 px-3 pb-2 text-[10px] font-spec-code uppercase tracking-[0.2em] text-text-secondary font-semibold">
              Lối Tắt Xem Website
            </div>

            <Link
              to="/crafts"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-['Montserrat'] text-text-secondary hover:text-accent-terracotta hover:bg-surface-subtle transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                <span>Kho Tác Phẩm Khách Xem</span>
              </span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>

            <Link
              to="/artisans"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-['Montserrat'] text-text-secondary hover:text-accent-terracotta hover:bg-surface-subtle transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>Danh Bạ Nghệ Nhân Ngoài</span>
              </span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>

            <Link
              to="/regions"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-['Montserrat'] text-text-secondary hover:text-accent-terracotta hover:bg-surface-subtle transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">map</span>
                <span>Bản Đồ Di Sản 7 Vùng</span>
              </span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>
          </nav>

          {/* Footer Sidebar */}
          <div className="p-3 border-t border-border-neutral bg-surface-subtle/50 text-[11px] font-spec-code text-text-secondary flex items-center justify-between">
            <span>Vai trò: <strong className="text-text-primary">{isAdmin ? 'Toàn quyền' : 'Biên tập'}</strong></span>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-text-secondary hover:text-error cursor-pointer flex items-center gap-1"
              title="Đăng xuất"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>
        </aside>

        {/* 3. KHU VỰC NỘI DUNG CHÍNH (MAIN WORKSPACE) */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Bar Trong Trang Admin */}
          <header className="h-14 bg-surface-crisp border-b border-border-neutral px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 border border-border-neutral hover:border-accent-terracotta text-text-primary"
                aria-label="Toggle Menu"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>

              <div className="flex items-center gap-2 text-[12px] font-spec-code text-text-secondary">
                <Link to="/admin/crafts" className="hover:text-accent-terracotta">Admin</Link>
                <span>/</span>
                <span className="text-accent-terracotta font-semibold">{getBreadcrumb()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-spec-code uppercase tracking-wider text-text-secondary hover:text-accent-terracotta border border-border-neutral px-2.5 py-1 bg-surface-subtle"
              >
                <span className="material-symbols-outlined text-[15px]">home</span>
                <span>Trang Chủ</span>
              </Link>
            </div>
          </header>

          {/* Menu Drawer Mobile */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-surface-crisp border-b border-border-neutral p-4 space-y-2">
              <NavLink
                to="/admin/crafts"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-[13px] font-['Montserrat'] text-text-primary hover:bg-surface-subtle"
              >
                🏺 Quản Lý Sản Phẩm Di Sản
              </NavLink>
              <NavLink
                to="/admin/crafts/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-[13px] font-['Montserrat'] text-text-primary hover:bg-surface-subtle pl-6"
              >
                + Thêm Tác Phẩm Mới
              </NavLink>
              <NavLink
                to="/admin/artisans"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-[13px] font-['Montserrat'] text-text-primary hover:bg-surface-subtle"
              >
                👥 Quản Lý Hồ Sơ Nghệ Nhân
              </NavLink>
              <NavLink
                to="/admin/artisans/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-[13px] font-['Montserrat'] text-text-primary hover:bg-surface-subtle pl-6"
              >
                + Thêm Bậc Thầy Mới
              </NavLink>
            </div>
          )}

          {/* Nội dung trang con qua Outlet */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
