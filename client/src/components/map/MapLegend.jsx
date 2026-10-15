import React from 'react';
import { CRAFT_CATEGORIES } from './craftVillages';

export default function MapLegend({
  selectedCategory,
  onSelectCategory,
  totalVillages = 18,
  activeRegionLabel = 'Toàn Quốc'
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => setIsCollapsed(false)}
        className="bg-canvas-linen/95 backdrop-blur-md border border-border-neutral px-3 py-2 shadow-xl flex items-center gap-2 font-spec-code text-[11px] text-text-primary hover:text-accent-terracotta transition-colors cursor-pointer"
        title="Mở bảng chú giải & bộ lọc ngành nghề"
      >
        <span className="material-symbols-outlined text-[16px] text-accent-terracotta">tune</span>
        <span className="uppercase tracking-wider font-semibold">Chú Giải & Lọc Nghề</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className="bg-canvas-linen/95 backdrop-blur-md border border-border-neutral p-4 shadow-xl flex flex-col gap-3 font-spec-code text-[11px] select-none max-w-xs w-full transition-all">
      {/* Sovereignty Badge & Minimize Toggle */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border-neutral">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-terracotta shrink-0 animate-pulse"></span>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-terracotta">
              Chủ Quyền Lãnh Thổ
            </span>
            <span className="text-[9px] text-text-secondary leading-tight mt-0.5">
              Hoàng Sa & Trường Sa (Việt Nam)
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          className="text-text-secondary hover:text-accent-terracotta p-1 cursor-pointer"
          title="Thu gọn bảng chú giải"
        >
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </button>
      </div>

      {/* Region Status */}
      <div className="flex items-center justify-between text-text-secondary text-[10px] tracking-wider uppercase">
        <span>Vùng khảo cứu:</span>
        <span className="text-text-primary font-semibold">{activeRegionLabel}</span>
      </div>

      {/* Category Toggles */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-text-secondary font-medium">
          <span>Ngành Nghề ({totalVillages} điểm)</span>
          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className="text-accent-terracotta hover:underline cursor-pointer lowercase text-[10px]"
            >
              xem tất cả
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {Object.values(CRAFT_CATEGORIES).map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`flex items-center justify-between py-1 px-2 rounded-none transition-all text-left cursor-pointer border ${
                  isSelected
                    ? 'bg-surface-crisp border-accent-terracotta text-accent-terracotta font-semibold shadow-xs'
                    : 'border-transparent text-text-secondary hover:bg-surface-crisp hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  <span className="text-[11px] truncate">{cat.label}</span>
                </div>
                <span className="material-symbols-outlined text-[13px] opacity-60">
                  {cat.icon}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cluster Guide */}
      <div className="pt-2 border-t border-border-neutral/70 flex items-center justify-between text-[10px] text-text-secondary">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full border border-accent-terracotta bg-accent-terracotta/20 flex items-center justify-center text-[9px] font-bold text-accent-terracotta">
            N
          </div>
          <span>Cụm gom điểm</span>
        </div>
        <span className="opacity-60 text-[9px]">Click phóng to</span>
      </div>
    </div>
  );
}
