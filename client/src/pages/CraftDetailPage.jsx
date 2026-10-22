import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const DEFAULT_GALLERY_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    alt: 'Bình Gốm Men Lam Cổ',
    title: 'Góc chụp toàn cảnh tác phẩm',
  },
];

export default function CraftDetailPage() {
  const { id } = useParams();
  const craftId = id || 1;
  const [craft, setCraft] = useState(null);
  const [relatedList, setRelatedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCraftDetail() {
      try {
        setLoading(true);
        const detail = await api.getCraftById(craftId);
        if (isMounted && detail) {
          setCraft(detail);
        }
        const related = await api.getRelatedCrafts(craftId).catch(() => []);
        if (isMounted && Array.isArray(related)) {
          setRelatedList(related);
        }
      } catch (err) {
        console.warn('Lỗi nạp chi tiết tác phẩm từ DB:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCraftDetail();
    setActivePhotoIndex(0);
    return () => { isMounted = false; };
  }, [craftId]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('craftroots_favourites');
      if (stored) {
        const list = JSON.parse(stored);
        if (list.some((item) => (item.id || item) == craftId)) {
          setIsSaved(true);
        }
      }
    } catch {
      //
    }
  }, [craftId]);

  const toggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      try {
        const stored = localStorage.getItem('craftroots_favourites');
        let list = stored ? JSON.parse(stored) : [];
        const itemObj = {
          id: craft?.id || craftId,
          name: craft?.name || 'Tác phẩm thủ công',
          code: craft?.slug || `CR-0${craftId}`,
          price: craft?.price || 'Liên hệ',
          image: craft?.thumbnailUrl || DEFAULT_GALLERY_PHOTOS[0].url,
        };
        if (next) {
          if (!list.some((i) => (i.id || i) == craftId)) {
            list.push(itemObj);
          }
        } else {
          list = list.filter((i) => (i.id || i) != craftId);
        }
        localStorage.setItem('craftroots_favourites', JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
      } catch {
        //
      }
      return next;
    });
  };

  const photos = (craft?.images && craft.images.length > 0)
    ? craft.images.map((img) => ({
        url: img.url,
        title: img.caption || craft?.name,
        alt: img.altText || craft?.name,
      }))
    : [
        {
          url: craft?.thumbnailUrl || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
          title: craft?.name || 'Tác phẩm thủ công',
          alt: craft?.name || 'Ảnh chi tiết',
        },
      ];

  const currentPhoto = photos[activePhotoIndex] || photos[0];
  const leadArtisan = craft?.artisans?.[0] || {
    name: 'Nghệ Nhân Làng Nghề',
    title: 'Nghệ nhân Ưu tú',
    roleTitle: 'Chủ trì chế tác di sản',
  };
  const materialsText = craft?.materials?.map((m) => m.name).join(', ') || 'Nguyên liệu tự nhiên thuần Việt';
  const techniquesText = craft?.techniques?.map((t) => t.name).join(', ') || 'Kỹ pháp thủ công truyền thừa';

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Top Breadcrumbs */}
      <section className="w-full bg-canvas-linen py-space-sm border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-wrap items-center font-spec-code text-spec-code tracking-[0.16em] uppercase text-text-secondary">
            <Link to="/" className="hover:text-accent-terracotta transition-colors">Trang Chủ</Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <Link to="/crafts" className="hover:text-accent-terracotta transition-colors">{craft?.category?.name || 'Di Sản Thủ Công'}</Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <Link to="/regions" className="hover:text-accent-terracotta transition-colors">{craft?.region?.name || 'Làng Nghề Truyền Thống'}</Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <span className="text-text-primary font-semibold">{craft?.name || `Tác phẩm #CR-${craftId}`}</span>
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
              <div className="relative w-full aspect-video sm:aspect-[4/3] bg-surface-subtle overflow-hidden group shadow-sm border border-border-neutral">
                <img
                  id="craft-main-display"
                  src={currentPhoto.url}
                  alt={currentPhoto.title}
                  data-alt={currentPhoto.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-text-primary/90 text-surface-crisp px-3 py-1 font-spec-code text-[11px] uppercase tracking-[0.15em] backdrop-blur-sm">
                  {craft?.category?.name || 'Mộc Bản Thủ Công'}
                </div>
                <div className="absolute bottom-4 right-4 bg-surface-crisp/95 text-text-primary px-3 py-1.5 font-spec-code text-spec-code shadow-sm flex items-center gap-2 border border-border-neutral">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent-terracotta animate-pulse"></span>
                  Lượt tra cứu: {craft?.viewCount || 1} lần
                </div>
              </div>

              {/* Thumbnail Gallery Selector */}
              <div className="grid grid-cols-4 gap-space-sm pt-space-xs">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`gallery-thumb aspect-video sm:aspect-[4/3] p-1 transition-all focus:outline-none shadow-sm cursor-pointer border ${
                      activePhotoIndex === idx
                        ? 'bg-surface-crisp ring-1 ring-accent-terracotta border-accent-terracotta'
                        : 'bg-surface-subtle hover:bg-surface-crisp border-border-neutral'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Micro Metrology Bar */}
              <div className="p-space-md bg-surface-container-low border border-border-neutral flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-accent-terracotta text-[18px]">verified</span>
                  <span className="font-spec-code text-spec-code uppercase tracking-[0.08em] text-text-primary font-medium">
                    Chứng thư di sản CraftRoots
                  </span>
                </div>
                <div className="font-spec-code text-[11px] text-text-secondary tracking-widest uppercase">
                  Mã CSDL: {craft?.slug || `craft-${craftId}`}
                </div>
              </div>
            </div>

            {/* Right Specification & Storytelling Column (45% -> 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              {/* Heritage Category Overline */}
              <div className="flex items-center gap-2 mb-space-xs">
                <span className="w-6 h-[1px] bg-accent-terracotta"></span>
                <span className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold">
                  {craft?.region?.name || 'Di Sản Làng Nghề Việt Nam'}
                </span>
              </div>

              {/* Primary Title */}
              <h1 className="font-display-hero text-[20px] sm:text-[26px] md:text-[32px] leading-[28px] sm:leading-[34px] md:leading-[38px] tracking-[0.04em] sm:tracking-[0.1em] font-light text-text-primary uppercase mb-space-xs">
                {craft?.name || 'Tác Phẩm Thủ Công Truyền Thống'}
              </h1>
              <p className="font-title-card text-[14px] sm:text-title-card italic text-text-secondary mb-space-md">
                {craft?.shortDescription || 'Tuyệt tác tạo hình thuần thủ công từ đôi bàn tay các bậc thầy nghệ nhân Việt Nam.'}
              </p>

              {/* Artisan Endorsement Ribbon */}
              <div className="p-3 sm:p-space-md bg-surface-subtle border border-border-neutral mb-4 sm:mb-space-lg flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                  <span className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary uppercase tracking-[0.12em] sm:tracking-[0.14em]">Chế tác bởi nghệ nhân</span>
                  <Link to={`/artisans/${leadArtisan.id || 1}`} className="font-label-signature text-[18px] sm:text-[22px] leading-tight text-text-primary font-normal hover:text-accent-terracotta transition-colors">
                    {leadArtisan.name}
                  </Link>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 bg-surface-crisp text-accent-terracotta font-spec-code text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.15em] uppercase font-semibold border border-border-neutral">
                    {leadArtisan.title || 'Nghệ Nhân Ưu Tú'}
                  </span>
                  <p className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary mt-0.5 sm:mt-1">{leadArtisan.roleTitle || 'Chủ trì chế tác'}</p>
                </div>
              </div>

              {/* Technical Spec Matrix Table */}
              <div className="bg-surface-crisp border border-border-neutral p-3 sm:p-space-md shadow-sm mb-4 sm:mb-space-lg space-y-2 sm:space-y-space-sm">
                <div className="pb-space-xs border-b border-border-neutral">
                  <span className="font-label-action text-[10px] sm:text-label-action uppercase tracking-[0.15em] sm:tracking-[0.2em] text-text-primary font-semibold">
                    Thông Số Kỹ Thuật Di Sản
                  </span>
                </div>
                <div className="grid grid-cols-1 divide-y divide-border-neutral text-body-spec">
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Mã định danh</span>
                    <span className="font-spec-code text-spec-code text-text-primary font-semibold text-right tracking-[0.08em]">{craft?.slug || `CR-0${craftId}`}</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Làng nghề xuất xứ</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right font-medium">{craft?.region?.name || 'Việt Nam'}</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Chất liệu chế tác</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right">{materialsText}</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Kỹ thuật tạo tác</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right font-medium">{techniquesText}</span>
                  </div>
                  {craft?.tools && (
                    <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                      <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Nông cụ & Dụng cụ</span>
                      <span className="font-body-spec text-body-spec text-text-primary text-right">{craft.tools}</span>
                    </div>
                  )}
                  {craft?.traditionalUse && (
                    <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                      <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Đề xuất công năng</span>
                      <span className="font-body-spec text-body-spec text-accent-terracotta text-right font-medium">{craft.traditionalUse}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Valuation & Action Zone */}
              <div className="p-4 sm:p-space-lg bg-surface-subtle border border-border-neutral shadow-sm flex flex-col space-y-3 sm:space-y-space-md">
                <div>
                  <span className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary uppercase tracking-[0.12em] sm:tracking-[0.15em] block mb-1">
                    Định mức chuyển nhượng di sản
                  </span>
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-space-sm">
                    <span className="font-headline-title text-[22px] sm:text-[28px] md:text-[32px] text-text-primary font-bold tracking-tight">Giá giám tuyển</span>
                    <span className="font-spec-code text-[11px] sm:text-spec-code text-accent-terracotta tracking-[0.05em] uppercase font-medium">Chế tác theo mẻ</span>
                  </div>
                  <p className="font-body-spec text-[12px] text-text-secondary mt-1">
                    * Mỗi mẻ chỉ nung thành công 12 bộ đạt chuẩn tỷ lệ vết rạn tự nhiên cấp độ A+.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-space-sm pt-space-xs">
                  <button
                    type="button"
                    onClick={toggleSave}
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

      {/* Interactive Provenance & Kiln Temperature Gauge */}
      <section className="w-full bg-surface-container border-y border-border-neutral py-space-xl">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-4">
              <div className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold mb-2">
                Quy Trình Hỏa Biến
              </div>
              <h2 className="font-headline-title text-headline-title text-text-primary tracking-tight mb-2">
                Nhiệt Độ Lò Bầu &amp; Men Khử
              </h2>
              <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                Nung liên tục trong 72 giờ bằng củi thông già để đạt đỉnh nhiệt 1300°C. Vết men rạn vỡ tự nhiên khi hạ nhiệt từ từ theo chu kỳ 48 giờ đón gió đông bắc.
              </p>
            </div>
            <div className="md:col-span-8 bg-surface-crisp border border-border-neutral p-space-lg shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter text-center">
                <div className="flex flex-col items-center">
                  <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.1em] mb-1">Giai đoạn 1</span>
                  <span className="font-display-hero text-[24px] text-text-primary font-medium tracking-normal">250°C</span>
                  <span className="font-body-spec text-[12px] text-text-secondary mt-1">Xông sấy mộc khô kiệt</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.1em] mb-1">Giai đoạn 2</span>
                  <span className="font-display-hero text-[24px] text-text-primary font-medium tracking-normal">950°C</span>
                  <span className="font-body-spec text-[12px] text-text-secondary mt-1">Khử oxy trong lò kín</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-spec-code text-spec-code text-accent-terracotta font-semibold uppercase tracking-[0.1em] mb-1">Đỉnh nhiệt</span>
                  <span className="font-display-hero text-[24px] text-accent-terracotta font-medium tracking-normal">1300°C</span>
                  <span className="font-body-spec text-[12px] text-text-secondary mt-1">Hóa thủy tinh men tro</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.1em] mb-1">Nguội tuần hoàn</span>
                  <span className="font-display-hero text-[24px] text-text-primary font-medium tracking-normal">48 Giờ</span>
                  <span className="font-body-spec text-[12px] text-text-secondary mt-1">Rạn men phát tiếng lách tách</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Works Section: Tác Phẩm Cùng Nghệ Nhân */}
      <section className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-margin">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 md:pb-space-lg border-b border-border-neutral mb-6 md:mb-8 gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-[1px] bg-accent-terracotta"></span>
                <span className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold">
                  Tuyển Tập Tác Phẩm
                </span>
              </div>
              <h3 className="font-headline-title text-[20px] sm:text-[24px] md:text-[26px] text-text-primary tracking-tight font-medium uppercase">
                Tác Phẩm Cùng Nghệ Nhân {leadArtisan.name} <span className="opacity-35 select-none font-light">|</span> {craft?.region?.name || 'Di sản làng nghề'}
              </h3>
            </div>
            <div className="mt-space-sm md:mt-0 font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
              Hồ sơ lưu trữ: {relatedList.length} tác phẩm liên quan
            </div>
          </div>

          {relatedList.length === 0 ? (
            <p className="text-center font-spec-code text-text-secondary py-8">
              Đang tổng hợp các tác phẩm liên quan từ cùng nghệ nhân...
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-gutter">
              {relatedList.map((work) => (
                <article key={work.id} className="bg-surface-crisp border border-border-neutral transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-md flex flex-col justify-between group">
                  <div className="relative w-full aspect-square md:aspect-[4/5] bg-surface-subtle overflow-hidden">
                    <img
                      src={work.thumbnailUrl || work.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'}
                      alt={work.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Ẩn mã sản phẩm trên mobile để tối ưu khung hình */}
                    <span className="hidden md:inline-block absolute top-3 left-3 bg-text-primary text-surface-crisp px-2.5 py-0.5 font-spec-code text-[10px] uppercase tracking-[0.15em]">
                      Mã: {work.slug || `CR-0${work.id}`}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 md:p-space-lg flex-1 flex flex-col justify-between">
                    <div>
                      {/* Nhãn xuất xứ đơn giản hóa, không lặp */}
                      <div className="flex items-center font-spec-code text-[10px] md:text-spec-code text-accent-terracotta uppercase tracking-[0.1em] mb-1 truncate">
                        <span className="truncate">{work.region || work.category || 'Di sản làng nghề'}</span>
                      </div>
                      <h4 className="font-title-card text-[15px] sm:text-[16px] md:text-title-card text-text-primary font-semibold mb-1 md:mb-2 group-hover:text-accent-terracotta transition-colors line-clamp-2 leading-snug">
                        <Link to={`/crafts/${work.id}`}>{work.name}</Link>
                      </h4>
                      {/* Ẩn mô tả dài trên màn hình di động */}
                      <p className="hidden md:block font-body-spec text-body-spec text-text-secondary line-clamp-2 leading-relaxed mb-2">
                        {work.shortDescription || work.description || 'Tác phẩm chế tác thủ công tinh xảo.'}
                      </p>
                    </div>
                    <div className="pt-2 md:pt-space-md mt-1 md:mt-space-sm border-t border-border-neutral flex items-center justify-between gap-1">
                      <span className="font-headline-title text-[13px] sm:text-[14px] md:text-[18px] text-text-primary font-semibold truncate">
                        {work.price || 'Giá liên hệ'}
                      </span>
                      <Link
                        to={`/crafts/${work.id}`}
                        className="font-label-action text-[9px] sm:text-[10px] md:text-label-action uppercase tracking-[0.1em] md:tracking-[0.15em] text-accent-terracotta hover:underline inline-flex items-center gap-0.5 font-semibold shrink-0"
                      >
                        <span className="hidden sm:inline">XEM </span>CHI TIẾT →
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
