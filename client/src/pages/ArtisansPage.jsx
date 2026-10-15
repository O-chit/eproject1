import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const DEFAULT_MASTERWORKS = [
  {
    id: 1,
    year: '2024',
    ref: 'CR-ART-01',
    tag: 'Gốm Cổ Phục Chế • Men Rạn Cung Đình',
    name: 'Bình Hút Lộc Men Lam Cổ Dát Vàng',
    description: 'Chế tác từ đất sét cao lanh sông Hồng, vẽ men lam thủy mặc và dát vàng quỳ 24K cung đình.',
    height: '42 cm | Độc bản',
    status: 'Bản ghi di sản CraftRoots',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
  },
];

export default function ArtisansPage() {
  const { id } = useParams();
  const [artisansList, setArtisansList] = useState([]);
  const [selectedId, setSelectedId] = useState(id || 1);
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBioModal, setShowBioModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingNote, setBookingNote] = useState('');

  // 1. Nạp danh sách tất cả nghệ nhân từ DB
  useEffect(() => {
    async function loadArtisans() {
      try {
        const list = await api.getArtisans();
        if (Array.isArray(list) && list.length > 0) {
          setArtisansList(list);
          if (!id) {
            setSelectedId(list[0].id);
          } else {
            setSelectedId(id);
          }
        }
      } catch (err) {
        console.warn('Lỗi nạp danh sách nghệ nhân từ DB:', err.message);
      }
    }
    loadArtisans();
  }, [id]);

  // 2. Nạp chi tiết nghệ nhân được chọn (kèm tác phẩm N-N)
  useEffect(() => {
    let isMounted = true;
    async function loadArtisanDetail() {
      try {
        setLoading(true);
        const detail = await api.getArtisanById(selectedId);
        if (isMounted && detail) {
          setArtisan(detail);
        }
      } catch (err) {
        console.warn('Lỗi nạp chi tiết nghệ nhân từ DB:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (selectedId) {
      loadArtisanDetail();
    }
    return () => { isMounted = false; };
  }, [selectedId]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitContact({
        fullName: bookingName || 'Khách viếng thăm',
        email: bookingEmail || 'khach@example.com',
        phone: bookingPhone || '',
        subject: `Hẹn gặp nghệ nhân: ${artisan?.name || 'Làng nghề'}`,
        message: bookingNote || `Đăng ký đến thăm xưởng và giao lưu cùng nghệ nhân ${artisan?.name}`,
      });
      setFormSubmitted(true);
      setBookingName('');
      setBookingPhone('');
      setBookingEmail('');
      setBookingNote('');
      setTimeout(() => setFormSubmitted(false), 6000);
    } catch {
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 4000);
    }
  };

  const works = (artisan?.crafts && artisan.crafts.length > 0)
    ? artisan.crafts.map((c) => ({
        id: c.id,
        year: 'Di sản',
        ref: c.slug || `CR-0${c.id}`,
        tag: c.category || 'Mỹ Nghệ Truyền Thống',
        name: c.name,
        description: c.shortDescription || c.description || 'Chế tác thủ công theo quy chuẩn di sản.',
        height: 'Nguyên bản làng nghề',
        status: c.isFeatured ? 'Tác Phẩm Đặc Sắc' : 'Lưu trữ di sản',
        image: c.thumbnailUrl || c.image || DEFAULT_MASTERWORKS[0].image,
      }))
    : DEFAULT_MASTERWORKS;

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Thanh lựa chọn danh mục nghệ nhân từ CSDL */}
      <section className="w-full bg-surface-subtle border-b border-border-neutral py-3">
        <div className="max-w-7xl mx-auto px-margin flex items-center justify-between overflow-x-auto no-scrollbar gap-4 text-spec-code font-spec-code">
          <span className="uppercase tracking-[0.14em] text-accent-terracotta font-semibold whitespace-nowrap">
            NGHỆ NHÂN TRUYỀN THỪA ({artisansList.length}):
          </span>
          <div className="flex items-center gap-2 whitespace-nowrap">
            {artisansList.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer border ${
                  Number(selectedId) === Number(a.id)
                    ? 'bg-text-primary text-surface-crisp border-text-primary font-semibold'
                    : 'bg-surface-crisp text-text-secondary border-border-neutral hover:border-accent-terracotta'
                }`}
              >
                {a.name} ({a.title?.split(' ')?.[1] || 'NN'})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: MASTER ARTISAN HERO PROFILE */}
      <section className="w-full px-margin py-space-xl bg-canvas-linen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
          
          {/* Portrait Column */}
          <div className="lg:col-span-5 relative group overflow-hidden bg-surface-container shadow-md border border-border-neutral">
            <div className="w-full h-full min-h-[520px] lg:min-h-[640px] relative">
              <img
                className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                src={artisan?.avatarUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"}
                alt={artisan?.name || "Nghệ nhân"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-surface-crisp">
                <div>
                  <p className="font-spec-code text-[11px] tracking-[0.2em] uppercase text-surface-variant/90">
                    Chân Dung Nghệ Nhân
                  </p>
                  <p className="font-headline-title text-title-card text-surface-crisp">
                    {artisan?.regionName || 'Làng Nghề Truyền Thống'}
                  </p>
                </div>
                <div className="font-spec-code text-[10px] tracking-widest text-primary-fixed uppercase px-2.5 py-1 bg-surface-crisp/10 backdrop-blur-md border border-surface-crisp/20">
                  {artisan?.yearsOfExperience || 40} Năm Nghề
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-7 flex flex-col justify-between p-space-lg lg:p-space-xl bg-surface-crisp border border-border-neutral shadow-sm">
            <div className="space-y-space-md">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-accent-terracotta inline-block"></span>
                <span className="font-label-action text-label-action tracking-[0.25em] text-accent-terracotta uppercase font-semibold">
                  HỒ SƠ {artisan?.title ? artisan.title.toUpperCase() : 'NGHỆ NHÂN ƯU TÚ'} | DI SẢN QUỐC GIA
                </span>
              </div>

              <div>
                <h1 className="font-display-hero text-display-hero uppercase tracking-[0.18em] text-text-primary leading-tight">
                  {artisan?.name || 'NGHỆ NHÂN TRUYỀN THỐNG'}
                </h1>
                <div className="mt-space-xs flex flex-wrap items-center font-spec-code text-spec-code text-text-secondary gap-y-1">
                  <span className="text-text-primary font-semibold">{artisan?.yearsOfExperience || 45} Năm Kinh Nghiệm</span>
                  <span className="mx-3 opacity-30">|</span>
                  <span>{artisan?.specialty || 'Phục chế di sản thủ công tinh hoa'}</span>
                  <span className="mx-3 opacity-30">|</span>
                  <span className="text-accent-terracotta font-medium">{artisan?.regionName || 'Việt Nam'}</span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-border-neutral"></div>

              <p className="font-body-default text-body-default text-text-primary leading-relaxed text-justify">
                {artisan?.biography || 'Bậc thầy lưu giữ hồn cốt di sản nghề truyền thống, cống hiến trọn cuộc đời cho việc bảo tồn và phục chế những nét tinh hoa văn hóa đất Việt.'}
              </p>

              <div className="bg-surface-subtle p-space-md my-space-md border-l-2 border-accent-terracotta">
                <p className="font-label-signature text-label-signature italic text-text-secondary leading-snug">
                  “Lửa lò bầu như tâm can người thợ. Nóng vội một khắc là hỏng một mùa gốm, giữ được nhịp thở đều thì đất vô tri mới kết tinh thành hồn cốt nước non.”
                </p>
                <div className="mt-2 text-right font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">
                  — Bút ký lò nung tháng 11/1987
                </div>
              </div>
            </div>

            <div className="pt-space-md">
              <div className="grid grid-cols-3 gap-space-sm bg-surface-container-low p-space-md mb-space-md border border-border-neutral">
                <div className="flex flex-col">
                  <span className="font-headline-title text-headline-title text-primary tracking-tight font-bold">50+</span>
                  <span className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mt-1">Năm Kinh Nghiệm</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-title text-headline-title text-accent-terracotta tracking-tight font-bold">120+</span>
                  <span className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mt-1">Tác Phẩm Phục Dựng</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-title text-headline-title text-tertiary tracking-tight font-bold">03</span>
                  <span className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mt-1">Triển Lãm Quốc Tế</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-space-md">
                <a
                  href="#dat-lich"
                  className="inline-flex items-center justify-center bg-text-primary text-surface-crisp font-label-action text-label-action uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-accent-terracotta transition-colors shadow-sm cursor-pointer"
                >
                  Đăng Ký Đàm Đạo Trà &amp; Xem Mẻ Lò
                </a>
                <button
                  type="button"
                  onClick={() => setShowBioModal(true)}
                  className="inline-flex items-center gap-2 text-text-primary hover:text-accent-terracotta font-label-action text-label-action uppercase tracking-[0.15em] py-3.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                  <span>Niên Biểu Cuộc Đời</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: MASTERWORKS COLLECTION */}
      <section className="w-full px-margin py-space-xl bg-surface-container-low border-y border-border-neutral">
        <div className="max-w-7xl mx-auto space-y-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm pb-space-sm border-b border-border-neutral">
            <div>
              <div className="flex items-center gap-2 mb-space-xs">
                <span className="font-spec-code text-spec-code uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
                  Tác Phẩm Tiêu Biểu
                </span>
                <span className="opacity-40">/</span>
                <span className="font-spec-code text-spec-code uppercase tracking-wider text-text-secondary">
                  Kỹ Thuật Men Tro Lò Củi
                </span>
              </div>
              <h2 className="font-headline-title text-headline-title text-text-primary tracking-wide uppercase">
                BỘ SƯU TẬP TÁC PHẨM ĐỘC BẢN
              </h2>
            </div>
            <p className="font-body-spec text-body-spec text-text-secondary max-w-md text-left md:text-right">
              Mỗi hiện vật đại diện cho một dấu mốc phục chế công thức bùn sông Hồng kết hợp tro rơm nếp, nung nhiệt 1280°C liên tục 72 giờ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {works.map((work) => (
              <article key={work.id} className="group bg-surface-crisp border border-border-neutral shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
                <div className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    src={work.image}
                    alt={work.name}
                  />
                  <div className="absolute top-4 left-4 bg-text-primary text-surface-crisp font-spec-code text-[11px] uppercase tracking-widest px-2.5 py-1">
                    NĂM CHẾ TÁC: {work.year}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-surface-crisp/90 backdrop-blur-sm text-text-primary font-spec-code text-[10px] uppercase px-2 py-0.5 border border-border-neutral">
                    Ref: {work.ref}
                  </div>
                </div>

                <div className="p-space-lg flex flex-col flex-1 justify-between space-y-space-md">
                  <div>
                    <div className="font-spec-code text-spec-code uppercase tracking-wider text-accent-terracotta mb-1">
                      {work.tag}
                    </div>
                    <h3 className="font-title-card text-title-card text-text-primary group-hover:text-accent-terracotta transition-colors leading-snug">
                      {work.name}
                    </h3>
                    <p className="font-body-spec text-body-spec text-text-secondary mt-space-xs leading-relaxed">
                      {work.description}
                    </p>
                  </div>

                  <div className="pt-space-sm space-y-2 border-t border-border-neutral">
                    <div className="flex justify-between items-center text-body-spec font-spec-code text-[12px] text-text-secondary">
                      <span>Quy cách:</span>
                      <span className="text-text-primary font-semibold">{work.height}</span>
                    </div>
                    <div className="pt-space-xs flex items-center justify-between">
                      <span className="font-spec-code text-[11px] text-tertiary tracking-wider uppercase font-semibold">
                        {work.status}
                      </span>
                      <Link
                        to={`/crafts/${work.id}`}
                        className="font-label-action text-label-action uppercase tracking-widest text-text-primary hover:text-accent-terracotta transition-colors flex items-center gap-1 font-semibold"
                      >
                        HỒ SƠ <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: STUDIO VISIT & APPOINTMENT RESERVATION */}
      <section className="w-full px-margin py-space-xl bg-canvas-linen" id="dat-lich">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-crisp border border-border-neutral shadow-md grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            
            {/* Studio Info Left Panel */}
            <div className="lg:col-span-7 p-space-lg lg:p-space-xl flex flex-col justify-between space-y-space-md">
              <div className="space-y-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-terracotta text-[20px]">explore</span>
                  <span className="font-label-action text-label-action uppercase tracking-[0.25em] text-accent-terracotta font-semibold">
                    KHÔNG GIAN LÒ GỐM THỰC ĐỊA
                  </span>
                </div>
                <h2 className="font-headline-title text-headline-title uppercase tracking-wide text-text-primary">
                  ĐẾN THĂM XƯỞNG GỐM &amp; GẶP GỠ NGHỆ NHÂN
                </h2>
                <p className="font-body-default text-body-default text-text-secondary leading-relaxed">
                  Xưởng gốm của Nghệ nhân Nguyễn Văn Bình là một trong số rất ít xưởng gia tộc tại Bát Tràng còn lưu giữ hệ thống lò bầu cổ 5 bầu nung củi. Quý khách ghé thăm được thưởng trà thái nguyên nấu nước mưa giếng cổ, nghe chuyện làng nghề và trực tiếp quan sát giai đoạn kéo gốm tay truyền thống.
                </p>
              </div>

              <div className="space-y-space-sm bg-surface-container-low p-space-md border border-border-neutral">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">location_on</span>
                  <div>
                    <p className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">Địa Chỉ Xưởng Thực Địa</p>
                    <p className="font-body-default text-body-default text-text-primary font-medium">
                      Xưởng Gốm Bình Gốm, Xóm 1 Làng Cổ Bát Tràng, Gia Lâm, Hà Nội
                    </p>
                    <p className="font-spec-code text-[11px] text-text-secondary mt-0.5">
                      Tọa độ: 20°58'42.1"N 105°54'51.2"E • Bến gốm Cổ Giang
                    </p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-border-neutral"></div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent-terracotta text-[20px] mt-0.5">schedule</span>
                  <div>
                    <p className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">Thời Gian Tiếp Khách &amp; Đàm Đạo</p>
                    <p className="font-body-default text-body-default text-text-primary font-medium">
                      Thứ Ba — Chủ Nhật | 08:30 — 17:00
                    </p>
                    <p className="font-spec-code text-[11px] text-accent-terracotta mt-0.5">
                      (Vui lòng đặt hẹn trước tối thiểu 24h để đảm bảo nghệ nhân có mặt tại xưởng)
                    </p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-border-neutral"></div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">verified_user</span>
                  <div>
                    <p className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">Nghi Thức Đón Tiếp</p>
                    <p className="font-body-spec text-body-spec text-text-secondary">
                      Tối đa 6 khách mỗi lượt trà để đảm bảo không gian yên tĩnh và trải nghiệm trò chuyện sâu sắc cùng Nghệ nhân.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Form Right Panel */}
            <div className="lg:col-span-5 bg-surface-subtle p-space-lg lg:p-space-xl flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border-neutral">
              <form className="space-y-space-md" onSubmit={handleBookingSubmit}>
                <div>
                  <span className="font-label-action text-label-action uppercase tracking-[0.2em] text-text-primary font-semibold block mb-1">
                    PHIẾU ĐẶT HẸN ĐÀM ĐẠO TRÀ
                  </span>
                  <p className="font-body-spec text-body-spec text-text-secondary">
                    Điền thông tin để chúng tôi chuẩn bị trà ấm và điều phối thời gian tiếp đón của Nghệ nhân {artisan?.name || 'làng nghề'}.
                  </p>
                </div>

                <div className="space-y-space-sm">
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Họ và tên khách quý *</label>
                    <input
                      className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral"
                      placeholder="Nguyễn Hoàng Nam"
                      required
                      type="text"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Số điện thoại liên lạc *</label>
                    <input
                      className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral"
                      placeholder="0912 345 678"
                      required
                      type="tel"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div>
                      <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Ngày mong muốn *</label>
                      <input className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral" required type="date" />
                    </div>
                    <div>
                      <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Khung giờ tiếp *</label>
                      <select className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral">
                        <option>Sáng: 09:30 - 11:30</option>
                        <option>Chiều: 14:00 - 16:00</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Mục đích chuyến thăm</label>
                    <select
                      className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral"
                      value={bookingNote}
                      onChange={(e) => setBookingNote(e.target.value)}
                    >
                      <option value="Đàm đạo trà & Tìm hiểu kỹ thuật men rạn cổ">Đàm đạo trà &amp; Tìm hiểu kỹ thuật men rạn cổ</option>
                      <option value="Quan sát chu kỳ dỡ lò nung củi">Quan sát chu kỳ dỡ lò nung củi</option>
                      <option value="Đặt chế tác tác phẩm gia bảo độc bản">Đặt chế tác tác phẩm gia bảo độc bản</option>
                      <option value="Nghiên cứu học thuật dân tộc học / mỹ thuật">Nghiên cứu học thuật dân tộc học / mỹ thuật</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-text-primary hover:bg-accent-terracotta text-surface-crisp font-label-action text-label-action uppercase tracking-[0.2em] py-4 transition-colors text-center shadow-md cursor-pointer" type="submit">
                  ĐẶT LỊCH ĐÀM ĐẠO TRÀ &amp; XEM MẺ LÒ →
                </button>

                {formSubmitted && (
                  <div className="p-3 bg-surface-crisp border border-accent-terracotta text-accent-terracotta text-center font-body-spec text-[13px]">
                    CraftRoots đã tiếp nhận yêu cầu đàm đạo cùng Nghệ nhân {artisan?.name || 'làng nghề'}. Ban thư ký di sản sẽ liên lạc xác nhận lịch trong vòng 4 giờ.
                  </div>
                )}
              </form>

              <div className="mt-space-md pt-space-sm flex items-center justify-between font-spec-code text-[11px] text-text-secondary border-t border-border-neutral">
                <span>Chứng thực: Hiệp hội Làng nghề VN</span>
                <span>Miễn phí vé vào cửa di sản</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MODAL: NIÊN BIỂU NGHỆ NHÂN */}
      {showBioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-text-primary/60 backdrop-blur-sm"
            onClick={() => setShowBioModal(false)}
          ></div>
          <div className="bg-surface-crisp border border-border-neutral p-space-lg shadow-2xl relative max-h-[85vh] max-w-2xl w-full overflow-y-auto z-10">
            <div className="flex justify-between items-start pb-space-sm border-b border-border-neutral">
              <div>
                <span className="font-spec-code text-[11px] uppercase tracking-widest text-accent-terracotta">HỒ SƠ TƯ LIỆU HÓA</span>
                <h3 className="font-headline-title text-headline-title text-text-primary uppercase mt-1">
                  Niên Biểu Nghệ Nhân Nguyễn Văn Bình
                </h3>
              </div>
              <button
                type="button"
                className="p-1 text-text-secondary hover:text-text-primary cursor-pointer"
                onClick={() => setShowBioModal(false)}
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="py-space-md space-y-space-md relative before:absolute before:inset-0 before:left-3 before:w-[2px] before:bg-border-neutral">
              <div className="relative pl-8">
                <span className="absolute left-3 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-terracotta"></span>
                <span className="font-spec-code text-[12px] text-accent-terracotta font-semibold">1952</span>
                <h4 className="font-title-card text-title-card text-text-primary font-medium">Chào đời tại Bát Tràng</h4>
                <p className="font-body-spec text-body-spec text-text-secondary mt-1">
                  Sinh ra trong gia đình gốm danh gia họ Nguyễn, đời thứ năm tiếp nối nghề nhào nặn đất sét bên dòng Hồng Hà.
                </p>
              </div>

              <div className="relative pl-8">
                <span className="absolute left-3 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-text-primary"></span>
                <span className="font-spec-code text-[12px] text-text-primary font-semibold">1974</span>
                <h4 className="font-title-card text-title-card text-text-primary font-medium">Trở thành Trưởng kíp lò Hợp tác xã Hợp Thành</h4>
                <p className="font-body-spec text-body-spec text-text-secondary mt-1">
                  Chỉ huy kỹ thuật nung củi các sản phẩm gốm mộc xuất khẩu đi Đông Âu.
                </p>
              </div>

              <div className="relative pl-8">
                <span className="absolute left-3 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-terracotta"></span>
                <span className="font-spec-code text-[12px] text-accent-terracotta font-semibold">1995</span>
                <h4 className="font-title-card text-title-card text-text-primary font-medium">Phục dựng thành công Men Rạn Hậu Lê</h4>
                <p className="font-body-spec text-body-spec text-text-secondary mt-1">
                  Sau 12 năm điền dã và giải mã mảnh gốm cổ khai quật từ Hoàng thành Thăng Long.
                </p>
              </div>

              <div className="relative pl-8">
                <span className="absolute left-3 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-text-primary"></span>
                <span className="font-spec-code text-[12px] text-text-primary font-semibold">2010</span>
                <h4 className="font-title-card text-title-card text-text-primary font-medium">Phong tặng danh hiệu Nghệ Nhân Ưu Tú</h4>
                <p className="font-body-spec text-body-spec text-text-secondary mt-1">
                  Được Chủ tịch nước trao tặng danh hiệu cao quý vì sự nghiệp bảo tồn di sản gốm Việt.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
