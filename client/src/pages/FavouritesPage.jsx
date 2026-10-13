import React from 'react';

export default function FavouritesPage() {
  return (
    <div className="craft-container py-12">
      <div className="border-b border-[#E6E2DA] pb-6 mb-8">
        <span className="spec-code text-[#B86B35]">LƯU TRỮ CÁ NHÂN</span>
        <h1 className="headline-title mt-2">Tác Phẩm Yêu Thích & Đã Đánh Dấu</h1>
        <p className="body-default mt-2">Cơ chế lưu trữ lưỡng thể Hybrid: Local Storage kết hợp đồng bộ hóa PostgreSQL.</p>
      </div>
      <div className="border border-dashed border-[#E6E2DA] p-12 text-center bg-[#FFFFFF]">
        <span className="material-symbols-outlined text-4xl text-[#B86B35] mb-2">bookmark</span>
        <p className="body-default text-[#5A5854]">Khung giao diện Danh sách yêu thích & Đồng bộ đám mây (Sẽ triển khai ở Sprint 5)</p>
      </div>
    </div>
  );
}
