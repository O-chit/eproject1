'use client';

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * RegionDetailModal
 * Component Popup Trang Chi Tiết Vùng Văn Hóa Làng Nghề
 * Được thiết kế chuẩn theo Hệ thống Thiết kế "Human-Crafted Sharp Linework" của CraftRoots:
 * - Nền Canvas Linen mộc: #F9F8F6
 * - Bề mặt thẻ tinh khiết: #FFFFFF / #F4F2EE
 * - Đường viền Linework sắc nét: #E6E2DA
 * - Mực đen truyền thống: #1C1B1A
 * - Màu chữ thứ cấp: #5A5854
 * - Màu điểm nhấn thương hiệu Terracotta Đất Nung: #B86B35
 */
export default function RegionDetailModal({ region, isOpen, onClose }) {
  // Lắng nghe phím Escape để đóng popup
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !region) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-[#1C1B1A]/65 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="region-modal-title"
    >
      {/* Khung nội dung trang popup - Phong cách Linen & Sharp Linework */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#F9F8F6] border border-[#E6E2DA] shadow-2xl overflow-hidden flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()} // Ngăn nổi bọt sự kiện để không đóng khi click trong modal
        style={{
          boxShadow: `0 25px 50px -12px rgba(28, 27, 26, 0.25), 0 0 0 1px #E6E2DA`
        }}
      >
        {/* Đường line màu đặc trưng của vùng văn hóa ở trên cùng */}
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: region.color }} />

        {/* HEADER POPUP */}
        <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#E6E2DA] flex items-start justify-between gap-4 shrink-0">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-white shadow-xs"
                style={{ backgroundColor: region.color }}
              >
                {region.id}
              </span>
              <span className="font-mono text-[11px] font-semibold text-[#B86B35] uppercase tracking-widest">
                DI SẢN LÀNG NGHỀ TRUYỀN THỐNG
              </span>
            </div>
            <h2
              id="region-modal-title"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1C1B1A] tracking-wide uppercase font-serif"
            >
              {region.name}
            </h2>
            <span className="text-xs sm:text-sm text-[#5A5854] font-serif italic">
              {region.subName}
            </span>
          </div>

          {/* Nút đóng X sắc nét */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-[#F4F2EE] hover:bg-[#1C1B1A] text-[#5A5854] hover:text-[#FFFFFF] border border-[#E6E2DA] transition-colors cursor-pointer text-base shrink-0"
            title="Đóng trang chi tiết (Esc)"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* THANH CHỈ SỐ DI SẢN (HERITAGE STATS BAR) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-[#E6E2DA] border-b border-[#E6E2DA] bg-[#F4F2EE] text-center font-mono shrink-0">
          <div className="py-2.5 px-3">
            <span className="text-[10px] uppercase text-[#867368] block tracking-wider">Tỉnh thành</span>
            <span className="text-base sm:text-lg font-bold text-[#1C1B1A] font-serif">
              {region.provinces ? region.provinces.length : 0} Địa phương
            </span>
          </div>
          <div className="py-2.5 px-3">
            <span className="text-[10px] uppercase text-[#867368] block tracking-wider">Làng nghề tiêu biểu</span>
            <span className="text-base sm:text-lg font-bold text-[#B86B35] font-serif">
              {region.crafts ? region.crafts.length : 0} Làng nghề
            </span>
          </div>
          <div className="py-2.5 px-3 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-[#E6E2DA]">
            <span className="text-[10px] uppercase text-[#867368] block tracking-wider">Bản sắc</span>
            <span className="text-xs sm:text-sm font-semibold text-[#1C1B1A] truncate block font-serif">
              Thủ công tinh hoa
            </span>
          </div>
        </div>

        {/* NỘI DUNG CUỘN (SCROLLABLE CONTENT) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-thin scrollbar-thumb-[#D9C2B5] scrollbar-track-transparent">
          {/* 1. Đặc trưng văn hóa nghề */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-4" style={{ backgroundColor: region.color }} />
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#1C1B1A] font-bold">
                Đặc Trưng Văn Hóa Nghề & Không Gian Di Sản
              </h3>
            </div>
            <p className="text-sm sm:text-[14px] text-[#5A5854] leading-relaxed bg-[#FFFFFF] p-4 sm:p-5 border border-[#E6E2DA] shadow-xs">
              {region.description}
            </p>
          </div>

          {/* 2. Danh sách làng nghề tiêu biểu */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4" style={{ backgroundColor: region.color }} />
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#1C1B1A] font-bold">
                  Làng Nghề Truyền Thống Tiêu Biểu ({region.crafts ? region.crafts.length : 0})
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#867368]">
                Gìn giữ kỹ pháp cổ truyền
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {region.crafts &&
                region.crafts.map((craft) => (
                  <div
                    key={craft.id}
                    className="p-4 bg-[#FFFFFF] border border-[#E6E2DA] hover:border-[#B86B35] transition-all flex flex-col justify-between group shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-sm sm:text-base text-[#1C1B1A] font-serif group-hover:text-[#B86B35] transition-colors">
                          {craft.name}
                        </h4>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 shrink-0 border border-[#E6E2DA] bg-[#F9F8F6] text-[#5A5854]"
                        >
                          {craft.province}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A5854] leading-relaxed mb-3 line-clamp-3">
                        {craft.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#F4F2EE] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#867368]">Kỹ nghệ thủ công</span>
                      <Link
                        to={`/crafts?q=${encodeURIComponent(craft.name)}`}
                        className="text-[#B86B35] hover:text-[#8E4A16] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Xem tác phẩm</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 3. Tỉnh thành trực thuộc */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-4" style={{ backgroundColor: region.color }} />
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#1C1B1A] font-bold">
                Địa Giới {region.provinces ? region.provinces.length : 0} Tỉnh Thành Trực Thuộc
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 bg-[#FFFFFF] p-3.5 border border-[#E6E2DA] shadow-xs">
              {region.provinces &&
                region.provinces.map((prov) => (
                  <span
                    key={prov}
                    className="px-2.5 py-1 bg-[#F9F8F6] border border-[#E6E2DA] text-[#5A5854] hover:text-[#1C1B1A] hover:border-[#B86B35] text-xs font-mono transition-colors"
                  >
                    {prov}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* FOOTER HÀNH ĐỘNG */}
        <div className="p-4 sm:p-5 border-t border-[#E6E2DA] bg-[#FFFFFF] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#867368] font-mono text-center sm:text-left">
            <span>Đang xem chi tiết di sản: </span>
            <span className="text-[#1C1B1A] font-bold">{region.name}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              to={`/crafts?q=${encodeURIComponent(region.name)}`}
              className="flex-1 sm:flex-none py-2.5 px-5 bg-[#B86B35] hover:bg-[#8E4A16] text-[#FFFFFF] font-mono text-xs uppercase tracking-wider font-bold transition-colors text-center shadow-xs"
            >
              Khám Phá Toàn Bộ Di Sản Vùng
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-[#F4F2EE] hover:bg-[#E6E2DA] text-[#1C1B1A] border border-[#E6E2DA] font-mono text-xs uppercase tracking-wider transition-colors text-center cursor-pointer"
            >
              Quay Lại Bản Đồ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
