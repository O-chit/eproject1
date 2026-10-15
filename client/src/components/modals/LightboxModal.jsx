import React, { useEffect } from 'react';

export default function LightboxModal({ imageSrc, title, caption, isOpen, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 cursor-pointer z-10"
        aria-label="Đóng xem ảnh"
      >
        <span className="material-symbols-outlined text-[32px]">close</span>
      </button>

      <div className="max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageSrc}
          alt={title || 'Tác phẩm di sản'}
          className="max-h-[78vh] w-auto object-contain border border-white/10 shadow-2xl"
        />
        {(title || caption) && (
          <div className="mt-4 text-center text-white">
            {title && <h4 className="font-headline-title text-[18px]">{title}</h4>}
            {caption && <p className="font-body-spec text-[12px] text-gray-300 mt-1">{caption}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
