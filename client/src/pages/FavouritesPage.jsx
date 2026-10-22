import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const DEFAULT_FAVOURITES = [
  {
    id: 'CR-BT-2025-08MR',
    craftId: 1,
    tag: 'ĐỘC BẢN HỎA BIẾN',
    village: 'Làng Bát Tràng',
    category: 'Gốm Nung Củi',
    title: 'Bộ Trà Men Rạn Nung Củi Bát Tràng',
    recordCode: 'CR-BT-2025-08MR',
    artisan: 'NNƯT. Trần Độ (Kế thừa)',
    technique: 'Men tro trấu nung củi 1300°C',
    price: '4.850.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHLVXL22QpZ-W6fRWVEoakFHIo4ljNfFkspHENrwribuefT4-4_8_qOwtR7-YIqvDSLmeYsIgE19Gr4yu8an_levhuhN9f8Bug5yhL-zHEVT5snKa5Zm62vay5g8pF8mUnDwrAB9BeUuiLAt6MQUdnTfii0gO3JCZF5gwY4Zl9gzhI1vMK7qsnVHHUeWDsUhODFzGXqDxif7MY7Rlw2FgSQd1Og23O9ec8Z9G8LTM'
  },
  {
    id: 'CR-VP-1044',
    craftId: 2,
    tag: 'TƠ NGUYÊN BẢN 100%',
    village: 'Làng Lụa Vạn Phúc',
    category: 'Lụa Canh Cửi Cổ',
    title: 'Khăn Lụa Tơ Tằm Vân Mây',
    recordCode: 'CR-VP-1044',
    artisan: 'Xưởng dệt Triệu Văn Mão',
    technique: 'Khung cửi Jacquard gỗ thủ công',
    price: '1.650.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_UriqVZgcqu2zxDdCIiXv-VLDo7ORx654YJwnlW8s7lIu7SaLY_B816ZyicgWY_srXXEZDOUhA5XHdh0WHpRvjIs5pxWahCk6TqoAFO_eMrWij_ybMWYlhGRqxxPEXF5SBTktGANn1bKFAgLaeOxZnTl1ttbKMOQJRPhVUnOU6pnuvrMQskHc_jDzj8DOTHNdkfRiWtG914BDBnIOKLC0UMr3SuaF1vlPulzNugg'
  },
  {
    id: 'CR-PV-MT09',
    craftId: 5,
    tag: 'NAN VÓT TAY 0.8MM',
    village: 'Làng Mây Tre Phú Vinh',
    category: 'Mây Nếp Cảnh',
    title: 'Khay Trà Mây Nếp Vót Chuốt',
    recordCode: 'CR-PV-MT09',
    artisan: 'NNƯT. Nguyễn Văn Trung',
    technique: 'Đan xương cá vót chuốt thủ công',
    price: '980.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe5_KTNdoP-CbEM2Ss1VU8uEr7tUX6ICTYkxXXEIaGKf5lgeBSIqnSr5qSZ-QP4iLArFikRjQQWLbGTE_znh4_uYslxZmdAcDoCrX8kJ1kfg3GD9EgULkBtGkZGjoTQefw_c6tImJSEGYS6MEjNQCR6x0RTCqSMZPNlwig3MRpIVW3foZYvou4poCEU7RNELDgOWIdkuWcrpt7UTPXLbWlXV4VrKGYGGAVdY4xRdI'
  },
  {
    id: 'NVB-2025-09',
    craftId: 1,
    tag: 'PHỤC CHẾ HOÀNG GIA',
    village: 'Làng Bát Tràng',
    category: 'Gốm Men Lam',
    title: 'Bình Vôi Men Lam Cổ Dát Bạc',
    recordCode: 'NVB-2025-09',
    artisan: 'Hợp Tác Xã Gốm Cổ Họa',
    technique: 'Chạm bạc thủ công thời Lê',
    price: '7.200.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ0wnleIE0nuZKXe36QWmLN9jSWkDNjCUlluuUoGvVWZzAMTtNZ1q0YoF9uWVUzPbOCAyUpCUaADWFj_bGIn9ueMh7uuG8PlQkbjbE7Fo51TmwANKIxQAd7DLcuGhGGfUNhFWcAUOsfmiLL49hcEdX2SOWul5sZUcQ4DnSZw_7vT-x9J-iV3ta8aZ5JQqJ-MbvyVS78JUabdWyM6i449CXyKjhXtWNnWtAXOS5s6Q'
  }
];

