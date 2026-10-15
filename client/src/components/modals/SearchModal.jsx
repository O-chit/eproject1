import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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

  if (!isOpen) return null;

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/crafts?q=${encodeURIComponent(query.trim())}`);
  }

  const QUICK_SUGGESTIONS = [
    { label: 'Gốm Bát Tràng', query: 'Bát Tràng' },
    { label: 'Lụa Vạn Phúc', query: 'Vạn Phúc' },
    { label: 'Tranh Đông Hồ', query: 'Đông Hồ' },
    { label: 'Gốm Chăm Bàu Trúc', query: 'Bàu Trúc' },
    { label: 'Thổ cẩm Lùng Tám', query: 'Lùng Tám' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#1C1B1A]/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-surface-crisp border border-border-neutral shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border-neutral">
          <span className="font-spec-code text-[11px] uppercase tracking-widest text-accent-terracotta font-semibold">
            TRA CỨU DI SẢN LÀNG NGHỀ
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-[11px] font-spec-code uppercase"
          >
            [ESC ĐÓNG]
          </button>
        </div>

        <form onSubmit={handleSearch} className="mt-4">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-text-secondary text-[22px]">
              search
            </span>
            <input
              type="text"
              autoFocus
              className="w-full h-12 pl-11 pr-24 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[14px] focus:outline-none focus:border-accent-terracotta"
              placeholder="Nhập tên làng nghề, nghệ nhân, chất liệu (gốm, lụa, đồng...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 h-9 bg-accent-terracotta text-white font-spec-code text-[11px] uppercase tracking-wider hover:bg-[#8E4A16] transition-colors cursor-pointer"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        <div className="mt-5">
          <span className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">
            GỢI Ý TRA CỨU NHANH:
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {QUICK_SUGGESTIONS.map((sug) => (
              <button
                key={sug.query}
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/crafts?q=${encodeURIComponent(sug.query)}`);
                }}
                className="px-3 py-1 bg-surface-subtle border border-border-neutral hover:border-accent-terracotta font-spec-code text-[11px] text-text-primary transition-colors cursor-pointer"
              >
                #{sug.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
