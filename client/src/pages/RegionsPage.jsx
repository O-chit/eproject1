import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CulturalMap from '../components/map/CulturalMap';
import { getRegionsApi, getRegionCraftsApi } from '../api/regions';

export default function RegionsPage() {
  const [regions, setRegions] = useState([]);
  const [activeRegionKey, setActiveRegionKey] = useState('all');
  const [activeRegionCrafts, setActiveRegionCrafts] = useState([]);
  const [showRegionPanel, setShowRegionPanel] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingCrafts, setLoadingCrafts] = useState(false);

  // 1. Tải danh sách vùng miền từ Database
  useEffect(() => {
    let isMounted = true;
    async function fetchRegions() {
      try {
        setLoadingRegions(true);
        const res = await getRegionsApi();
        if (isMounted && res.data) {
          setRegions(res.data);
        }
      } catch (err) {
        console.error('[RegionsPage] Lỗi nạp danh sách vùng miền:', err);
      } finally {
        if (isMounted) setLoadingRegions(false);
      }
    }

    fetchRegions();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Tìm thông tin vùng đang chọn
  const currentRegion = regions.find(
    (r) => r.code === activeRegionKey || String(r.id) === String(activeRegionKey)
  ) || {
    id: 'all',
    name: 'TOÀN CẢNH KHÔNG GIAN DI SẢN VIỆT NAM',
    code: 'CR-GEO-VIETNAM-ALL',
    description:
      'Bản đồ địa chí không gian di sản bao quát trọn vẹn các vùng văn hóa truyền thống cùng chủ quyền biển đảo thiêng liêng (Quần đảo Hoàng Sa và Quần đảo Trường Sa). Tích hợp dữ liệu mạng lưới làng nghề thủ công và nghệ nhân trao truyền qua nhiều thế hệ.',
    imageUrl:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
  };

  // 3. Tải các sản phẩm của vùng được chọn
  useEffect(() => {
    let isMounted = true;
    async function fetchRegionCrafts() {
      if (activeRegionKey === 'all') {
        setActiveRegionCrafts([]);
        return;
      }
      const targetRegion = regions.find(
        (r) => r.code === activeRegionKey || String(r.id) === String(activeRegionKey)
      );
      if (!targetRegion) return;

      try {
        setLoadingCrafts(true);
        const res = await getRegionCraftsApi(targetRegion.id);
        if (isMounted && res.data) {
          setActiveRegionCrafts(res.data);
        }
      } catch (err) {
        console.warn('[RegionsPage] Lỗi nạp sản phẩm theo vùng:', err);
      } finally {
        if (isMounted) setLoadingCrafts(false);
      }
    }

    fetchRegionCrafts();
    return () => {
      isMounted = false;
    };
  }, [activeRegionKey, regions]);

  return (
    <div className="flex flex-col w-full h-full flex-1 bg-[#1C1B1A] relative overflow-hidden">
      {/* THANH ĐIỀU HƯỚNG VÙNG MIỀN (Region Navigation Bar) */}
      <nav className="w-full bg-canvas-linen/95 backdrop-blur-md border-b border-border-neutral z-30 shrink-0 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xs select-none">
        {/* Cụm Trái: Tên Phân Hệ */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <span className="material-symbols-outlined text-[18px] text-accent-terracotta">map</span>
          <span className="font-spec-code text-[11px] uppercase tracking-[0.18em] text-text-primary font-semibold">
            BẢN ĐỒ VĂN HÓA LÀNG NGHỀ
          </span>
          <span className="text-border-neutral opacity-50 select-none">|</span>
        </div>

        {/* Cụm Giữa: Thanh Chuyển Vùng Ngang Lấy Động Từ CSDL */}
        <div className="flex-1 overflow-x-auto scrollbar-none py-0.5">
          <div className="flex items-center whitespace-nowrap font-label-action text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-text-secondary">
            <button
              type="button"
              onClick={() => setActiveRegionKey('all')}
              className={`py-1 px-1.5 transition-all cursor-pointer rounded-none ${
                activeRegionKey === 'all'
                  ? 'text-accent-terracotta font-bold border-b-2 border-accent-terracotta bg-accent-terracotta/5'
                  : 'hover:text-accent-terracotta'
              }`}
            >
              TẤT CẢ VÙNG
            </button>

            {regions.map((item) => {
              const regionKey = item.code || String(item.id);
              const isActive = activeRegionKey === regionKey;
              return (
                <React.Fragment key={item.id}>
                  <span className="mx-2 sm:mx-3 text-border-neutral opacity-40 select-none font-light">
                    |
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveRegionKey(regionKey)}
                    className={`py-1 px-1.5 transition-all cursor-pointer rounded-none ${
                      isActive
                        ? 'text-accent-terracotta font-bold border-b-2 border-accent-terracotta bg-accent-terracotta/5'
                        : 'hover:text-accent-terracotta'
                    }`}
                  >
                    {item.name}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Cụm Phải: Nút Xem Hồ Sơ Vùng & Thống kê */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-surface-crisp border border-border-neutral font-spec-code text-[10px] text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta animate-pulse"></span>
            <span className="text-text-primary font-semibold">
              {activeRegionCrafts.length > 0
                ? `${activeRegionCrafts.length} TÁC PHẨM`
                : `${regions.length} VÙNG DI SẢN`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowRegionPanel(!showRegionPanel)}
            className={`h-8 px-3 border border-border-neutral flex items-center gap-1.5 font-spec-code text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
              showRegionPanel
                ? 'bg-accent-terracotta text-surface-crisp border-accent-terracotta'
                : 'bg-surface-crisp hover:bg-surface-subtle text-text-primary'
            }`}
            title="Bật/Tắt thẻ hồ sơ thông tin vùng"
          >
            <span className="material-symbols-outlined text-[16px]">
              {showRegionPanel ? 'close' : 'info'}
            </span>
            <span className="hidden sm:inline">Hồ Sơ Vùng</span>
          </button>
        </div>
      </nav>

      {/* BẢN ĐỒ TOÀN MÀN HÌNH (Full-Screen Interactive Map Canvas) */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        <CulturalMap
          activeRegionKey={activeRegionKey}
          onRegionChange={(key) => setActiveRegionKey(key)}
          className="w-full h-full"
        />

        {/* THẺ HỒ SƠ TÓM TẮT VÙNG NỔI (Floating Collapsible Region Panel) */}
        {showRegionPanel && (
          <div className="absolute top-4 left-4 z-20 max-w-sm w-full bg-surface-crisp/95 backdrop-blur-md border border-border-neutral p-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-neutral">
              <span className="font-spec-code text-[11px] text-accent-terracotta tracking-[0.18em] uppercase font-semibold">
                {currentRegion.code || 'CR-GEO-VIETNAM'}
              </span>
              <button
                type="button"
                onClick={() => setShowRegionPanel(false)}
                className="text-text-secondary hover:text-text-primary p-1 cursor-pointer"
                title="Đóng hồ sơ vùng"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <h3 className="font-headline-title text-[18px] text-text-primary uppercase font-semibold tracking-wide mb-2">
              {currentRegion.name}
            </h3>

            <p className="font-body-spec text-[12px] text-text-secondary leading-relaxed mb-4">
              {currentRegion.description}
            </p>

            {/* Danh sách sản phẩm của vùng từ CSDL */}
            {activeRegionCrafts && activeRegionCrafts.length > 0 ? (
              <div className="space-y-2 mb-4">
                <span className="font-spec-code text-[10px] tracking-wider uppercase text-text-secondary block">
                  Tác Phẩm Tiêu Biểu Trong Vùng ({activeRegionCrafts.length}):
                </span>
                {activeRegionCrafts.slice(0, 3).map((craft) => (
                  <Link
                    key={craft.id}
                    to={`/crafts/${craft.id}`}
                    className="flex items-center justify-between p-2 bg-canvas-linen/60 hover:bg-canvas-linen border border-border-neutral text-[12px] group transition-colors"
                  >
                    <span className="font-medium text-text-primary group-hover:text-accent-terracotta truncate">
                      {craft.name}
                    </span>
                    <span className="text-[10px] text-accent-terracotta uppercase shrink-0 font-spec-code ml-2">
                      Xem →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-surface-subtle border border-border-neutral text-center text-[12px] text-text-secondary mb-4">
                Chọn một vùng cụ thể trên bản đồ để khám phá danh sách tác phẩm và làng nghề tương ứng.
              </div>
            )}

            <Link
              to="/crafts"
              className="flex items-center justify-between w-full bg-text-primary hover:bg-accent-terracotta text-surface-crisp px-4 py-2.5 font-label-action text-[11px] uppercase tracking-[0.14em] transition-colors"
            >
              <span>Xem Toàn Bộ Sản Phẩm Di Sản</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
