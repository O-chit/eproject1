import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-[#F9F8F6] border-t border-[#E6E2DA] pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hàng trên: 3 khối chính */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#E6E2DA]">
          
          {/* Cột 1: Thương hiệu & Tôn chỉ */}
          <div className="md:col-span-4 flex flex-col pr-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-['Playfair_Display'] text-[24px] font-semibold text-[#1C1B1A] tracking-tight">
                CraftRoots
              </span>
              <span className="text-[10px] font-['Inter'] tracking-[0.2em] uppercase text-[#B86B35] border border-[#B86B35] px-2 py-0.5 rounded-full">
                Lưu Trữ Sống
              </span>
            </div>
            <p className="font-['Inter'] text-[14px] text-[#5A5854] leading-relaxed mb-6">
              Bảo tồn cốt cách làng nghề và tôn vinh bàn tay tài hoa của nghệ nhân Việt Nam qua từng đường nét, chất liệu mộc bản và tâm thức văn hóa ngàn năm.
            </p>
            <div className="font-['Inter'] text-[13px] text-[#1C1B1A] space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-[#1C1B1A]">
                <span className="material-symbols-outlined text-[16px] text-[#B86B35]">
                  location_on
                </span>
                Xưởng gốm & Lưu trữ Di sản:
              </div>
              <div className="text-[#5A5854] pl-5 text-[12px]">
                Thôn 1 Bát Tràng, Gia Lâm, TP. Hà Nội
              </div>
            </div>
          </div>

          {/* Cột 2: Đăng ký Bản Tin */}
          <div className="md:col-span-5 flex flex-col justify-start md:px-6 border-t md:border-t-0 md:border-l md:border-r border-[#E6E2DA] pt-6 md:pt-0">
            <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] text-[#1C1B1A] font-semibold mb-2">
              Bản Tin Di Sản & Phục Dựng
            </span>
            <p className="font-['Inter'] text-[13px] text-[#5A5854] mb-4 leading-relaxed">
              Nhận tư liệu điền dã, hồ sơ kỹ thuật cổ truyền và thông báo tuyển tập tác phẩm thủ công giới hạn hàng tháng.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center w-full max-w-md h-11 rounded-full border border-[#E6E2DA] bg-[#FFFFFF] px-2 transition-colors focus-within:border-[#B86B35]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ thư điện tử..."
                required
                className="flex-1 bg-transparent px-3 text-[13px] text-[#1C1B1A] placeholder:text-[#5A5854]/60 focus:outline-none"
              />
              <button
                type="submit"
                className="h-8 px-4 rounded-full bg-[#B86B35] text-white font-['Montserrat'] text-[10px] uppercase tracking-[0.15em] font-semibold hover:bg-[#8E4A16] transition-colors shrink-0"
              >
                Đăng Ký
              </button>
            </form>
            {subscribed && (
              <span className="text-[12px] text-[#006670] mt-2 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Cảm ơn bạn đã đăng ký nhận bản tin di sản CraftRoots!
              </span>
            )}
          </div>

          {/* Cột 3: Liên kết nhanh */}
          <div className="md:col-span-3 flex flex-col pt-6 md:pt-0">
            <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] text-[#1C1B1A] font-semibold mb-3">
              Không Gian Khám Phá
            </span>
            <ul className="space-y-2 font-['Inter'] text-[13px]">
              <li>
                <Link to="/crafts" className="text-[#5A5854] hover:text-[#B86B35] transition-colors">
                  Danh mục 66+ tác phẩm
                </Link>
              </li>
              <li>
                <Link to="/regions" className="text-[#5A5854] hover:text-[#B86B35] transition-colors">
                  Bản đồ văn hóa 3 miền
                </Link>
              </li>
              <li>
                <Link to="/artisans" className="text-[#5A5854] hover:text-[#B86B35] transition-colors">
                  Hồ sơ Nghệ nhân Nhân dân
                </Link>
              </li>
              <li>
                <Link to="/seasonal" className="text-[#5A5854] hover:text-[#B86B35] transition-colors">
                  Bộ sưu tập theo mùa
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#5A5854] hover:text-[#B86B35] transition-colors">
                  Liên hệ xưởng nghề & Tham quan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hàng dưới: Bản quyền Aptech eProject & Meta */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-['Inter'] text-[12px] text-[#5A5854]">
          <div className="flex items-center gap-2">
            <span>© 2026 <strong>CraftRoots</strong>. Dự án tốt nghiệp <strong>eProject – Aptech Computer Education</strong>.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-['Montserrat'] uppercase tracking-wider">
            <span className="text-[#B86B35]">Kiến Trúc Linework Chuẩn Mực</span>
            <span>•</span>
            <span>PostgreSQL 3NF</span>
            <span>•</span>
            <span>React 18 SPA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
