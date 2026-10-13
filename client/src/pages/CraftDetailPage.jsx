import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const GALLERY_PHOTOS = [
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9O3gQL4UyGAzvsdnfdDAr9jVo5wf-PqrIP4Q71xSWUXrJ8vXfYysi3-KYwEI84hdGzKF-JZV34gNXpDGwk7ramD254sTh_js-_cawkd5VhnJr4ST1pFFPc_aIVr1gwwfRHXR99a1OhThrioFR9M40z5MI592OB6QA4mOqF3uIbm4Pyj1FvBuUDMucEsKzJTAkS7yrEdDody-XdfO3P2fak7Te0XsgDKMAzdHc-Uk',
    alt: 'Editorial close-up still life photograph of a handcrafted traditional Vietnamese Bat Trang crackle glaze ceramic tea set, featuring a bell-shaped teapot with fine crackle lines, six companion cups, and a ceramic platter resting on an aged weathered dark teak table, soft diffused natural window lighting with faint curling steam, warm terracotta accents and muted earthy tones, museum archival aesthetic.',
    title: 'Góc chụp toàn cảnh bộ ấm chén men rạn dáng quả chuông cổ điển',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAek_gUQ2Mc6KWSkJsR7CziwjdJG4s5I-bseH2KGPdkh974MWmg5LqbRpp-9ABPNB7MDBR6BsP2GoWS-pB1KIjZEZ1Fhaindt3gwvmzuq6XSYcAkMW1xrPkuVsQU1vYxu6YHmU33_J8dZ8cgHgI2W49DLSactYvnB7F6IagGpX4rb9LlZdGU5G7qWfRwxyWhE_ITEqNowZTyHv4bafivHivSF6M25p2yPwqQCMMMz0',
    alt: 'Macro macro lens shot focusing sharply on the bell-shaped ceramic teapot lid showing delicate spiderweb crackle ash glaze patterns, matte tactile earthenware texture, warm studio light from side angle.',
    title: 'Góc cận cảnh nắp ấm dáng quả chuông với núm cầm tiện tay nguyên khối',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKtHhTTz7DXi-iJEkU_gB4eS0-wetuJ0SRFRhUSjHt2M1dPYycC5U3V90kG7RBcx7DSOLLDzN2I1ry5FtoM_2Cw_PGnfZN1UzJ_TVAiMKH4xzgCbqXIlHwIP9aj37vbzyOKepDCHpUDGTposEVctXj8Xb5sBfhQxjKrmpKBi8uIIGGnQwv6FJt-PKdWQkXss9MCektu6xIrLyeEO1n6rboeBomyQ4G1klVBTd6O3o',
    alt: 'High magnification detail of traditional Vietnamese crackle glaze showing fine natural crazing filled with natural tea tannin patina, subtle mineral specks, smooth tactile glassy surface.',
    title: 'Mạng lưới men rạn tro trấu cổ kính hình thành tự nhiên trong lò củi 1300 độ C',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQpMi-84Wlk9WfkFX9WJEidp714r333AzvS98OP3pTpGOYDPBcy4cnPq0-7R9h9HCdM6YUQkhorAbYmHwlexpoksY0Ok87joXkFXnVN9GktBeUrvV8cGjlCMdrcjSocxblPyYJgx_wgO-4hcoq9iAha9R-KsRls4DXBd9Q-Btc-H2quAk-4ErTONPmBGP0wmWzPd95MHUylftdBPCQEGg0AVss2L57gtUYw2Li5O4',
    alt: 'Bottom view of the handcrafted ceramic teapot showing raw unglazed high-fired terracotta foot rim and deep pressed Chinese-Vietnamese seal mark stamp of master artisan Nguyen Van Binh.',
    title: 'Triện gốm khắc chìm tay xác thực danh tính nghệ nhân Nguyễn Văn Bình dưới đáy ấm',
  },
];

