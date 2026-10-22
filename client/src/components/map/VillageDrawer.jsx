import React from 'react';
import { Link } from 'react-router-dom';
import { CRAFT_CATEGORIES } from './craftVillages';

export default function VillageDrawer({ village, onClose }) {
  if (!village) return null;

  const categoryMeta = CRAFT_CATEGORIES[village.category] || {
    label: village.categoryLabel || 'Thủ Công Truyền Thống',
    color: '#B86B35',
    icon: 'category'
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[380px] md:w-[420px] bg-canvas-linen border-l border-border-neutral shadow-2xl z-30 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-border-neutral bg-surface-crisp flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: categoryMeta.color }}
          ></span>
          <span className="font-spec-code text-[11px] uppercase tracking-[0.16em] text-accent-terracotta font-semibold">
            {village.regionName}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng chi tiết"
          className="w-8 h-8 rounded-none border border-border-neutral bg-surface-crisp flex items-center justify-center text-text-secondary hover:text-accent-terracotta hover:border-accent-terracotta transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5 font-body-spec">
        {/* Village Hero Image */}
        {village.image && (
          <div className="relative w-full aspect-video border border-border-neutral overflow-hidden group">
            <img
              src={village.image}
              alt={village.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-surface-crisp font-spec-code text-[11px]">
              <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-none uppercase tracking-wider">
                {village.established}
              </span>
              <span className="flex items-center gap-1 text-[10px] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Di Tích Sống
              </span>
            </div>
          </div>
        )}

        {/* Title & Location */}
        <div>
          <h3 className="font-display-hero text-[17px] sm:text-[20px] font-semibold text-text-primary uppercase tracking-[1px] sm:tracking-[2px] leading-tight mb-1.5">
            {village.name}
          </h3>
          <div className="flex items-center gap-1.5 text-text-secondary text-[12px] font-spec-code">
            <span className="material-symbols-outlined text-[15px] text-accent-terracotta shrink-0">
              location_on
            </span>
            <span>{village.province}</span>
          </div>
        </div>

        {/* Category Pill & Metrics */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border-neutral/70 font-spec-code">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-text-secondary tracking-wider">
              Dòng nghề chính
            </span>
            <span className="text-[12px] font-semibold text-text-primary mt-0.5">
              {categoryMeta.label}
            </span>
          </div>
          <div className="flex flex-col border-l border-border-neutral/70 pl-3">
            <span className="text-[10px] uppercase text-text-secondary tracking-wider">
              Hồ sơ lưu trữ
            </span>
            <span className="text-[12px] font-semibold text-accent-terracotta mt-0.5">
              {village.craftsCount || 12} Tác phẩm
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <div className="font-spec-code text-[10px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold mb-2">
            Mộc bản địa chí
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {village.description}
          </p>
        </div>

        {/* Representative Artisan */}
        {village.representativeArtisan && (
          <div className="p-3.5 bg-surface-subtle border border-border-neutral flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-accent-terracotta bg-surface-crisp flex items-center justify-center text-accent-terracotta font-serif font-bold text-sm shrink-0">
                CR
              </div>
              <div className="flex flex-col">
                <span className="font-spec-code text-[9px] uppercase tracking-wider text-text-secondary">
                  Nghệ nhân tiêu biểu
                </span>
                <span className="text-[13px] font-semibold text-text-primary">
                  {village.representativeArtisan}
                </span>
              </div>
            </div>
            <Link
              to="/artisans"
              className="font-spec-code text-[10px] uppercase text-accent-terracotta hover:underline tracking-wider"
            >
              Hồ sơ →
            </Link>
          </div>
        )}

        {/* Coordinate Stamp */}
        <div className="font-spec-code text-[10px] text-text-secondary/80 flex items-center justify-between pt-1">
          <span>TỌA ĐỘ VỆ TINH:</span>
          <span className="text-text-primary font-spec-code font-semibold">
            {village.coordinates ? `${village.coordinates[1]}° N, ${village.coordinates[0]}° E` : ''}
          </span>
        </div>
      </div>

      {/* Drawer Actions */}
      <div className="p-4 border-t border-border-neutral bg-surface-crisp flex items-center gap-3 shrink-0">
        <Link
          to={village.craftId ? `/crafts/${village.craftId}` : '/crafts'}
          className="flex-1 py-2.5 px-4 bg-text-primary hover:bg-accent-terracotta text-surface-crisp font-label-action text-[11px] uppercase tracking-[0.15em] text-center transition-colors font-semibold"
        >
          Khám Phá Kỹ Pháp
        </Link>
        <Link
          to="/contact"
          className="py-2.5 px-3 border border-border-neutral hover:border-accent-terracotta text-text-primary hover:text-accent-terracotta font-spec-code text-[11px] uppercase tracking-wider transition-colors"
          title="Đặt lịch thăm xưởng"
        >
          Thăm Xưởng
        </Link>
      </div>
    </div>
  );
}
