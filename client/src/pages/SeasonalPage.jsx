import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import { getCurrentSeasonalCollectionApi, getSeasonalCollectionsApi, getSeasonalCollectionByIdApi } from '../api/seasonal';

export default function SeasonalPage() {
  const { isFav, toggleFav } = useFavourites();
  const [toastMessage, setToastMessage] = useState('');

  const [currentCollection, setCurrentCollection] = useState(null);
  const [collectionsList, setCollectionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Nạp bộ sưu tập mùa từ Database
  useEffect(() => {
    let isMounted = true;
    async function fetchSeasonalData() {
      try {
        setLoading(true);
        setError(null);

        // Lấy danh sách bộ sưu tập và bộ sưu tập mùa hiện tại
        const [currRes, listRes] = await Promise.allSettled([
          getCurrentSeasonalCollectionApi(),
          getSeasonalCollectionsApi()
        ]);

        if (isMounted) {
          if (currRes.status === 'fulfilled' && currRes.value?.data) {
            setCurrentCollection(currRes.value.data);
          }
          if (listRes.status === 'fulfilled' && listRes.value?.data) {
            setCollectionsList(listRes.value.data);
          }
          if (currRes.status === 'rejected' && (!listRes.value?.data || listRes.value.data.length === 0)) {
            throw new Error('Chưa thể tải dữ liệu bộ sưu tập theo mùa từ máy chủ.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('[SeasonalPage] Lỗi nạp dữ liệu mùa:', err);
          setError('Không thể kết nối với máy chủ để tải bộ sưu tập mùa. Vui lòng thử lại sau.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSeasonalData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectCollection = async (id) => {
    if (currentCollection?.id === id) return;
    try {
      setLoading(true);
      const res = await getSeasonalCollectionByIdApi(id);
      setCurrentCollection(res.data);
    } catch (err) {
      console.error('[SeasonalPage] Lỗi chuyển bộ sưu tập:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = (craft) => {
    const targetId = craft.id;
    const currentlyFav = isFav(targetId);
    toggleFav(targetId);
    setToastMessage(currentlyFav ? `Đã bỏ lưu "${craft.name}"` : `Đã thêm "${craft.name}" vào mục lưu trữ`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Trạng thái tải Loading
  if (loading && !currentCollection) {
    return (
      <div className="flex flex-col w-full bg-canvas-linen min-h-screen">
        <div className="w-full h-[520px] bg-surface-container animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-margin py-space-xl w-full space-y-8 animate-pulse">
          <div className="h-10 bg-surface-container w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-96 bg-surface-container"></div>
            <div className="h-96 bg-surface-container"></div>
            <div className="h-96 bg-surface-container"></div>
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái Lỗi
  if (error && !currentCollection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-margin py-space-xl bg-canvas-linen text-center">
        <span className="material-symbols-outlined text-[48px] text-accent-terracotta mb-4">
          cloud_off
        </span>
        <h2 className="font-headline-title text-headline-title text-text-primary uppercase mb-2">
          Không thể tải bộ sưu tập mùa
        </h2>
        <p className="font-body-default text-body-default text-text-secondary max-w-md mb-6">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-text-primary hover:bg-accent-terracotta text-surface-crisp font-label-action uppercase tracking-widest px-6 py-3 transition-colors cursor-pointer"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  const crafts = currentCollection?.crafts || [];
  const heroCraft = currentCollection?.heroCraft || crafts[0] || null;

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-text-primary text-surface-crisp px-5 py-3 shadow-lg border border-accent-terracotta font-label-action text-[12px] uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-terracotta text-[18px]">bookmark_added</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Selector: Chuyển đổi các bộ sưu tập mùa từ Database */}
      {collectionsList.length > 1 && (
        <div className="w-full bg-surface-crisp border-b border-border-neutral sticky top-20 z-20 shadow-xs">
          <div className="max-w-7xl mx-auto px-margin py-2.5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 shrink-0">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">routine</span>
              <span className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-text-primary font-semibold">
                CÁC KỲ GIÁM TUYỂN THEO MÙA:
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {collectionsList.map((col) => {
                const isActive = currentCollection?.id === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => handleSelectCollection(col.id)}
                    className={`px-3 py-1 font-label-action text-[11px] uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? 'bg-text-primary text-surface-crisp border-text-primary'
                        : 'bg-surface-subtle text-text-secondary border-border-neutral hover:border-text-primary'
                    }`}
                  >
                    {col.title} ({col.year})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Immersive Editorial Hero */}
      <section className="relative w-full -mt-20 overflow-hidden bg-surface-container-high">
        <div
          className="w-full min-h-[580px] lg:min-h-[640px] bg-cover bg-center flex items-center relative"
          style={{
            backgroundImage: `url('${
              currentCollection?.bannerUrl ||
              currentCollection?.banner_url ||
              'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80'
            }')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-text-primary/90 via-text-primary/70 to-transparent"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-margin w-full pt-28 pb-space-xl">
            <div className="max-w-2xl text-surface-crisp flex flex-col items-start">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <span className="font-spec-code text-spec-code tracking-[0.25em] uppercase text-primary-fixed-dim">
                  Tuyển Tập Giới Hạn Di Sản
                </span>
                <span className="text-surface-variant/40 select-none">|</span>
                <span className="font-label-signature italic text-label-signature text-secondary-fixed">
                  Năm {currentCollection?.year || 2024} • Mã {currentCollection?.seasonCode?.toUpperCase() || 'MÙA'}
                </span>
              </div>

              <h1 className="font-display-hero text-display-hero uppercase text-surface-crisp font-light tracking-[6px] leading-[1.15] mb-space-md">
                {currentCollection?.title || 'BỘ SƯU TẬP DI SẢN THEO MÙA'}
              </h1>

              <div className="h-0.5 w-16 bg-accent-terracotta mb-space-md"></div>

              <p className="font-body-default text-body-default text-surface-variant font-normal leading-relaxed mb-space-lg max-w-xl">
                {currentCollection?.themeConcept ||
                  'Tuyển tập các tác phẩm thủ công truyền thống được giám tuyển riêng biệt, phản ánh nhịp điệu chuyển mùa của đất trời và bàn tay tài hoa của nghệ nhân Việt.'}
              </p>

              <div className="flex flex-wrap items-center gap-space-md">
                <a
                  href="#tuyen-tap"
                  className="inline-flex items-center justify-center bg-accent-terracotta hover:bg-primary text-surface-crisp font-label-action text-label-action uppercase tracking-[0.18em] px-7 py-3.5 transition-colors shadow-sm"
                >
                  Khám Phá Tuyển Tập ({crafts.length} Tác Phẩm)
                </a>
                <div className="flex items-center font-spec-code text-spec-code text-surface-variant tracking-[0.12em] uppercase">
                  <span>Cập nhật từ CSDL</span>
                  <span className="mx-3 text-surface-variant/40">|</span>
                  <span>Di sản quốc gia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Callout Block */}
      <section className="w-full max-w-7xl mx-auto px-margin py-space-xl">
        <div className="bg-surface-subtle p-space-lg lg:p-space-xl relative shadow-sm border border-border-neutral">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-lg">
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <span className="material-symbols-outlined text-accent-terracotta text-[20px]">spa</span>
                <span className="font-spec-code text-spec-code uppercase tracking-[0.2em] text-text-secondary">
                  Triết Lý Giám Tuyển Mùa
                </span>
              </div>
              <blockquote className="font-headline-title text-headline-title text-text-primary font-normal italic leading-snug tracking-tight mb-space-sm">
                “{currentCollection?.themeConcept || 'Mỗi vật phẩm mùa mang trong mình hơi thở thiên nhiên, kết tinh từ nguồn nguyên liệu bản địa và thời điểm chế tác tương thích với tuần hoàn bốn mùa.'}”
              </blockquote>
              <cite className="font-spec-code text-spec-code uppercase tracking-[0.14em] text-accent-terracotta not-italic block">
                — Hội đồng Thẩm định Di sản CraftRoots
              </cite>
            </div>
            
            <div className="shrink-0 flex flex-col items-start md:items-end justify-center pl-0 md:pl-space-lg text-text-secondary font-spec-code text-spec-code space-y-1">
              <div className="text-text-primary font-medium tracking-[0.15em] uppercase">Quy mô tuyển tập</div>
              <div className="text-[28px] leading-tight font-display-hero font-light text-primary">
                {crafts.length} Hiện Vật
              </div>
              <div className="text-[11px] tracking-[0.1em] text-text-secondary/80">Số hóa hoàn chỉnh từ CSDL</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Grid Từ CSDL */}
      <section className="w-full max-w-7xl mx-auto px-margin pb-space-xl" id="tuyen-tap">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg pb-space-sm border-b border-border-neutral">
          <div>
            <div className="flex items-center gap-2 mb-space-xs">
              <span className="h-2 w-2 bg-accent-terracotta"></span>
              <span className="font-spec-code text-spec-code tracking-[0.2em] uppercase text-text-secondary">
                Danh Mục Hiện Vật Từ Cơ Sở Dữ Liệu
              </span>
            </div>
            <h2 className="font-headline-title text-headline-title text-text-primary font-semibold tracking-tight uppercase">
              TÁC PHẨM TRONG BỘ SƯU TẬP {currentCollection?.title}
            </h2>
          </div>
          <div className="flex items-center gap-space-sm mt-space-sm md:mt-0 font-spec-code text-spec-code text-text-secondary">
            <span className="text-text-primary font-semibold">{crafts.length} Tác phẩm</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span>Xác thực bởi chuyên gia di sản</span>
          </div>
        </div>

        {crafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {crafts.map((craft) => {
              const isSaved = isFav(craft.id);
              return (
                <article
                  key={craft.id}
                  className="group bg-surface-crisp flex flex-col justify-between border border-border-neutral transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container">
                    <img
                      src={craft.thumbnailUrl || craft.thumbnail_url || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80'}
                      alt={craft.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-text-primary text-surface-crisp font-spec-code text-[10px] tracking-[0.15em] uppercase px-2.5 py-1">
                      {craft.category?.name || craft.category || 'Di Sản Mùa'}
                    </div>
                    {craft.isHeroCraft && (
                      <div className="absolute top-3 right-3 bg-accent-terracotta text-surface-crisp font-spec-code text-[9px] tracking-wider uppercase px-2 py-0.5 font-bold">
                        TIÊU ĐIỂM MÙA
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-canvas-linen/90 backdrop-blur-sm text-text-primary font-spec-code text-spec-code px-2 py-0.5 shadow-sm border border-border-neutral">
                      REF: CR-COL-{craft.id}
                    </div>
                  </div>

                  <div className="p-space-lg flex flex-col flex-1 justify-between bg-surface-crisp">
                    <div>
                      <div className="flex items-center font-spec-code text-spec-code text-text-secondary tracking-[0.1em] uppercase mb-space-xs">
                        <span>{craft.region?.name || craft.region || 'Việt Nam'}</span>
                        <span className="mx-2 text-border-neutral opacity-60">|</span>
                        <span>{craft.curatorNote ? 'Giám tuyển ghi chú' : 'Thủ công truyền đời'}</span>
                      </div>
                      <Link to={`/crafts/${craft.id}`}>
                        <h3 className="font-title-card text-title-card text-text-primary font-medium tracking-tight mb-space-xs group-hover:text-accent-terracotta transition-colors leading-snug">
                          {craft.name}
                        </h3>
                      </Link>
                      <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed mb-space-md line-clamp-3">
                        {craft.curatorNote || craft.shortDescription || craft.short_description || 'Tác phẩm được bảo tồn trong kho dữ liệu di sản làng nghề CraftRoots.'}
                      </p>
                    </div>

                    <div className="pt-space-md bg-surface-subtle/40 -mx-space-lg -mb-space-lg p-space-lg flex items-center justify-between border-t border-border-neutral">
                      <div className="flex flex-col">
                        <span className="font-spec-code text-[11px] uppercase tracking-[0.12em] text-text-secondary">
                          Mã Hồ Sơ CSDL
                        </span>
                        <span className="font-headline-title text-title-card text-text-primary font-semibold">
                          #CR-{craft.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/crafts/${craft.id}`}
                          className="px-3 py-2 bg-surface-crisp hover:bg-surface-container border border-border-neutral font-label-action text-[11px] uppercase tracking-wider text-text-primary transition-colors"
                        >
                          Xem Chi Tiết
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleSave(craft)}
                          className={`w-10 h-10 flex items-center justify-center transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-accent-terracotta text-surface-crisp'
                              : 'bg-text-primary hover:bg-accent-terracotta text-surface-crisp'
                          }`}
                          title={isSaved ? 'Đã lưu trong tuyển tập' : 'Thêm vào tuyển tập'}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isSaved ? 'bookmark_added' : 'bookmark_add'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface-crisp border border-border-neutral p-12 text-center max-w-xl mx-auto">
            <span className="material-symbols-outlined text-accent-terracotta text-[36px] mb-2">
              inventory_2
            </span>
            <h3 className="font-title-card text-text-primary uppercase mb-2">
              Bộ Sưu Tập Đang Được Giám Tuyển
            </h3>
            <p className="font-body-spec text-text-secondary">
              Các tác phẩm trong kỳ giám tuyển này đang được cập nhật thêm từ cơ sở dữ liệu di sản quốc gia.
            </p>
          </div>
        )}
      </section>

      {/* Editorial Process Feature: From High Mountain to Tea Table */}
      <section className="w-full bg-surface-subtle py-space-xl border-t border-border-neutral">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-xl">
            <span className="font-spec-code text-spec-code uppercase tracking-[0.25em] text-accent-terracotta mb-space-xs">
              Hành Trình Chế Tác
            </span>
            <h2 className="font-headline-statement text-headline-statement font-light uppercase text-text-primary tracking-[0.2em]">
              QUY CHUẨN GIÁM TUYỂN DI SẢN THEO MÙA
            </h2>
            <div className="h-0.5 w-12 bg-border-neutral mt-space-sm"></div>
          </div>

          {/* 3-Step Process Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter relative">
            <div className="bg-surface-crisp p-space-lg flex flex-col justify-between shadow-sm border border-border-neutral">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-display-hero text-[36px] leading-none font-light text-accent-terracotta">
                    01
                  </span>
                  <span className="font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
                    Giai Đoạn I
                  </span>
                </div>
                <h3 className="font-title-card text-title-card text-text-primary font-medium mb-space-xs">
                  Điền Dã Khảo Sát
                </h3>
                <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                  Đội ngũ chuyên gia điền dã trực tiếp đến các làng nghề truyền thống vào đúng mùa vụ nguyên liệu, xác thực nguồn gốc và tuổi đời của các nghệ nhân chủ trì.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.1em] border-t border-border-neutral">
                <span>Khảo sát thực địa</span>
                <span className="mx-2 text-border-neutral opacity-60">|</span>
                <span>Chuẩn hóa lý lịch</span>
              </div>
            </div>

            <div className="bg-surface-crisp p-space-lg flex flex-col justify-between shadow-sm border border-border-neutral">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-display-hero text-[36px] leading-none font-light text-primary">
                    02
                  </span>
                  <span className="font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
                    Giai Đoạn II
                  </span>
                </div>
                <h3 className="font-title-card text-title-card text-text-primary font-medium mb-space-xs">
                  Thẩm Định Độc Bản
                </h3>
                <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                  Kiểm định khắt khe tính nguyên bản của kỹ nghệ chế tác: không sử dụng hóa chất công nghiệp, duy trì bí quyết truyền đời của dòng họ hoặc hợp tác xã thủ công.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.1em] border-t border-border-neutral">
                <span>100% Thuần thủ công</span>
                <span className="mx-2 text-border-neutral opacity-60">|</span>
                <span>Kiểm định chất liệu</span>
              </div>
            </div>

            <div className="bg-surface-crisp p-space-lg flex flex-col justify-between shadow-sm border border-border-neutral">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-display-hero text-[36px] leading-none font-light text-accent-terracotta">
                    03
                  </span>
                  <span className="font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
                    Giai Đoạn III
                  </span>
                </div>
                <h3 className="font-title-card text-title-card text-text-primary font-medium mb-space-xs">
                  Số Hóa Vào Di Sản Số
                </h3>
                <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                  Lưu trữ hồ sơ hiện vật hoàn chỉnh trên nền tảng CraftRoots với thông số kỹ thuật, hồ sơ nghệ nhân tham gia và hình ảnh độ phân giải cao phục vụ nghiên cứu.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.1em] border-t border-border-neutral">
                <span>Cơ sở dữ liệu mở</span>
                <span className="mx-2 text-border-neutral opacity-60">|</span>
                <span>Bảo tồn vĩnh viễn</span>
              </div>
            </div>
          </div>

          {/* Workshop Metadata Bar */}
          <div className="mt-space-lg bg-surface-crisp p-4 border border-border-neutral flex flex-col md:flex-row items-center justify-between shadow-sm text-text-secondary font-body-spec text-[12px]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">verified</span>
              <span className="uppercase tracking-[0.1em] text-text-primary font-semibold">
                Tiêu Chuẩn Giám Tuyển Văn Hóa:
              </span>
              <span>Bảo tồn 100% nguyên liệu tự nhiên bản địa Việt Nam</span>
            </div>
            <div className="flex items-center gap-3 mt-2 md:mt-0 uppercase tracking-[0.12em] font-spec-code text-[11px]">
              <span>Mã lưu trữ: {currentCollection?.slug || 'COLLECTION-DEFAULT'}</span>
              <span className="text-border-neutral opacity-60">|</span>
              <Link to="/crafts" className="text-accent-terracotta hover:underline font-medium">
                Khám phá toàn bộ danh mục di sản →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