export default function FavouritesPage() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('craftroots_favourites_archive');
      if (saved) return JSON.parse(saved);
      return DEFAULT_FAVOURITES;
    } catch {
      return DEFAULT_FAVOURITES;
    }
  });

  const [isFromDb, setIsFromDb] = useState(false);
  const [notification, setNotification] = useState('');

  // Tải danh sách yêu thích từ Database nếu đã đăng nhập
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('craftroots_token');

    if (token) {
      api.getFavourites()
        .then((dbFavs) => {
          if (!isMounted) return;
          if (Array.isArray(dbFavs) && dbFavs.length > 0) {
            const mapped = dbFavs.map((c) => ({
              id: `DB-FAV-${c.id}`,
              craftId: c.id,
              tag: c.category || 'DI SẢN TRUYỀN THỐNG',
              village: c.region || 'Làng Nghề',
              category: c.category || 'Thủ Công',
              title: c.name,
              recordCode: `CR-ARCHIVE-${c.id}`,
              artisan: 'Nghệ Nhân Làng Nghề',
              technique: 'Chế tác thủ công bản địa',
              price: 'Bảo tồn văn hóa',
              image: c.image || c.thumbnail_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
            }));
            setItems(mapped);
            setIsFromDb(true);
          }
        })
        .catch((err) => {
          console.warn('Lỗi khi nạp danh sách yêu thích từ CSDL:', err);
        });
    }

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('craftroots_favourites_archive', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const handleRemove = async (id, title, craftId) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (craftId) {
      api.removeFavourite(craftId).catch(() => {});
    }
    setNotification(`Đã gỡ "${title}" khỏi danh sách lưu trữ.`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ tác phẩm đã lưu trong bộ sưu tập?')) {
      items.forEach((item) => {
        if (item.craftId) api.removeFavourite(item.craftId).catch(() => {});
      });
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

  const handleResetDefaults = () => {
    setItems(DEFAULT_FAVOURITES);
    setIsFromDb(false);
    setNotification('Đã khôi phục bộ sưu tập di sản mẫu.');
    setTimeout(() => setNotification(''), 4000);
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
              <span>{isFromDb ? 'BẢN GHI CSDL' : 'TRÌNH DUYỆT'}: {items.length.toString().padStart(2, '0')} DI SẢN</span>
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
                Danh sách được lưu trữ an toàn trực tiếp trên trình duyệt của bạn nhằm bảo vệ quyền riêng tư. Dữ liệu này chỉ khả dụng trên thiết bị hiện thời mà không chia sẻ với bên thứ ba.
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

          {items.length === 0 ? (
            <div className="bg-surface-crisp border border-dashed border-border-neutral p-12 text-center my-8 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-accent-terracotta mb-3">bookmark_border</span>
              <h3 className="font-headline-title text-xl text-text-primary font-semibold mb-2">
                Chưa Có Tác Phẩm Nào Được Lưu Trữ
              </h3>
              <p className="font-body-spec text-[14px] text-text-secondary max-w-md mx-auto mb-6">
                Bạn chưa thêm tác phẩm nào vào tủ lưu trữ cá nhân. Hãy duyệt qua danh mục di sản hoặc bấm khôi phục mẫu.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/crafts"
                  className="bg-text-primary hover:bg-accent-terracotta text-surface-crisp px-6 py-3 font-label-action text-label-action uppercase tracking-[0.18em] transition-colors"
                >
                  Khám Phá Di Sản
                </Link>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="border border-border-neutral hover:border-accent-terracotta text-text-primary hover:text-accent-terracotta px-6 py-3 font-label-action text-label-action uppercase tracking-[0.18em] transition-colors cursor-pointer"
                >
                  Nạp Dữ Liệu Mẫu
                </button>
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
                        onClick={() => handleRemove(item.id, item.title, item.craftId)}
                        className="btn-remove-item px-2 py-1 md:px-3 md:py-1.5 bg-surface-crisp/95 text-text-primary hover:text-accent-terracotta hover:bg-surface-crisp font-label-action text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.18em] uppercase shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                        title="Gỡ khỏi danh sách lưu"
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
                          Ước lượng thẩm định
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
