import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const ALL_SEASONS = [
  { code: 'spring', name: 'Mùa Xuân', icon: '🌸', tag: 'Khởi Sắc Đất Trời', color: '#059669' },
  { code: 'summer', name: 'Mùa Hạ', icon: '☀️', tag: 'Sợi Tự Nhiên & Đất Nung', color: '#0284c7' },
  { code: 'autumn', name: 'Mùa Thu', icon: '🍂', tag: 'Thu Trầm & Gốm Mộc', color: '#d97706' },
  { code: 'winter', name: 'Mùa Đông', icon: '❄️', tag: 'Hơi Ấm Men Hỏa', color: '#6366f1' },
];

const SEASONAL_ITEMS = [
  {
    id: 'THU-GM-01',
    craftId: 1,
    tag: 'Gốm Mộc',
    ref: 'REF: THU-GM-01',
    region: 'Hà Nội',
    artisan: 'Nghệ Nhân Lò Nung Củi',
    title: 'Bộ Trà Gốm Mộc Đất Nung Sa Thạch',
    description: 'Dung tích ấm 280ml, đất phù sa lòng sông Hồng ngâm ủ 3 năm, nung củi liên tục 72 giờ ở nhiệt độ 1250°C tạo lớp men tro tự nhiên phong hóa.',
    price: '3.200.000',
    unit: 'đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDifivacaZsk9y5DZ8WJyfTpMp_FKaks_8hRGemnkBfsOFmOezTMtoFZBDAarQS3JbOgev_2n2DdAuNBoYTeP9TB9AnhuTJoNJE-Fw6rKwMSLAXw7_49OaorYeHLWxc0kR0zeioCitqB97vl6Obh2ZFbVzJKqJsQWmvCRNO2-bo_woZrG7dkPoRpT7o3g4nv_BMkGiRzKXd34UjfZ5Yj4IwUU3iU-WU6FMyqNTtDnw'
  },
  {
    id: 'THU-TR-05',
    craftId: 3,
    tag: 'Trà Cổ Thụ',
    ref: 'REF: THU-TR-05',
    region: 'Hà Giang & Tây Hồ',
    artisan: 'Thu Hái Đỉnh Đèo',
    title: 'Trà Sen Cổ Thụ Bách Diệp Tây Hồ',
    description: '100% búp trà Shan Tuyết cổ thụ 300 năm tuổi vùng núi cao Hoàng Su Phì ngậm sương, ướp từng cánh sen Bách Diệp hái trước bình minh lộng gió.',
    price: '1.850.000',
    unit: 'đ / 100g',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPGPeefjkcxyjRMvMCuJXfmPIXXZHqZGv_X5p7nUoK2iayjCOf8NKi4rA0Pr-VW5dzNqoQE9pE7C1BAmoFFQ3zs3r3LYgq6ZE6NF7CHNEtrF9emyvuD6K5vxMyfut7b0z0_Z9uNPLsH6GulEXrEz0dVubv097TBkwJN20-fWD30lNev9kh7W1vE5Dt-c4GtWgbCfIBbzJ1jiFWEvKaUvf9TLF3onsKdUa6jan6NMM'
  },
  {
    id: 'THU-MN-03',
    craftId: 5,
    tag: 'Mây Tre Đan',
    ref: 'REF: THU-MN-03',
    region: 'Làng Phú Vinh',
    artisan: 'Đan Nan Mắt Cáo',
    title: 'Khay Trà Mây Nếp Bện Nan Đan Mắt Cáo',
    description: 'Khai thác từ mây nếp rừng già dẻo dai kết hợp tre đực hong gác bếp 6 tháng chống ẩm mọt tự nhiên, hoàn toàn không hóa chất bảo quản.',
    price: '1.150.000',
    unit: 'đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATU5lGoFKB-HXZ8O_uWDx7nkGCGOUHUlnW2Ot3CT13hJN3P3dmbdKT0Bisv4_RGYMcxt0tfhXeDgTKqqMrr9mMrgrPlLLBG0ugfvulf8M_MX6_-sPP470qLsEjZIOLfNitrnoJ0c7qi9-sWqcIDTxF9VnGSyLJrGosMIJdWECtGMeMaQ-bVpC5cmU-C-yNe7YzwoJm17jTYd85RZaiokXarV4anhk_cTf2331UFe0'
  }
];

