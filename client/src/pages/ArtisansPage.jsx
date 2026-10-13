import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MASTERWORKS = [
  {
    id: 1,
    year: '2021',
    ref: 'NVB-2021-01',
    tag: 'Gốm Cổ Phục Chế • Men Rạn Hậu Lê',
    name: 'Bình Vôi Men Rạn Họa Tiết Mây Cuộn',
    description: 'Được đắp nổi thủ công chi tiết nghê vờn ngọc và mây cuộn cổ truyền. Men tro rơm nung bằng gỗ nghiến cho mạng rạn rễ tre sắc sảo màu cánh gián.',
    height: '42 cm',
    status: 'Hiện trạng: Sưu tập cá nhân',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR60-ZpfXIwFHNpnO-pJ2uEKkYBsVI65Mqk5RG5BXfbRQPPEaDOjG5Da77X9XTxl86hy--e3V1a3rg2xg4doXOgoFJV9znih8IjXXTwCdAzxlRW2ERihSz5PSCbgTWu7WfTz5-3-Nw0j8q0OvmMjBTtAm-HVCMMXUBHFiYGY4ArOOE7f353lKM6gO61KdF1eEublsluggeiz4CJNhBeCYEPi6xVigP7kYQ9Yacr9c',
  },
  {
    id: 2,
    year: '2023',
    ref: 'NVB-2023-04',
    tag: 'Trà Đạo Di Sản • Men Hỏa Biến',
    name: 'Bộ Ấm Chén Cổ Ngũ Hành Tương Sinh',
    description: 'Nung củi không kiểm soát nhân tạo, để ngọn lửa tự do vẽ nên các vệt oxit khoáng tự nhiên. Gồm 1 ấm thếp, 1 chuyên trà và 5 chén quân tượng trưng Kim - Mộc - Thủy - Hỏa - Thổ.',
    height: '280 ml',
    status: 'Lưu trữ: Bảo tàng CraftRoots',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk2rOtTTCHjFTaZI3fpgTrSH_9ynRt6in3qZKbW-w1d-eCRXfhP40o4PbhXFgeA6J29Ijl3FZOoNFgkfRxGSxAxb6YmeuKzvtHOc9nmw8ZwtOtR6YbSyYZu1IXQFgG5P-fLxP2W-IOKnOuUWXdNCpz4B8Ouu-bnNKQPqAkTAOG8626cb30lCtrBRjI-6wn3oyMAYqatgW07T28Y-eKRFzoD3LTtWmiWr-hW3ifNu8',
  },
  {
    id: 3,
    year: '2025',
    ref: 'NVB-2025-09',
    tag: 'Kỷ Niệm 50 Năm Nghề • Độc Bản',
    name: 'Lư Xông Trầm Men Lam Cổ Dát Bạc',
    description: 'Tác phẩm kết tinh kỹ thuật vẽ lam dưới men phong cách triều Mạc kết hợp nghệ thuật gò bạc Định Công, chế tác riêng đánh dấu chặng đường 50 năm cầm bút vẽ gốm.',
    height: '24 × 28 cm',
    status: 'Phục chế độc bản duy nhất',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPdVDBwua7oWYuFRtlcCML1Q2YxEgOA4bZJjpPo-qImdRRfb6R6UNhp70jGpoTZQI_-85tnyxxgyiDNWW8Uf622ooPG-VSAPoUx9ezFopSw_aGntM0pcoRMjT5OiGuHVuiRVH2g8TIXKia8xbIc0FAUtEJ1w_OOw3gaPpWOnSTsA5KLZkG-9FQToAZNqiYv2kIaqirLLYY7899C5v9oOgKL7Cdw6aPiId3oI8iXjA',
  },
];

