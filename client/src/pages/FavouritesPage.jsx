import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import { getCraftById } from '../api/crafts';

export default function FavouritesPage() {
  const { favourites, toggleFav, isFav } = useFavourites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Tải thông tin chi tiết từng tác phẩm từ Database dựa trên danh sách ID đã lưu
  useEffect(() => {
    let isMounted = true;
    async function loadFavouritesDetails() {
      if (!favourites || favourites.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const promises = favourites.map((id) =>
          getCraftById(id).catch((err) => {
            console.warn(`[FavouritesPage] Không thể tải craft #${id}:`, err);
            return null;
          })
        );

        const results = await Promise.all(promises);
        if (isMounted) {
          const validCrafts = results
            .filter((res) => res && res.data)
            .map((res) => res.data);
          setItems(validCrafts);
        }
      } catch (err) {
        console.error('[FavouritesPage] Lỗi nạp danh sách yêu thích:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFavouritesDetails();
    return () => {
      isMounted = false;
    };
  }, [favourites]);

  const handleRemove = (craftId, title) => {
    toggleFav(craftId);
    setNotification(`Đã gỡ "${title}" khỏi danh sách lưu trữ.`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ tác phẩm đã lưu trong bộ sưu tập?')) {
      items.forEach((item) => toggleFav(item.id));
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
      <section className="w-full bg-canvas-linen pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-neutral">
            <nav aria-label="Đường dẫn lưu trữ" className="flex items-center text-text-secondary font-label-action text-label-action uppercase tracking-[0.2em]">
              <Link to="/" className="hover:text-accent-terracotta transition-colors">TRANG CHỦ</Link>
              <span className="mx-3 text-border-neutral opacity-60 font-light select-none">|</span>
              <span className="text-text-secondary">HỒ SƠ CÁ NHÂN</span>
              <span className="mx-3 text-border-neutral opacity-60 font-light select-none">|</span>
              <span className="text-text-primary font-semibold">TÁC PHẨM ĐÃ LƯU</span>
            </nav>
            <div className="flex items-center gap-2 font-spec-code text-spec-code text-text-secondary uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta inline-block animate-pulse"></span>
              <span>BẢN GHI ĐỒNG BỘ: {items.length.toString().padStart(2, '0')} DI SẢN TỪ CSDL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Title & Action Bar Section */}
      <section className="w-full bg-canvas-linen pb-8">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
            <div className="flex flex-col space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-surface-crisp border border-border-neutral font-spec-code text-spec-code uppercase tracking-[0.15em] text-accent-terracotta shadow-sm">
                  {items.length} TÁC PHẨM ĐÃ LƯU
                </span>
                <span className="font-spec-code text-[11px] uppercase tracking-[0.1em] text-text-secondary">
                  MÃ ĐỊNH DANH TỦ ĐỒNG BỘ: CR-ARCHIVE-VN
                </span>
              </div>
              <h1 className="font-headline-statement text-[34px] md:text-[42px] leading-[1.15] uppercase tracking-[6px] font-extralight text-text-primary">
                LƯU TRỮ CÁ NHÂN
              </h1>
              <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                Danh sách tác phẩm được nạp trực tiếp từ cơ sở dữ liệu di sản quốc gia. Bạn có thể lưu trữ và đối chiếu lý lịch các kiệt tác thủ công bất cứ lúc nào.
              </p>
            </div>

            {/* Global Archive Utilities Bar */}
            <div className="flex flex-wrap items-center gap-y-2 text-[13px] font-label-action uppercase tracking-[2px] text-text-primary pb-2">
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
        <div className="max-w-7xl mx-auto px-margin">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-surface-crisp border border-border-neutral h-[460px]"></div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-surface-crisp border border-dashed border-border-neutral p-12 text-center my-8 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-accent-terracotta mb-3">bookmark_border</span>
              <h3 className="font-headline-title text-xl text-text-primary font-semibold mb-2">
                Chưa Có Tác Phẩm Nào Được Lưu Trữ
              </h3>
              <p className="font-body-spec text-[14px] text-text-secondary max-w-md mx-auto mb-6">
                Bạn chưa lưu tác phẩm nào vào tủ lưu trữ cá nhân. Hãy duyệt qua danh mục di sản để bắt đầu lưu lại các hiện vật yêu thích.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="craft-card flex flex-col bg-surface-crisp shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg border border-border-neutral/60 justify-between"
                >
                  <div>
                    <div className="relative w-full aspect-square bg-surface-subtle overflow-hidden">
                      <img
                        src={item.thumbnailUrl || item.thumbnail_url || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80'}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 z-10">
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id, item.name)}
                          className="btn-remove-item px-3 py-1.5 bg-surface-crisp/95 text-text-primary hover:text-accent-terracotta hover:bg-surface-crisp font-label-action text-[10px] tracking-[0.18em] uppercase shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>✕</span>
                          <span>GỠ LƯU</span>
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 bg-text-primary/90 text-surface-crisp font-spec-code text-[10px] uppercase tracking-wider px-2 py-0.5">
                        {item.category?.name || 'Thủ Công'}
                      </div>
                    </div>

                    <div className="p-space-md">
                      <div className="flex items-center gap-2 font-spec-code text-[11px] text-accent-terracotta uppercase tracking-wider mb-1">
                        <span>{item.region?.name || 'Việt Nam'}</span>
                        <span className="opacity-40">|</span>
                        <span>MÃ: #CR-{item.id}</span>
                      </div>
                      <Link to={`/crafts/${item.id}`}>
                        <h3 className="font-title-card text-title-card text-text-primary font-medium hover:text-accent-terracotta transition-colors leading-snug">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="font-body-spec text-[13px] text-text-secondary mt-2 line-clamp-2">
                        {item.shortDescription || item.short_description || 'Tác phẩm di sản lưu trữ trong hệ thống CraftRoots.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md pt-0">
                    <div className="pt-3 border-t border-border-neutral flex items-center justify-between">
                      <span className="font-spec-code text-[11px] text-text-secondary uppercase">
                        Hồ Sơ CSDL: ĐÃ XÁC THỰC
                      </span>
                      <Link
                        to={`/crafts/${item.id}`}
                        className="font-label-action text-[11px] uppercase tracking-wider text-text-primary hover:text-accent-terracotta font-semibold flex items-center gap-1"
                      >
                        CHI TIẾT <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
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
