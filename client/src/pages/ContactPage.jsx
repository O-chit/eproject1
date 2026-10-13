import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TOPICS = [
  'Đặt Tác Phẩm Thửa Riêng',
  'Hẹn Ghé Thăm Làng Nghề',
  'Hợp Tác Văn Hóa & Triển Lãm',
  'Thẩm Định Cổ Vật',
  'Khác'
];

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Hẹn Ghé Thăm Làng Nghề');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate direct inquiry submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // reset form
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Sub-header Breadcrumb & Operational Status Bar */}
      <div className="w-full border-b border-[#E6E2DA] bg-[#F4F2EE]/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] font-['Inter']">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center flex-wrap uppercase tracking-[0.14em] text-[#5A5854]">
            <Link to="/" className="hover:text-[#B86B35] transition-colors">Trang Chủ</Link>
            <span className="mx-3 text-[#E6E2DA] select-none">|</span>
            <span>Kết Nối & Điều Phối Di Sản</span>
            <span className="mx-3 text-[#E6E2DA] select-none">|</span>
            <span className="text-[#1C1B1A] font-semibold">Gặp Gỡ Xưởng Thủ Công</span>
          </nav>
          {/* Operation Telemetry Metadata */}
          <div className="flex items-center flex-wrap uppercase tracking-[0.12em] text-[#5A5854]">
            <span className="flex items-center gap-1.5 text-[#B86B35] font-medium">
              <span className="inline-block w-1.5 h-1.5 bg-[#B86B35]"></span>
              Thời Gian Phản Hồi: Trong vòng 24h
            </span>
            <span className="mx-3 text-[#E6E2DA] select-none">|</span>
            <span>Giờ Làm Việc: 09:00 — 18:00 (Thứ Ba – Chủ Nhật)</span>
          </div>
        </div>
      </div>

      {/* Primary Workspace Layout */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Studio & Artisan Workshop Directory (5 cols lg) */}
            <div className="lg:col-span-5 flex flex-col space-y-8">
              {/* Editorial Title Block */}
              <div>
                <span className="font-['Inter'] text-[12px] uppercase tracking-[0.25em] text-[#B86B35] block mb-2 font-medium">
                  Điểm Hẹn Trực Tiếp // Bảo Tồn Nguyên Bản
                </span>
                <h1 className="font-['Montserrat'] text-[32px] md:text-[40px] leading-[44px] md:leading-[50px] font-light text-[#1C1B1A] tracking-[0.18em] uppercase">
                  Gặp Gỡ & Kết Nối
                </h1>
                <p className="font-['Inter'] text-[15px] text-[#5A5854] mt-3 leading-relaxed">
                  Mọi lời nhắn đều được gửi trực tiếp đến đội ngũ giám tuyển bảo tồn và các nghệ nhân xưởng bản địa.
                </p>
              </div>

              {/* Structured Info Modules */}
              <div className="flex flex-col divide-y divide-[#E6E2DA] border-t border-b border-[#E6E2DA]">
                {/* Module 1: Physical Space */}
                <div className="py-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[18px] text-[#B86B35]">storefront</span>
                    <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] text-[#1C1B1A] font-semibold">
                      1. Không Gian Trưng Bày & Tiếp Khách
                    </span>
                  </div>
                  <div className="pl-6 space-y-1.5 font-['Inter'] text-[13px] text-[#5A5854]">
                    <p className="text-[#1C1B1A] font-medium">Số 12 Ngõ Tràng Tiền, Hoàn Kiếm, Hà Nội</p>
                    <p>Thời gian mở cửa: <span className="text-[#1C1B1A]">09:00 – 18:00</span> (Thứ Ba – Chủ Nhật, nghỉ Thứ Hai dưỡng lò)</p>
                    <p className="text-[12px] italic text-[#5A5854]/80">Chỉ dẫn định vị: Cách Nhà Hát Lớn 150m, có chỗ đỗ xe ô tô thuận tiện.</p>
                  </div>
                </div>

                {/* Module 2: Telephone Line */}
                <div className="py-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[18px] text-[#B86B35]">call</span>
                    <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] text-[#1C1B1A] font-semibold">
                      2. Đường Dây Trực Tiếp
                    </span>
                  </div>
                  <div className="pl-6 space-y-1.5 font-['Inter'] text-[13px] text-[#5A5854]">
                    <p className="text-[#1C1B1A] font-medium tracking-wide">
                      Hotline: (+84) 988.246.810{' '}
                      <span className="text-xs font-normal text-[#5A5854] block md:inline md:ml-1">
                        (Ban điều phối làng nghề & Giám tuyển di sản)
                      </span>
                    </p>
                    <p>Giờ trực thoại tiếp nhận: <span className="text-[#1C1B1A]">08:30 – 20:00</span> hàng ngày</p>
                  </div>
                </div>

                {/* Module 3: Digital Correspondence */}
                <div className="py-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[18px] text-[#B86B35]">mail</span>
                    <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] text-[#1C1B1A] font-semibold">
                      3. Thư Điện Tử & Hồ Sơ Điền Dã
                    </span>
                  </div>
                  <div className="pl-6 space-y-1.5 font-['Inter'] text-[13px] text-[#5A5854]">
                    <p>Hòm thư chính thức: <a className="text-[#1C1B1A] hover:text-[#B86B35] font-medium underline underline-offset-4" href="mailto:lienhe@craftroots.vn">lienhe@craftroots.vn</a></p>
                    <p>Hồ sơ phục dựng & giám tuyển: <a className="text-[#1C1B1A] hover:text-[#B86B35] font-medium underline underline-offset-4" href="mailto:curating@craftroots.vn">curating@craftroots.vn</a></p>
                  </div>
                </div>
              </div>

              {/* Traveler / Workshop Protocol Callout */}
              <div className="bg-[#F4F2EE] border-l-2 border-[#B86B35] p-5">
                <span className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#B86B35] block mb-2 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">info</span>
                  Lưu Ý Dành Cho Khách Ghé Thăm Xưởng Bản Địa:
                </span>
                <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed">
                  Quý khách muốn ghé thăm trực tiếp các lò gốm Bát Tràng, xưởng dệt lụa Vạn Phúc hoặc xưởng mây tre Phú Vinh vui lòng gửi lịch hẹn trước <span className="text-[#1C1B1A] font-medium">48 giờ</span> để chúng tôi chuẩn bị trà ấm và điều phối đón tiếp chu đáo cùng nghệ nhân đại diện.
                </p>
              </div>

              {/* Archival Studio Coordinates & Photo Plate */}
              <div className="border border-[#E6E2DA] bg-[#FFFFFF] p-4 flex items-center gap-4">
                <div className="w-24 h-24 shrink-0 bg-[#F2EDEB] overflow-hidden border border-[#E6E2DA]">
                  <img
                    className="w-full h-full object-cover filter grayscale contrast-125 hover:scale-105 transition-transform duration-500"
                    alt="Xưởng Giám Tuyển Tràng Tiền"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJfc2caUNtz08IfnmfEak2irrLmuSyYLYZDnFNzLZ5KuhGWk4Xk9KOd_CrmDrEn_r_7ns4WIsA4oVXf2MDMB6G6G-tdL2ZP_XDCnskDcPAWUoZPgFWkjz2IY5j623QtEI-vLn4RLCm5L9tkjDUEWbeVjS6N45w5mGcyFyCjyhND3SQ8wvQUwEazxGoGxAEZLRiLEzJyB52hQv0DW-Oy9OeCdb7BIsx7GC1W-5UdiYx7d4sVALsSIJI"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-['Inter'] text-[10px] uppercase tracking-[0.16em] text-[#B86B35] block font-medium">
                    Định vị Không gian Lưu Trữ
                  </span>
                  <p className="font-['Playfair_Display'] text-[15px] text-[#1C1B1A] font-medium truncate mt-0.5">
                    Xưởng Giám Tuyển Tràng Tiền
                  </p>
                  <div className="mt-2 pt-2 border-t border-[#E6E2DA] font-['Inter'] text-[11px] text-[#5A5854] leading-tight space-y-0.5">
                    <div>Tọa độ: <span className="text-[#1C1B1A]">21.0252° N, 105.8566° E</span></div>
                    <div>Mã định danh liên lạc: <span className="text-[#1C1B1A]">CR-HQ-HN</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Minimalist Inquiry Form (7 cols lg) */}
            <div className="lg:col-span-7">
              <div className="bg-[#FFFFFF] border border-[#E6E2DA] p-6 sm:p-8 md:p-10 shadow-sm">
                
                {/* Form Header */}
                <div className="border-b border-[#E6E2DA] pb-6 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Inter'] text-[12px] uppercase tracking-[0.2em] text-[#B86B35] font-medium">
                      Hồ Sơ Yêu Cầu // Mẫu 04-CR
                    </span>
                    <span className="font-['Inter'] text-[11px] text-[#5A5854] tracking-widest uppercase">
                      Mã: RQ-2024
                    </span>
                  </div>
                  <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1B1A] tracking-wide font-semibold">
                    Phiếu Liên Hệ & Đặt Lịch Hẹn Trực Tiếp
                  </h2>
                  <p className="font-['Inter'] text-[13px] text-[#5A5854] mt-1.5">
                    Vui lòng cung cấp chi tiết nhu cầu để chúng tôi chuyển đến đúng ban đại diện nghệ nhân phụ trách lĩnh vực.
                  </p>
                </div>

                {/* Form Body */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Field 1 & 2: Row for Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-['Montserrat'] text-[11px] uppercase tracking-[0.16em] text-[#1C1B1A] font-medium mb-2" htmlFor="fullName">
                        Họ và Tên <span className="text-[#B86B35]">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn An Bình"
                        className="w-full bg-[#FDFBF7] border border-[#E6E2DA] focus:border-[#B86B35] outline-none px-4 py-3 font-['Inter'] text-[13px] text-[#1C1B1A] placeholder:text-[#5A5854]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-['Montserrat'] text-[11px] uppercase tracking-[0.16em] text-[#1C1B1A] font-medium mb-2" htmlFor="phone">
                        Số Điện Thoại Liên Hệ
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(+84) 0912 345 678"
                        className="w-full bg-[#FDFBF7] border border-[#E6E2DA] focus:border-[#B86B35] outline-none px-4 py-3 font-['Inter'] text-[13px] text-[#1C1B1A] placeholder:text-[#5A5854]/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Field 3: Email */}
                  <div>
                    <label className="block font-['Montserrat'] text-[11px] uppercase tracking-[0.16em] text-[#1C1B1A] font-medium mb-2" htmlFor="email">
                      Địa Chỉ Email <span className="text-[#B86B35]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="anbinh.nguyen@domain.com"
                      className="w-full bg-[#FDFBF7] border border-[#E6E2DA] focus:border-[#B86B35] outline-none px-4 py-3 font-['Inter'] text-[13px] text-[#1C1B1A] placeholder:text-[#5A5854]/50 transition-colors"
                    />
                  </div>

                  {/* Field 4: Topic Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-['Montserrat'] text-[11px] uppercase tracking-[0.16em] text-[#1C1B1A] font-medium">
                        Chủ Đề Quan Tâm <span className="text-[#B86B35]">*</span>
                      </label>
                      <span className="font-['Inter'] text-[11px] text-[#5A5854]">Chọn phân loại thảo luận</span>
                    </div>
                    
                    <div className="p-3 border border-[#E6E2DA] bg-[#FDFBF7] flex flex-wrap items-center gap-y-2 text-['Inter'] text-[11px] tracking-wider uppercase">
                      {TOPICS.map((item, idx) => {
                        const isSelected = topic === item;
                        return (
                          <React.Fragment key={item}>
                            {idx > 0 && <span className="text-[#E6E2DA] select-none mx-2">|</span>}
                            <button
                              type="button"
                              onClick={() => setTopic(item)}
                              className={`px-2.5 py-1 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#B86B35] text-[#FFFFFF] font-semibold'
                                  : 'text-[#5A5854] hover:text-[#B86B35]'
                              }`}
                            >
                              [ {item} ]
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field 5: Message Details */}
                  <div>
                    <label className="block font-['Montserrat'] text-[11px] uppercase tracking-[0.16em] text-[#1C1B1A] font-medium mb-2" htmlFor="message">
                      Lời Nhắn Hoặc Yêu Cầu Chi Tiết <span className="text-[#B86B35]">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Chia sẻ mong muốn của bạn về tác phẩm thủ công, thời gian dự kiến ghé thăm xưởng hoặc nội dung hợp tác bảo tồn di sản..."
                      className="w-full bg-[#FDFBF7] border border-[#E6E2DA] focus:border-[#B86B35] outline-none p-4 font-['Inter'] text-[13px] text-[#1C1B1A] placeholder:text-[#5A5854]/50 transition-colors resize-y leading-relaxed"
                    ></textarea>
                  </div>

                  {/* Direct Submission Trigger */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1C1B1A] hover:bg-[#B86B35] text-[#FFFFFF] py-4 px-8 transition-all duration-200 uppercase font-['Montserrat'] text-[11px] tracking-[0.2em] font-semibold text-center flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <span>{loading ? 'Đang Gửi Lời Nhắn...' : 'Gửi Lời Nhắn Đến Xưởng'}</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>

                  {/* Discrete State Confirmation Banner */}
                  {submitted && (
                    <div className="border border-[#B86B35]/60 bg-[#F4F2EE] p-4 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#B86B35] text-[20px] shrink-0 mt-0.5">check_circle</span>
                        <div className="flex-1">
                          <p className="font-['Inter'] text-[12px] uppercase tracking-wider text-[#1C1B1A] font-semibold">
                            Lời Nhắn Đã Được Ghi Nhận Thành Công
                          </p>
                          <p className="font-['Inter'] text-[13px] text-[#5A5854] mt-1">
                            Ban điều phối và các nghệ nhân phụ trách xưởng sẽ nghiên cứu yêu cầu và phản hồi qua email hoặc số điện thoại trong vòng 24 giờ làm việc.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Reassurance Pillar Bar */}
      <section className="w-full border-t border-[#E6E2DA] bg-[#FFFFFF] py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Reassurance 1 */}
            <div className="flex items-start gap-3.5 pr-4 border-b md:border-b-0 md:border-r border-[#E6E2DA] pb-6 md:pb-0">
              <div className="w-8 h-8 border border-[#E6E2DA] bg-[#F4F2EE] flex items-center justify-center shrink-0 text-[#B86B35]">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div>
                <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.14em] text-[#1C1B1A] font-semibold block mb-1">
                  Bảo Mật Dữ Liệu
                </span>
                <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-snug">
                  Thông tin cá nhân chỉ phục vụ trao đổi văn hóa, điều phối lịch hẹn và kết nối xưởng thủ công nguyên bản.
                </p>
              </div>
            </div>

            {/* Reassurance 2 */}
            <div className="flex items-start gap-3.5 pr-4 border-b md:border-b-0 md:border-r border-[#E6E2DA] pb-6 md:pb-0">
              <div className="w-8 h-8 border border-[#E6E2DA] bg-[#F4F2EE] flex items-center justify-center shrink-0 text-[#B86B35]">
                <span className="material-symbols-outlined text-[18px]">handshake</span>
              </div>
              <div>
                <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.14em] text-[#1C1B1A] font-semibold block mb-1">
                  Kết Nối Trực Tiếp
                </span>
                <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-snug">
                  Làm việc trực tiếp cùng nghệ nhân lão thành và tổ nghề bản địa, tuyệt đối không qua trung gian thương mại.
                </p>
              </div>
            </div>

            {/* Reassurance 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 border border-[#E6E2DA] bg-[#F4F2EE] flex items-center justify-center shrink-0 text-[#B86B35]">
                <span className="material-symbols-outlined text-[18px]">compass_calibration</span>
              </div>
              <div>
                <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.14em] text-[#1C1B1A] font-semibold block mb-1">
                  Hỗ Trợ Đón Tiếp
                </span>
                <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-snug">
                  Cung cấp lộ trình điền dã chi tiết, chuẩn bị trà mạn và hướng dẫn các nghi thức tôn trọng bàn xoay lò thủ công.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
