import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const DEFAULT_TABS = [
  { id: 'all', label: 'TẤT CẢ (ALL)' },
  { id: '1', label: 'GỐM SỨ' },
  { id: '2', label: 'ĐÚC ĐỒNG' },
  { id: '3', label: 'DỆT MAY' },
  { id: '4', label: 'MÂY TRE ĐAN' },
  { id: '5', label: 'SƠN MÀI' },
];

export default function DirectoryPage() {
  const [tabs, setTabs] = useState(DEFAULT_TABS);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set([1, 3]));

  // Nạp danh mục từ DB
  useEffect(() => {
    async function loadCategories() {
      try {
        const catData = await api.getCategories();
        if (Array.isArray(catData) && catData.length > 0) {
          const dynamicTabs = [
            { id: 'all', label: 'TẤT CẢ (ALL)' },
            ...catData.map((c) => ({
              id: String(c.id),
              slug: c.slug,
              label: c.name.toUpperCase(),
            })),
          ];
          setTabs(dynamicTabs);
        }
      } catch (err) {
        console.warn('Lỗi tải danh mục từ DB:', err.message);
      }
    }
    loadCategories();
  }, []);

  // Nạp danh sách sản phẩm từ DB theo bộ lọc
  useEffect(() => {
    let isMounted = true;
    async function loadCrafts() {
      try {
        setLoading(true);
        const params = { limit: 50 };
        if (selectedTab !== 'all') {
          params.category = selectedTab;
        }
        if (searchQuery.trim()) {
          params.q = searchQuery.trim();
        }

        const data = await api.getCrafts(params);
        const items = Array.isArray(data) ? data : data.data || [];
        if (isMounted) {
          setCrafts(items);
        }
      } catch (err) {
        console.warn('Lỗi tải sản phẩm từ DB:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadCrafts();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedTab, searchQuery]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('craftroots_favourites');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedIds(new Set(parsed.map((item) => item.id || item)));
        }
      }
    } catch {
      // Giữ mặc định
    }
  }, []);

  const toggleSave = (item) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }

      try {
        const stored = localStorage.getItem('craftroots_favourites');
        let list = stored ? JSON.parse(stored) : [];
        if (next.has(item.id)) {
          if (!list.find((i) => (i.id || i) === item.id)) {
            list.push(item);
          }
        } else {
          list = list.filter((i) => (i.id || i) !== item.id);
        }
        localStorage.setItem('craftroots_favourites', JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
      } catch {
        // Fallback
      }

      return next;
    });
  };

  const displayItems = crafts.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.categorySlug || item.category,
    categoryLabel: item.category || 'THỦ CÔNG VIỆT NAM',
    origin: `${item.region || 'Làng Nghề Truyền Thống'} — Di sản sống`,
    description: item.shortDescription || item.description || 'Chế tác thủ công từ các nghệ nhân lành nghề.',
    refCode: `CR-${item.id < 10 ? '0' : ''}${item.id}`,
    edition: item.isFeatured ? 'ĐẶC SẮC TUYỂN CHỌN' : `Bản ghi di sản #${item.id}`,
    price: item.price || 'Liên hệ giám tuyển',
    image: item.thumbnailUrl || item.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
  }));

  return (
    <div className="w-full bg-canvas-linen">
      {/* Top Archival Header */}
      <section className="w-full border-b border-border-neutral bg-canvas-linen py-space-xl">
        <div className="max-w-7xl mx-auto px-margin">
          {/* Metadata tracker */}
          <div className="flex items-center gap-space-sm mb-space-sm">
            <span className="font-spec-code text-spec-code uppercase tracking-[0.2em] text-accent-terracotta">
              Hồ sơ tư liệu hóa
            </span>
            <span className="text-border-neutral opacity-60">|</span>
            <span className="font-spec-code text-spec-code text-text-secondary tracking-[0.08em]">
              Mã danh mục: CAT-VN-2024
            </span>
            <span className="text-border-neutral opacity-60">|</span>
            <span className="font-spec-code text-spec-code text-text-secondary">
              Cập nhật: Quý IV/2024
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display-hero text-display-hero text-text-primary uppercase tracking-[0.3em] font-light leading-tight mb-space-sm">
            DANH MỤC DI SẢN THỦ CÔNG
          </h1>
          <p className="font-body-default text-body-default text-text-secondary max-w-3xl leading-relaxed">
            Kho lưu trữ hơn 240 tác phẩm thủ công nguyên bản từ các làng nghề truyền thống Việt Nam. Mỗi hiện vật được định danh độc bản cùng chứng thư nguồn gốc địa dư và kỹ pháp chế tác nguyên bản.
          </p>

          {/* Search & Quantitative Filters Bar */}
          <div className="mt-space-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
            {/* Pill Search */}
            <div className="relative flex-1 max-w-xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên tác phẩm, làng nghề hoặc chất liệu..."
                className="w-full h-12 pl-12 pr-6 rounded-[50px] bg-surface-crisp border border-border-neutral text-body-spec font-body-spec text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-terracotta transition-colors shadow-sm"
              />
            </div>

            {/* Density Counter & Quick View Mode */}
            <div className="flex items-center gap-space-md self-end md:self-center font-spec-code text-spec-code text-text-secondary">
              <span className="text-text-primary font-semibold">
                {displayItems.length} HIỆN VẬT KHẢ DỤNG
              </span>
              <span className="text-border-neutral opacity-60">|</span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-accent-terracotta transition-colors">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                LỌC KỸ PHÁP
              </span>
              <span className="text-border-neutral opacity-60">|</span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-accent-terracotta transition-colors">
                <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                SẮP XẾP: THỨ HẠNG LỊCH SỬ
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pipe-delimited Categorical Tab Navigation */}
      <section className="w-full bg-surface-crisp border-b border-border-neutral sticky top-[134px] md:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-margin overflow-x-auto no-scrollbar">
          <div className="flex items-center py-4 font-label-action text-label-action tracking-[0.15em] uppercase whitespace-nowrap">
            {tabs.map((tab, idx) => (
              <React.Fragment key={tab.id}>
                {idx > 0 && <span className="mx-4 text-border-neutral opacity-60 select-none">|</span>}
                <button
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-1 transition-colors cursor-pointer ${
                    selectedTab === tab.id
                      ? 'text-text-primary font-semibold relative border-b-2 border-accent-terracotta'
                      : 'text-text-secondary hover:text-accent-terracotta'
                  }`}
                >
                  {tab.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Column / 2-Column Mobile Grid: Artisanal Catalog */}
      <section className="w-full bg-canvas-linen py-space-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-margin">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-2 border-[#B86B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-[0.15em]">
                Đang nạp kho lưu trữ hiện vật từ CSDL...
              </p>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="p-16 border border-border-neutral bg-surface-crisp text-center">
              <span className="material-symbols-outlined text-5xl text-accent-terracotta mb-3">inventory_2</span>
              <h3 className="font-headline-title text-xl font-medium text-text-primary mb-2">
                Không tìm thấy tác phẩm phù hợp
              </h3>
              <p className="font-body-default text-text-secondary mb-6">
                Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc chuyên đề.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedTab('all'); }}
                className="px-6 py-2.5 bg-text-primary text-surface-crisp font-label-action text-label-action uppercase tracking-wider font-semibold hover:bg-accent-terracotta transition-colors cursor-pointer"
              >
                XÓA BỘ LỌC
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-gutter">
              {displayItems.map((item) => (
                <article
                  key={item.id}
                  className="group relative bg-surface-crisp border border-border-neutral transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-surface-subtle">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1.5 bg-canvas-linen/90 backdrop-blur-sm border border-border-neutral px-[6px] py-[4px] md:px-2.5 md:py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta"></span>
                      <span className="font-spec-code text-[10px] tracking-[0.08em] md:tracking-[0.12em] uppercase text-text-primary">
                        {item.edition}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSave(item)}
                      aria-label="Lưu tác phẩm"
                      className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 rounded-none bg-surface-crisp/90 backdrop-blur-sm border border-border-neutral flex items-center justify-center text-text-secondary hover:text-accent-terracotta hover:bg-surface-crisp transition-colors cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[16px] md:text-[18px] ${savedIds.has(item.id) ? 'text-accent-terracotta filled' : ''}`}>
                        bookmark
                      </span>
                    </button>
                  </div>

                  <div className="p-3 sm:p-4 md:p-space-lg flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1 md:mb-space-xs truncate">
                        <span className="font-spec-code text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-accent-terracotta truncate">
                          {item.origin}
                        </span>
                      </div>
                      <h3 className="font-headline-title text-[15px] sm:text-[16px] md:text-headline-title text-text-primary tracking-tight mb-1 md:mb-space-xs group-hover:text-accent-terracotta transition-colors line-clamp-2 leading-snug">
                        <Link to={`/crafts/${item.id}`}>{item.name}</Link>
                      </h3>
                      {/* Ẩn đoạn mô tả dài trên màn hình di động */}
                      <p className="hidden md:block font-body-spec text-body-spec text-text-secondary leading-relaxed mb-space-md">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 md:pt-space-md border-t border-border-neutral flex items-center justify-between font-spec-code text-spec-code gap-1">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] md:text-[11px] text-text-secondary tracking-[0.08em] uppercase truncate">
                          Ref: {item.refCode}
                        </span>
                        <span className="text-[13px] sm:text-[14px] font-semibold text-text-primary mt-0.5 truncate">
                          {item.price}
                        </span>
                      </div>
                      <Link
                        to={`/crafts/${item.id}`}
                        className="font-label-action text-[10px] md:text-label-action tracking-[0.1em] md:tracking-[0.15em] uppercase text-text-primary border-b border-text-primary pb-0.5 hover:text-accent-terracotta hover:border-accent-terracotta transition-colors shrink-0"
                      >
                        Chi tiết →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
