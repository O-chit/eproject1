import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="craft-container py-24 text-center">
      <span className="spec-code text-[#B86B35]">MÃ LỖI 404</span>
      <h1 className="font-['Playfair_Display'] text-4xl font-semibold mt-3 mb-4 text-[#1C1B1A]">
        Không Tìm Thấy Trang Di Sản
      </h1>
      <p className="body-default text-[#5A5854] max-w-md mx-auto mb-8">
        Đường dẫn bạn truy cập có thể đã được thay đổi hoặc chưa nằm trong danh mục lưu trữ.
      </p>
      <Link
        to="/"
        className="craft-btn craft-btn-primary"
      >
        Trở Về Trang Chủ
      </Link>
    </div>
  );
}
