import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/crafts?q=${encodeURIComponent(searchQuery.trim())}`);
      setDrawerOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Trang Chủ' },
    { to: '/crafts', label: 'Danh Mục Di Sản' },
    { to: '/regions', label: 'Vùng Miền & Làng Nghề' },
    { to: '/artisans', label: 'Nghệ Nhân' },
    { to: '/seasonal', label: 'Mùa Triển Lãm' },
    { to: '/contact', label: 'Gặp Gỡ & Kết Nối' },
  ];

  const categories = [
    { name: 'Gốm Sứ & Đất Nung', count: 18, path: '/crafts?category=gom-su' },
    { name: 'Dệt & Thổ Cẩm Tự Nhiên', count: 14, path: '/crafts?category=det-tho-cam' },
    { name: 'Mây Tre Đan & Thủ Công Nan', count: 12, path: '/crafts?category=may-tre-dan' },
    { name: 'Chạm Khắc & Mộc Bản Cổ', count: 9, path: '/crafts?category=cham-khac-go' },
    { name: 'Sơn Mài & Dát Vàng Truyền Thống', count: 7, path: '/crafts?category=son-mai' },
    { name: 'Kim Hoàn & Đúc Đồng Mỹ Nghệ', count: 6, path: '/crafts?category=duc-dong' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#E6E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Trái: Menu Hamburger Toggle & Brand Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="w-10 h-10 border border-[#E6E2DA] hover:border-[#B86B35] bg-[#FFFFFF] flex items-center justify-center text-[#1C1B1A] hover:text-[#B86B35] transition-colors focus:outline-none"
              aria-label="Mở danh mục di sản"
            >
              <span className="material-symbols-outlined text-[20px]">
                {drawerOpen ? 'close' : 'menu'}
              </span>
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full border border-[#B86B35] flex items-center justify-center bg-[#F9F8F6] text-[#B86B35] font-serif font-bold text-sm tracking-widest">
                CR
              </div>
              <div className="flex flex-col">
                <span className="font-['Montserrat'] text-[13px] uppercase tracking-[0.25em] text-[#1C1B1A] font-semibold group-hover:text-[#B86B35] transition-colors">
                  CraftRoots
                </span>
                <span className="font-['Inter'] text-[9px] uppercase tracking-[0.18em] text-[#5A5854] leading-none">
                  Di Sản Sống
                </span>
              </div>
            </Link>
          </div>

          {/* Giữa: Menu ngang chính (Desktop) & Thanh tìm kiếm */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-['Montserrat'] text-[11px] uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? 'text-[#B86B35] font-semibold border-b border-[#B86B35] pb-1'
                      : 'text-[#5A5854] hover:text-[#1C1B1A]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Phải: Search bar mini, Favourites, Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Thanh search nhanh */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <span className="material-symbols-outlined absolute left-3 text-[#5A5854] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tác phẩm, nghệ nhân..."
                className="w-48 xl:w-64 h-9 pl-9 pr-3 bg-[#FFFFFF] border border-[#E6E2DA] text-[13px] text-[#1C1B1A] placeholder:text-[#5A5854]/60 focus:outline-none focus:border-[#B86B35] transition-colors"
              />
            </form>

            {/* Mục Yêu Thích */}
            <Link
              to="/favourites"
              className="flex items-center gap-2 border border-[#E6E2DA] bg-[#FFFFFF] px-3 py-2 text-[#54433A] hover:text-[#B86B35] hover:border-[#B86B35] transition-colors font-['Montserrat'] text-[11px] tracking-[0.15em] uppercase"
              title="Danh mục yêu thích"
            >
              <span className="material-symbols-outlined text-[16px] text-[#B86B35]">
                bookmark
              </span>
              <span className="hidden sm:inline">Đã Lưu</span>
            </Link>

            <span className="text-[#E6E2DA] opacity-60 font-light select-none hidden sm:inline">
              |
            </span>

            {/* Tài khoản cá nhân */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div
                  className="h-9 px-2.5 border border-[#B86B35] bg-[#FFFFFF] flex items-center gap-1.5 text-[12px] text-[#B86B35] font-['Montserrat'] font-medium"
                  title={`Đã đăng nhập: ${user?.fullName || user?.email}`}
                >
                  <span className="material-symbols-outlined text-[17px]">account_circle</span>
                  <span className="hidden xl:inline max-w-[100px] truncate">{user?.fullName?.split(' ')[0] || 'Tài khoản'}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="w-9 h-9 border border-[#E6E2DA] bg-[#FFFFFF] flex items-center justify-center text-[#5A5854] hover:text-[#BA1A1A] hover:border-[#BA1A1A] transition-colors"
                  title="Đăng xuất"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-9 h-9 border border-[#E6E2DA] bg-[#FFFFFF] flex items-center justify-center text-[#1C1B1A] hover:border-[#B86B35] hover:text-[#B86B35] transition-colors"
                title="Đăng nhập tài khoản"
              >
                <span className="material-symbols-outlined text-[19px]">
                  person
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Drawer trượt từ đỉnh xuống khi bấm Menu Hamburger */}
        {drawerOpen && (
          <div className="w-full bg-[#F9F8F6]/98 border-t border-[#E6E2DA] backdrop-blur-md shadow-xl transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#E6E2DA] mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#B86B35] inline-block"></span>
                  <span className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#B86B35] font-semibold">
                    MỤC LỤC DI SẢN & BỘ LỌC CHUYÊN ĐỀ
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="text-xs font-['Montserrat'] uppercase tracking-wider text-[#5A5854] hover:text-[#1C1B1A] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  Đóng
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cột 1: Điều hướng các phân hệ */}
                <div>
                  <h4 className="font-['Montserrat'] text-[11px] uppercase tracking-[0.2em] text-[#867368] font-semibold mb-4">
                    Phân Hệ Khám Phá
                  </h4>
                  <ul className="space-y-3">
                    {navLinks.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setDrawerOpen(false)}
                          className="font-['Playfair_Display'] text-[18px] text-[#1C1B1A] hover:text-[#B86B35] transition-colors flex items-center justify-between group"
                        >
                          <span>{item.label}</span>
                          <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#B86B35]">
                            arrow_right_alt
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cột 2: Các danh mục ngành nghề */}
                <div>
                  <h4 className="font-['Montserrat'] text-[11px] uppercase tracking-[0.2em] text-[#867368] font-semibold mb-4">
                    Ngành Nghề Tiêu Biểu
                  </h4>
                  <ul className="space-y-2.5">
                    {categories.map((cat) => (
                      <li key={cat.name}>
                        <Link
                          to={cat.path}
                          onClick={() => setDrawerOpen(false)}
                          className="font-['Inter'] text-[14px] text-[#5A5854] hover:text-[#B86B35] flex items-center justify-between transition-colors py-1 border-b border-[#E6E2DA]/40"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[11px] font-['Inter'] text-[#867368] bg-[#F2EDEB] px-2 py-0.5 rounded-full">
                            {cat.count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cột 3: Tuyên ngôn & Tác phẩm tiêu điểm */}
                <div className="border border-[#E6E2DA] bg-[#FFFFFF] p-6 flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-[10px] font-['Montserrat'] uppercase tracking-[0.2em] text-[#B86B35] border border-[#B86B35] px-2 py-0.5 mb-3">
                      Lưu Trữ Sống
                    </span>
                    <h5 className="font-['Playfair_Display'] text-[17px] font-semibold text-[#1C1B1A] mb-2">
                      Gìn Giữ Hồn Cốt Nghề Cổ Việt Nam
                    </h5>
                    <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed">
                      Mỗi sản phẩm không đơn thuần là một vật phẩm, mà là sự lắng đọng của thời gian, đất trời và bàn tay người nghệ nhân.
                    </p>
                  </div>
                  <Link
                    to="/crafts"
                    onClick={() => setDrawerOpen(false)}
                    className="mt-4 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#B86B35] text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.15em] hover:bg-[#8E4A16] transition-colors"
                  >
                    Xem Toàn Bộ 66+ Tác Phẩm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Spacer giữ chiều cao cho Header cố định */}
      <div className="h-20"></div>
    </>
  );
}
