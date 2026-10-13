import React from 'react';

export default function ContactPage() {
  return (
    <div className="craft-container py-12">
      <div className="border-b border-[#E6E2DA] pb-6 mb-8">
        <span className="spec-code text-[#B86B35]">KẾT NỐI DI SẢN</span>
        <h1 className="headline-title mt-2">Gặp Gỡ & Đặt Lịch Hẹn Xưởng Nghề</h1>
        <p className="body-default mt-2">Biểu mẫu liên hệ đóng góp tư liệu và tham quan trải nghiệm.</p>
      </div>
      <div className="border border-dashed border-[#E6E2DA] p-12 text-center bg-[#FFFFFF]">
        <span className="material-symbols-outlined text-4xl text-[#B86B35] mb-2">mail</span>
        <p className="body-default text-[#5A5854]">Khung giao diện Form Liên Hệ (Sẽ triển khai ở Sprint 5)</p>
      </div>
    </div>
  );
}
