import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import { getCraftById, getRelatedCrafts, getCrafts } from '../api/crafts';

export default function CraftDetailPage() {
  const { id } = useParams();

  const [craft, setCraft] = useState(null);
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const { isFav, toggleFav } = useFavourites();
  const craftId = craft?.id || Number(id) || 1;
  const isSaved = isFav(craftId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePhotoIndex(0);
    setLoading(true);
    setError(null);

    let isMounted = true;
    getCraftById(id)
      .then((res) => {
        if (!isMounted) return;
        if (res?.data) {
          setCraft(res.data);
          // Nạp tác phẩm liên quan từ API
          getRelatedCrafts(res.data.id || id)
            .then((relRes) => {
              if (isMounted && Array.isArray(relRes?.data) && relRes.data.length > 0) {
                setRelatedWorks(relRes.data);
              } else {
                // Fallback lấy danh sách tác phẩm chung từ database
                getCrafts({ limit: 4 })
                  .then((fallbackRel) => {
                    if (isMounted && fallbackRel?.data) {
                      setRelatedWorks(
                        fallbackRel.data
                          .filter((c) => String(c.id) !== String(id))
                          .slice(0, 3)
                      );
                    }
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {
              getCrafts({ limit: 4 })
                .then((fallbackRel) => {
                  if (isMounted && fallbackRel?.data) {
                    setRelatedWorks(
                      fallbackRel.data
                        .filter((c) => String(c.id) !== String(id))
                        .slice(0, 3)
                    );
                  }
                })
                .catch(() => {});
            });
        } else {
          setError('Không tìm thấy thông tin tác phẩm trong cơ sở dữ liệu.');
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Lỗi khi nạp chi tiết tác phẩm:', err);
          setError(
            err.statusCode === 404
              ? 'Tác phẩm không tồn tại trong cơ sở dữ liệu.'
              : 'Không thể kết nối đến máy chủ để lấy dữ liệu tác phẩm.'
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleToggleSave = () => {
    toggleFav(craftId);
  };

  // Trạng thái đang tải (Loading Skeleton)
  if (loading) {
    return (
      <div className="flex flex-col w-full bg-canvas-linen py-space-xl min-h-[600px]">
        <div className="max-w-7xl mx-auto px-margin w-full animate-pulse space-y-8">
          <div className="h-6 bg-surface-subtle border border-border-neutral w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            <div className="lg:col-span-7 aspect-[4/3] bg-surface-subtle border border-border-neutral"></div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-4 bg-surface-subtle w-1/4"></div>
              <div className="h-10 bg-surface-subtle w-3/4"></div>
              <div className="h-20 bg-surface-subtle w-full"></div>
              <div className="h-40 bg-surface-subtle w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái lỗi hoặc không tìm thấy tác phẩm
  if (error || !craft) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[500px] bg-canvas-linen px-margin py-space-xl text-center space-y-6">
        <span className="material-symbols-outlined text-[64px] text-accent-terracotta">
          inventory_2
        </span>
        <div className="space-y-2 max-w-md">
          <h2 className="font-headline-title text-2xl uppercase tracking-wider text-text-primary">
            {error || 'Không tìm thấy tác phẩm'}
          </h2>
          <p className="font-body-spec text-text-secondary">
            Hiện vật bạn đang tìm kiếm không tồn tại hoặc đã được chuyển vào mục lưu chiểu nội bộ của bảo tàng.
          </p>
        </div>
        <Link
          to="/crafts"
          className="px-8 py-3.5 bg-text-primary text-surface-crisp font-label-action text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-accent-terracotta transition-colors shadow-sm"
        >
          QUAY LẠI KHO LƯU TRỮ DI SẢN
        </Link>
      </div>
    );
  }

  // Chuẩn hóa thư viện ảnh từ CSDL (images table hoặc thumbnail)
  const gallery = [];
  if (craft.images && Array.isArray(craft.images) && craft.images.length > 0) {
    craft.images.forEach((img) => {
      gallery.push({
        url: img.url,
        alt: img.altText || img.caption || craft.name,
        title: img.caption || craft.name,
      });
    });
  } else if (craft.gallery && Array.isArray(craft.gallery) && craft.gallery.length > 0) {
    gallery.push(...craft.gallery);
  } else if (craft.thumbnailUrl || craft.thumbnail_url || craft.image) {
    gallery.push({
      url: craft.thumbnailUrl || craft.thumbnail_url || craft.image,
      alt: craft.name,
      title: craft.name,
    });
  }

  const currentPhoto = gallery[activePhotoIndex] || gallery[0] || { url: '', alt: '', title: '' };

  // Trích xuất quan hệ Nghệ nhân (Artisan N-N)
  const leadArtisan =
    Array.isArray(craft.artisans) && craft.artisans.length > 0
      ? craft.artisans.find((a) => a.isLead || a.is_lead) || craft.artisans[0]
      : null;
  const artisanName = leadArtisan?.name || craft.artisan || 'Nghệ nhân làng nghề';
  const artisanTitle = leadArtisan?.title || craft.artisanTitle || 'Nghệ nhân Ưu tú';
  const artisanRole = leadArtisan?.roleTitle || leadArtisan?.role_title || craft.artisanExp || 'Chủ trì chế tác';

  // Trích xuất Danh mục & Vùng miền
  const categoryName =
    typeof craft.category === 'object' ? craft.category?.name : craft.category || craft.categoryLabel || 'Thủ công mỹ nghệ';
  const regionName =
    typeof craft.region === 'object' ? craft.region?.name : craft.region || craft.origin || 'Việt Nam';

  // Trích xuất Chất liệu & Kỹ thuật
  const materialsText = Array.isArray(craft.materials)
    ? craft.materials.map((m) => (typeof m === 'object' ? m.name : m)).join(', ')
    : craft.material || 'Nguyên liệu tự nhiên bản địa';

  const techniquesText = Array.isArray(craft.techniques)
    ? craft.techniques.map((t) => (typeof t === 'object' ? t.name : t)).join(', ')
    : craft.technique || 'Thủ công truyền thống';

  // Trích xuất các bước Quy trình chế tác từ trường process
  const processStages =
    Array.isArray(craft.processStages) && craft.processStages.length > 0
      ? craft.processStages
      : craft.process
      ? craft.process.split('->').map((step, idx) => ({
          step: `Giai đoạn ${idx + 1}`,
          temp: step.trim().split(' ')[0] || `Bước ${idx + 1}`,
          desc: step.trim(),
        }))
      : [];

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Top Breadcrumbs */}
      <section className="w-full bg-canvas-linen py-space-sm border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-wrap items-center font-spec-code text-spec-code tracking-[0.16em] uppercase text-text-secondary">
            <Link to="/" className="hover:text-accent-terracotta transition-colors">
              Trang Chủ
            </Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <Link to="/crafts" className="hover:text-accent-terracotta transition-colors">
              {categoryName}
            </Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <Link to="/regions" className="hover:text-accent-terracotta transition-colors">
              {regionName}
            </Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <span className="text-text-primary font-semibold truncate max-w-xs sm:max-w-md">
              {craft.name} (Mã: {craft.slug || `CR-0${craft.id}`})
            </span>
          </div>
        </div>
      </section>

      {/* Showcase Split: 55% Left Visual / 45% Right Specification */}
      <section className="w-full py-space-lg bg-surface">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Left Photography Column (55% -> 7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-space-md">
              {/* Main Hero Image Frame */}
              <div className="relative w-full aspect-[4/3] bg-surface-subtle overflow-hidden group shadow-sm border border-border-neutral">
                <img
                  id="craft-main-display"
                  src={currentPhoto?.url}
                  alt={currentPhoto?.title || craft.name}
                  data-alt={currentPhoto?.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-text-primary/90 text-surface-crisp px-3 py-1 font-spec-code text-[11px] uppercase tracking-[0.15em] backdrop-blur-sm">
                  {craft.isFeatured || craft.is_featured ? 'DI SẢN TIÊU BIỂU' : 'NGUYÊN BẢN THỦ CÔNG'}
                </div>
                <div className="absolute bottom-4 right-4 bg-surface-crisp/95 text-text-primary px-3 py-1.5 font-spec-code text-spec-code shadow-sm flex items-center gap-2 border border-border-neutral">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent-terracotta animate-pulse"></span>
                  Độ hoàn thiện: 100% Nguyên bản
                </div>
              </div>

              {/* Thumbnail Gallery Selector */}
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-space-sm pt-space-xs">
                  {gallery.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`gallery-thumb aspect-[4/3] p-1 transition-all focus:outline-none shadow-sm cursor-pointer border ${
                        activePhotoIndex === idx
                          ? 'bg-surface-crisp ring-1 ring-accent-terracotta border-accent-terracotta'
                          : 'bg-surface-subtle hover:bg-surface-crisp border-border-neutral'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title || `${craft.name} góc ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Micro Metrology Bar */}
              <div className="p-space-md bg-surface-container-low border border-border-neutral flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-accent-terracotta text-[18px]">verified</span>
                  <span className="font-spec-code text-spec-code uppercase tracking-[0.08em] text-text-primary font-medium">
                    Chứng thư di sản giám tuyển
                  </span>
                </div>
                <div className="font-spec-code text-[11px] text-text-secondary tracking-widest uppercase">
                  Lưu trữ quốc gia • Giám tuyển CraftRoots
                </div>
              </div>
            </div>

            {/* Right Specification & Storytelling Column (45% -> 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              {/* Heritage Category Overline */}
              <div className="flex items-center gap-2 mb-space-xs">
                <span className="w-6 h-[1px] bg-accent-terracotta"></span>
                <span className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold">
                  {categoryName} — {regionName}
                </span>
              </div>

              {/* Primary Title */}
              <h1 className="font-display-hero text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] tracking-[0.08em] font-light text-text-primary uppercase mb-space-xs">
                {craft.name}
              </h1>
              <p className="font-title-card text-title-card italic text-text-secondary mb-space-md leading-relaxed">
                {craft.shortDescription || craft.short_description || craft.description}
              </p>

              {/* Artisan Endorsement Ribbon */}
              <div className="p-space-md bg-surface-subtle border border-border-neutral mb-space-lg flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                  <span className="font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.14em]">Chế tác bởi bàn tay</span>
                  <Link
                    to={leadArtisan ? `/artisans/${leadArtisan.id}` : '/artisans'}
                    className="font-label-signature text-[22px] leading-tight text-text-primary font-normal hover:text-accent-terracotta transition-colors"
                  >
                    {artisanName}
                  </Link>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-surface-crisp text-accent-terracotta font-spec-code text-[10px] tracking-[0.15em] uppercase font-semibold border border-border-neutral">
                    {artisanTitle}
                  </span>
                  <p className="font-spec-code text-[11px] text-text-secondary mt-1">{artisanRole}</p>
                </div>
              </div>

              {/* Technical Spec Matrix Table */}
              <div className="bg-surface-crisp border border-border-neutral p-space-md shadow-sm mb-space-lg space-y-space-sm">
                <div className="pb-space-xs border-b border-border-neutral">
                  <span className="font-label-action text-label-action uppercase tracking-[0.2em] text-text-primary font-semibold">
                    Thông Số Kỹ Thuật Di Sản
                  </span>
                </div>
                <div className="grid grid-cols-1 divide-y divide-border-neutral text-body-spec">
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Mã định danh</span>
                    <span className="font-spec-code text-spec-code text-text-primary font-semibold text-right tracking-[0.08em]">
                      {craft.slug || `CR-0${craft.id}`}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Xuất xứ địa dư</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right font-medium">
                      {regionName}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Chất liệu cốt</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right">
                      {materialsText}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Kỹ thuật tạo tác</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right font-medium">
                      {techniquesText}
                    </span>
                  </div>
                  {craft.tools && (
                    <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                      <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Công cụ chế tác</span>
                      <span className="font-body-spec text-body-spec text-text-primary text-right">
                        {craft.tools}
                      </span>
                    </div>
                  )}
                  {craft.traditionalUse || craft.traditional_use ? (
                    <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                      <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Công năng truyền thống</span>
                      <span className="font-body-spec text-body-spec text-accent-terracotta text-right font-medium">
                        {craft.traditionalUse || craft.traditional_use}
                      </span>
                    </div>
                  ) : null}
                  {craft.culturalContext || craft.cultural_context ? (
                    <div className="py-2.5 flex flex-col gap-1">
                      <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em]">Bối cảnh văn hóa</span>
                      <span className="font-body-spec text-[13px] text-text-secondary leading-relaxed">
                        {craft.culturalContext || craft.cultural_context}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Valuation & Action Zone */}
              <div className="p-space-lg bg-surface-subtle border border-border-neutral shadow-sm flex flex-col space-y-space-md">
                <div>
                  <span className="font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.15em] block mb-1">
                    Định mức chuyển nhượng di sản
                  </span>
                  <div className="flex items-baseline gap-space-sm">
                    <span className="font-headline-title text-[28px] text-text-primary font-bold tracking-tight">
                      LƯU CHIỂU BẢO TÀNG
                    </span>
                    <span className="font-spec-code text-spec-code text-accent-terracotta tracking-[0.05em] uppercase font-medium">
                      Độc bản xác thực
                    </span>
                  </div>
                  <p className="font-body-spec text-[12px] text-text-secondary mt-1">
                    * Mỗi tác phẩm đều được kiểm định nguồn gốc và đóng dấu triện nghệ nhân độc bản.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-space-sm pt-space-xs">
                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className={`flex-1 transition-colors duration-200 py-3.5 px-6 font-label-action text-label-action uppercase tracking-[0.18em] font-semibold text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      isSaved
                        ? 'bg-accent-terracotta text-surface-crisp'
                        : 'bg-text-primary text-surface-crisp hover:bg-accent-terracotta'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'filled' : ''}`}>
                      bookmark_add
                    </span>
                    {isSaved ? 'Đã Lưu Bộ Sưu Tập' : 'Lưu Vào Bộ Sưu Tập'}
                  </button>
                  <Link
                    to="/contact"
                    className="flex-1 bg-surface-crisp border border-border-neutral text-text-primary hover:bg-surface-container-high transition-colors duration-200 py-3.5 px-6 font-label-action text-label-action uppercase tracking-[0.16em] font-semibold text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Đặt Hẹn Thăm Xưởng</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Provenance & Process Gauge */}
      {processStages.length > 0 && (
        <section className="w-full bg-surface-container border-y border-border-neutral py-space-xl">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
              <div className="md:col-span-4">
                <div className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold mb-2">
                  Quy Trình Chế Tác
                </div>
                <h2 className="font-headline-title text-headline-title text-text-primary tracking-tight mb-2">
                  Kỹ Nghệ Truyền Thừa
                </h2>
                <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                  Tác phẩm trải qua các công đoạn chế tác thủ công nghiêm ngặt lưu giữ bí truyền qua nhiều thế hệ.
                </p>
              </div>
              <div className="md:col-span-8 bg-surface-crisp border border-border-neutral p-space-lg shadow-sm">
                <div
                  className={`grid grid-cols-2 ${
                    processStages.length > 2 ? 'sm:grid-cols-4' : 'sm:grid-cols-2'
                  } gap-gutter text-center`}
                >
                  {processStages.map((stage, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.1em] mb-1">
                        {stage.step}
                      </span>
                      <span
                        className={`font-display-hero text-[18px] sm:text-[20px] font-medium tracking-normal ${
                          idx === 1 ? 'text-accent-terracotta' : 'text-text-primary'
                        }`}
                      >
                        {stage.temp}
                      </span>
                      <span className="font-body-spec text-[12px] text-text-secondary mt-1">
                        {stage.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Works Section: Tác Phẩm Cùng Bộ Sưu Tập */}
      {relatedWorks.length > 0 && (
        <section className="w-full bg-surface-container-low py-space-xl">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="flex flex-col md:flex-row md:items-end justify-between pb-space-lg border-b border-border-neutral mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-[1px] bg-accent-terracotta"></span>
                  <span className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold">
                    Tuyển Tập Tác Phẩm Khác
                  </span>
                </div>
                <h3 className="font-headline-title text-[26px] text-text-primary tracking-tight font-medium uppercase">
                  Khám Phá Di Sản CraftRoots <span className="opacity-35 select-none font-light">|</span>{' '}
                  {categoryName}
                </h3>
              </div>
              <div className="mt-space-sm md:mt-0 font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
                Hồ sơ lưu trữ: {relatedWorks.length} tác phẩm liên quan
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {relatedWorks.map((work) => {
                const workImg = work.thumbnailUrl || work.thumbnail_url || work.image || '';
                const workCategory =
                  typeof work.category === 'object' ? work.category?.name : work.category || categoryName;
                const workOrigin =
                  typeof work.region === 'object' ? work.region?.name : work.region || work.origin || regionName;

                return (
                  <article
                    key={work.id}
                    className="bg-surface-crisp border border-border-neutral transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-md flex flex-col group"
                  >
                    <div className="relative w-full aspect-[4/5] bg-surface-subtle overflow-hidden">
                      <img
                        src={workImg}
                        alt={work.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-text-primary text-surface-crisp px-2.5 py-0.5 font-spec-code text-[10px] uppercase tracking-[0.15em]">
                        Mã: {work.slug || `CR-0${work.id}`}
                      </span>
                    </div>
                    <div className="p-space-lg flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.1em] mb-1">
                          <span>{workCategory}</span>
                          <span className="mx-2 opacity-35">|</span>
                          <span className="truncate">{workOrigin}</span>
                        </div>
                        <h4 className="font-title-card text-title-card text-text-primary font-semibold mb-2 group-hover:text-accent-terracotta transition-colors line-clamp-1">
                          {work.name}
                        </h4>
                        <p className="font-body-spec text-body-spec text-text-secondary line-clamp-2 leading-relaxed">
                          {work.shortDescription || work.short_description || work.description}
                        </p>
                      </div>
                      <div className="pt-space-md mt-space-sm border-t border-border-neutral flex items-center justify-between">
                        <span className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">
                          LƯU CHIỂU QUỐC GIA
                        </span>
                        <Link
                          to={`/crafts/${work.id}`}
                          className="font-label-action text-label-action uppercase tracking-[0.15em] text-accent-terracotta hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          XEM CHI TIẾT →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
