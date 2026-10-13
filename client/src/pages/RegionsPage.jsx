import React from 'react';

export default function RegionsPage() {
  return (
    <div className="craft-container py-12">
      <div className="border-b border-[#E6E2DA] pb-6 mb-8">
        <span className="spec-code text-[#B86B35]">BẢN ĐỒ VĂN HÓA</span>
        <h1 className="headline-title mt-2">Vùng Miền & 120+ Làng Nghề Truyền Thống</h1>
        <p className="body-default mt-2">Khám phá bản sắc di sản theo không gian địa lý Bắc - Trung - Nam.</p>
      </div>
      <div className="border border-dashed border-[#E6E2DA] p-12 text-center bg-[#FFFFFF]">
        <span className="material-symbols-outlined text-4xl text-[#B86B35] mb-2">map</span>
        <p className="body-default text-[#5A5854]">Khung giao diện Bản đồ văn hóa và Làng nghề vùng miền</p>
      </div>
    </div>
  );
}
