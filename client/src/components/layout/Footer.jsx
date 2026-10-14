import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-canvas-linen border-t border-border-neutral pt-space-xl pb-space-lg mt-auto">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter pb-space-xl border-b border-border-neutral">
          
          {/* Cột 1: Thương hiệu CraftRoots & Lưu Trữ Sống */}
          <div className="md:col-span-4 flex flex-col pr-space-md">
            <div className="flex items-center gap-space-sm mb-space-sm">
              <span className="font-headline-title text-headline-title text-text-primary tracking-tight">
                CraftRoots
              </span>
              <span className="text-[10px] font-spec-code tracking-[0.2em] uppercase text-accent-terracotta border border-accent-terracotta px-2 py-0.5 rounded-[50px]">
                Lưu Trữ Sống
              </span>
            </div>
            <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed mb-space-md">
              Bảo tồn cốt cách làng nghề và tôn vinh bàn tay tài hoa của nghệ nhân Việt Nam qua từng đường nét, chất liệu mộc bản và tâm thức văn hóa ngàn năm.
            </p>
            <div className="text-body-spec font-body-spec text-text-primary space-y-1">
              <div className="font-semibold text-text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-accent-terracotta">
                  location_on
                </span>
                Xưởng gốm &amp; Lưu trữ Di sản:
              </div>
              <div className="text-text-secondary pl-5 text-[12px]">
                Thôn 1 Bát Tràng, Gia Lâm, Hà Nội
              </div>
            </div>
          </div>

          {/* Cột 2: Bản Tin Di Sản & Phục Dựng */}
          <div className="md:col-span-5 flex flex-col justify-start md:px-space-md border-t md:border-t-0 md:border-l md:border-r border-border-neutral pt-space-md md:pt-0">
            <span className="font-label-action text-label-action uppercase tracking-[0.18em] text-text-primary font-semibold mb-space-xs">
              Bản Tin Di Sản &amp; Phục Dựng
            </span>
            <p className="font-body-spec text-body-spec text-text-secondary mb-space-md">
              Nhận tư liệu điền dã, hồ sơ kỹ thuật cổ truyền và thông báo tuyển tập tác phẩm thủ công giới hạn hàng tháng.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center w-full max-w-md h-[46px] rounded-[50px] border border-border-neutral bg-surface-crisp px-space-sm transition-colors focus-within:border-accent-terracotta"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email lưu trữ di sản..."
                required
                className="flex-1 bg-transparent px-space-sm text-body-spec text-text-primary placeholder:text-text-secondary/60 focus:outline-none text-[13px]"
              />
              <button
                type="submit"
                className="font-label-action text-label-action uppercase tracking-[0.15em] bg-text-primary hover:bg-accent-terracotta text-surface-crisp px-4 py-2 rounded-[50px] transition-colors shrink-0 cursor-pointer"
              >
                Đăng Ký
              </button>
            </form>
            {subscribed && (
              <span className="text-[12px] text-accent-terracotta mt-2 font-body-spec flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Đã đăng ký nhận bản tin di sản thành công!
              </span>
            )}
          </div>

          {/* Cột 3: Nguyên Tắc & Kết Nối */}
          <div className="md:col-span-3 flex flex-col justify-between md:pl-space-md pt-space-md md:pt-0">
            <div className="flex flex-col">
              <span className="font-label-action text-label-action uppercase tracking-[0.18em] text-text-primary font-semibold mb-space-sm">
                Nguyên Tắc &amp; Kết Nối
              </span>
              <nav className="flex flex-wrap items-center font-body-spec text-body-spec text-text-secondary leading-loose">
                <Link to="/crafts" className="hover:text-accent-terracotta transition-colors" data-path="craftroots-charter">
                  Quy chế
                </Link>
                <span className="mx-2 text-border-neutral opacity-60 font-light select-none">|</span>
                <Link to="/artisans" className="hover:text-accent-terracotta transition-colors" data-path="craftroots-artisans">
                  Nghệ nhân đối tác
                </Link>
                <span className="mx-2 text-border-neutral opacity-60 font-light select-none">|</span>
                <Link to="/crafts" className="hover:text-accent-terracotta transition-colors" data-path="craftroots-conservation">
                  Bảo tồn
                </Link>
                <span className="mx-2 text-border-neutral opacity-60 font-light select-none">|</span>
                <Link to="/contact" className="hover:text-accent-terracotta transition-colors" data-path="craftroots-contact">
                  Liên hệ
                </Link>
              </nav>
            </div>
            <div className="pt-space-md">
              <span className="font-spec-code text-[11px] uppercase tracking-[0.1em] text-text-secondary block">
                Tài liệu hóa theo chuẩn văn hóa dân tộc học
              </span>
            </div>
          </div>
        </div>

        {/* Thanh Tọa Độ & Bản Quyền Bên Dưới */}
        <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between text-body-spec text-text-secondary text-[12px]">
          <div>
            © 2024 CraftRoots. Giữ toàn quyền lưu trữ và phát hành di sản phi vật thể.
          </div>
          <div className="flex items-center gap-space-md mt-space-xs sm:mt-0 font-spec-code text-spec-code text-[11px] text-text-secondary">
            <span>Kinh độ: 105.9142° E</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span>Vĩ độ: 20.9782° N</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span>Bản vị: Thổ Trạch Việt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
