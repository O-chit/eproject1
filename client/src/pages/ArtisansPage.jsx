import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ArtisanDetailPopup from '../components/modals/ArtisanDetailPopup';
import VisitBookingModal from '../components/modals/VisitBookingModal';

export default function ArtisansPage() {
  const location = useLocation();
  const [artisans, setArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeArtisanIndex, setActiveArtisanIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingArtisan, setBookingArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artisanStats, setArtisanStats] = useState({
    total: 0,
    totalExp: 0,
    totalCrafts: 0,
    nationalHeritage: 0,
  });

  // Nạp danh sách nghệ nhân, danh mục và thống kê từ CSDL PostgreSQL
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [artisansData, categoriesData, statsData] = await Promise.all([
          api.getArtisans({ limit: 100 }),
          api.getCategories(),
          api.getStats(),
        ]);

        const rawList = Array.isArray(artisansData)
          ? artisansData
          : artisansData?.data || [];

        // Định dạng dữ liệu nghệ nhân chuẩn chỉnh
        const formattedArtisans = rawList.map((a, idx) => ({
          ...a,
          id: a.id,
          ref: a.ref || a.code || a.refCode || `ART-0${a.id}`,
          code: a.code || a.ref || `ART-0${a.id}`,
          name: a.name || a.fullName,
          title: a.title || 'Nghệ Nhân Di Sản',
          age: a.age || 65,
          village: a.village || a.villageName || a.province || a.regionName || 'Làng Nghề',
          province: a.province || a.regionName || 'Việt Nam',
          category: a.categorySlug || a.category || 'gom',
          categoryId: a.categoryId,
          categorySlug: a.categorySlug,
          craft_category: a.craft_category || a.specialty || a.categoryName || 'Di Sản Thủ Công',
          years_of_experience: a.years_of_experience || a.yearsOfExperience || 40,
          generation: typeof a.generation === 'number' ? `Đời Thứ ${a.generation}` : a.generation || 'Đời Truyền Thừa',
          matrix_index: `#0${idx + 1}`,
          description: a.description || a.technique_summary || a.techniqueSummary || a.bio || 'Bậc thầy chế tác thủ công di sản.',
          quote: a.quote || 'Đất sét phải ủ ba mùa mưa nắng, men tro nung củi gỗ dâu mới ra được đường rạn của thời gian.',
          masterwork_name: a.masterwork_name || a.signatureWork || 'Tác phẩm tiêu biểu',
          material: a.material || 'Nguyên liệu tự nhiên bản địa',
          firing_technique: a.firing_technique || a.techniqueSummary || 'Kỹ pháp thủ công truyền thống',
          signature_style: a.signature_style || 'Độc bản thủ công',
          biography: a.biography || a.bio || 'Nghệ nhân kế thừa và gìn giữ tinh hoa văn hóa truyền thống qua nhiều thế hệ.',
          avatar_url: a.avatar_url || a.avatarUrl || a.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
        }));

        if (isMounted) {
          setArtisans(formattedArtisans);

          if (Array.isArray(categoriesData)) {
            setCategories(categoriesData);
          }

          const totalExp = formattedArtisans.reduce(
            (sum, item) => sum + (Number(item.years_of_experience) || 0),
            0
          );

          setArtisanStats({
            total: statsData?.artisans || formattedArtisans.length,
            totalExp: totalExp || 250,
            totalCrafts: statsData?.crafts || 8,
            nationalHeritage: statsData?.nationalHeritages || 6,
          });
        }
      } catch (err) {
        console.warn('Lỗi nạp dữ liệu nghệ nhân từ DB:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Đồng bộ mở Modal khi truy cập đường link có hash #nghe-nhan/{ref}
  useEffect(() => {
    if (artisans.length === 0) return;
    const hash = window.location.hash;
    if (hash && hash.startsWith('#nghe-nhan/')) {
      const targetRef = hash.replace('#nghe-nhan/', '').trim().toUpperCase();
      const foundIdx = artisans.findIndex(
        (a) =>
          a.ref?.toUpperCase() === targetRef ||
          a.code?.toUpperCase() === targetRef ||
          String(a.id) === targetRef
      );
      if (foundIdx !== -1) {
        setActiveArtisanIndex(foundIdx);
        setIsPopupOpen(true);
      }
    }
  }, [location, artisans]);

  // 2. Lọc danh sách nghệ nhân theo danh mục thực tế
  const filteredArtisans = selectedCategory === 'all'
    ? artisans
    : artisans.filter((a) => {
        return (
          String(a.categoryId) === selectedCategory ||
          a.categorySlug === selectedCategory ||
          a.category === selectedCategory
        );
      });

  const listForModal = filteredArtisans.length > 0 ? filteredArtisans : artisans;
  const currentArtisan = listForModal[activeArtisanIndex] || artisans[0] || null;

  // 3. Xử lý mở popup của 1 nghệ nhân
  const handleOpenArtisanPopup = (artisanObj) => {
    const idx = listForModal.findIndex((a) => a.id === artisanObj.id);
    setActiveArtisanIndex(idx !== -1 ? idx : 0);
    setIsPopupOpen(true);
  };

  // 4. Chuyển tuần hoàn Trước / Sau
  const handlePrevArtisan = () => {
    setActiveArtisanIndex((prev) => (prev > 0 ? prev - 1 : listForModal.length - 1));
  };

  const handleNextArtisan = () => {
    setActiveArtisanIndex((prev) => (prev < listForModal.length - 1 ? prev + 1 : 0));
  };

  const prevIdx = activeArtisanIndex > 0 ? activeArtisanIndex - 1 : Math.max(0, listForModal.length - 1);
  const nextIdx = activeArtisanIndex < listForModal.length - 1 ? activeArtisanIndex + 1 : 0;

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* SECTION 1: EDITORIAL HEADER & METADATA STRIP */}
      <section className="w-full bg-surface-crisp border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin py-space-md">
          {/* Breadcrumb with pipes */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center font-spec-code text-[11px] uppercase tracking-[0.18em] text-text-secondary mb-space-sm">
            <a className="hover:text-accent-terracotta transition-colors" href="/">Trang Chủ</a>
            <span className="mx-3 text-border-neutral select-none opacity-60">|</span>
            <a className="hover:text-accent-terracotta transition-colors" href="/crafts">Danh Mục Di Sản</a>
            <span className="mx-3 text-border-neutral select-none opacity-60">|</span>
            <span className="text-accent-terracotta font-medium">Nghệ Nhân Ưu Tú</span>
            <span className="mx-3 text-border-neutral select-none opacity-60">|</span>
            <span className="text-text-secondary/70">Mã lưu trữ: ARTISAN-ARCHIVE-MATRIX-2025</span>
          </nav>

          {/* Main Headline Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end pt-2 pb-space-sm">
            <div className="lg:col-span-8 flex flex-col space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-terracotta"></span>
                <span className="font-spec-code text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.25em] uppercase text-accent-terracotta font-semibold">
                  HỒ SƠ LƯU TRỮ DI SẢN • MA TRẬN NGHỆ NHÂN • BẢO TỒN NGUYÊN BẢN
                </span>
              </div>
              <h1 className="font-headline-title text-[20px] sm:text-[28px] md:text-[36px] lg:text-[40px] leading-[1.2] text-text-primary tracking-tight font-semibold">
                Danh Sách Nghệ Nhân &amp; Bậc Thầy Chế Tác
              </h1>
              <p className="font-body-default text-text-secondary text-[13px] sm:text-[14px] md:text-[15px] max-w-3xl leading-relaxed pt-1">
                Kho tư liệu mở trực quan về các bậc thầy di sản phi vật thể Việt Nam. Sơ đồ lưu trữ 2 chiều hệ thống hóa theo vùng nguyên liệu, kỹ pháp độc bản, niên đại truyền thừa và tác phẩm tiêu biểu.
              </p>
            </div>

            {/* Archival Stamp Badge */}
            <div className="lg:col-span-4 flex lg:justify-end items-center">
              <div className="p-4 bg-canvas-linen border border-border-neutral flex items-center gap-3 w-full lg:w-auto">
                <div className="w-10 h-10 border border-accent-terracotta/40 flex items-center justify-center shrink-0 text-accent-terracotta">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-spec-code text-[10px] uppercase tracking-widest text-text-secondary">Chuẩn Quốc Gia</span>
                  <span className="font-spec-code text-[12px] font-semibold text-text-primary uppercase tracking-wider">Hồ Sơ Xác Thực 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Counter Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-gutter pt-3 sm:pt-space-md mt-2 sm:mt-space-sm border-t border-border-neutral font-spec-code">
            <div className="flex flex-col border-r border-border-neutral last:border-r-0 pr-3 sm:pr-4">
              <span className="text-[20px] sm:text-[24px] md:text-[30px] font-headline-title font-semibold text-text-primary leading-tight">
                {artisanStats.total || artisans.length}
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">Nghệ Nhân Lưu Trữ</span>
            </div>
            <div className="flex flex-col md:border-r border-border-neutral last:border-r-0 pr-3 sm:pr-4">
              <span className="text-[20px] sm:text-[24px] md:text-[30px] font-headline-title font-semibold text-text-primary leading-tight">
                {artisanStats.totalExp}+
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">Năm Gia Truyền</span>
            </div>
            <div className="flex flex-col border-r border-border-neutral last:border-r-0 pr-3 sm:pr-4 pt-2 md:pt-0">
              <span className="text-[20px] sm:text-[24px] md:text-[30px] font-headline-title font-semibold text-text-primary leading-tight">
                {artisanStats.totalCrafts}
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">Hiện Vật Độc Bản</span>
            </div>
            <div className="flex flex-col last:border-r-0 pr-3 sm:pr-4 pt-2 md:pt-0">
              <span className="text-[20px] sm:text-[24px] md:text-[30px] font-headline-title font-semibold text-accent-terracotta leading-tight">100%</span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">Chứng Thực Di Sản</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FILTER STRIP WITH DELIMITERS (DYNAMIC DATA TỪ DATABASE) */}
      <section className="w-full bg-canvas-linen border-b border-border-neutral sticky top-[134px] md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="overflow-x-auto flex items-center py-3 text-[12px] font-label-action uppercase tracking-[0.14em] whitespace-nowrap no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`pb-1 transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'text-accent-terracotta font-semibold border-b-2 border-accent-terracotta'
                  : 'text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              TẤT CẢ ({artisans.length})
            </button>

            {categories.map((cat) => {
              const catArtisanCount = artisans.filter(
                (a) =>
                  a.categoryId === cat.id ||
                  a.categorySlug === cat.slug ||
                  a.category === cat.slug
              ).length;

              const isCatActive =
                selectedCategory === String(cat.id) || selectedCategory === cat.slug;

              return (
                <React.Fragment key={cat.id}>
                  <span className="mx-4 text-border-neutral select-none opacity-40 font-light">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(String(cat.id))}
                    className={`pb-1 transition-colors cursor-pointer ${
                      isCatActive
                        ? 'text-accent-terracotta font-semibold border-b-2 border-accent-terracotta'
                        : 'text-text-secondary hover:text-accent-terracotta'
                    }`}
                  >
                    {cat.name.toUpperCase()} ({catArtisanCount})
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: 2D GRID MATRIX SHOWCASE */}
      <section className="w-full bg-canvas-linen py-space-xl border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          {/* Section Control Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-border-neutral gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-spec-code text-[10px] uppercase tracking-[0.25em] text-accent-terracotta font-semibold">
                  SƠ ĐỒ LƯỚI MA TRẬN 2 CHIỀU
                </span>
                <span className="w-1.5 h-1.5 bg-accent-terracotta rounded-full"></span>
                <span className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">
                  HỒ SƠ BẬC THẦY • BẢO TỒN NGUYÊN BẢN
                </span>
              </div>
              <h2 className="font-headline-title text-[24px] md:text-[28px] text-text-primary tracking-tight font-semibold">
                Bậc Thầy Chế Tác Tiêu Biểu &amp; Tác Phẩm Cốt Lõi
              </h2>
            </div>
            <div className="flex items-center gap-4 font-spec-code text-[11px] text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-text-primary"></span>{' '}
                {filteredArtisans.length.toString().padStart(2, '0')} Vị Trí Trọng Điểm
              </span>
              <span className="text-border-neutral opacity-60">|</span>
              <span>MA TRẬN: {filteredArtisans.length} HỒ SƠ</span>
              <span className="text-border-neutral opacity-60">|</span>
              <span className="text-accent-terracotta font-semibold">ĐỒNG BỘ CSDL</span>
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-[0.15em]">
                Đang nạp dữ liệu hồ sơ nghệ nhân từ CSDL...
              </p>
            </div>
          ) : filteredArtisans.length === 0 ? (
            <div className="p-16 border border-border-neutral bg-surface-crisp text-center">
              <span className="material-symbols-outlined text-5xl text-accent-terracotta mb-3">person_search</span>
              <h3 className="font-headline-title text-xl font-medium text-text-primary mb-2">
                Không tìm thấy hồ sơ nghệ nhân phù hợp
              </h3>
              <p className="font-body-default text-text-secondary mb-6">
                Chưa có nghệ nhân thuộc chuyên đề này hoặc đang trong tiến trình xác thực điền dã.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="px-6 py-2.5 bg-text-primary text-surface-crisp font-label-action text-label-action uppercase tracking-wider font-semibold hover:bg-accent-terracotta transition-colors cursor-pointer"
              >
                XEM TOÀN BỘ NGHỆ NHÂN ({artisans.length})
              </button>
            </div>
          ) : (
            /* 2-Dimensional Full-Width Architectural Grid Matrix */
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {filteredArtisans.map((artisan, index) => (
                <article
                  key={artisan.id}
                  onClick={() => handleOpenArtisanPopup(artisan)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenArtisanPopup(artisan);
                    }
                  }}
                  className="relative z-0 hover:z-10 flex flex-col justify-between group transition-all duration-300 ease-out border border-border-neutral hover:-translate-y-1.5 hover:border-accent-terracotta hover:shadow-[0_16px_36px_rgba(28,27,26,0.12)] cursor-pointer bg-surface-crisp overflow-hidden"
                  aria-label={`Xem hồ sơ nghệ nhân: ${artisan.name}`}
                >
                  {/* 1. Phần Ảnh Nghệ Nhân */}
                  <div className="relative w-full aspect-square md:aspect-[4/3] bg-[#1C1B1A] overflow-hidden shrink-0 border-b border-border-neutral">
                    <img
                      className="w-full h-full object-cover grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      src={artisan.avatar_url}
                      alt={artisan.name}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none"></div>

                    {/* Nhãn thể loại ở góc trên */}
                    <div className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 flex items-center justify-between font-spec-code text-[10px] uppercase tracking-wider pointer-events-none">
                      <div className="flex items-center gap-1 bg-black/75 backdrop-blur-sm px-1.5 py-0.5 md:px-2.5 md:py-1 text-surface-crisp border border-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta"></span>
                        <span className="text-[#ffb689] font-semibold text-[9px] md:text-[10px] truncate max-w-[85px] sm:max-w-none">
                          {artisan.craft_category}
                        </span>
                      </div>
                      <span className="hidden sm:inline-block bg-black/75 backdrop-blur-sm text-surface-crisp/90 px-2 py-0.5 border border-white/20 text-[9px] md:text-[10px]">
                        REF: {artisan.ref}
                      </span>
                    </div>

                    {/* Nhãn mã ma trận góc dưới ảnh */}
                    <div className="hidden md:block absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-surface-crisp/90 px-2 py-0.5 border border-white/20 font-spec-code text-[10px] uppercase font-semibold pointer-events-none">
                      {artisan.matrix_index}
                    </div>
                  </div>

                  {/* 2. Phần Mô Tả Thông Tin Nghệ Nhân */}
                  <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-between bg-surface-crisp space-y-2 md:space-y-4">
                    <div className="space-y-1.5 md:space-y-3">
                      {/* Hàng nhãn vị trí */}
                      <div className="flex items-center justify-between font-spec-code text-[10px] md:text-[11px] gap-1">
                        <div className="flex items-center gap-1.5 text-accent-terracotta uppercase tracking-wider font-medium truncate">
                          <span className="truncate">{artisan.village || artisan.province}</span>
                        </div>
                        <span className="hidden sm:inline-block text-text-secondary text-[9px] md:text-[10px] uppercase bg-surface-subtle border border-border-neutral px-1.5 py-0.5 font-medium shrink-0">
                          {artisan.generation}
                        </span>
                      </div>

                      {/* Tên & Danh xưng */}
                      <div>
                        <h3 className="font-headline-title text-[15px] sm:text-[17px] md:text-[22px] font-semibold text-text-primary group-hover:text-accent-terracotta transition-colors leading-snug line-clamp-2">
                          {artisan.name}
                        </h3>
                        <p className="font-spec-code text-[11px] md:text-[12px] text-text-secondary mt-0.5 truncate">
                          {artisan.title} • <span className="text-accent-terracotta font-medium">{artisan.years_of_experience} Năm Nghề</span>
                        </p>
                        <p className="hidden md:block font-body-default text-[12px] text-text-secondary/80 mt-1 line-clamp-1">
                          {artisan.description}
                        </p>
                      </div>

                      {/* Trích dẫn triết lý nghề */}
                      <blockquote className="hidden md:block font-label-signature italic text-[13px] text-text-primary/90 leading-relaxed border-l-2 border-accent-terracotta pl-3.5 py-2 bg-surface-subtle my-2">
                        “{artisan.quote}”
                      </blockquote>
                    </div>

                    {/* Chân thẻ: Tác phẩm tiêu biểu & Điều hướng xem hồ sơ */}
                    <div className="pt-2 md:pt-3 border-t border-border-neutral space-y-2 md:space-y-3">
                      <div className="p-2 md:p-3 bg-surface-subtle border border-border-neutral flex items-center justify-between gap-1">
                        <div className="flex flex-col min-w-0 pr-1">
                          <span className="font-spec-code text-[8px] md:text-[9px] uppercase tracking-wider text-accent-terracotta font-semibold">
                            Tác Phẩm Tiêu Biểu
                          </span>
                          <span className="font-body-spec text-[11px] md:text-[12px] font-medium text-text-primary truncate">
                            {artisan.masterwork_name}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-accent-terracotta text-[16px] md:text-[20px] shrink-0">grain</span>
                      </div>

                      <div className="pt-0.5 md:pt-1 flex items-center justify-between font-spec-code text-[10px] md:text-[11px]">
                        <span className="hidden sm:inline text-text-secondary text-[10px] uppercase">DI SẢN QUỐC GIA</span>
                        <span className="font-label-action text-[10px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.15em] text-accent-terracotta group-hover:translate-x-1 flex items-center gap-0.5 md:gap-1 font-semibold transition-transform">
                          Xem Hồ Sơ <span className="material-symbols-outlined text-[13px] md:text-[15px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Matrix System Bottom Strip */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between py-3 px-4 bg-surface-crisp border border-border-neutral font-spec-code text-[11px] text-text-secondary gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-terracotta"></span>
              <span className="uppercase tracking-wider">
                ĐANG HIỂN THỊ {filteredArtisans.length.toString().padStart(2, '0')} / {artisans.length.toString().padStart(2, '0')} HỒ SƠ NGHỆ NHÂN TRỌNG ĐIỂM
              </span>
            </div>
            <div className="flex items-center gap-2">
              {artisans.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleOpenArtisanPopup(artisans[0])}
                  className="px-3 py-1.5 border border-border-neutral bg-canvas-linen text-text-primary uppercase tracking-wider text-[10px] hover:border-accent-terracotta transition-colors cursor-pointer"
                >
                  Mở Xem Chi Tiết Tuần Hoàn
                </button>
              )}
              <a
                className="px-3 py-1.5 bg-text-primary text-surface-crisp uppercase tracking-wider text-[10px] hover:bg-accent-terracotta transition-colors flex items-center gap-1 font-semibold"
                href="#dat-lich"
              >
                Quy Trình Gặp Gỡ Bậc Thầy ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WORKSHOP VISIT & HERITAGE PROTOCOL NOTICE */}
      <section className="w-full bg-canvas-linen border-t border-border-neutral py-space-xl" id="dat-lich">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="bg-surface-crisp border border-border-neutral p-space-lg md:p-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-terracotta text-[20px]">local_cafe</span>
                  <span className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
                    QUY TRÌNH GẶP GỠ NGHỆ NHÂN TIỀN BỐI
                  </span>
                </div>
                <h3 className="font-headline-title text-[24px] text-text-primary font-semibold">
                  Đăng Ký Đàm Đạo Trà &amp; Tham Quan Xưởng Chế Tác Trực Tiếp
                </h3>
                <p className="font-body-default text-text-secondary text-[14px] leading-relaxed max-w-2xl">
                  Nhằm tôn trọng nhịp điệu lao động và không gian tĩnh tại của các bậc thầy, mỗi xưởng chỉ tiếp tối đa 06 khách/buổi. Mọi lịch hẹn được điều phối viên CraftRoots xác nhận trước 48 giờ cùng chỉ dẫn phong tục bản địa.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  className="w-full bg-text-primary hover:bg-accent-terracotta text-surface-crisp font-label-action text-[11px] uppercase tracking-[0.18em] py-3.5 px-6 text-center transition-colors shadow-sm"
                  href="tel:0988246810"
                >
                  Hotline Điều Phối: 0988.246.810
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setBookingArtisan(currentArtisan || artisans[0]);
                    setIsBookingOpen(true);
                  }}
                  className="w-full bg-surface-crisp border border-text-primary hover:bg-canvas-linen text-text-primary font-label-action text-[11px] uppercase tracking-[0.18em] py-3.5 px-6 text-center transition-colors cursor-pointer"
                >
                  Gửi Hồ Sơ Yêu Cầu Ghé Thăm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPUP MODAL HỒ SƠ CHI TIẾT NGHỆ NHÂN */}
      {currentArtisan && (
        <ArtisanDetailPopup
          artisan={currentArtisan}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onPrev={handlePrevArtisan}
          onNext={handleNextArtisan}
          currentIndex={activeArtisanIndex}
          totalArtisans={listForModal.length}
          prevIndexLabel={listForModal[prevIdx]?.matrix_index || '#01'}
          nextIndexLabel={listForModal[nextIdx]?.matrix_index || '#02'}
          onBookVisit={(art) => {
            setBookingArtisan(art);
            setIsBookingOpen(true);
          }}
        />
      )}

      {/* MODAL ĐẶT LỊCH THĂM XƯỞNG */}
      <VisitBookingModal
        artisan={bookingArtisan || currentArtisan || artisans[0]}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