const RELATED_WORKS = [
  {
    id: 101,
    code: 'CR-BT-HL04',
    title: 'Bình Hút Lộc Men Rạn Cổ',
    category: 'Gốm Men Rạn',
    period: 'Thế Kỷ XVIII',
    description: 'Dáng bình miệng loe cổ thắt, lưu giữ vượng khí theo quan niệm phong thủy kinh thành Thăng Long xưa.',
    price: '3.650.000 ₫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzXcydUozdi1PLpqPxD4ZBpXNYg-ZxxkKbOfwc96bEYO0OHDra0CEo0AqdNsTVi-L2TSuENgoW-2OIb95Zoqb-dJtoJJIypv_oB1K6a910Xxy35ra_tRY4ml_OzbYG0V9KByiTgM5N7pW1yE3YUMx823oN5g0lYbzBDb8haDWdDqo-leCsOxG_8Bej51CkA8hy9PvNlSDGN5QAx9acTJB_aLxH3VRiOqrCK5_uhwc',
  },
  {
    id: 102,
    code: 'CR-BT-DD02',
    title: 'Đĩa Cảnh Men Lam Đắp Nổi',
    category: 'Gốm Sa Thạch',
    period: 'Thời Lê Trung Hưng',
    description: 'Họa tiết tùng hạc diên niên vẽ tay bằng oxit coban tự nhiên, men trắng ngà nung nhiệt cao.',
    price: '2.800.000 ₫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqduILIjCsF1Kr_gNwT3HzCol9ezbm28IM-WATA6u3a0Kr8CYRzu98P3zWTne8NLrEGuVggHoQ89zJCBrkJbC8wQoA7JqQqJ2oSQM5h6CVd1OHhsmIKgJsgtVtnyopCOs05V63JZo8I6k5-nAo8X_b4jyLWbBoMi6bJctZ6aMadrS7-0MkDyYuXEvLZFi2TgKBBbD7_yBTT0-K43uVnlY0MZrXFsEgsPrvfb4lcX8',
  },
  {
    id: 103,
    code: 'CR-BT-LH09',
    title: 'Lư Hương Gốm Chạm Rồng Nổi',
    category: 'Gốm Thờ Cổ',
    period: 'Thế Kỷ XVII',
    description: 'Vật phẩm thờ tự trang nghiêm với đôi rồng chầu mặt nguyệt đắp nổi tinh xảo hoàn toàn bằng tay.',
    price: '5.200.000 ₫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaUrvFnVxj2lsHDRkr-yaTRJCRIumrtcbAoBO8T7gJK22rF-l8LFMNoASMdtx_N8hQkmINE6HE7xtmJmzGpxqvbiG5mzG2TvxNKGDuu4MZjKV7e4q6ixIFOJ1PSNsl56IqQagawz_SCLeDfMjYY1bGxxdBh3e-6wBJ15RkSXBTpEZHEoWqpB_uzbwmdJy82jUtSMpkv6zROQGRW5W2GKqEOL2DxfhNLSsVd1T7ujM',
  },
];

