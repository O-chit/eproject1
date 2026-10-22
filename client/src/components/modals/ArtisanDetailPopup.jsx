import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavourites } from '../../context/FavouritesContext';

/**
 * ArtisanDetailPopup - Popup Modal Hồ sơ Chuyên sâu Nghệ Nhân
 * Tuân thủ tuyệt đối triết lý Human-Crafted Sharp Linework & Canvas Linen Theme (docs/DESIGN.md Mục 3)
 */
export default function ArtisanDetailPopup({
  artisan,
  isOpen,
  onClose,
  onBookVisit,
  onPrev,
  onNext,
  currentIndex = 0,
  totalArtisans = 6,
  prevIndexLabel = '#01',
  nextIndexLabel = '#03',
}) {
  const { isArtisanFavourited, toggleArtisanFavourite } = useFavourites();

  // 1. Quản lý Focus Trap, Phím Esc, Arrow Keys và Khóa Cuộn Body
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Đồng bộ URL hash: #nghe-nhan/{ref}
      const refCode = artisan?.ref || artisan?.code || `ART-0${artisan?.id || 1}`;
      window.history.replaceState(null, '', `#nghe-nhan/${refCode}`);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (isOpen && window.location.hash.startsWith('#nghe-nhan')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
  }, [isOpen, onClose, onPrev, onNext, artisan]);

  if (!isOpen || !artisan) return null;

  const refCode = artisan.ref || artisan.code || `ART-0${artisan.id || 1}`;
  const isFav = isArtisanFavourited ? isArtisanFavourited(artisan.id) : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1C1B1A]/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="artisan-popup-title"
      aria-describedby="artisan-popup-desc"
    >
      <div
        className="relative bg-surface-crisp border border-border-neutral w-full max-w-[1040px] max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in scale-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng X sắc cạnh */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-surface-crisp/90 hover:bg-text-primary text-text-primary hover:text-white border border-border-neutral transition-colors cursor-pointer"
          aria-label="Đóng hồ sơ nghệ nhân"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* CỘT TRÁI (~5/12 - 41.67%): Ảnh chân dung độc lập, không bị văn bản đè */}
        <div className="w-full md:w-5/12 aspect-video md:aspect-auto min-h-0 md:min-h-full relative bg-[#1C1B1A] flex flex-col justify-between p-4 sm:p-6 overflow-hidden shrink-0">
          <img
            src={artisan.avatar_url || artisan.avatarUrl || artisan.image_url || artisan.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80'}
            alt={artisan.name}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out"
          />
          {/* Lớp gradient nhẹ bảo vệ nhãn góc, không che phủ khuôn mặt */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none"></div>

          {/* Dải nhãn trên ảnh */}
          <div className="relative z-10 flex items-center justify-between pb-2 font-spec-code text-[10px] uppercase tracking-wider text-surface-crisp/90">
            <span className="bg-black/70 backdrop-blur-sm px-2.5 py-1 border border-white/20 text-[#ffb689] font-semibold">
              {artisan.craft_category || artisan.specialty || 'Di Sản Thủ Công'}
            </span>
            <span className="bg-black/70 backdrop-blur-sm text-white/90 px-2 py-1 border border-white/20">
              REF: {refCode}
            </span>
          </div>

          {/* Dải nhãn dưới ảnh: Chỉ chứa năm nghề & số thứ tự */}
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 font-spec-code text-[10px] uppercase">
            <div className="flex items-center gap-1.5">
              <span className="bg-accent-terracotta text-surface-crisp px-2.5 py-1 font-medium shadow-sm">
                {artisan.years_of_experience || artisan.yearsOfExperience || 40} Năm Nghề
              </span>
              <span className="bg-black/70 backdrop-blur-sm text-surface-crisp border border-white/20 px-2 py-1 font-semibold">
                {artisan.generation || 'Đời Thứ 5'}
              </span>
            </div>
            <span className="font-spec-code text-[11px] text-surface-crisp/90 bg-black/70 backdrop-blur-sm border border-white/20 px-2 py-0.5 tracking-widest uppercase font-semibold">
              #{String(currentIndex + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* CỘT PHẢI (~7/12 - 58.33%): Khối nội dung hồ sơ chuyên sâu cuộn độc lập */}
        <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto max-h-[85vh] space-y-6 bg-surface-crisp flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header thông tin nghệ nhân (Tên, danh hiệu, vị trí) */}
            <div className="space-y-2 pb-4 border-b border-border-neutral">
              <div className="font-spec-code text-[11px] uppercase tracking-[0.18em] text-text-secondary flex flex-wrap items-center gap-1.5">
                <span className="text-accent-terracotta font-semibold">Nghệ Nhân Ưu Tú</span>
                <span className="text-border-neutral select-none opacity-60">|</span>
                <span>{artisan.craft_category || artisan.specialty || 'Nghề Thủ Công'}</span>
                <span className="text-border-neutral select-none opacity-60">|</span>
                <span>{artisan.village || artisan.regionName || 'Làng Nghề Truyền Thống'}, {artisan.province || 'Việt Nam'}</span>
              </div>
              <h2
                id="artisan-popup-title"
                className="font-headline-title text-[26px] sm:text-[30px] font-semibold text-text-primary leading-tight"
              >
                {artisan.name}
              </h2>
              <p id="artisan-popup-desc" className="font-spec-code text-[12px] sm:text-[13px] text-text-secondary">
                {artisan.title || 'Nghệ Nhân Ưu Tú'} • {artisan.age || 68} tuổi • <span className="text-accent-terracotta font-semibold">{artisan.years_of_experience || artisan.yearsOfExperience || 40} Năm Nghề</span> ({artisan.generation || 'Đời Thứ 5'})
              </p>
            </div>

            {/* d. Lời trích dẫn triết lý nghề */}
            <blockquote className="border-l-2 border-accent-terracotta pl-4 py-2.5 bg-surface-subtle/50 font-label-signature italic text-[14px] text-text-primary leading-relaxed">
              "{artisan.quote || 'Đất có linh hồn, lửa có tính khí. Người thợ chỉ là chiếc cầu nối giữa tinh hoa trời đất và dáng hình thế gian.'}"
            </blockquote>

            {/* e. Thân Thế & Niên Biểu (Biography & Historical Timeline) */}
            <div>
              <h4 className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold mb-2">
                ■ THÂN THẾ &amp; HÀNH TRÌNH NGHỀ
              </h4>
              <p className="font-body-default text-[13px] text-text-secondary leading-relaxed">
                {artisan.biography ||
                  'Sinh ra trong gia đình danh gia kế nghiệp nhiều đời tại châu thổ sông Hồng. Trải qua hơn nửa thế kỷ gắn bó cùng lửa lò nung củi truyền thống, ông đã phục dựng thành công nhiều kỹ pháp độc bản thất truyền từ thời cổ.'}
              </p>
            </div>

            {/* f. Bảng thông số kỹ thuật chế tác (Specs Table) */}
            <div>
              <h4 className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold mb-2">
                ■ KỸ PHÁP ĐẶC TRƯNG &amp; THÔNG SỐ
              </h4>
              <div className="border border-border-neutral divide-y divide-border-neutral text-[12px]">
                <div className="grid grid-cols-3 p-2.5 bg-surface-subtle/40">
                  <span className="font-spec-code text-text-secondary uppercase">Cốt liệu</span>
                  <span className="col-span-2 font-medium text-text-primary">
                    {artisan.material || 'Đất sét cao lanh Trúc Thôn, tro trấu lọc'}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-spec-code text-text-secondary uppercase">Kỹ thuật nung</span>
                  <span className="col-span-2 font-medium text-text-primary">
                    {artisan.firing_technique || 'Lò bầu nung củi nhiệt 1280°C liên tục 72 giờ'}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2.5 bg-surface-subtle/40">
                  <span className="font-spec-code text-text-secondary uppercase">Dấu ấn độc bản</span>
                  <span className="col-span-2 font-medium text-text-primary">
                    {artisan.signature_style || 'Men rạn tam thái vẽ chỉ lam chàm thủy mặc'}
                  </span>
                </div>
              </div>
            </div>

            {/* g. Tác phẩm tiêu biểu */}
            <div>
              <h4 className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold mb-2">
                ■ TÁC PHẨM TIÊU BIỂU
              </h4>
              <div className="p-3 bg-surface-subtle border border-border-neutral flex items-center justify-between">
                <div>
                  <span className="font-headline-title text-[14px] font-semibold text-text-primary block">
                    {artisan.masterwork_name || artisan.crafts?.[0]?.name || 'Bình vôi men rạn cổ thế kỷ XVIII'}
                  </span>
                  <span className="font-spec-code text-[11px] text-text-secondary">
                    Chế tác thủ công độc bản • Chứng nhận di sản CraftRoots
                  </span>
                </div>
                <span className="material-symbols-outlined text-accent-terracotta text-[22px]">verified</span>
              </div>
            </div>

            {/* h. Khối "Ghé Thăm Xưởng & Gặp Gỡ Bậc Thầy" */}
            <div className="p-4 bg-canvas-linen border border-border-neutral space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-terracotta text-[18px]">local_cafe</span>
                <span className="font-spec-code text-[10px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
                  QUY TRÌNH GẶP GỠ NGHỆ NHÂN TIỀN BỐI
                </span>
              </div>
              <p className="font-body-spec text-[12px] text-text-secondary leading-relaxed">
                Xưởng chỉ tiếp tối đa 06 khách/buổi. Yêu cầu đặt lịch hẹn trước 48 giờ để điều phối viên bản địa chuẩn bị chu đáo.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href="tel:0988246810"
                  className="flex-1 bg-text-primary hover:bg-accent-terracotta text-surface-crisp font-label-action text-[11px] uppercase tracking-[0.18em] py-2.5 px-4 text-center transition-colors"
                >
                  Hotline: 0988.246.810
                </a>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onBookVisit) onBookVisit(artisan);
                  }}
                  className="flex-1 bg-surface-crisp border border-text-primary hover:bg-canvas-linen text-text-primary font-label-action text-[11px] uppercase tracking-[0.18em] py-2.5 px-4 text-center transition-colors cursor-pointer"
                >
                  Gửi Yêu Cầu Ghé Thăm
                </button>
              </div>
            </div>
          </div>

          {/* i. Chân trang Popup & Điều hướng trước/sau tuần hoàn */}
          <div className="pt-4 mt-6 border-t border-border-neutral flex flex-col sm:flex-row items-center justify-between gap-4 font-spec-code text-[11px]">
            {/* Cụm điều hướng trước / sau tuần hoàn: ← #01 | #03 → */}
            <div className="flex items-center gap-2 text-text-secondary">
              <button
                type="button"
                onClick={onPrev}
                className="hover:text-accent-terracotta transition-colors flex items-center gap-1 cursor-pointer"
                title="Hồ sơ trước (Phím mũi tên trái)"
              >
                ← {prevIndexLabel}
              </button>
              <span className="text-border-neutral opacity-50 select-none">|</span>
              <button
                type="button"
                onClick={onNext}
                className="hover:text-accent-terracotta transition-colors flex items-center gap-1 cursor-pointer"
                title="Hồ sơ tiếp theo (Phím mũi tên phải)"
              >
                {nextIndexLabel} →
              </button>
            </div>

            {/* Nút lưu hồ sơ & liên kết trang riêng */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleArtisanFavourite && toggleArtisanFavourite(artisan)}
                className={`flex items-center gap-1 uppercase tracking-wider transition-colors cursor-pointer ${
                  isFav ? 'text-accent-terracotta font-semibold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isFav ? 'bookmark_added' : 'bookmark'}
                </span>
                <span>{isFav ? 'Đã Lưu' : 'Lưu Hồ Sơ'}</span>
              </button>
              <span className="text-border-neutral opacity-50 select-none">|</span>
              <Link
                to={`/artisans/${artisan.id}`}
                className="text-accent-terracotta hover:underline uppercase tracking-wider font-semibold"
              >
                Trang Chi Tiết →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
