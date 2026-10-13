import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getArtisansApi, getArtisanByIdApi } from '../api/artisans';

export default function ArtisansPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentArtisanId = searchParams.get('id');

  const [artisansList, setArtisansList] = useState([]);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [error, setError] = useState(null);

  const [showBioModal, setShowBioModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // 1. Tải danh sách nghệ nhân từ Database
  useEffect(() => {
    let isMounted = true;
    async function fetchArtisans() {
      try {
        setLoadingList(true);
        setError(null);
        const res = await getArtisansApi();
        const list = res.data || [];
        if (isMounted) {
          setArtisansList(list);
          if (list.length > 0) {
            const initialId = currentArtisanId ? Number(currentArtisanId) : list[0].id;
            const found = list.find((a) => a.id === initialId) || list[0];
            loadArtisanDetail(found.id);
          } else {
            setLoadingDetail(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('[ArtisansPage] Lỗi nạp danh sách nghệ nhân:', err);
          setError('Không thể kết nối đến máy chủ để tải hồ sơ nghệ nhân. Vui lòng thử lại sau.');
        }
      } finally {
        if (isMounted) setLoadingList(false);
      }
    }

    fetchArtisans();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Tải chi tiết nghệ nhân & danh sách tác phẩm N-N
  const loadArtisanDetail = async (id) => {
    try {
      setLoadingDetail(true);
      const res = await getArtisanByIdApi(id);
      setSelectedArtisan(res.data);
      setSearchParams({ id });
    } catch (err) {
      console.error('[ArtisansPage] Lỗi nạp chi tiết nghệ nhân:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSelectArtisan = (id) => {
    if (selectedArtisan?.id === id) return;
    loadArtisanDetail(id);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  // Trạng thái tải toàn trang ban đầu
  if (loadingList) {
    return (
      <div className="flex flex-col w-full bg-canvas-linen min-h-screen py-space-xl px-margin">
        <div className="max-w-7xl mx-auto w-full animate-pulse space-y-8">
          <div className="h-10 bg-surface-container w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-[560px] bg-surface-container"></div>
            <div className="lg:col-span-7 space-y-4">
              <div className="h-6 bg-surface-container w-1/4"></div>
              <div className="h-12 bg-surface-container w-3/4"></div>
              <div className="h-24 bg-surface-container w-full"></div>
              <div className="h-40 bg-surface-container w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái lỗi
  if (error && artisansList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-margin py-space-xl bg-canvas-linen text-center">
        <span className="material-symbols-outlined text-[48px] text-accent-terracotta mb-4">
          person_off
        </span>
        <h2 className="font-headline-title text-headline-title text-text-primary uppercase mb-2">
          Không thể tải hồ sơ nghệ nhân
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

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* THANH ĐIỀU HƯỚNG DANH SÁCH NGHỆ NHÂN (Master Artisans Selector) */}
      <section className="w-full bg-surface-crisp border-b border-border-neutral sticky top-20 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-margin py-3 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
              NGHỆ NHÂN DI SẢN:
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
            {artisansList.map((artisan) => {
              const isSelected = selectedArtisan?.id === artisan.id;
              return (
                <button
                  key={artisan.id}
                  type="button"
                  onClick={() => handleSelectArtisan(artisan.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-1.5 transition-all cursor-pointer whitespace-nowrap text-left border ${
                    isSelected
                      ? 'bg-text-primary text-surface-crisp border-text-primary shadow-sm'
                      : 'bg-surface-subtle text-text-secondary border-border-neutral hover:border-text-primary hover:text-text-primary'
                  }`}
                >
                  {artisan.avatarUrl && (
                    <img
                      src={artisan.avatarUrl}
                      alt={artisan.name}
                      className="w-5 h-5 rounded-full object-cover shrink-0 grayscale"
                    />
                  )}
                  <span className="font-label-action text-[12px] uppercase tracking-wider font-medium">
                    {artisan.name}
                  </span>
                  {artisan.title && (
                    <span
                      className={`font-spec-code text-[10px] uppercase opacity-75 hidden md:inline ${
                        isSelected ? 'text-surface-variant' : 'text-accent-terracotta'
                      }`}
                    >
                      • {artisan.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 1: MASTER ARTISAN HERO PROFILE */}
      {selectedArtisan ? (
        <section className="w-full px-margin py-space-xl bg-canvas-linen">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
            
            {/* Portrait Column */}
            <div className="lg:col-span-5 relative group overflow-hidden bg-surface-container shadow-md border border-border-neutral">
              <div className="w-full h-full min-h-[520px] lg:min-h-[640px] relative">
                <img
                  className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                  src={selectedArtisan.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'}
                  alt={selectedArtisan.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-surface-crisp">
                  <div>
                    <p className="font-spec-code text-[11px] tracking-[0.2em] uppercase text-surface-variant/90">
                      Chân Dung Điền Dã
                    </p>
                    <p className="font-headline-title text-title-card text-surface-crisp">
                      {selectedArtisan.specialty || 'Nghệ Thuật Thủ Công Cổ Truyền'}
                    </p>
                  </div>
                  {selectedArtisan.title && (
                    <div className="font-spec-code text-[10px] tracking-widest text-primary-fixed uppercase px-2.5 py-1 bg-surface-crisp/10 backdrop-blur-md border border-surface-crisp/20">
                      {selectedArtisan.title}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 flex flex-col justify-between p-space-lg lg:p-space-xl bg-surface-crisp border border-border-neutral shadow-sm">
              <div className="space-y-space-md">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-accent-terracotta inline-block"></span>
                  <span className="font-label-action text-label-action tracking-[0.25em] text-accent-terracotta uppercase font-semibold">
                    HỒ SƠ NGHỆ NHÂN | BẬC THẦY DI SẢN
                  </span>
                </div>

                <div>
                  <h1 className="font-display-hero text-display-hero uppercase tracking-[0.18em] text-text-primary leading-tight">
                    {selectedArtisan.name}
                  </h1>
                  <div className="mt-space-xs flex flex-wrap items-center font-spec-code text-spec-code text-text-secondary gap-y-1">
                    {selectedArtisan.title && (
                      <span className="text-text-primary font-semibold">{selectedArtisan.title}</span>
                    )}
                    {selectedArtisan.yearsOfExperience && (
                      <>
                        <span className="mx-3 opacity-30">|</span>
                        <span>{selectedArtisan.yearsOfExperience} Năm Thâm Niên Nghề</span>
                      </>
                    )}
                    {selectedArtisan.regionName && (
                      <>
                        <span className="mx-3 opacity-30">|</span>
                        <span className="text-accent-terracotta font-medium">{selectedArtisan.regionName}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-border-neutral"></div>

                <p className="font-body-default text-body-default text-text-primary leading-relaxed text-justify">
                  {selectedArtisan.biography ||
                    'Nghệ nhân cả đời gắn bó với từng thớ đất, sợi tơ, ngọn lửa lò nung, gìn giữ tinh hoa văn hóa truyền đời qua các thế hệ nghệ nhân Việt Nam.'}
                </p>

                <div className="bg-surface-subtle p-space-md my-space-md border-l-2 border-accent-terracotta">
                  <p className="font-label-signature text-label-signature italic text-text-secondary leading-snug">
                    “Thủ công là đối thoại tĩnh lặng giữa tâm can người thợ và hồn đất quê hương. Không vội vã, giữ trọn nhịp thở thì di sản mới trường tồn.”
                  </p>
                  <div className="mt-2 text-right font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">
                    — Trích tâm cảm nghệ nhân {selectedArtisan.name}
                  </div>
                </div>
              </div>

              <div className="pt-space-md">
                <div className="grid grid-cols-3 gap-space-sm bg-surface-container-low p-space-md mb-space-md border border-border-neutral">
                  <div className="flex flex-col">
                    <span className="font-headline-title text-headline-title text-primary tracking-tight font-bold">
                      {selectedArtisan.yearsOfExperience ? `${selectedArtisan.yearsOfExperience}+` : '30+'}
                    </span>
                    <span className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mt-1">
                      Năm Cầm Nghề
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-title text-headline-title text-accent-terracotta tracking-tight font-bold">
                      {selectedArtisan.crafts ? `${selectedArtisan.crafts.length}` : '—'}
                    </span>
                    <span className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mt-1">
                      Tác Phẩm Chủ Trì
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-title text-headline-title text-tertiary tracking-tight font-bold">
                      100%
                    </span>
                    <span className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mt-1">
                      Thủ Công Độc Bản
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-space-md">
                  <a
                    href="#dat-lich"
                    className="inline-flex items-center justify-center bg-text-primary text-surface-crisp font-label-action text-label-action uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-accent-terracotta transition-colors shadow-sm cursor-pointer"
                  >
                    Đăng Ký Đàm Đạo Trà &amp; Xem Xưởng
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowBioModal(true)}
                    className="inline-flex items-center gap-2 text-text-primary hover:text-accent-terracotta font-label-action text-label-action uppercase tracking-[0.15em] py-3.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">history_edu</span>
                    <span>Tư Liệu Điền Dã</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>
      ) : null}

      {/* SECTION 2: MASTERWORKS COLLECTION (DỮ LIỆU TỪ DATABASE QUA QUAN HỆ N-N) */}
      <section className="w-full px-margin py-space-xl bg-surface-container-low border-y border-border-neutral">
        <div className="max-w-7xl mx-auto space-y-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm pb-space-sm border-b border-border-neutral">
            <div>
              <div className="flex items-center gap-2 mb-space-xs">
                <span className="font-spec-code text-spec-code uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
                  Tác Phẩm Tiêu Biểu
                </span>
                <span className="opacity-40">/</span>
                <span className="font-spec-code text-spec-code uppercase tracking-wider text-text-secondary">
                  Dữ Liệu Cơ Sở Dữ Liệu Di Sản
                </span>
              </div>
              <h2 className="font-headline-title text-headline-title text-text-primary tracking-wide uppercase">
                CÁC TÁC PHẨM CHẾ TÁC BỞI {selectedArtisan?.name || 'NGHỆ NHÂN'}
              </h2>
            </div>
            <p className="font-body-spec text-body-spec text-text-secondary max-w-md text-left md:text-right">
              Mỗi tác phẩm lưu giữ dấu ấn bàn tay tài hoa, ghi nhận đóng góp và vai trò chủ trì của nghệ nhân trong di sản quốc gia.
            </p>
          </div>

          {loadingDetail ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-surface-crisp border border-border-neutral h-[480px]"></div>
              ))}
            </div>
          ) : selectedArtisan?.crafts && selectedArtisan.crafts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {selectedArtisan.crafts.map((craft) => (
                <article
                  key={craft.id}
                  className="group bg-surface-crisp border border-border-neutral shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      src={craft.thumbnailUrl || craft.thumbnail_url || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80'}
                      alt={craft.name}
                    />
                    {craft.roleTitle && (
                      <div className="absolute top-4 left-4 bg-text-primary text-surface-crisp font-spec-code text-[11px] uppercase tracking-widest px-2.5 py-1">
                        {craft.roleTitle}
                      </div>
                    )}
                    {craft.isLead && (
                      <div className="absolute top-4 right-4 bg-accent-terracotta text-surface-crisp font-spec-code text-[10px] uppercase px-2 py-0.5 tracking-wider font-semibold">
                        CHỦ TRÌ
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-surface-crisp/90 backdrop-blur-sm text-text-primary font-spec-code text-[10px] uppercase px-2 py-0.5 border border-border-neutral">
                      Ref: CR-CRAFT-{craft.id}
                    </div>
                  </div>

                  <div className="p-space-lg flex flex-col flex-1 justify-between space-y-space-md">
                    <div>
                      <div className="font-spec-code text-spec-code uppercase tracking-wider text-accent-terracotta mb-1">
                        {craft.category?.name || craft.category || 'Nghệ Thuật Truyền Thống'}
                      </div>
                      <h3 className="font-title-card text-title-card text-text-primary group-hover:text-accent-terracotta transition-colors leading-snug">
                        {craft.name}
                      </h3>
                      <p className="font-body-spec text-body-spec text-text-secondary mt-space-xs leading-relaxed line-clamp-3">
                        {craft.shortDescription || craft.short_description || craft.contributionNotes || 'Tác phẩm được bảo tồn trong kho dữ liệu di sản CraftRoots.'}
                      </p>
                    </div>

                    <div className="pt-space-sm space-y-2 border-t border-border-neutral">
                      <div className="flex justify-between items-center text-body-spec font-spec-code text-[12px] text-text-secondary">
                        <span>Đóng góp:</span>
                        <span className="text-text-primary font-semibold truncate max-w-[180px]">
                          {craft.contributionNotes || craft.roleTitle || 'Nghệ nhân chế tác'}
                        </span>
                      </div>
                      <div className="pt-space-xs flex items-center justify-between">
                        <span className="font-spec-code text-[11px] text-tertiary tracking-wider uppercase font-semibold">
                          Lưu trữ di sản
                        </span>
                        <Link
                          to={`/crafts/${craft.id}`}
                          className="font-label-action text-label-action uppercase tracking-widest text-text-primary hover:text-accent-terracotta transition-colors flex items-center gap-1 font-semibold"
                        >
                          HỒ SƠ CHI TIẾT <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-surface-crisp border border-border-neutral p-12 text-center max-w-xl mx-auto">
              <span className="material-symbols-outlined text-accent-terracotta text-[36px] mb-2">
                inventory_2
              </span>
              <h3 className="font-title-card text-text-primary uppercase mb-2">
                Hồ Sơ Tác Phẩm Đang Cập Nhật
              </h3>
              <p className="font-body-spec text-text-secondary">
                Ban giám tuyển CraftRoots đang tiếp tục số hóa các tác phẩm hợp tác và chế tác độc bản của nghệ nhân {selectedArtisan?.name}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: STUDIO VISIT & APPOINTMENT RESERVATION */}
      <section className="w-full px-margin py-space-xl bg-canvas-linen" id="dat-lich">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-crisp border border-border-neutral shadow-md grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            
            {/* Studio Info Left Panel */}
            <div className="lg:col-span-7 p-space-lg lg:p-space-xl flex flex-col justify-between space-y-space-md">
              <div className="space-y-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-terracotta text-[20px]">explore</span>
                  <span className="font-label-action text-label-action uppercase tracking-[0.25em] text-accent-terracotta font-semibold">
                    KHÔNG GIAN XƯỞNG THỰC ĐỊA
                  </span>
                </div>
                <h2 className="font-headline-title text-headline-title uppercase tracking-wide text-text-primary">
                  ĐẾN THĂM XƯỞNG &amp; GẶP GỠ NGHỆ NHÂN {selectedArtisan?.name}
                </h2>
                <p className="font-body-default text-body-default text-text-secondary leading-relaxed">
                  Xưởng chế tác của Nghệ nhân {selectedArtisan?.name} ({selectedArtisan?.title || 'Nghệ nhân Di Sản'}) là điểm kết nối sống động giữa người gìn giữ nghề và công chúng yêu di sản. Quý khách ghé thăm được thưởng trà mộc, nghe tâm tình chuyện nghề và quan sát các thao tác chế tác thủ công nguyên bản.
                </p>
              </div>

              <div className="space-y-space-sm bg-surface-container-low p-space-md border border-border-neutral">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">location_on</span>
                  <div>
                    <p className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">Địa Chỉ Xưởng Thực Địa</p>
                    <p className="font-body-default text-body-default text-text-primary font-medium">
                      {selectedArtisan?.contactInfo || 'Khu Di Sản Làng Nghề Truyền Thống, Hà Nội'}
                    </p>
                    <p className="font-spec-code text-[11px] text-text-secondary mt-0.5">
                      Vùng: {selectedArtisan?.regionName || 'Đồng bằng sông Hồng'} • Tiếp nhận đăng ký điền dã
                    </p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-border-neutral"></div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent-terracotta text-[20px] mt-0.5">schedule</span>
                  <div>
                    <p className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">Thời Gian Tiếp Khách &amp; Đàm Đạo</p>
                    <p className="font-body-default text-body-default text-text-primary font-medium">
                      Thứ Ba — Chủ Nhật | 08:30 — 17:00
                    </p>
                    <p className="font-spec-code text-[11px] text-accent-terracotta mt-0.5">
                      (Vui lòng đặt hẹn trước tối thiểu 24h để xưởng chuẩn bị đón tiếp chu đáo)
                    </p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-border-neutral"></div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">verified_user</span>
                  <div>
                    <p className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">Nghi Thức Đón Tiếp</p>
                    <p className="font-body-spec text-body-spec text-text-secondary">
                      Tối đa 6 khách mỗi lượt trà để đảm bảo không gian yên tĩnh và trải nghiệm trò chuyện sâu sắc cùng Nghệ nhân.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Form Right Panel */}
            <div className="lg:col-span-5 bg-surface-subtle p-space-lg lg:p-space-xl flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border-neutral">
              <form className="space-y-space-md" onSubmit={handleBookingSubmit}>
                <div>
                  <span className="font-label-action text-label-action uppercase tracking-[0.2em] text-text-primary font-semibold block mb-1">
                    PHIẾU ĐẶT HẸN ĐÀM ĐẠO TRÀ
                  </span>
                  <p className="font-body-spec text-body-spec text-text-secondary">
                    Đăng ký đàm đạo và tìm hiểu tinh hoa nghề cùng {selectedArtisan?.name || 'Nghệ nhân'}.
                  </p>
                </div>

                <div className="space-y-space-sm">
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Họ và tên khách quý *</label>
                    <input className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral" placeholder="Nguyễn Hoàng Nam" required type="text" />
                  </div>
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Số điện thoại liên lạc *</label>
                    <input className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral" placeholder="0912 345 678" required type="tel" />
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div>
                      <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Ngày mong muốn *</label>
                      <input className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral" required type="date" />
                    </div>
                    <div>
                      <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Khung giờ tiếp *</label>
                      <select className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral">
                        <option>Sáng: 09:30 - 11:30</option>
                        <option>Chiều: 14:00 - 16:00</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">Mục đích chuyến thăm</label>
                    <select className="w-full h-[46px] rounded-[50px] bg-surface-crisp px-space-md font-body-spec text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-terracotta shadow-sm border border-border-neutral">
                      <option>Đàm đạo trà &amp; Tìm hiểu kỹ nghệ chế tác cổ</option>
                      <option>Quan sát quy trình xưởng thực địa</option>
                      <option>Đặt chế tác tác phẩm gia bảo độc bản</option>
                      <option>Nghiên cứu học thuật dân tộc học / mỹ thuật</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-text-primary hover:bg-accent-terracotta text-surface-crisp font-label-action text-label-action uppercase tracking-[0.2em] py-4 transition-colors text-center shadow-md cursor-pointer" type="submit">
                  ĐẶT LỊCH ĐÀM ĐẠO TRÀ &amp; THĂM XƯỞNG →
                </button>

                {formSubmitted && (
                  <div className="p-3 bg-surface-crisp border border-accent-terracotta text-accent-terracotta text-center font-body-spec text-[13px]">
                    CraftRoots đã tiếp nhận yêu cầu đàm đạo cùng Nghệ nhân {selectedArtisan?.name}. Ban thư ký di sản sẽ liên lạc xác nhận lịch trong vòng 4 giờ làm việc.
                  </div>
                )}
              </form>

              <div className="mt-space-md pt-space-sm flex items-center justify-between font-spec-code text-[11px] text-text-secondary border-t border-border-neutral">
                <span>Chứng thực: Hiệp hội Làng nghề VN</span>
                <span>Miễn phí vé vào cửa di sản</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MODAL: NIÊN BIỂU NGHỆ NHÂN */}
      {showBioModal && selectedArtisan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-text-primary/60 backdrop-blur-sm"
            onClick={() => setShowBioModal(false)}
          ></div>
          <div className="bg-surface-crisp border border-border-neutral p-space-lg shadow-2xl relative max-h-[85vh] max-w-2xl w-full overflow-y-auto z-10">
            <div className="flex justify-between items-start pb-space-sm border-b border-border-neutral">
              <div>
                <span className="font-spec-code text-[11px] uppercase tracking-widest text-accent-terracotta">HỒ SƠ TƯ LIỆU HÓA</span>
                <h3 className="font-headline-title text-headline-title text-text-primary uppercase mt-1">
                  Niên Biểu &amp; Hành Trình: {selectedArtisan.name}
                </h3>
              </div>
              <button
                type="button"
                className="p-1 text-text-secondary hover:text-text-primary cursor-pointer"
                onClick={() => setShowBioModal(false)}
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="py-space-md space-y-space-md relative before:absolute before:inset-0 before:left-3 before:w-[2px] before:bg-border-neutral">
              <div className="relative pl-8">
                <span className="absolute left-3 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-terracotta"></span>
                <span className="font-spec-code text-[12px] text-accent-terracotta font-semibold">Khởi Nghiệp</span>
                <h4 className="font-title-card text-title-card text-text-primary font-medium">Bén Duyên Với Di Sản</h4>
                <p className="font-body-spec text-body-spec text-text-secondary mt-1">
                  Kế thừa truyền thống gia tộc và bắt đầu cầm bút, vuốt gốm, xe sợi từ thuở thiếu thời.
                </p>
              </div>

              <div className="relative pl-8">
                <span className="absolute left-3 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-text-primary"></span>
                <span className="font-spec-code text-[12px] text-text-primary font-semibold">Thâm Niên</span>
                <h4 className="font-title-card text-title-card text-text-primary font-medium">{selectedArtisan.yearsOfExperience || 30}+ Năm Thực Hành Nghề</h4>
                <p className="font-body-spec text-body-spec text-text-secondary mt-1">
                  {selectedArtisan.specialty || 'Thực hành các kỹ thuật chế tác cổ truyền'} đạt trình độ bậc thầy.
                </p>
              </div>

              <div className="relative pl-8">
                <span className="absolute left-3 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-terracotta"></span>
                <span className="font-spec-code text-[12px] text-accent-terracotta font-semibold">Tôn Vinh</span>
                <h4 className="font-title-card text-title-card text-text-primary font-medium">{selectedArtisan.title || 'Nghệ Nhân Ưu Tú'}</h4>
                <p className="font-body-spec text-body-spec text-text-secondary mt-1">
                  Được cộng đồng và nhà nước ghi nhận công lao to lớn trong công tác bảo tồn di sản thủ công quốc gia.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