export default function CraftDetailPage() {
  const { id } = useParams();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('craftroots_favourites');
      if (stored) {
        const list = JSON.parse(stored);
        if (list.some((item) => (item.id || item) == id || (item.id || item) === 1)) {
          setIsSaved(true);
        }
      }
    } catch {
      //
    }
  }, [id]);

  const toggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      try {
        const stored = localStorage.getItem('craftroots_favourites');
        let list = stored ? JSON.parse(stored) : [];
        const itemObj = {
          id: id || 1,
          name: 'Bộ Trà Men Rạn Nung Củi Bát Tràng',
          code: 'CR-BT-2025-08MR',
          price: '4.850.000 ₫',
          image: GALLERY_PHOTOS[0].url,
        };
        if (next) {
          if (!list.some((i) => (i.id || i) == (id || 1))) {
            list.push(itemObj);
          }
        } else {
          list = list.filter((i) => (i.id || i) != (id || 1));
        }
        localStorage.setItem('craftroots_favourites', JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
      } catch {
        //
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Top Breadcrumbs */}
      <section className="w-full bg-canvas-linen py-space-sm border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-wrap items-center font-spec-code text-spec-code tracking-[0.16em] uppercase text-text-secondary">
            <Link to="/" className="hover:text-accent-terracotta transition-colors">Trang Chủ</Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <Link to="/crafts?category=gom-su" className="hover:text-accent-terracotta transition-colors">Gốm Sứ</Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <Link to="/regions" className="hover:text-accent-terracotta transition-colors">Làng Gốm Bát Tràng</Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <span className="text-text-primary font-semibold">Bộ Trà Men Rạn Cổ (Mã: BT-MR08)</span>
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
                  src={GALLERY_PHOTOS[activePhotoIndex].url}
                  alt={GALLERY_PHOTOS[activePhotoIndex].title}
                  data-alt={GALLERY_PHOTOS[activePhotoIndex].alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-text-primary/90 text-surface-crisp px-3 py-1 font-spec-code text-[11px] uppercase tracking-[0.15em] backdrop-blur-sm">
                  Mộc Bản Thủ Công • Nung Lò Củi
                </div>
                <div className="absolute bottom-4 right-4 bg-surface-crisp/95 text-text-primary px-3 py-1.5 font-spec-code text-spec-code shadow-sm flex items-center gap-2 border border-border-neutral">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent-terracotta animate-pulse"></span>
                  Độ hoàn thiện: 100% Nguyên bản
                </div>
              </div>

              {/* Thumbnail Gallery Selector */}
              <div className="grid grid-cols-4 gap-space-sm pt-space-xs">
                {GALLERY_PHOTOS.map((photo, idx) => (
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
                    Chứng thư cổ vật phục dựng
                  </span>
                </div>
                <div className="font-spec-code text-[11px] text-text-secondary tracking-widest uppercase">
                  Niên hiệu: Quý Mão • Giám tuyển CraftRoots
                </div>
              </div>
            </div>

            {/* Right Specification & Storytelling Column (45% -> 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              {/* Heritage Category Overline */}
              <div className="flex items-center gap-2 mb-space-xs">
                <span className="w-6 h-[1px] bg-accent-terracotta"></span>
                <span className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold">
                  Di Sản Gốm Cổ Việt Nam — Thế Kỷ XVI
                </span>
              </div>

              {/* Primary Title */}
              <h1 className="font-display-hero text-[30px] leading-[38px] tracking-[0.12em] font-light text-text-primary uppercase mb-space-xs">
                Bộ Trà Men Rạn Nung Củi Bát Tràng
              </h1>
              <p className="font-title-card text-title-card italic text-text-secondary mb-space-md">
                Dáng quả chuông cổ điển — Tinh hoa phục chế từ thư tịch cổ triều Lê
              </p>

              {/* Artisan Endorsement Ribbon */}
              <div className="p-space-md bg-surface-subtle border border-border-neutral mb-space-lg flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                  <span className="font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.14em]">Chế tác bởi bàn tay</span>
                  <Link to="/artisans" className="font-label-signature text-[22px] leading-tight text-text-primary font-normal hover:text-accent-terracotta transition-colors">
                    Nguyễn Văn Bình
                  </Link>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-surface-crisp text-accent-terracotta font-spec-code text-[10px] tracking-[0.15em] uppercase font-semibold border border-border-neutral">
                    Nghệ Nhân Ưu Tú
                  </span>
                  <p className="font-spec-code text-[11px] text-text-secondary mt-1">50 năm tuổi nghề gia truyền</p>
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
                    <span className="font-spec-code text-spec-code text-text-primary font-semibold text-right tracking-[0.08em]">CR-BT-2025-08MR</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Làng nghề xuất xứ</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right font-medium">Bát Tràng, Gia Lâm, Hà Nội</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Chất liệu cốt</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right">Đất sét cao lanh sông Hồng lọc kỹ 3 lần</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Loại men đặc thù</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right font-medium">Men rạn tro trấu cổ truyền (Crackle ash glaze)</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Kỹ thuật tạo tác</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right">Chuốt tay bàn xoay, nung củi liên tục 72h (1300°C)</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Quy chuẩn kích thước</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right">Ấm 350ml | 06 chén 50ml | Khay gốm Ø 28cm</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Đề xuất công năng</span>
                    <span className="font-body-spec text-body-spec text-accent-terracotta text-right font-medium">Thưởng trà Shan Tuyết cổ thụ, Trà ướp sen Tây Hồ</span>
                  </div>
                </div>
              </div>

              {/* Valuation & Action Zone */}
              <div className="p-space-lg bg-surface-subtle border border-border-neutral shadow-sm flex flex-col space-y-space-md">
                <div>
                  <span className="font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.15em] block mb-1">
                    Định mức chuyển nhượng di sản
                  </span>
                  <div className="flex items-baseline gap-space-sm">
                    <span className="font-headline-title text-[32px] text-text-primary font-bold tracking-tight">4.850.000 ₫</span>
                    <span className="font-spec-code text-spec-code text-accent-terracotta tracking-[0.05em] uppercase font-medium">Chế tác độc bản theo mẻ lò</span>
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
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-space-lg border-b border-border-neutral mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-[1px] bg-accent-terracotta"></span>
                <span className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold">
                  Tuyển Tập Tác Phẩm
                </span>
              </div>
              <h3 className="font-headline-title text-[26px] text-text-primary tracking-tight font-medium uppercase">
                Tác Phẩm Cùng Nghệ Nhân Nguyễn Văn Bình <span className="opacity-35 select-none font-light">|</span> Bát Tràng
              </h3>
            </div>
            <div className="mt-space-sm md:mt-0 font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
              Hồ sơ lưu trữ: 03 tác phẩm nguyên bản
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {RELATED_WORKS.map((work) => (
              <article key={work.id} className="bg-surface-crisp border border-border-neutral transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-md flex flex-col group">
                <div className="relative w-full aspect-[4/5] bg-surface-subtle overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-text-primary text-surface-crisp px-2.5 py-0.5 font-spec-code text-[10px] uppercase tracking-[0.15em]">
                    Mã: {work.code}
                  </span>
                </div>
                <div className="p-space-lg flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.1em] mb-1">
                      <span>{work.category}</span>
                      <span className="mx-2 opacity-35">|</span>
                      <span>{work.period}</span>
                    </div>
                    <h4 className="font-title-card text-title-card text-text-primary font-semibold mb-2 group-hover:text-accent-terracotta transition-colors">
                      {work.title}
                    </h4>
                    <p className="font-body-spec text-body-spec text-text-secondary line-clamp-2 leading-relaxed">
                      {work.description}
                    </p>
                  </div>
                  <div className="pt-space-md mt-space-sm border-t border-border-neutral flex items-center justify-between">
                    <span className="font-headline-title text-[18px] text-text-primary font-semibold">
                      {work.price}
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
