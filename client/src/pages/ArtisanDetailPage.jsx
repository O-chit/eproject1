import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ArtisanDetailPopup from '../components/modals/ArtisanDetailPopup';
import VisitBookingModal from '../components/modals/VisitBookingModal';

export default function ArtisanDetailPage() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDetail() {
      try {
        setLoading(true);
        const data = await api.getArtisanById(id);
        if (isMounted && data) {
          setArtisan(data);
        }
      } catch (err) {
        console.warn('Lỗi nạp chi tiết nghệ nhân từ DB:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (id) {
      loadDetail();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-canvas-linen">
        <span className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest animate-pulse">
          ĐANG NẠP HỒ SƠ DI SẢN NGHỆ NHÂN...
        </span>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center bg-canvas-linen p-6">
        <h3 className="font-headline-title text-xl text-text-primary">Không tìm thấy hồ sơ nghệ nhân</h3>
        <p className="font-body-default text-text-secondary text-[13px] mt-1">
          Hồ sơ có thể chưa được lưu trữ hoặc đang trong quá trình số hóa điền dã.
        </p>
        <Link to="/artisans" className="mt-4 px-6 py-2.5 bg-accent-terracotta text-white font-spec-code text-[11px] uppercase tracking-wider">
          Quay Lại Danh Sách Nghệ Nhân
        </Link>
      </div>
    );
  }

  const milestones = artisan.milestones && artisan.milestones.length > 0
    ? artisan.milestones
    : [
        { year: '1985', event: 'Tiếp quản xưởng thủ công gia truyền từ thế hệ tiền bối.' },
        { year: '1998', event: 'Phục dựng thành công kỹ pháp độc bản cổ truyền.' },
        { year: '2012', event: 'Được phong tặng danh hiệu Nghệ Nhân Di Sản Quốc Gia.' },
        { year: '2024', event: 'Truyền thụ kỹ nghệ cho thế hệ kế thừa đời tiếp theo.' },
      ];

  const specs = artisan.specs && Array.isArray(artisan.specs) ? artisan.specs : [];

  return (
    <div className="w-full bg-canvas-linen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin space-y-10">
        {/* Breadcrumb có pipe delimiter */}
        <div className="font-spec-code text-[11px] uppercase tracking-widest text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-accent-terracotta">Trang Chủ</Link>
          <span className="opacity-60">|</span>
          <Link to="/artisans" className="hover:text-accent-terracotta">Nghệ Nhân</Link>
          <span className="opacity-60">|</span>
          <span className="text-accent-terracotta">{artisan.name || artisan.fullName}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-surface-crisp border border-border-neutral p-4 sm:p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
          <div className="w-full md:w-5/12 aspect-video md:aspect-auto md:min-h-[380px] relative bg-black overflow-hidden border border-border-neutral shrink-0">
            <img
              src={artisan.avatar_url || artisan.avatarUrl || artisan.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80'}
              alt={artisan.name || artisan.fullName}
              className="w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between text-white font-spec-code text-[10px] sm:text-[11px]">
              <span className="bg-black/60 px-2 py-0.5 border border-white/20">
                REF: {artisan.ref || artisan.code || artisan.refCode || `ART-${artisan.id}`}
              </span>
              <span className="bg-accent-terracotta px-2 py-0.5">
                {artisan.years_of_experience || artisan.yearsOfExperience || 40} Năm Nghề
              </span>
            </div>
          </div>

          <div className="w-full md:w-7/12 flex flex-col justify-between space-y-4 sm:space-y-5">
            <div>
              <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-widest text-accent-terracotta font-semibold">
                HỒ SƠ BẬC THẦY DI SẢN • {artisan.village || artisan.villageName || artisan.regionName || 'Làng Nghề Truyền Thống'}
              </span>
              <h1 className="font-headline-title text-2xl sm:text-3xl md:text-4xl text-text-primary font-bold mt-1">
                {artisan.name || artisan.fullName}
              </h1>
              <p className="font-spec-code text-[12px] sm:text-[13px] text-text-secondary mt-1">
                {artisan.title || 'Nghệ Nhân Ưu Tú'} • {artisan.age || 68} Tuổi • {artisan.craft_category || artisan.specialty || 'Di Sản'}
              </p>

              <blockquote className="border-l-2 border-accent-terracotta pl-3 sm:pl-4 py-2 sm:py-2.5 my-3 sm:my-4 bg-surface-subtle/50 font-label-signature italic text-[13px] sm:text-[14px] text-text-primary leading-relaxed">
                "{artisan.quote || 'Đất có linh hồn, lửa có tính khí. Người thợ chỉ là chiếc cầu nối giữa tinh hoa trời đất và dáng hình thế gian.'}"
              </blockquote>

              <p className="font-body-default text-[12.5px] sm:text-[13px] text-text-secondary leading-relaxed">
                {artisan.biography || artisan.bio || 'Nghệ nhân dành trọn đời cống hiến cho công cuộc bảo tồn và phục chế các tinh hoa thủ công truyền thống.'}
              </p>
            </div>

            <div className="pt-4 border-t border-border-neutral flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-3.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[12px] uppercase tracking-[0.18em] transition-colors cursor-pointer shadow-sm"
              >
                ĐẶT LỊCH THĂM XƯỞNG →
              </button>
              <button
                type="button"
                onClick={() => setIsPopupOpen(true)}
                className="px-6 py-3.5 border border-border-neutral hover:border-text-primary font-spec-code text-[12px] uppercase tracking-wider text-text-primary transition-colors cursor-pointer"
              >
                Mở Popup Tư Liệu Nhanh
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Niên Biểu Mốc Son Sự Nghiệp */}
        <div className="bg-surface-crisp border border-border-neutral p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-accent-terracotta"></span>
            <h3 className="font-headline-title text-xl text-text-primary font-semibold uppercase">
              Niên Biểu Sự Nghiệp &amp; Cống Hiến Di Sản
            </h3>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-[2px] before:bg-border-neutral pl-2">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-8">
                <span className="absolute left-3 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-terracotta border-2 border-white"></span>
                <span className="font-spec-code text-[12px] text-accent-terracotta font-semibold">
                  {m.year}
                </span>
                <p className="font-body-default text-[13px] text-text-secondary mt-0.5">
                  {m.event || m.title || m.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Bảng Thông Số Kỹ Pháp Đặc Trưng */}
        <div className="bg-surface-crisp border border-border-neutral p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-accent-terracotta"></span>
            <h3 className="font-headline-title text-xl text-text-primary font-semibold uppercase">
              Kỹ Pháp Chế Tác Độc Bản
            </h3>
          </div>

          <div className="border border-border-neutral divide-y divide-border-neutral font-body-spec text-[13px]">
            {specs.length > 0 ? (
              specs.map((s, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 sm:grid-cols-3 p-3 ${
                    idx % 2 === 0 ? 'bg-surface-subtle/40' : ''
                  }`}
                >
                  <span className="font-spec-code text-text-secondary uppercase">{s.label}</span>
                  <span className="sm:col-span-2 font-medium text-text-primary">{s.value}</span>
                </div>
              ))
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-surface-subtle/40">
                  <span className="font-spec-code text-text-secondary uppercase">Kỹ pháp chủ đạo</span>
                  <span className="sm:col-span-2 font-medium text-text-primary">
                    {artisan.techniqueSummary || artisan.specialty || 'Chế tác thủ công bí truyền qua nhiều thế hệ'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                  <span className="font-spec-code text-text-secondary uppercase">Tác phẩm tiêu biểu</span>
                  <span className="sm:col-span-2 font-medium text-text-primary">
                    {artisan.signatureWork || artisan.masterwork_name || 'Bản ghi di sản tiêu biểu'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-surface-subtle/40">
                  <span className="font-spec-code text-text-secondary uppercase">Chứng nhận di sản</span>
                  <span className="sm:col-span-2 font-medium text-text-primary">
                    {artisan.verificationLabel || 'Di sản văn hóa phi vật thể quốc gia'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 4: Tác phẩm liên kết */}
        {artisan.crafts && artisan.crafts.length > 0 && (
          <div className="bg-surface-crisp border border-border-neutral p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-terracotta"></span>
                <h3 className="font-headline-title text-xl text-text-primary font-semibold uppercase">
                  Tác Phẩm Chế Tác Tiêu Biểu ({artisan.crafts.length})
                </h3>
              </div>
              <Link
                to="/crafts"
                className="font-spec-code text-[11px] text-accent-terracotta uppercase tracking-wider hover:underline"
              >
                Xem tất cả kho lưu trữ →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {artisan.crafts.map((craft) => (
                <Link
                  key={craft.id}
                  to={`/crafts/${craft.id}`}
                  className="group border border-border-neutral bg-canvas-linen p-3 hover:border-accent-terracotta transition-all flex flex-col justify-between"
                >
                  <div className="aspect-square w-full overflow-hidden bg-surface-subtle mb-3">
                    <img
                      src={craft.thumbnailUrl || craft.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80'}
                      alt={craft.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="font-spec-code text-[10px] text-accent-terracotta uppercase block mb-1">
                      {craft.region || craft.category || 'Di sản'}
                    </span>
                    <h4 className="font-title-card text-[14px] font-medium text-text-primary group-hover:text-accent-terracotta transition-colors line-clamp-2">
                      {craft.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* POPUP CHI TIẾT */}
      <ArtisanDetailPopup
        artisan={artisan}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onBookVisit={() => {
          setIsPopupOpen(false);
          setIsBookingOpen(true);
        }}
      />

      {/* MODAL ĐẶT LỊCH */}
      <VisitBookingModal
        artisan={artisan}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
