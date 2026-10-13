import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const GALLERY_PHOTOS = [
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9O3gQL4UyGAzvsdnfdDAr9jVo5wf-PqrIP4Q71xSWUXrJ8vXfYysi3-KYwEI84hdGzKF-JZV34gNXpDGwk7ramD254sTh_js-_cawkd5VhnJr4ST1pFFPc_aIVr1gwwfRHXR99a1OhThrioFR9M40z5MI592OB6QA4mOqF3uIbm4Pyj1FvBuUDMucEsKzJTAkS7yrEdDody-XdfO3P2fak7Te0XsgDKMAzdHc-Uk',
    caption: 'Góc chụp toàn cảnh bộ ấm chén men rạn dáng quả chuông cổ điển',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAek_gUQ2Mc6KWSkJsR7CziwjdJG4s5I-bseH2KGPdkh974MWmg5LqbRpp-9ABPNB7MDBR6BsP2GoWS-pB1KIjZEZ1Fhaindt3gwvmzuq6XSYcAkMW1xrPkuVsQU1vYxu6YHmU33_J8dZ8cgHgI2W49DLSactYvnB7F6IagGpX4rb9LlZdGU5G7qWfRwxyWhE_ITEqNowZTyHv4bafivHivSF6M25p2yPwqQCMMMz0',
    caption: 'Góc cận cảnh nắp ấm dáng quả chuông với núm cầm tiện tay nguyên khối',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKtHhTTz7DXi-iJEkU_gB4eS0-wetuJ0SRFRhUSjHt2M1dPYycC5U3V90kG7RBcx7DSOLLDzN2I1ry5FtoM_2Cw_PGnfZN1UzJ_TVAiMKH4xzgCbqXIlHwIP9aj37vbzyOKepDCHpUDGTposEVctXj8Xb5sBfhQxjKrmpKBi8uIIGGnQwv6FJt-PKdWQkXss9MCektu6xIrLyeEO1n6rboeBomyQ4G1klVBTd6O3o',
    caption: 'Mạng lưới men rạn tro trấu cổ kính hình thành tự nhiên trong lò củi 1300 độ C',
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQpMi-84Wlk9WfkFX9WJEidp714r333AzvS98OP3pTpGOYDPBcy4cnPq0-7R9h9HCdM6YUQkhorAbYmHwlexpoksY0Ok87joXkFXnVN9GktBeUrvV8cGjlCMdrcjSocxblPyYJgx_wgO-4hcoq9iAha9R-KsRls4DXBd9Q-Btc-H2quAk-4ErTONPmBGP0wmWzPd95MHUylftdBPCQEGg0AVss2L57gtUYw2Li5O4',
    caption: 'Triện gốm khắc chìm tay xác thực danh tính nghệ nhân Nguyễn Văn Bình dưới đáy ấm',
  },
];

