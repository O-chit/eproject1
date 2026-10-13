import React from 'react';

export default function SeasonalPage() {
  return (
    <div className="craft-container py-12">
      <div className="border-b border-[#E6E2DA] pb-6 mb-8">
        <span className="spec-code text-[#B86B35]">BỘ SƯU TẬP THEO MÙA</span>
        <h1 className="headline-title mt-2">Mùa Triển Lãm & Tuyển Tập Văn Hóa</h1>
        <p className="body-default mt-2">Không gian trưng bày chuyên đề 4 mùa với tác phẩm Hero tiêu điểm.</p>
      </div>
      <div className="border border-dashed border-[#E6E2DA] p-12 text-center bg-[#FFFFFF]">
        <span className="material-symbols-outlined text-4xl text-[#B86B35] mb-2">auto_awesome</span>
        <p className="body-default text-[#5A5854]">Khung giao diện Bộ sưu tập theo mùa (Sẽ triển khai ở Sprint 5)</p>
      </div>
    </div>
  );
}
