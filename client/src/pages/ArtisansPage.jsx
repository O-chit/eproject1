import React from 'react';
import { Link } from 'react-router-dom';

const ARTISAN_WORKS = [
  {
    id: 1,
    name: 'Bình Vôi Men Rạn Họa Tiết Mây Cuộn',
    category: 'Gốm Men Tro Lò Bầu',
    year: 'Phục dựng 2021',
    description: 'Tác phẩm đoạt giải Tinh hoa Bát Tràng, men rạn ngả sắc vàng rơm tự nhiên, mô phỏng đồ tế tự đình làng cổ.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaUrvFnVxj2lsHDRkr-yaTRJCRIumrtcbAoBO8T7gJK22rF-l8LFMNoASMdtx_N8hQkmINE6HE7xtmJmzGpxqvbiG5mzG2TvxNKGDuu4MZjKV7e4q6ixIFOJ1PSNsl56IqQagawz_SCLeDfMjYY1bGxxdBh3e-6wBJ15RkSXBTpEZHEoWqpB_uzbwmdJy82jUtSMpkv6zROQGRW5W2GKqEOL2DxfhNLSsVd1T7ujM',
  },
  {
    id: 2,
    name: 'Bộ Ấm Chén Cổ Ngũ Hành Tương Sinh',
    category: 'Gốm Đất Nung Nung Củi',
    year: 'Phục dựng 2023',
    description: 'Chế tác từ 5 loại đất sét phù sa khác nhau, tượng trưng cho Kim - Mộc - Thủy - Hỏa - Thổ trong triết lý phương Đông.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9O3gQL4UyGAzvsdnfdDAr9jVo5wf-PqrIP4Q71xSWUXrJ8vXfYysi3-KYwEI84hdGzKF-JZV34gNXpDGwk7ramD254sTh_js-_cawkd5VhnJr4ST1pFFPc_aIVr1gwwfRHXR99a1OhThrioFR9M40z5MI592OB6QA4mOqF3uIbm4Pyj1FvBuUDMucEsKzJTAkS7yrEdDody-XdfO3P2fak7Te0XsgDKMAzdHc-Uk',
  },
  {
    id: 3,
    name: 'Chân Đèn Men Lam Gốm Thời Mạc',
    category: 'Men Lam Lam Khử',
    year: 'Phục chế 2024',
    description: 'Kỹ pháp vẽ men lam trên cốt gốm mộc không dùng thước đo, phóng bút tự nhiên với họa tiết nghê và rồng lá thời Mạc.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqduILIjCsF1Kr_gNwT3HzCol9ezbm28IM-WATA6u3a0Kr8CYRzu98P3zWTne8NLrEGuVggHoQ89zJCBrkJbC8wQoA7JqQqJ2oSQM5h6CVd1OHhsmIKgJsgtVtnyopCOs05V63JZo8I6k5-nAo8X_b4jyLWbBoMi6bJctZ6aMadrS7-0MkDyYuXEvLZFi2TgKBBbD7_yBTT0-K43uVnlY0MZrXFsEgsPrvfb4lcX8',
  },
];

