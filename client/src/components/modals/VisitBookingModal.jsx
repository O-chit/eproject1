import React, { useState } from 'react';

export default function VisitBookingModal({ artisan, isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('Sáng: 09:30 - 11:30');
  const [note, setNote] = useState('Đàm đạo trà & Tìm hiểu kỹ thuật cổ truyền');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (onSuccess) onSuccess({ name, phone, date, slot, note, artisanId: artisan?.id });
      setSubmitted(false);
      onClose();
    }, 1800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B1A]/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-surface-crisp border border-border-neutral w-full max-w-lg p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary cursor-pointer"
          aria-label="Đóng cửa sổ"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <span className="font-spec-code text-[11px] uppercase tracking-widest text-accent-terracotta font-semibold">
          KẾT NỐI DI SẢN TRỰC TIẾP
        </span>
        <h3 className="font-headline-title text-[20px] text-text-primary uppercase mt-1">
          Đặt Lịch Thăm Xưởng {artisan?.name ? `• ${artisan.name}` : ''}
        </h3>
        <p className="font-body-spec text-[12px] text-text-secondary mt-1">
          Trải nghiệm quan sát quy trình chế tác thủ công và đàm đạo trà đàm cùng nghệ nhân ưu tú.
        </p>

        {submitted ? (
          <div className="my-6 p-4 bg-[#F4F9F5] border border-emerald-700 text-emerald-900 text-center font-body-spec text-[13px]">
            Đã tiếp nhận yêu cầu đặt lịch hẹn! Ban thư ký di sản CraftRoots sẽ liên lạc với bạn qua số {phone} trong vòng 4 giờ làm việc.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Họ và tên quý khách *
              </label>
              <input
                className="w-full h-11 bg-surface-crisp px-4 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                placeholder="Nguyễn Văn An"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Số điện thoại liên lạc *
              </label>
              <input
                className="w-full h-11 bg-surface-crisp px-4 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                placeholder="0912 345 678"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                  Ngày hẹn *
                </label>
                <input
                  type="date"
                  required
                  className="w-full h-11 bg-surface-crisp px-3 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                  Khung giờ tiếp
                </label>
                <select
                  className="w-full h-11 bg-surface-crisp px-3 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                >
                  <option>Sáng: 09:30 - 11:30</option>
                  <option>Chiều: 14:00 - 16:00</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Mục đích chuyến thăm
              </label>
              <select
                className="w-full h-11 bg-surface-crisp px-3 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              >
                <option value="Đàm đạo trà & Tìm hiểu kỹ thuật cổ truyền">Đàm đạo trà &amp; Tìm hiểu kỹ thuật cổ truyền</option>
                <option value="Quan sát chu kỳ dỡ lò nung củi">Quan sát chu kỳ dỡ lò nung củi</option>
                <option value="Đặt chế tác tác phẩm gia bảo độc bản">Đặt chế tác tác phẩm gia bảo độc bản</option>
                <option value="Nghiên cứu học thuật dân tộc học / mỹ thuật">Nghiên cứu học thuật dân tộc học / mỹ thuật</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[12px] uppercase tracking-[0.2em] py-3.5 mt-2 transition-colors cursor-pointer"
            >
              GỬI YÊU CẦU ĐẶT LỊCH HẸN →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
