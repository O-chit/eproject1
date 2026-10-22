import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ArtisanDetailPopup from '../components/modals/ArtisanDetailPopup';
import VisitBookingModal from '../components/modals/VisitBookingModal';

const FALLBACK_ARTISANS = {
  1: {
    id: 1,
    ref: 'ART-BT-001',
    code: 'ART-BT-001',
    name: 'Nguyễn Văn Bình',
    title: 'Nghệ Nhân Ưu Tú • Bậc Thầy Lò Bầu',
    age: 72,
    village: 'Bát Tràng',
    province: 'Hà Nội',
    category: 'gom',
    craft_category: 'Gốm Sa Thạch Men Rạn Cổ',
    years_of_experience: 50,
    generation: 'Đời Thứ 6',
    quote: 'Đất sét phải ủ ba mùa mưa nắng, men tro nung củi gỗ dâu mới ra được đường rạn của thời gian.',
    masterwork_name: 'Bình vôi men rạn cổ thế kỷ XVIII',
    material: 'Đất sét cao lanh Trúc Thôn, tro trấu lọc nếp',
    firing_technique: 'Lò bầu nung củi nhiệt 1280°C liên tục 72 giờ',
    signature_style: 'Men rạn tam thái vẽ chỉ lam chàm thủy mặc',
    biography: 'Sinh ra trong gia đình gốm danh gia kế nghiệp 6 đời tại châu thổ sông Hồng. Trải qua hơn nửa thế kỷ gắn bó cùng lò nung củi truyền thống, ông đã phục dựng thành công nhiều kỹ pháp men rạn thất truyền từ thời Hậu Lê.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsI9aPyBln6KwNTduyuzUQsX3URliV1Lme3MJ-LRjuusu4bzRy8Pg1p4qxcQ20-bV982DIaUPJeSYINYU3RqJQr402-Fg4v9teM9X_SOYh5i4sV9_nm-K-QRB0kom3klpQBV5PHVsgpUuay47yNjVhkwP-9zcQ4vxT9Top5WXmRIElWWrk5aYrLmODShqcU1RgRAYGUCWARylylg4Sh4NR0wxLI2f7AFUlG34agHAgtokI1OJFalxJ',
    milestones: [
      { year: '1974', event: 'Tiếp quản kíp lò bầu cổ và bắt đầu nghiên cứu phục dựng bài men rạn thời Lê.' },
      { year: '1989', event: 'Phục chế thành công bài men tro vỏ sò và men tam thái thất truyền.' },
      { year: '2005', event: 'Được Nhà nước phong tặng danh hiệu Nghệ Nhân Ưu Tú ngành thủ công mỹ nghệ.' },
      { year: '2024', event: 'Hoàn thành bộ sưu tập 12 bảo vật gốm cung đình cho Bảo tàng Mỹ thuật Việt Nam.' },
    ],
  },
};

