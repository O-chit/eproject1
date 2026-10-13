import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CraftDetailPage() {
  const { id } = useParams();

  return (
    <div className="craft-container py-12">
      <div className="border-b border-[#E6E2DA] pb-6 mb-8">
        <Link to="/crafts" className="text-xs font-['Montserrat'] uppercase tracking-wider text-[#B86B35] hover:underline flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Quay lại danh mục
        </Link>
        <span className="spec-code text-[#B86B35]">CHI TIẾT TÁC PHẨM #{id}</span>
        <h1 className="headline-title mt-2">Hồ Sơ Tác Phẩm & Quan Hệ Nghệ Nhân</h1>
      </div>
      <div className="border border-dashed border-[#E6E2DA] p-12 text-center bg-[#FFFFFF]">
        <span className="material-symbols-outlined text-4xl text-[#B86B35] mb-2">article</span>
        <p className="body-default text-[#5A5854]">Khung giao diện Chi tiết tác phẩm, Gallery Lightbox & Nghệ nhân N-N (Sẽ triển khai ở Sprint 4)</p>
      </div>
    </div>
  );
}
