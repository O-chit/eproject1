import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';

export default function FavouritesPage() {
  const { isAuthenticated } = useAuth();
  const { favourites, toggleFav, clearAll } = useFavourites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Tải danh sách yêu thích thực tế (từ Database nếu đã đăng nhập hoặc từ IDs trong context/localStorage)
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const dbFavs = await api.getFavourites();
          if (!isMounted) return;
          const list = Array.isArray(dbFavs) ? dbFavs : dbFavs?.data || [];
          const mapped = list.map((c) => ({
            id: c.id,
            craftId: c.id,
            tag: c.tag || c.category || 'DI SẢN TRUYỀN THỐNG',
            village: c.village || c.region || 'Làng Nghề',
            category: c.category || 'Thủ Công',
            title: c.name,
            recordCode: c.code || `CR-0${c.id}`,
            artisan: c.artisan || 'Nghệ Nhân Làng Nghề',
            technique: c.technique || 'Chế tác thủ công bản địa',
            price: c.price_vnd || c.priceVnd
              ? `${Number(c.price_vnd || c.priceVnd).toLocaleString('vi-VN')} đ`
              : 'Ước lượng giám tuyển',
            image: c.image || c.thumbnailUrl || c.thumbnail_url || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
          }));
          setItems(mapped);
        } else {
          // Khách chưa đăng nhập: Nếu có danh sách ID trong favourites, nạp chi tiết các tác phẩm đó
          if (!favourites || favourites.length === 0) {
            if (isMounted) setItems([]);
            return;
          }
          const allCraftsRes = await api.getCrafts({ limit: 100 });
          if (!isMounted) return;
          const allCrafts = Array.isArray(allCraftsRes)
            ? allCraftsRes
            : allCraftsRes?.data || allCraftsRes?.crafts || [];
          const favIdsSet = new Set(favourites.map((id) => Number(id)));
          const matching = allCrafts.filter((c) => favIdsSet.has(Number(c.id)));
          const mapped = matching.map((c) => ({
            id: c.id,
            craftId: c.id,
            tag: c.tag || c.category || 'DI SẢN TRUYỀN THỐNG',
            village: c.village || c.region || 'Làng Nghề',
            category: c.category || 'Thủ Công',
            title: c.name,
            recordCode: c.code || `CR-0${c.id}`,
            artisan: c.artisan || 'Nghệ Nhân Làng Nghề',
            technique: c.technique || 'Chế tác thủ công bản địa',
            price: c.price_vnd || c.priceVnd
              ? `${Number(c.price_vnd || c.priceVnd).toLocaleString('vi-VN')} đ`
              : 'Ước lượng giám tuyển',
            image: c.image || c.thumbnailUrl || c.thumbnail_url || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.warn('Lỗi nạp danh sách yêu thích:', err);
        if (isMounted) setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, favourites]);

  const handleRemove = async (craftId, title) => {
    await toggleFav(craftId);
    setItems((prev) => prev.filter((item) => Number(item.craftId) !== Number(craftId)));
    setNotification(`Đã gỡ "${title}" khỏi danh sách lưu trữ.`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleClearAll = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ tác phẩm đã lưu trong bộ sưu tập?')) {
      await clearAll();
      setItems([]);
      setNotification('Đã xóa toàn bộ tác phẩm khỏi mục lưu trữ.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setNotification('Đã sao chép liên kết bộ sưu tập vào bộ nhớ tạm.');
      setTimeout(() => setNotification(''), 4000);
    } else {
      alert('Đã tạo liên kết chia sẻ bộ sưu tập.');
    }
  };

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Top Breadcrumb & Archive Meta Row */}
      <section className="w-full bg-canvas-linen pt-4 sm:pt-8 pb-3 sm:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border-neutral">
            {/* Structural Breadcrumb with delimiter styling */}
            <nav aria-label="Đường dẫn lưu trữ" className="flex items-center text-text-secondary font-label-action text-[10px] sm:text-label-action uppercase tracking-[0.14em] sm:tracking-[0.2em]">
              <Link to="/" className="hover:text-accent-terracotta transition-colors">TRANG CHỦ</Link>
              <span className="mx-2 sm:mx-3 text-border-neutral opacity-60 font-light select-none">|</span>
              <span className="text-text-secondary">HỒ SƠ CÁ NHÂN</span>
              <span className="mx-2 sm:mx-3 text-border-neutral opacity-60 font-light select-none">|</span>
              <span className="text-text-primary font-semibold">TÁC PHẨM ĐÃ LƯU</span>
            </nav>
            {/* Live Archive Coordinate Stamp */}
            <div className="flex items-center gap-2 font-spec-code text-[10px] sm:text-spec-code text-text-secondary uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta inline-block animate-pulse"></span>
              <span>{isAuthenticated ? 'BẢN GHI ĐỒNG BỘ CSDL' : 'LƯU TRỮ TRÌNH DUYỆT'}: {items.length.toString().padStart(2, '0')} DI SẢN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Title & Action Bar Section */}
      <section className="w-full bg-canvas-linen pb-4 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 pb-4">
            <div className="flex flex-col space-y-2 sm:space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-surface-crisp border border-border-neutral font-spec-code text-[10px] sm:text-spec-code uppercase tracking-[0.1em] sm:tracking-[0.15em] text-accent-terracotta shadow-sm">
                  {items.length} TÁC PHẨM ĐÃ LƯU
                </span>
                <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.1em] text-text-secondary">
                  MÃ ĐỊNH DANH: CR-ARCHIVE-VN
                </span>
              </div>
              <h1 className="font-headline-statement text-[20px] sm:text-[28px] md:text-[36px] lg:text-[42px] leading-[1.2] uppercase tracking-[1.5px] sm:tracking-[3px] md:tracking-[6px] font-extralight text-text-primary">
                LƯU TRỮ CÁ NHÂN
              </h1>
              <p className="font-body-spec text-[12px] sm:text-body-spec text-text-secondary leading-relaxed">
                {isAuthenticated
                  ? 'Danh sách tác phẩm di sản đã được đồng bộ trực tiếp với tài khoản máy chủ và lưu trữ an toàn trong cơ sở dữ liệu.'
                  : 'Danh sách được lưu trữ an toàn trên thiết bị của bạn. Hãy đăng nhập để đồng bộ vĩnh viễn trên toàn hệ thống.'}
              </p>
            </div>

            {/* Global Archive Utilities Bar */}
            <div className="flex flex-wrap items-center gap-y-2 text-[11px] sm:text-[13px] font-label-action uppercase tracking-[1px] sm:tracking-[2px] text-text-primary pb-2">
              <button
                type="button"
                onClick={handleShare}
                className="hover:text-accent-terracotta transition-colors flex items-center gap-1.5 py-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-accent-terracotta">share</span>
                <span>CHIA SẺ BỘ SƯU TẬP</span>
              </button>
              <span className="mx-4 text-border-neutral opacity-60 font-light select-none">|</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="hover:text-accent-terracotta transition-colors flex items-center gap-1.5 py-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-accent-terracotta">print</span>
                <span>IN BẢN KIỂM KÊ DI SẢN</span>
              </button>
              {items.length > 0 && (
                <>
                  <span className="mx-4 text-border-neutral opacity-60 font-light select-none">|</span>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-text-secondary hover:text-error transition-colors flex items-center gap-1.5 py-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                    <span>XÓA TẤT CẢ</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid of Bookmarked Artifacts */}
      <section className="w-full bg-canvas-linen pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-margin">
          {/* Notification banner if modified */}
          {notification && (
            <div className="mb-6 p-4 bg-surface-crisp border border-border-neutral shadow-sm text-text-primary flex items-center justify-between">
              <div className="flex items-center gap-2 font-body-spec text-body-spec">
                <span className="material-symbols-outlined text-accent-terracotta text-[18px]">verified</span>
                <span>{notification}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotification('')}
                className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary hover:text-text-primary cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-[0.15em]">
                Đang nạp danh mục tác phẩm lưu trữ...
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-surface-crisp border border-dashed border-border-neutral p-12 text-center my-8 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-accent-terracotta mb-3">bookmark_border</span>
              <h3 className="font-headline-title text-xl text-text-primary font-semibold mb-2">
                Chưa Có Tác Phẩm Nào Được Lưu Trữ
              </h3>
              <p className="font-body-spec text-[14px] text-text-secondary max-w-md mx-auto mb-6">
                Bạn chưa thêm tác phẩm nào vào tủ lưu trữ cá nhân. Hãy duyệt qua danh mục di sản và bấm lưu các kiệt tác bạn yêu thích.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/crafts"
                  className="bg-text-primary hover:bg-accent-terracotta text-surface-crisp px-6 py-3 font-label-action text-label-action uppercase tracking-[0.18em] transition-colors"
                >
                  Khám Phá Di Sản
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-gutter">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="craft-card flex flex-col justify-between bg-surface-crisp shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg border border-border-neutral/60 overflow-hidden"
                >
                  {/* 1:1 Aspect Image with Sharp Remove Button */}
                  <div className="relative w-full aspect-square bg-surface-subtle overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.craftId, item.title)}
                        className="btn-remove-item px-2 py-1 md:px-3 md:py-1.5 bg-surface-crisp/95 text-text-primary hover:text-accent-terracotta hover:bg-surface-crisp font-label-action text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.18em] uppercase shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                        title="Gỡ khỏi danh sách lưu trữ"
                      >
                        <span>✕</span>
                        <span className="hidden sm:inline">GỠ LƯU</span>
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3">
                      <span className="px-1.5 py-0.5 md:px-2.5 md:py-1 bg-text-primary/85 text-surface-crisp font-spec-code text-[9px] md:text-[11px] tracking-wider uppercase backdrop-blur-sm">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content Metadata Block */}
                  <div className="p-3 sm:p-4 md:p-space-lg flex flex-col flex-1 justify-between bg-surface-crisp">
                    <div>
                      <div className="flex items-center text-accent-terracotta font-spec-code text-[10px] md:text-spec-code uppercase tracking-wider mb-1 truncate">
                        <span className="truncate">{item.village || item.category || 'Di sản làng nghề'}</span>
                      </div>
                      <h2 className="font-title-card text-[15px] sm:text-[16px] md:text-title-card text-text-primary leading-snug line-clamp-2 mb-2">
                        <Link to={`/crafts/${item.craftId}`} className="hover:text-accent-terracotta transition-colors">
                          {item.title}
                        </Link>
                      </h2>
                      {/* Specs Detail Grid - Ẩn trên mobile để tối ưu diện tích */}
                      <div className="hidden md:block bg-surface-subtle p-3 space-y-1.5 font-spec-code text-[12px] text-text-secondary mb-3">
                        <div className="flex justify-between items-center">
                          <span className="uppercase tracking-wider">Mã Hồ Sơ:</span>
                          <span className="text-text-primary font-medium">{item.recordCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="uppercase tracking-wider">Nghệ nhân:</span>
                          <span className="text-text-primary">{item.artisan}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="uppercase tracking-wider">Kỹ thuật:</span>
                          <span className="text-text-primary">{item.technique}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Trigger */}
                    <div className="mt-3 md:mt-6 pt-2 md:pt-4 flex items-center justify-between bg-canvas-linen/40 -mx-3 -mb-3 px-3 py-2.5 md:-mx-space-lg md:-mb-space-lg md:px-space-lg md:py-4 border-t border-border-neutral/60 gap-1">
                      <div className="min-w-0">
                        <span className="hidden sm:block font-spec-code text-[9px] md:text-[10px] uppercase tracking-wider text-text-secondary truncate">
                          Ước lượng định giá
                        </span>
                        <span className="font-headline-title text-[13px] sm:text-[14px] md:text-[18px] text-text-primary font-semibold tracking-tight truncate block">
                          {item.price}
                        </span>
                      </div>
                      <Link
                        to={`/crafts/${item.craftId}`}
                        className="font-label-action text-[9px] sm:text-[10px] md:text-label-action uppercase tracking-[0.1em] md:tracking-[0.18em] text-text-primary hover:text-accent-terracotta flex items-center gap-0.5 md:gap-1 font-semibold transition-colors shrink-0"
                      >
                        <span><span className="hidden sm:inline">XEM </span>CHI TIẾT</span>
                        <span className="text-[12px] md:text-[14px]">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