export default function ArtisanDetailPage() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        let data = null;
        if (/^\d+$/.test(id)) {
          data = await api.getArtisanById(id);
        }
        if (!data) {
          data = FALLBACK_ARTISANS[id] || FALLBACK_ARTISANS[1];
        }
        setArtisan(data);
      } catch (err) {
        console.warn('Lỗi nạp chi tiết nghệ nhân:', err);
        setArtisan(FALLBACK_ARTISANS[1]);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
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
        <Link to="/artisans" className="mt-4 px-6 py-2.5 bg-accent-terracotta text-white font-spec-code text-[11px] uppercase">
          Quay Lại Danh Sách
        </Link>
      </div>
    );
  }

  const milestones = artisan.milestones || [
    { year: '1978', event: 'Bắt đầu học nghề gia truyền từ đời tiền bối.' },
    { year: '1995', event: 'Phục dựng thành công kỹ pháp độc bản cổ truyền.' },
    { year: '2010', event: 'Được phong tặng danh hiệu Nghệ Nhân Ưu Tú.' },
    { year: '2023', event: 'Truyền thụ kỹ nghệ cho thế hệ kế thừa đời tiếp theo.' },
  ];

  return (
    <div className="w-full bg-canvas-linen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin space-y-10">
        {/* Breadcrumb có pipe delimiter */}
        <div className="font-spec-code text-[11px] uppercase tracking-widest text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-accent-terracotta">Trang Chủ</Link>
          <span className="opacity-60">|</span>
          <Link to="/artisans" className="hover:text-accent-terracotta">Nghệ Nhân</Link>
          <span className="opacity-60">|</span>
          <span className="text-accent-terracotta">{artisan.name}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-surface-crisp border border-border-neutral p-6 sm:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-stretch">
          <div className="w-full md:w-5/12 aspect-video md:aspect-auto md:min-h-[380px] relative bg-black overflow-hidden border border-border-neutral shrink-0">
            <img
              src={artisan.avatar_url || artisan.avatarUrl || artisan.image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80'}
              alt={artisan.name}
              className="w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white font-spec-code text-[11px]">
              <span className="bg-black/60 px-2 py-0.5 border border-white/20">
                REF: {artisan.ref || artisan.code || `ART-${artisan.id}`}
              </span>
              <span className="bg-accent-terracotta px-2 py-0.5">
                {artisan.years_of_experience || artisan.yearsOfExperience || 40} Năm Nghề
              </span>
            </div>
          </div>

          <div className="w-full md:w-7/12 flex flex-col justify-between space-y-5">
            <div>
              <span className="font-spec-code text-[11px] uppercase tracking-widest text-accent-terracotta font-semibold">
                HỒ SƠ BẬC THẦY DI SẢN • {artisan.village || artisan.regionName || 'Làng Nghề Truyền Thống'}
              </span>
              <h1 className="font-headline-title text-3xl sm:text-4xl text-text-primary font-bold mt-1">
                {artisan.name}
              </h1>
              <p className="font-spec-code text-[13px] text-text-secondary mt-1">
                {artisan.title || 'Nghệ Nhân Ưu Tú'} • {artisan.age || 70} Tuổi • {artisan.craft_category || artisan.specialty || 'Di Sản'}
              </p>

              <blockquote className="border-l-2 border-accent-terracotta pl-4 py-2.5 my-4 bg-surface-subtle/50 font-label-signature italic text-[14px] text-text-primary leading-relaxed">
                "{artisan.quote || 'Đất có linh hồn, lửa có tính khí. Người thợ chỉ là chiếc cầu nối giữa tinh hoa trời đất và dáng hình thế gian.'}"
              </blockquote>

              <p className="font-body-default text-[13px] text-text-secondary leading-relaxed">
                {artisan.biography || 'Nghệ nhân dành trọn đời cống hiến cho công cuộc bảo tồn và phục chế các tinh hoa thủ công truyền thống.'}
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
                  {m.event}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-surface-subtle/40">
              <span className="font-spec-code text-text-secondary uppercase">Cốt liệu chính</span>
              <span className="sm:col-span-2 font-medium text-text-primary">
                {artisan.material || 'Đất sét cao lanh Trúc Thôn, tro trấu lọc nếp'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
              <span className="font-spec-code text-text-secondary uppercase">Nhiệt độ &amp; Lò nung</span>
              <span className="sm:col-span-2 font-medium text-text-primary">
                {artisan.firing_technique || 'Lò bầu nung củi nhiệt 1280°C liên tục 72 giờ'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-surface-subtle/40">
              <span className="font-spec-code text-text-secondary uppercase">Dấu ấn độc bản</span>
              <span className="sm:col-span-2 font-medium text-text-primary">
                {artisan.signature_style || 'Men rạn tam thái vẽ chỉ lam chàm thủy mặc'}
              </span>
            </div>
          </div>
        </div>
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
