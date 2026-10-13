import React from 'react';

export default function ArtisansPage() {
  return (
    <div className="craft-container py-12">
      <div className="border-b border-[#E6E2DA] pb-6 mb-8">
        <span className="spec-code text-[#B86B35]">PHÂN HỆ NGHỆ NHÂN</span>
        <h1 className="headline-title mt-2">Hồ Sơ Nghệ Nhân Bậc Thầy</h1>
        <p className="body-default mt-2">Tôn vinh bàn tay vàng và các tác phẩm tham gia chế tác.</p>
      </div>
      <div className="border border-dashed border-[#E6E2DA] p-12 text-center bg-[#FFFFFF]">
        <span className="material-symbols-outlined text-4xl text-[#B86B35] mb-2">person</span>
        <p className="body-default text-[#5A5854]">Khung giao diện Danh sách & Hồ sơ chi tiết Nghệ nhân (Sẽ triển khai ở Sprint 4)</p>
      </div>
    </div>
  );
}