export default function SeasonalPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const seasonParam = searchParams.get('season')?.toLowerCase();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const [savedItems, setSavedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('craftroots_favourites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState('');

  // Nạp dữ liệu bộ sưu tập mùa từ CSDL PostgreSQL theo mùa được chọn
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getSeasonalCollections()
      .then(async (collections) => {
        if (!isMounted) return;
        if (Array.isArray(collections) && collections.length > 0) {
          // Khớp bộ sưu tập với mùa người dùng chọn từ URL hoặc thanh điều hướng
          let targetCol = null;
          if (seasonParam) {
            targetCol = collections.find((c) => c.seasonCode?.toLowerCase() === seasonParam);
          }
          if (!targetCol) {
            // Mặc định nạp mùa Thu hoặc bộ sưu tập đầu tiên
            targetCol = collections.find((c) => c.seasonCode?.toLowerCase() === 'autumn') || collections[0];
          }

          try {
            const fullDetails = await api.getSeasonalCollectionById(targetCol.id);
            if (isMounted && fullDetails) {
              setCollection(fullDetails);
            }
          } catch (fetchErr) {
            console.warn('Lỗi khi lấy chi tiết BST mùa:', fetchErr);
          }
        }
      })
      .catch((err) => {
        console.warn('Lỗi khi nạp danh sách BST mùa từ DB:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [seasonParam]);

  const toggleSave = async (item) => {
    const isSaved = savedItems.some((s) => s.id === item.id);
    let updated;
    if (isSaved) {
      updated = savedItems.filter((s) => s.id !== item.id);
      setToastMessage(`Đã bỏ lưu "${item.title}"`);
      // Thử đồng bộ với server nếu đã đăng nhập
      if (item.craftId) {
        api.removeFavourite(item.craftId).catch(() => {});
      }
    } else {
      updated = [...savedItems, item];
      setToastMessage(`Đã thêm "${item.title}" vào mục lưu trữ`);
      if (item.craftId) {
        api.addFavourite(item.craftId).catch(() => {});
      }
    }
    setSavedItems(updated);
    try {
      localStorage.setItem('craftroots_favourites', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setTimeout(() => setToastMessage(''), 3000);
  };

  const seasonNameVi =
    collection?.seasonCode === 'spring'
      ? 'XUÂN'
      : collection?.seasonCode === 'summer'
      ? 'HẠ'
      : collection?.seasonCode === 'winter'
      ? 'ĐÔNG'
      : 'THU';

  const displayedItems = collection?.curatedCrafts?.length > 0
    ? collection.curatedCrafts.map((item) => ({
        id: `CR-COL-${item.craft.id}`,
        craftId: item.craft.id,
        tag: item.highlightBadge || item.craft.category || `MÙA ${seasonNameVi}`,
        ref: item.craft.sku || `REF: CR-S0${item.craft.id}`,
        region: item.craft.region || 'Việt Nam',
        artisan: item.craft.category || 'Nghệ Nhân Làng Nghề',
        title: item.craft.name,
        description: item.curatorNote || item.craft.shortDescription,
        price: item.craft.priceVnd ? Number(item.craft.priceVnd).toLocaleString('vi-VN') : '3.200.000',
        unit: 'đ',
        image: item.craft.thumbnailUrl || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      }))
    : SEASONAL_ITEMS;

  const heroBg = collection?.bannerUrl || collection?.bannerImage || 'https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&w=1400&q=80';
  const heroTitle = collection?.title?.toUpperCase() || `BỘ SƯU TẬP MÙA ${seasonNameVi} 2026`;
  const heroConcept = collection?.themeConcept || collection?.description || 'Khi tiết khí giao hòa, mỗi tác phẩm thủ công là một thông điệp văn hóa sâu sắc đưa con người trở về với nhịp thở nguyên sơ của đất trời.';
  const heroSeasonBadge = collection?.seasonCode
    ? `MÙA ${seasonNameVi} NĂM ${collection.year || '2026'}`
    : 'Tuyển Tập Di Sản Theo Mùa';

  const quote = collection?.philosophyQuote || collection?.curatorPhilosophy || heroConcept;
  const quoteAuthor = collection?.quoteSource || collection?.curatorName || 'Hội đồng Giám tuyển Di sản CraftRoots';

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-text-primary text-surface-crisp px-5 py-3 shadow-lg border border-accent-terracotta font-label-action text-[12px] uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-terracotta text-[18px]">bookmark_added</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Immersive Editorial Hero */}
      <section className="relative w-full -mt-[134px] md:-mt-20 overflow-hidden bg-surface-container-high">
        <div
          className="w-full min-h-[380px] sm:min-h-[480px] lg:min-h-[640px] bg-cover bg-center flex items-center relative"
          style={{ backgroundImage: `url('${heroBg}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-text-primary/90 via-text-primary/75 to-transparent"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-margin w-full pt-[120px] sm:pt-[130px] md:pt-28 pb-6 sm:pb-space-xl">
            <div className="max-w-2xl text-surface-crisp flex flex-col items-start">
              <div className="flex items-center gap-space-xs mb-2 sm:mb-space-sm">
                <span className="font-spec-code text-[10px] sm:text-spec-code tracking-[0.15em] sm:tracking-[0.25em] uppercase text-primary-fixed-dim">
                  Tuyển Tập Giới Hạn
                </span>
                <span className="text-surface-variant/40 select-none">|</span>
                <span className="font-label-signature italic text-[13px] sm:text-label-signature text-secondary-fixed">
                  {heroSeasonBadge}
                </span>
              </div>

              <h1 className="font-display-hero text-[22px] sm:text-[32px] md:text-[44px] lg:text-[52px] uppercase text-surface-crisp font-light tracking-[1.5px] sm:tracking-[3px] md:tracking-[6px] leading-[1.25] mb-2.5 sm:mb-space-md">
                {heroTitle}
              </h1>

              <div className="h-0.5 w-12 sm:w-16 bg-accent-terracotta mb-2.5 sm:mb-space-md"></div>

              <p className="font-body-default text-[13px] sm:text-body-default text-surface-variant font-normal leading-relaxed mb-4 sm:mb-space-lg max-w-xl">
                {heroConcept}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-space-md">
                <a
                  href="#tuyen-tap"
                  className="inline-flex items-center justify-center bg-accent-terracotta hover:bg-primary text-surface-crisp font-label-action text-[11px] sm:text-label-action uppercase tracking-[0.12em] sm:tracking-[0.18em] px-5 py-2.5 sm:px-7 sm:py-3.5 transition-colors shadow-sm"
                >
                  Khám Phá Tuyển Tập Mùa {seasonNameVi}
                </a>
                <div className="flex items-center font-spec-code text-[10px] sm:text-spec-code text-surface-variant tracking-[0.08em] sm:tracking-[0.12em] uppercase">
                  <span>Niên khóa: {collection?.year || '2026'}</span>
                  <span className="mx-2 sm:mx-3 text-surface-variant/40">|</span>
                  <span>{collection ? 'Đồng bộ từ CSDL' : 'Bản mẫu'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THANH CHUYỂN ĐỔI NHANH 4 MÙA XUÂN - HẠ - THU - ĐÔNG */}
      <nav aria-label="Bộ chọn 4 mùa" className="w-full bg-surface-crisp border-y border-border-neutral sticky top-20 z-30 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-margin py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-accent-terracotta text-[18px]">filter_vintage</span>
            <span className="font-spec-code text-[11px] uppercase tracking-[0.15em] text-text-secondary hidden sm:inline">
              Tuyển Tập 4 Mùa:
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {ALL_SEASONS.map((s) => {
              const isSelected =
                (collection?.seasonCode?.toLowerCase() === s.code) ||
                (!collection?.seasonCode && s.code === (seasonParam || 'autumn'));

              return (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => setSearchParams({ season: s.code })}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[13px] font-title-card font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'border-accent-terracotta bg-surface-subtle text-accent-terracotta shadow-xs font-semibold'
                      : 'border-border-neutral/60 bg-transparent text-text-secondary hover:text-text-primary hover:border-border-neutral'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                  <span
                    className={`text-[10px] font-spec-code uppercase tracking-wider px-1.5 py-0.2 hidden md:inline-block ${
                      isSelected
                        ? 'text-accent-terracotta bg-accent-terracotta/10'
                        : 'text-text-secondary/60'
                    }`}
                  >
                    {s.tag}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="font-spec-code text-[11px] text-text-secondary uppercase tracking-wider shrink-0 hidden lg:block">
            Niên Vụ 2026
          </div>
        </div>
      </nav>

      {/* Narrative Callout Block */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-margin py-6 sm:py-10 md:py-space-xl">
        <div className="bg-surface-subtle p-4 sm:p-6 lg:p-space-xl relative shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-space-lg">
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-space-xs mb-1.5 sm:mb-space-sm">
                <span className="material-symbols-outlined text-accent-terracotta text-[18px] sm:text-[20px]">spa</span>
                <span className="font-spec-code text-[10.5px] sm:text-spec-code uppercase tracking-[0.14em] sm:tracking-[0.2em] text-text-secondary">
                  Triết Lý Giám Tuyển Văn Hóa Mùa {seasonNameVi}
                </span>
              </div>
              <blockquote className="font-headline-title text-[15px] sm:text-[18px] md:text-headline-title text-text-primary font-normal italic leading-snug tracking-tight mb-2 sm:mb-space-sm">
                “{quote}”
              </blockquote>
              <cite className="font-spec-code text-[10.5px] sm:text-spec-code uppercase tracking-[0.1em] sm:tracking-[0.14em] text-accent-terracotta not-italic block">
                — {quoteAuthor}, Niên vụ {collection?.year || '2026'}
              </cite>
            </div>
            
            <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border-neutral pl-0 md:pl-space-lg text-text-secondary font-spec-code text-spec-code space-y-0 md:space-y-1">
              <div>
                <div className="text-text-primary font-medium tracking-[0.1em] sm:tracking-[0.15em] uppercase text-[10.5px] sm:text-[12px]">Tác phẩm tuyển chọn</div>
                <div className="text-[10px] sm:text-[11px] tracking-[0.08em] sm:tracking-[0.1em] text-text-secondary/80">Xác thực nguyên bản</div>
              </div>
              <div className="text-[22px] sm:text-[28px] leading-tight font-display-hero font-light text-primary">
                {displayedItems.length.toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated 3-Column / 2-Column Mobile Sharp Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-margin pb-space-xl" id="tuyen-tap">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg pb-space-sm gap-2">
          <div>
            <div className="flex items-center gap-2 mb-space-xs">
              <span className="h-2 w-2 bg-accent-terracotta"></span>
              <span className="font-spec-code text-spec-code tracking-[0.2em] uppercase text-text-secondary">
                Danh Mục Giám Tuyển Mùa {seasonNameVi}
              </span>
            </div>
            <h2 className="font-headline-title text-[20px] sm:text-[24px] md:text-headline-title text-text-primary font-semibold tracking-tight uppercase">
              {collection?.title || `Tác Phẩm Tuyển Chọn Mùa ${seasonNameVi}`}
            </h2>
          </div>
          <div className="flex items-center gap-space-sm mt-space-sm md:mt-0 font-spec-code text-spec-code text-text-secondary">
            <span className="text-text-primary font-semibold">{displayedItems.length} Tác phẩm tiêu biểu</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span>{collection ? 'Đồng bộ từ CSDL' : 'Kiểm định văn hóa'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-gutter">
          {displayedItems.map((item) => {
            const isSaved = savedItems.some((s) => s.id === item.id);
            return (
              <article
                key={item.id}
                className="group bg-surface-crisp flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-border-neutral/60 overflow-hidden"
              >
                <div className="relative w-full aspect-square md:aspect-[4/5] overflow-hidden bg-surface-container">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-text-primary text-surface-crisp font-spec-code text-[10px] tracking-[0.08em] md:tracking-[0.15em] uppercase px-[6px] py-[4px] md:px-2.5 md:py-1">
                    {item.tag}
                  </div>
                  <div className="hidden md:block absolute bottom-3 right-3 bg-canvas-linen/90 backdrop-blur-sm text-text-primary font-spec-code text-spec-code px-2 py-0.5 shadow-sm">
                    {item.ref}
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-space-lg flex flex-col flex-1 justify-between bg-surface-crisp">
                  <div>
                    <div className="flex items-center font-spec-code text-[10px] md:text-spec-code text-accent-terracotta tracking-[0.1em] uppercase mb-1 truncate">
                      <span className="truncate">{item.region || item.artisan || 'Việt Nam'}</span>
                    </div>
                    <Link to={`/crafts/${item.craftId}`}>
                      <h3 className="font-title-card text-[15px] sm:text-[16px] md:text-title-card text-text-primary font-medium tracking-tight mb-1 md:mb-space-xs group-hover:text-accent-terracotta transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="hidden md:block font-body-spec text-body-spec text-text-secondary leading-relaxed mb-space-md line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-2 md:mt-0 pt-2 md:pt-space-md bg-surface-subtle/40 -mx-3 -mb-3 md:-mx-space-lg md:-mb-space-lg p-2.5 md:p-space-lg flex items-center justify-between border-t border-border-neutral/60 gap-1">
                    <div className="flex flex-col min-w-0">
                      <span className="hidden sm:block font-spec-code text-[9px] md:text-[11px] uppercase tracking-[0.12em] text-text-secondary truncate">
                        Định Giá Lưu Trữ
                      </span>
                      <span className="font-headline-title text-[13px] sm:text-[14px] md:text-headline-title text-text-primary font-semibold truncate">
                        {item.price}{' '}
                        <span className="text-[11px] md:text-body-spec font-normal text-text-secondary">
                          {item.unit}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSave(item)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isSaved
                          ? 'bg-accent-terracotta text-surface-crisp'
                          : 'bg-text-primary hover:bg-accent-terracotta text-surface-crisp'
                      }`}
                      title={isSaved ? 'Đã lưu trong tuyển tập' : 'Thêm vào tuyển tập'}
                    >
                      <span className="material-symbols-outlined text-[15px] md:text-[18px]">
                        {isSaved ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Editorial Process Feature */}
      <section className="w-full bg-surface-subtle py-space-xl">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-xl">
            <span className="font-spec-code text-spec-code uppercase tracking-[0.25em] text-accent-terracotta mb-space-xs">
              Quy Trình Di Sản Mùa {seasonNameVi}
            </span>
            <h2 className="font-headline-statement text-headline-statement font-light uppercase text-text-primary tracking-[0.2em]">
              QUY TRÌNH THỰC HIỆN MÙA {seasonNameVi}: TỪ NGUYÊN BẢN ĐẾN HOÀN THIỆN
            </h2>
            <div className="h-0.5 w-12 bg-border-neutral mt-space-sm"></div>
          </div>

          {/* 3-Step Process Flow (Dynamic from collection.processSteps or bespoke seasonal defaults) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter relative">
            {(Array.isArray(collection?.processSteps) && collection.processSteps.length > 0
              ? collection.processSteps
              : [
                  {
                    title: `Tuyển Chọn Nguyên Liệu Mùa ${seasonNameVi}`,
                    desc: 'Khai thác từ nguồn đất, sợi tự nhiên, thảo mộc hoặc kim khí đặc trưng của vùng đất di sản.',
                    meta1: `Tiết khí Mùa ${seasonNameVi}`,
                    meta2: 'Nguyên liệu tự nhiên',
                  },
                  {
                    title: 'Chế Tác Thủ Công & Nung Luyện',
                    desc: 'Nghệ nhân thực hiện qua hàng chục bước gia truyền với sự tỉ mỉ, tâm huyết và kỹ nghệ tinh xảo.',
                    meta1: 'Nung luyện nhiệt độ cao',
                    meta2: 'Kỹ nghệ gia truyền',
                  },
                  {
                    title: 'Kiểm Định & Lưu Trữ Di Sản',
                    desc: 'Mỗi tác phẩm hoàn thiện đều được đánh số hiệu lưu trữ và cấp chứng thư chất lượng CraftRoots.',
                    meta1: 'Nghiệm thu thủ công',
                    meta2: 'Chứng thư xuất xưởng',
                  },
                ]
            ).map((step, idx) => (
              <div
                key={idx}
                className="bg-surface-crisp p-4 sm:p-space-lg flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-space-md">
                    <span className="font-display-hero text-[24px] sm:text-[30px] md:text-[36px] leading-none font-light text-accent-terracotta">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-spec-code text-[11px] sm:text-spec-code uppercase tracking-[0.12em] sm:tracking-[0.15em] text-text-secondary">
                      Giai Đoạn {['I', 'II', 'III', 'IV'][idx] || (idx + 1)}
                    </span>
                  </div>
                  <h3 className="font-title-card text-[15px] sm:text-title-card text-text-primary font-medium mb-space-xs">
                    {step.title}
                  </h3>
                  <p className="font-body-spec text-[12px] sm:text-body-spec text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-4 sm:mt-space-lg pt-2 sm:pt-space-sm flex items-center font-spec-code text-[10px] sm:text-[11px] text-text-secondary uppercase tracking-[0.08em] sm:tracking-[0.1em]">
                  <span>{step.meta1 || `Tiết Mùa ${seasonNameVi}`}</span>
                  <span className="mx-2 text-border-neutral opacity-60">|</span>
                  <span>{step.meta2 || 'Chứng thư thủ công'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Workshop Metadata Bar */}
          <div className="mt-space-lg bg-surface-crisp p-4 border border-border-neutral flex flex-col md:flex-row items-center justify-between shadow-sm text-text-secondary font-body-spec text-[12px]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">verified</span>
              <span className="uppercase tracking-[0.1em] text-text-primary font-semibold">
                Quy Chuẩn Giám Tuyển Văn Hóa:
              </span>
              <span>Bảo toàn 100% nguyên liệu tự nhiên bản địa Việt Nam</span>
            </div>
            <div className="flex items-center gap-3 mt-2 md:mt-0 uppercase tracking-[0.12em] font-spec-code text-[11px]">
              <span>Mã lưu trữ: {collection?.code || collection?.archiveCode || `CR-${collection?.seasonCode?.toUpperCase() || 'AUTUMN'}-26`}</span>
              <span className="text-border-neutral opacity-60">|</span>
              <Link to="/crafts" className="text-accent-terracotta hover:underline font-medium">
                Khám phá danh mục di sản →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
