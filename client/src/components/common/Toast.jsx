import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  const typeStyles = {
    info: 'border-accent-terracotta bg-canvas-linen text-text-primary',
    success: 'border-emerald-700 bg-[#F4F9F5] text-emerald-900',
    warning: 'border-amber-700 bg-[#FFFDF5] text-amber-900',
    error: 'border-red-700 bg-[#FDF5F5] text-red-900',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 border shadow-xl animate-in slide-in-from-bottom duration-200 ${typeStyles[type] || typeStyles.info}`}>
      <span className="font-spec-code text-[11px] uppercase tracking-wider font-semibold">
        [DI SẢN]
      </span>
      <span className="font-body-spec text-[13px]">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-text-secondary hover:text-text-primary cursor-pointer"
          aria-label="Đóng thông báo"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}