export default function CraftDetailPage() {
  const { id } = useParams();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="w-full bg-[#F9F8F6]">
      {/* Showcase Section */}
      <section className="w-full py-8 md:py-12 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cột trái (55%): Gallery Ảnh tương tác */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="relative w-full aspect-[4/3] bg-[#F4F2EE] overflow-hidden group shadow-sm border border-[#E6E2DA]">
                <img
                  src={GALLERY_PHOTOS[activePhotoIndex].url}
                  alt="Chi tiết tác phẩm"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[#1C1B1A]/90 text-white px-3 py-1 font-['Inter'] text-[11px] uppercase tracking-[0.15em] backdrop-blur-sm">
                  Mộc Bản Thủ Công • Nung Lò Củi
                </div>
                <div className="absolute bottom-4 right-4 bg-[#FFFFFF]/95 text-[#1C1B1A] px-3 py-1.5 font-['Inter'] text-[12px] shadow-sm flex items-center gap-2 border border-[#E6E2DA]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#B86B35] animate-pulse"></span>
                  Độ hoàn thiện: 100% Nguyên bản
                </div>
              </div>

              {/* Dải ảnh thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {GALLERY_PHOTOS.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`aspect-[4/3] p-1 bg-[#FFFFFF] transition-all focus:outline-none border ${
                      activePhotoIndex === idx
                        ? 'border-[#B86B35] ring-1 ring-[#B86B35]'
                        : 'border-[#E6E2DA] hover:border-[#867368]'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Chú thích ảnh hiện tại */}
              <div className="p-4 bg-[#F2EDEB] border border-[#E6E2DA] flex items-center justify-between text-[12px] font-['Inter'] text-[#5A5854]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#B86B35] text-[18px]">verified</span>
                  <span className="uppercase tracking-wider text-[#1C1B1A] font-medium">Chứng thư cổ vật phục dựng</span>
                </div>
                <div className="italic text-[#867368]">
                  {GALLERY_PHOTOS[activePhotoIndex].caption}
                </div>
              </div>
            </div>

            {/* Cột phải (45%): Thông số kỹ thuật & Nghệ nhân */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-[1px] bg-[#B86B35]"></span>
                <span className="font-['Inter'] text-[11px] text-[#B86B35] uppercase tracking-[0.2em] font-semibold">
                  Di Sản Gốm Cổ Việt Nam — Thế Kỷ XVI
                </span>
              </div>

              <h1 className="font-['Playfair_Display'] text-[28px] sm:text-[34px] leading-tight text-[#1C1B1A] mb-2 font-medium">
                Bộ Trà Men Rạn Nung Củi Bát Tràng #{id || '01'}
              </h1>

              <p className="font-['Playfair_Display'] text-[16px] italic text-[#5A5854] mb-6">
                Dáng quả chuông cổ điển — Tinh hoa phục chế từ thư tịch cổ triều Lê
              </p>

              {/* Nghệ nhân bảo chứng */}
              <div className="p-4 bg-[#F4F2EE] border border-[#E6E2DA] mb-6 flex items-center justify-between shadow-xs">
                <div className="flex flex-col">
                  <span className="font-['Inter'] text-[11px] text-[#5A5854] uppercase tracking-wider">Chế tác bởi bàn tay</span>
                  <Link to="/artisans/1" className="font-['Playfair_Display'] text-[20px] text-[#1C1B1A] hover:text-[#B86B35] transition-colors">
                    Nguyễn Văn Bình
                  </Link>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 bg-[#FFFFFF] text-[#B86B35] font-['Inter'] text-[10px] tracking-wider uppercase font-semibold border border-[#E6E2DA]">
                    Nghệ Nhân Ưu Tú
                  </span>
                  <p className="font-['Inter'] text-[11px] text-[#5A5854] mt-1">50 năm tuổi nghề gia truyền</p>
                </div>
              </div>

              {/* Bảng thông số kỹ thuật di sản */}
              <div className="bg-[#FFFFFF] border border-[#E6E2DA] p-5 shadow-xs mb-6 space-y-3">
                <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.2em] text-[#1C1B1A] font-semibold block pb-2 border-b border-[#E6E2DA]">
                  Thông Số Kỹ Thuật Di Sản
                </span>
                
                <div className="grid grid-cols-1 divide-y divide-[#E6E2DA] text-[13px] font-['Inter']">
                  <div className="py-2 flex justify-between">
                    <span className="text-[#5A5854]">Mã định danh:</span>
                    <span className="text-[#1C1B1A] font-semibold">CR-BT-2026-08MR</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#5A5854]">Làng nghề xuất xứ:</span>
                    <span className="text-[#1C1B1A] font-medium">Bát Tràng, Gia Lâm, Hà Nội</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#5A5854]">Chất liệu cốt:</span>
                    <span className="text-[#1C1B1A]">Đất sét cao lanh sông Hồng lọc kỹ 3 lần</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#5A5854]">Loại men đặc thù:</span>
                    <span className="text-[#1C1B1A] font-medium">Men rạn tro trấu cổ truyền</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#5A5854]">Kỹ thuật tạo tác:</span>
                    <span className="text-[#1C1B1A]">Chuốt tay bàn xoay, nung củi liên tục 72h</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#5A5854]">Quy chuẩn kích thước:</span>
                    <span className="text-[#1C1B1A]">Ấm 350ml | 06 chén 50ml | Khay gốm Ø 28cm</span>
                  </div>
                </div>
              </div>

              {/* Nút thao tác: Thả tim & Liên hệ */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex-1 py-3 px-4 border font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSaved
                      ? 'bg-[#B86B35] text-white border-[#B86B35]'
                      : 'bg-[#FFFFFF] text-[#1C1B1A] border-[#E6E2DA] hover:border-[#B86B35] hover:text-[#B86B35]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'filled' : ''}`}>
                    bookmark
                  </span>
                  <span>{isSaved ? 'Đã Lưu Vào Danh Mục' : 'Lưu Tác Phẩm Yêu Thích'}</span>
                </button>
                <Link
                  to="/contact"
                  className="py-3 px-6 bg-[#1C1B1A] text-white hover:bg-[#B86B35] transition-colors font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold shrink-0"
                >
                  Liên Hệ Xưởng
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
