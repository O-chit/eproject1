import React from 'react';

export default function DirectoryPage() {
  return (
    <div className="craft-container py-12">
      <div className="border-b border-[#E6E2DA] pb-6 mb-8">
        <span className="spec-code text-[#B86B35]">PHÂN HỆ DANH MỤC</span>
        <h1 className="headline-title mt-2">Danh Mục Di Sản Thủ Công</h1>
        <p className="body-default mt-2">Khung giao diện danh mục tác phẩm làng nghề và bộ lọc đa diện.</p>
      </div>
      <div className="border border-dashed border-[#E6E2DA] p-12 text-center bg-[#FFFFFF]">
        <span className="material-symbols-outlined text-4xl text-[#B86B35] mb-2">grid_view</span>
        <p className="body-default text-[#5A5854]">Khung giao diện Danh mục sản phẩm (Sẽ triển khai ở Sprint 4)</p>
      </div>
    </div>
  );
}
