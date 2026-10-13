import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCrafts } from '../hooks/useCrafts';
import { useDebounce } from '../hooks/useDebounce';
import { useFavourites } from '../context/FavouritesContext';
import CraftCardSkeleton from '../components/common/CraftCardSkeleton';

import { getCategoriesApi } from '../api/metadata';

export default function DirectoryPage() {
  const [categories, setCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Nạp danh mục nghề trực tiếp từ Database
  useEffect(() => {
    getCategoriesApi()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.warn('Không thể nạp danh mục nghề từ API:', err);
      });
  }, []);

  // Tối ưu gõ tìm kiếm với debounce 350ms
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Nạp dữ liệu qua Custom Hook kết nối API Services
  const { crafts, loading, error, pagination } = useCrafts({
    category: selectedTab,
    q: debouncedSearch,
  });

  // Quản lý yêu thích lưỡng thể (Hybrid Favourites)
  const { isFav, toggleFav } = useFavourites();

  return (
    <div className="w-full bg-canvas-linen">
      {/* Top Archival Header */}
      <section className="w-full border-b border-border-neutral bg-canvas-linen py-space-xl">
        <div className="max-w-7xl mx-auto px-margin">
          {/* Metadata tracker */}
          <div className="flex items-center gap-space-sm mb-space-sm">
            <span className="font-spec-code text-spec-code uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
              HỒ SƠ TƯ LIỆU HÓA
            </span>
            <span className="text-border-neutral opacity-60">|</span>
            <span className="font-spec-code text-spec-code text-text-secondary tracking-[0.08em]">
              MÃ DANH MỤC: CAT-VN-2024
            </span>
            <span className="text-border-neutral opacity-60">|</span>
            <span className="font-spec-code text-spec-code text-text-secondary">
              CẬP NHẬT: TRỰC TUYẾN
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display-hero text-display-hero text-text-primary uppercase tracking-[0.3em] font-light leading-tight mb-space-sm">
            DANH MỤC DI SẢN THỦ CÔNG
          </h1>
          <p className="font-body-default text-body-default text-text-secondary max-w-3xl leading-relaxed">
            Kho lưu trữ các tác phẩm thủ công nguyên bản từ các làng nghề truyền thống Việt Nam. Mỗi hiện vật được định danh độc bản cùng chứng thư nguồn gốc địa dư và kỹ pháp chế tác nguyên bản.
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
                {loading ? 'ĐANG TẢI...' : `${crafts.length} HIỆN VẬT KHẢ DỤNG`}
              </span>
              <span className="text-border-neutral opacity-60">|</span>
              <span className="flex items-center gap-1.5 text-text-secondary hover:text-accent-terracotta transition-colors">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                LỌC KỸ PHÁP
              </span>
              <span className="text-border-neutral opacity-60">|</span>
              <span className="flex items-center gap-1.5 text-text-secondary hover:text-accent-terracotta transition-colors">
                <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                SẮP XẾP: THỨ HẠNG
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pipe-delimited Categorical Tab Navigation */}
      <section className="w-full bg-surface-crisp border-b border-border-neutral sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-margin overflow-x-auto no-scrollbar">
          <div className="flex items-center py-4 font-label-action text-label-action tracking-[0.15em] uppercase whitespace-nowrap">
            {[
              { id: 'all', label: 'TẤT CẢ (ALL)' },
              ...(categories && categories.length > 0
                ? categories.map((c) => ({ id: c.slug || String(c.id), label: c.name.toUpperCase() }))
                : [
                    { id: 'gom-su-truyen-thong', label: 'GỐM SỨ' },
                    { id: 'duc-dong-kim-hoan', label: 'ĐÚC ĐỒNG' },
                    { id: 'det-may-tho-cam', label: 'DỆT MAY' },
                    { id: 'may-tre-dan-go-thu-cong', label: 'MÂY TRE' },
                    { id: 'son-mai-my-nghe-kham-trai', label: 'SƠN MÀI' },
                  ]),
            ].map((tab, idx) => (
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

      {/* 3-Column Sharp Grid: Artisanal Catalog */}
      <section className="w-full bg-canvas-linen py-space-xl">
        <div className="max-w-7xl mx-auto px-margin">
          {/* Trạng thái lỗi */}
          {error && (
            <div className="p-6 mb-8 border border-red-200 bg-red-50 text-red-700 font-spec-code text-[13px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Trạng thái Loading với Skeleton Shimmer */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              <CraftCardSkeleton count={6} />
            </div>
          ) : crafts.length === 0 ? (
            /* Trạng thái Rỗng (Empty State) */
            <div className="p-16 border border-border-neutral bg-surface-crisp text-center">
              <span className="material-symbols-outlined text-5xl text-accent-terracotta mb-3">inventory_2</span>
              <h3 className="font-headline-title text-xl font-medium text-text-primary mb-2">
                Không tìm thấy tác phẩm phù hợp trong cơ sở dữ liệu
              </h3>
              <p className="font-body-default text-text-secondary mb-6">
                Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTab('all');
                }}
                className="px-6 py-2.5 bg-text-primary text-surface-crisp font-label-action text-label-action uppercase tracking-wider font-semibold hover:bg-accent-terracotta transition-colors cursor-pointer"
              >
                XÓA BỘ LỌC
              </button>
            </div>
          ) : (
            /* Lưới tác phẩm thủ công */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {crafts.map((item) => {
                const isSaved = isFav(item.id);
                const displayImage = item.thumbnailUrl || item.thumbnail_url || item.image || '';
                const displayOrigin = typeof item.region === 'object' ? item.region?.name : (item.region || item.origin || 'Việt Nam');
                const displayCategory = typeof item.category === 'object' ? item.category?.name : (item.category || item.categoryLabel || 'Thủ công di sản');
                const displayDesc = item.shortDescription || item.short_description || item.description || '';
                const displayCode = item.slug || item.refCode || `CR-0${item.id}`;

                return (
                  <article
                    key={item.id}
                    className="group relative bg-surface-crisp border border-border-neutral transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between"
                  >
                    <div className="relative w-full aspect-square overflow-hidden bg-surface-subtle">
                      <img
                        src={displayImage}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-canvas-linen/90 backdrop-blur-sm border border-border-neutral px-2.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta"></span>
                        <span className="font-spec-code text-[10px] tracking-[0.12em] uppercase text-text-primary">
                          {item.isFeatured || item.is_featured ? 'Di sản tiêu biểu' : 'Thủ công nguyên bản'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFav(item.id)}
                        aria-label="Lưu tác phẩm yêu thích"
                        className={`absolute top-3 right-3 w-8 h-8 rounded-none backdrop-blur-sm border border-border-neutral flex items-center justify-center transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-accent-terracotta text-white border-accent-terracotta'
                            : 'bg-surface-crisp/90 text-text-secondary hover:text-accent-terracotta hover:bg-surface-crisp'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'filled' : ''}`}>
                          bookmark
                        </span>
                      </button>
                    </div>

                    <div className="p-space-lg flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-space-xs">
                          <span className="font-spec-code text-[11px] uppercase tracking-[0.14em] text-accent-terracotta font-medium truncate">
                            {displayOrigin} • {displayCategory}
                          </span>
                        </div>
                        <h3 className="font-headline-title text-headline-title text-text-primary tracking-tight mb-space-xs group-hover:text-accent-terracotta transition-colors line-clamp-1">
                          <Link to={`/crafts/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed mb-space-md line-clamp-3">
                          {displayDesc}
                        </p>
                      </div>

                      <div className="pt-space-md border-t border-border-neutral flex items-center justify-between font-spec-code text-spec-code">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-text-secondary tracking-[0.08em] uppercase">
                            Mã: {displayCode}
                          </span>
                          <span className="text-[12px] font-semibold text-text-primary mt-0.5 uppercase tracking-wider">
                            LƯU CHIỂU QUỐC GIA
                          </span>
                        </div>
                        <Link
                          to={`/crafts/${item.id}`}
                          className="font-label-action text-label-action tracking-[0.15em] uppercase text-text-primary border-b border-text-primary pb-0.5 hover:text-accent-terracotta hover:border-accent-terracotta transition-colors font-semibold"
                        >
                          Chi tiết →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
