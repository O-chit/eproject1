import React, { useState, useEffect } from 'react';

export default function MapControls({ onResetView, onZoomIn, onZoomOut, onTogglePitch, is3D }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5 shadow-lg select-none">
      <button
        type="button"
        onClick={onZoomIn}
        aria-label="Phóng to"
        title="Phóng to"
        className="w-9 h-9 bg-surface-crisp/95 hover:bg-surface-crisp text-text-primary hover:text-accent-terracotta border border-border-neutral flex items-center justify-center transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
      </button>

      <button
        type="button"
        onClick={onZoomOut}
        aria-label="Thu nhỏ"
        title="Thu nhỏ"
        className="w-9 h-9 bg-surface-crisp/95 hover:bg-surface-crisp text-text-primary hover:text-accent-terracotta border border-border-neutral flex items-center justify-center transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">remove</span>
      </button>

      <button
        type="button"
        onClick={onResetView}
        aria-label="Toàn cảnh Việt Nam"
        title="Toàn cảnh Việt Nam & Biển Đảo"
        className="w-9 h-9 bg-surface-crisp/95 hover:bg-surface-crisp text-text-primary hover:text-accent-terracotta border border-border-neutral flex items-center justify-center transition-colors cursor-pointer font-spec-code text-[11px] font-bold"
      >
        <span className="material-symbols-outlined text-[18px]">crop_free</span>
      </button>

      <button
        type="button"
        onClick={onTogglePitch}
        aria-label="Góc nghiêng 3D"
        title={is3D ? 'Góc nhìn 2D' : 'Góc nghiêng Sa bàn 3D'}
        className={`w-9 h-9 border border-border-neutral flex items-center justify-center transition-colors cursor-pointer font-spec-code text-[10px] font-bold uppercase ${
          is3D
            ? 'bg-accent-terracotta text-surface-crisp border-accent-terracotta'
            : 'bg-surface-crisp/95 text-text-primary hover:text-accent-terracotta'
        }`}
      >
        3D
      </button>

      <button
        type="button"
        onClick={handleToggleFullscreen}
        aria-label="Toàn màn hình trình duyệt"
        title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Toàn màn hình trình duyệt'}
        className="w-9 h-9 bg-surface-crisp/95 hover:bg-surface-crisp text-text-primary hover:text-accent-terracotta border border-border-neutral flex items-center justify-center transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">
          {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
        </span>
      </button>
    </div>
  );
}