export default function ArtisansPage() {
  const [showBioModal, setShowBioModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* SECTION 1: MASTER ARTISAN HERO PROFILE */}
      <section className="w-full px-margin py-space-xl bg-canvas-linen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
          
          {/* Portrait Column */}
          <div className="lg:col-span-5 relative group overflow-hidden bg-surface-container shadow-md border border-border-neutral">
            <div className="w-full h-full min-h-[520px] lg:min-h-[640px] relative">
              <img
                className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl4t5W9t-jCGUSR42Jn70E0UuYern_kd1tUIorruRIyDjPEEJsJ-DS8L_IdPBEZrNrovQSQPQv8RFdg6ET-jdNxxL1ygCWJ2gY43MZgRYKRIQNKNKdn-FuedIf73w4AeLkMFSBkgCNIZnKUGdKp27ZlMcSGSnFU9Dv4fqi9_x3GHMEdPZtQfAyvAw7_X1WR1yUqr_ECSIrg7lf89RzA792KPEEdlAoACJVbW-fO-8"
                alt="Nghệ nhân Nguyễn Văn Bình"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-surface-crisp">
                <div>
                  <p className="font-spec-code text-[11px] tracking-[0.2em] uppercase text-surface-variant/90">
                    Chân Dung Điền Dã
                  </p>
                  <p className="font-headline-title text-title-card text-surface-crisp">
                    Bên Cửa Lò Bầu Bát Tràng
                  </p>
                </div>
                <div className="font-spec-code text-[10px] tracking-widest text-primary-fixed uppercase px-2.5 py-1 bg-surface-crisp/10 backdrop-blur-md border border-surface-crisp/20">
                  Kỷ Lục 2024
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
                  HỒ SƠ NGHỆ NHÂN ƯU TÚ | QUỐC PHỤC DI SẢN
                </span>
              </div>

              <div>
                <h1 className="font-display-hero text-display-hero uppercase tracking-[0.18em] text-text-primary leading-tight">
                  NGUYỄN VĂN BÌNH
                </h1>
                <div className="mt-space-xs flex flex-wrap items-center font-spec-code text-spec-code text-text-secondary gap-y-1">
                  <span className="text-text-primary font-semibold">72 Tuổi</span>
                  <span className="mx-3 opacity-30">|</span>
                  <span>50 Năm Gìn Giữ Men Tro &amp; Lò Bầu Bát Tràng</span>
                  <span className="mx-3 opacity-30">|</span>
                  <span className="text-accent-terracotta font-medium">Đời thứ 5 dòng họ gốm Nguyễn</span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-border-neutral"></div>

              <p className="font-body-default text-body-default text-text-primary leading-relaxed text-justify">
                Sinh ra bên bờ sông Hồng, nghệ nhân Nguyễn Văn Bình đã dành trọn hơn nửa thế kỷ để phục dựng thành công công thức men rạn tro trấu từ thời Hậu Lê tưởng chừng đã thất truyền. Từng mẻ gốm của ông không dùng lò gas công nghiệp mà kiên trì nung bằng củi gỗ trong suốt ba ngày ba đêm để đạt sắc độ trầm mặc tự nhiên. Với ông, mỗi vết rạn trên cốt gốm không phải khiếm khuyết, mà là hơi thở của đất, của lửa và thời gian.
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
            {MASTERWORKS.map((work) => (
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
                    Điền thông tin để chúng tôi chuẩn bị trà ấm và điều phối thời gian nung lò của cụ Bình.
                  </p>
                </div>

                <div className="space-y-space-sm">
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Họ và tên khách quý *</label>
                    <input className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral" placeholder="Nguyễn Hoàng Nam" required type="text" />
                  </div>
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Số điện thoại liên lạc *</label>
                    <input className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral" placeholder="0912 345 678" required type="tel" />
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
                    <select className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral">
                      <option>Đàm đạo trà &amp; Tìm hiểu kỹ thuật men rạn cổ</option>
                      <option>Quan sát chu kỳ dỡ lò nung củi</option>
                      <option>Đặt chế tác tác phẩm gia bảo độc bản</option>
                      <option>Nghiên cứu học thuật dân tộc học / mỹ thuật</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-text-primary hover:bg-accent-terracotta text-surface-crisp font-label-action text-label-action uppercase tracking-[0.2em] py-4 transition-colors text-center shadow-md cursor-pointer" type="submit">
                  ĐẶT LỊCH ĐÀM ĐẠO TRÀ &amp; XEM MẺ LÒ →
                </button>

                {formSubmitted && (
                  <div className="p-3 bg-surface-crisp border border-accent-terracotta text-accent-terracotta text-center font-body-spec text-[13px]">
                    CraftRoots đã tiếp nhận yêu cầu đàm đạo cùng Nghệ nhân Nguyễn Văn Bình. Ban thư ký di sản sẽ liên lạc xác nhận lịch trong vòng 4 giờ.
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