export default function ArtisansPage() {
  return (
    <div className="w-full bg-[#F9F8F6]">
      {/* Master Artisan Hero Profile */}
      <section className="w-full py-12 md:py-16 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Portrait Column */}
            <div className="lg:col-span-5 relative group overflow-hidden bg-[#ECE7E5] shadow-md border border-[#E6E2DA]">
              <div className="w-full h-full min-h-[480px] lg:min-h-[580px] relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl4t5W9t-jCGUSR42Jn70E0UuYern_kd1tUIorruRIyDjPEEJsJ-DS8L_IdPBEZrNrovQSQPQv8RFdg6ET-jdNxxL1ygCWJ2gY43MZgRYKRIQNKNKdn-FuedIf73w4AeLkMFSBkgCNIZnKUGdKp27ZlMcSGSnFU9Dv4fqi9_x3GHMEdPZtQfAyvAw7_X1WR1yUqr_ECSIrg7lf89RzA792KPEEdlAoACJVbW-fO-8"
                  alt="Nghệ nhân Nguyễn Văn Bình"
                  className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1A]/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                  <div>
                    <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#E6E2DF]">Chân Dung Điền Dã</p>
                    <p className="font-['Playfair_Display'] text-[18px] font-medium text-white">Bên Cửa Lò Bầu Bát Tràng</p>
                  </div>
                  <div className="font-['Inter'] text-[10px] tracking-widest text-[#FFDBC7] uppercase px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20">
                    Kỷ Lục 2026
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 bg-[#FFFFFF] border border-[#E6E2DA] shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-[#B86B35] inline-block"></span>
                  <span className="font-['Montserrat'] text-[11px] tracking-[0.25em] text-[#B86B35] uppercase font-semibold">
                    HỒ SƠ NGHỆ NHÂN ƯU TÚ | QUỐC PHỤC DI SẢN
                  </span>
                </div>

                <div>
                  <h1 className="font-['Montserrat'] text-[32px] sm:text-[40px] uppercase tracking-[0.18em] text-[#1C1B1A] font-light leading-tight">
                    NGUYỄN VĂN BÌNH
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center font-['Inter'] text-[12px] text-[#5A5854] gap-y-1">
                    <span className="text-[#1C1B1A] font-semibold">72 Tuổi</span>
                    <span className="mx-3 opacity-30">|</span>
                    <span>50 Năm Gìn Giữ Men Tro & Lò Bầu Bát Tràng</span>
                    <span className="mx-3 opacity-30">|</span>
                    <span className="text-[#B86B35] font-medium">Đời thứ 5 dòng họ gốm Nguyễn</span>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-[#E6E2DA]"></div>

                <p className="font-['Inter'] text-[14px] text-[#1C1B1A] leading-relaxed text-justify">
                  Sinh ra bên bờ sông Hồng, nghệ nhân Nguyễn Văn Bình đã dành trọn hơn nửa thế kỷ để phục dựng thành công công thức men rạn tro trấu từ thời Hậu Lê tưởng chừng đã thất truyền. Từng mẻ gốm của ông không dùng lò gas công nghiệp mà kiên trì nung bằng củi gỗ trong suốt ba ngày ba đêm để đạt sắc độ trầm mặc tự nhiên. Với ông, mỗi vết rạn trên cốt gốm không phải khiếm khuyết, mà là hơi thở của đất, của lửa và thời gian.
                </p>

                {/* Core Tenet Pullquote */}
                <div className="bg-[#F4F2EE] border-l-2 border-[#B86B35] p-5 my-4">
                  <p className="font-['Playfair_Display'] text-[15px] italic text-[#5A5854] leading-snug">
                    “Lửa lò bầu như tâm can người thợ. Nóng vội một khắc là hỏng một mùa gốm, giữ được nhịp thở đều thì đất vô tri mới kết tinh thành hồn cốt nước non.”
                  </p>
                  <div className="mt-2 text-right font-['Inter'] text-[11px] uppercase tracking-wider text-[#867368]">
                    — Bút ký lò nung tháng 11/1987
                  </div>
                </div>
              </div>

              {/* Metrics Strip & Action */}
              <div className="pt-4 border-t border-[#E6E2DA]">
                <div className="grid grid-cols-3 gap-3 bg-[#F7F3F0] p-4 mb-5 border border-[#E6E2DA]/60">
                  <div className="flex flex-col">
                    <span className="font-['Playfair_Display'] text-[24px] text-[#8E4A16] font-bold">50+</span>
                    <span className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#5A5854] mt-0.5">Năm Kinh Nghiệm</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Playfair_Display'] text-[24px] text-[#B86B35] font-bold">120+</span>
                    <span className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#5A5854] mt-0.5">Tác Phẩm Phục Dựng</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Playfair_Display'] text-[24px] text-[#006670] font-bold">03</span>
                    <span className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#5A5854] mt-0.5">Triển Lãm Quốc Tế</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center bg-[#1C1B1A] text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.2em] px-7 py-3 hover:bg-[#B86B35] transition-colors shadow-xs"
                  >
                    Đăng Ký Đàm Đạo Trà & Xem Mẻ Lò
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Masterworks Collection */}
      <section className="w-full py-14 bg-[#FFFFFF] border-t border-[#E6E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="mb-10 pb-4 border-b border-[#E6E2DA]">
            <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.25em] text-[#B86B35] font-semibold block mb-1">
              BỘ SƯU TẬP TÁC PHẨM ĐỘC BẢN
            </span>
            <h2 className="font-['Playfair_Display'] text-[26px] text-[#1C1B1A] font-medium">
              Các Kiệt Tác Chủ Trì Bởi Nghệ Nhân Nguyễn Văn Bình
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTISAN_WORKS.map((work) => (
              <article
                key={work.id}
                className="group border border-[#E6E2DA] bg-[#F9F8F6] p-4 flex flex-col justify-between hover:border-[#B86B35] hover:shadow-md transition-all"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-[#ECE7E5] mb-4">
                    <img
                      src={work.image}
                      alt={work.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-['Inter'] text-[#867368] mb-1">
                    <span>{work.category}</span>
                    <span>{work.year}</span>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-[18px] font-medium text-[#1C1B1A] mb-2 group-hover:text-[#B86B35] transition-colors">
                    {work.name}
                  </h3>
                  <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed mb-4">
                    {work.description}
                  </p>
                </div>
                <Link
                  to={`/crafts/${work.id}`}
                  className="w-full py-2 bg-[#FFFFFF] border border-[#E6E2DA] text-center font-['Montserrat'] text-[11px] uppercase tracking-wider text-[#1C1B1A] hover:text-[#B86B35] hover:border-[#B86B35] transition-colors font-medium block"
                >
                  Khám Phá Kỹ Pháp →
                </Link>
              </article>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
