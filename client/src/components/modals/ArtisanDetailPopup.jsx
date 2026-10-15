import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * ArtisanDetailPopup - Popup Modal Hồ sơ Chuyên sâu Nghệ Nhân
 * Tuân thủ tuyệt đối triết lý Human-Crafted Sharp Linework & Canvas Linen Theme
 */
export default function ArtisanDetailPopup({ artisan, isOpen, onClose, onBookVisit }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !artisan) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1C1B1A]/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-surface-crisp border border-border-neutral w-full max-w-[1040px] max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-surface-crisp/90 hover:bg-text-primary text-text-primary hover:text-white border border-border-neutral transition-colors cursor-pointer"
          aria-label="Đóng hồ sơ nghệ nhân"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* CỘT TRÁI: Ảnh chân dung & Thẻ nhận diện di sản */}
        <div className="md:w-5/12 relative bg-[#1C1B1A] min-h-[260px] md:min-h-full flex flex-col justify-end p-6 overflow-hidden">
          <img
            src={artisan.avatar_url || artisan.image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80'}
            alt={artisan.name}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>

          <div className="relative z-10 text-white">
            <span className="font-spec-code text-[11px] tracking-[0.2em] uppercase text-accent-terracotta font-semibold">
              REF: {artisan.code || `ART-${artisan.id}`}
            </span>
            <h3 className="font-headline-title text-[22px] md:text-[26px] font-bold text-white mt-1 leading-tight">
              {artisan.name}
            </h3>
            <p className="font-spec-code text-[12px] text-gray-300 mt-1">
              {artisan.title || 'Nghệ Nhân Ưu Tú'} • {artisan.age || 68} Tuổi
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-accent-terracotta text-white font-spec-code text-[10px] uppercase px-2 py-0.5 tracking-wider font-semibold">
                {artisan.experience_years ? `${artisan.experience_years} Năm Nghề` : '50 Năm Nghề'}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white font-spec-code text-[10px] uppercase px-2 py-0.5 tracking-wider">
                {artisan.generation || 'Đời Thứ 5'}
              </span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Hồ sơ tư liệu điền dã chuyên sâu */}
        <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto max-h-[85vh] space-y-6 bg-surface-crisp">
          {/* Breadcrumb */}
          <div className="font-spec-code text-[11px] uppercase tracking-[0.18em] text-text-secondary flex items-center gap-2">
            <span>DI SẢN NGHỆ NHÂN</span>
            <span>|</span>
            <span className="text-accent-terracotta">{artisan.craft_category || 'Gốm Sứ Men Rạn'}</span>
            <span>|</span>
            <span>{artisan.province || 'Hà Nội'}</span>
          </div>

          {/* Triết lý nghề */}
          <blockquote className="border-l-2 border-accent-terracotta pl-4 py-2 bg-surface-subtle/50 font-label-signature italic text-[14px] text-text-primary leading-relaxed">
            "{artisan.quote || 'Đất có linh hồn, lửa có tính khí. Người thợ chỉ là chiếc cầu nối giữa tinh hoa trời đất và dáng hình thế gian.'}"
          </blockquote>

          {/* Tiểu sử */}
          <div>
            <h4 className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold mb-2">
              ■ THÂN THẾ &amp; HÀNH TRÌNH NGHỀ
            </h4>
            <p className="font-body-default text-[13px] text-text-secondary leading-relaxed">
              {artisan.biography ||
                'Sinh ra trong gia đình gốm danh gia kế nghiệp nhiều đời tại châu thổ sông Hồng. Trải qua hơn nửa thế kỷ gắn bó cùng lò nung củi truyền thống, ông đã phục dựng thành công nhiều kỹ pháp men rạn thất truyền từ thời Hậu Lê.'}
            </p>
          </div>

          {/* Bảng thông số kỹ pháp */}
          <div>
            <h4 className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold mb-2">
              ■ KỸ PHÁP ĐẶC TRƯNG &amp; THÔNG SỐ
            </h4>
            <div className="border border-border-neutral divide-y divide-border-neutral text-[12px]">
              <div className="grid grid-cols-3 p-2.5 bg-surface-subtle/40">
                <span className="font-spec-code text-text-secondary uppercase">Cốt liệu</span>
                <span className="col-span-2 font-medium text-text-primary">{artisan.material || 'Đất sét cao lanh Trúc Thôn, tro trấu lọc'}</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="font-spec-code text-text-secondary uppercase">Kỹ thuật nung</span>
                <span className="col-span-2 font-medium text-text-primary">{artisan.firing_technique || 'Lò bầu nung củi nhiệt 1280°C liên tục 72 giờ'}</span>
              </div>
              <div className="grid grid-cols-3 p-2.5 bg-surface-subtle/40">
                <span className="font-spec-code text-text-secondary uppercase">Dấu ấn độc bản</span>
                <span className="col-span-2 font-medium text-text-primary">{artisan.signature_style || 'Men rạn tam thái vẽ chỉ lam chàm thủy mặc'}</span>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="pt-4 border-t border-border-neutral flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onBookVisit) onBookVisit(artisan);
              }}
              className="flex-1 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[12px] uppercase tracking-[0.18em] py-3 text-center transition-colors shadow-sm cursor-pointer"
            >
              ĐẶT LỊCH ĐÀM ĐẠO TRÀ &amp; THĂM XƯỞNG →
            </button>
            <Link
              to={`/artisans/${artisan.id}`}
              className="px-5 py-3 border border-border-neutral hover:border-text-primary font-spec-code text-[12px] text-text-primary uppercase tracking-wider text-center transition-colors"
            >
              Xem Trang Riêng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
