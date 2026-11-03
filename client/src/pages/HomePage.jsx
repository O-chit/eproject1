import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CraftCardSkeleton from '../components/common/CraftCardSkeleton';
import api from '../services/api';

const HIGHLIGHT_CRAFTS = [
  {
    id: 1,
    code: 'BT-MR01',
    badge: 'WOOD-FIRED 1300°C',
    village: 'Bat Trang Ceramics Village',
    province: 'Hanoi',
    name: 'Classic Crackle Glaze Teapot',
    description: 'Handcrafted from Red River alluvial silt fired with traditional wood ash glaze. Each natural web-like fracture forms according to kiln temperature fluctuations, uniquely one-of-a-kind.',
    material: 'Kaolin & wood ash glaze',
    dimension: '180ml | Ø 9.5cm',
    price: '1.850.000 ₫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaUrvFnVxj2lsHDRkr-yaTRJCRIumrtcbAoBO8T7gJK22rF-l8LFMNoASMdtx_N8hQkmINE6HE7xtmJmzGpxqvbiG5mzG2TvxNKGDuu4MZjKV7e4q6ixIFOJ1PSNsl56IqQagawz_SCLeDfMjYY1bGxxdBh3e-6wBJ15RkSXBTpEZHEoWqpB_uzbwmdJy82jUtSMpkv6zROQGRW5W2GKqEOL2DxfhNLSsVd1T7ujM',
    alt: 'Close-up macro of an artisanal Vietnamese cracked-glaze teapot from Bat Trang pottery village, delicate web-like crazing across ivory porcelain surface, brass arched handle, rustic earthen wood-fired aesthetic, natural atmospheric diffused daylight, museum catalog detail.',
  },
  {
    id: 2,
    code: 'MN-TC04',
    badge: 'ANTIQUE WOODEN LOOM',
    village: 'My Nghiep Weaving Village',
    province: 'Ninh Thuan',
    name: 'Sacred Lion Brocade Shawl',
    description: 'Natural cotton grown along sand dunes, dyed with wild bark and indigo steeped for 20 days. Ancient motifs embodying spiritual guardianship.',
    material: 'Raw plant-dyed cotton',
    dimension: '65 × 200 cm',
    price: '1.420.000 ₫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBay0c69D5JK7FMaxyn9PSRxcsgUqgVBC4moSSxlmkFLgKHiKIqdRgYLDbsNkoDNTWbn3aE3tjfmDVjmU7b0uCCCWly4AJRKvMbcSnFUrimhvpDJ528ysIaEbq7Vk675AvADO51B7vRlzladV4zbFP22E6K0TREwBbPB2PY6e9MzBG80dTaXhPHGxL-GcbgknPoVSiq1dmnBko_BQVJIGRkPk_Vx46iUTqabaRYxTU',
    alt: 'Traditional Cham handwoven brocade scarf laid flat on raw linen, complex geometric diamond patterns in natural indigo and madder root red, fine organic cotton fringe, authentic village craft aesthetic from My Nghiep Ninh Thuan, rich tactile fiber detail.',
  },
  {
    id: 3,
    code: 'PV-MT09',
    badge: 'HAND-PARING RATTAN',
    village: 'Phu Vinh Bamboo Village',
    province: 'Chuong My',
    name: 'Fine Hand-Shaved Rattan Tea Tray',
    description: 'Crafted from aged forest rattan sun-dried for 6 months, shaved into hair-thin strands using hand-forged blades. Tight weave without superfluous joints.',
    material: 'Forest rattan & aged bamboo',
    dimension: '36 × 26 × 3.5 cm',
    price: '980.000 ₫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqtjQ5mo5cRimsDw-0a1cXtEfhsOYh5Em5ML9l64b0Hc7BtO4oQu0rQCKeojkVUo26ovuW7WQJi9O9HWREIBgFJQ54jYdAVaqFw_qoJKFU5nDAJnK3m_SuzktfK4177Hs6U0AZ6NjMS-0nZHrlaberLVVzTzO0pAj5wvYnyap_2yX0pGsWUYWItuudPhk86mrePax74Ug2wRYKiBJ1_4Y22e-lHlXxzgQsUnUvcqw',
    alt: 'Intricately woven Vietnamese bamboo and rattan tea tray from Phu Vinh village, extremely tight circular geometric weave, smooth honey-colored aged patina, minimalist architectural craft styling, top-down angled shot on raw stoneware surface, clean studio daylight.',
  },
];

export default function HomePage() {
  const [crafts, setCrafts] = useState(HIGHLIGHT_CRAFTS);
  const [regionsList, setRegionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [siteStats, setSiteStats] = useState({ crafts: 0, artisans: 0, regions: 0 });

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const [craftsData, statsData, regionsData] = await Promise.all([
          api.getCrafts({ is_featured: true, limit: 3 }),
          api.getStats(),
          api.getRegions().catch(() => []),
        ]);
        const items = Array.isArray(craftsData) ? craftsData : craftsData?.data || [];
        if (isMounted && Array.isArray(items) && items.length > 0) {
          setCrafts(items);
        }
        if (isMounted && statsData && typeof statsData.crafts === 'number') {
          setSiteStats({
            crafts: statsData.crafts,
            artisans: statsData.artisans,
            regions: statsData.regions,
          });
        }
        const regionsArr = Array.isArray(regionsData) ? regionsData : regionsData?.data || [];
        if (isMounted && regionsArr.length > 0) {
          setRegionsList(regionsArr);
        }
      } catch (err) {
        console.warn('Unable to load from API DB, using fallback data:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[440px] sm:min-h-[520px] lg:min-h-[720px] flex items-center justify-center lg:justify-end overflow-hidden -mt-[134px] pt-[134px] md:-mt-20 md:pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          data-alt="A master Vietnamese ceramic artisan in an earthy, sunlit studio in Bat Trang village, shaping unglazed clay on a rustic kick-wheel. Golden dust motes float through northern afternoon light, illuminating handwoven bamboo drying racks, aged terracotta urns, raw river silt textures, and natural linen workwear. Editorial architectural lighting, authentic documentary aesthetic."
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCdKDmU3omFnH1-UgCNIGr9SniP8pazrUjo8i70l1xby0267_kF-wWIYx7SF1aDkAQvZDE1sqF2FcYkVr-HFqPyaOgIiGKKfnPwgH4YfBQ1HfvKSnkpIKecG_0XUd6-EPVGqR-bMn9Kclpi2WxHf9VC1lifYUEu-TYH9srXI47L3uxKDI0J9lQnBhD6wklng-H7V-3u3VsXCmCC9D1Avwacl9S1BrzXp7fbTLDSDpE')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-text-primary/75 via-text-primary/45 to-text-primary/25 lg:to-transparent"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-margin py-6 sm:py-10 md:py-space-xl flex justify-center lg:justify-end">
          <div className="w-full max-w-xl bg-canvas-linen/95 backdrop-blur-sm p-5 sm:p-8 md:p-12 border border-border-neutral rounded-none shadow-xl">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-terracotta inline-block"></span>
              <span className="font-display-hero text-[10px] sm:text-[12px] md:text-[13px] tracking-[0.18em] sm:tracking-[0.3em] md:tracking-[0.35em] text-accent-terracotta uppercase font-light">
                VIETNAMESE CRAFT ARCHIVE &amp; CONSERVATION
              </span>
            </div>

            <h1 className="font-headline-title text-[20px] sm:text-[28px] md:text-[38px] leading-[1.25] tracking-[0.04em] sm:tracking-[0.1em] md:tracking-[0.15em] text-text-primary uppercase font-light mb-4 sm:mb-6">
              LIVING HERITAGE IN EVERY LINE
            </h1>

            <p className="font-body-default text-[13px] sm:text-body-default text-text-secondary leading-relaxed mb-6 sm:mb-8">
              A digital sanctuary honoring the master craftsmanship of traditional villages across Vietnam. Every vein of clay, thread of silk, and bamboo strand carries the ancestral memory of Vietnamese hands over centuries.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-border-neutral">
              <Link
                to="/crafts"
                className="group inline-flex items-center gap-2 sm:gap-3 font-label-action text-[11px] sm:text-label-action uppercase tracking-[0.18em] sm:tracking-[0.25em] text-text-primary border-b border-text-primary pb-1 hover:text-accent-terracotta hover:border-accent-terracotta transition-colors"
              >
                <span>EXPLORE HERITAGE DIRECTORY</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.15em] text-text-secondary">
                ARCHIVED: {siteStats.crafts || crafts.length || 8} WORKS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION DIVIDER */}
      <div className="w-full bg-surface-subtle border-y border-border-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 font-spec-code text-[10.5px] sm:text-spec-code text-text-secondary">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-accent-terracotta">
              history_edu
            </span>
            <span className="uppercase tracking-[0.08em] sm:tracking-[0.12em] text-text-primary">
              DOSSIER 01 // VILLAGE TOPOGRAPHY
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] tracking-[0.08em]">
            <span>LONGITUDE: 105°55' E</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span>LATITUDE: 21°02' N</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span className="text-accent-terracotta font-medium">FIELD VALIDATION: 2024</span>
          </div>
        </div>
      </div>

      {/* 3. CRAFT HIGHLIGHTS GRID */}
      <section className="w-full py-8 sm:py-12 md:py-space-xl bg-canvas-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 pb-3 md:pb-6 border-b border-border-neutral gap-3">
            <div>
              <span className="font-display-hero text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-accent-terracotta font-medium block mb-1.5 sm:mb-2">
                CURATED COLLECTION
              </span>
              <h2 className="font-display-hero text-[16px] sm:text-[22px] tracking-[0.15em] sm:tracking-[0.25em] text-text-primary uppercase font-light">
                FEATURED MASTERWORKS <span className="mx-2 sm:mx-3 text-border-neutral opacity-60 font-light select-none">|</span> AUTHENTIC FROM VILLAGES
              </h2>
            </div>
            <div className="font-spec-code text-[11px] sm:text-spec-code text-text-secondary flex items-center gap-2">
              <span>SHOWING: {Math.min(3, siteStats.crafts) || '03'} OF {siteStats.crafts || '—'} ARCHIVED PIECES</span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-gutter">
            {loading ? (
              <CraftCardSkeleton count={3} />
            ) : (
              crafts.slice(0, 3).map((item) => (
                <article
                  key={item.id}
                  className="group bg-surface-crisp border border-border-neutral rounded-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-square md:aspect-[4/5] overflow-hidden bg-surface-subtle">
                    <img
                      src={item.image || item.thumbnailUrl || item.thumbnail_url}
                      alt={item.name}
                      data-alt={item.alt || item.name}
                      className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-text-primary text-surface-crisp px-[6px] py-[4px] leading-none shadow-xs">
                      <span className="font-spec-code text-[10px] uppercase tracking-[0.08em] md:tracking-[0.15em] block">
                        {item.badge || (item.isFeatured ? 'CURATED HIGHLIGHT' : 'HERITAGE CRAFT')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-accent-terracotta font-spec-code text-[10px] md:text-[11px] uppercase tracking-wider mb-1 md:mb-2 truncate">
                        <span className="truncate">
                          {item.region?.name || (typeof item.region === 'string' ? item.region : '') || item.village?.name || item.village || 'RED RIVER DELTA'}
                        </span>
                      </div>

                      <h3 className="font-title-card text-[15px] sm:text-[16px] md:text-title-card text-text-primary font-medium mb-1.5 md:mb-3 line-clamp-2 leading-snug">
                        <Link to={`/crafts/${item.id}`} className="hover:text-accent-terracotta transition-colors">
                          {item.name}
                        </Link>
                      </h3>

                      <p className="hidden md:block font-body-spec text-body-spec text-text-secondary leading-relaxed mb-4">
                        {item.description || item.shortDescription || item.short_description}
                      </p>
                    </div>

                    <div className="pt-2 md:pt-4 border-t border-border-neutral">
                      <div className="hidden md:block space-y-2 mb-3">
                        <div className="flex items-center justify-between font-spec-code text-[11px]">
                          <span className="text-text-secondary">Material:</span>
                          <span className="text-text-primary font-medium truncate max-w-[140px]">
                            {Array.isArray(item.materials) ? item.materials.map(m => m.name || m).join(', ') : (item.material || 'Natural raw material')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-spec-code text-[11px]">
                          <span className="text-text-secondary">Dimensions:</span>
                          <span className="text-text-primary font-medium">
                            {item.dimension || 'Traditional standard'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <span className="font-headline-title text-[13px] sm:text-[14px] md:text-[16px] text-text-primary font-semibold truncate">
                          {typeof item.price === 'number' ? `${item.price.toLocaleString('vi-VN')} ₫` : (item.price || '1.850.000 ₫')}
                        </span>
                        <Link
                          to={`/crafts/${item.id}`}
                          className="font-label-action text-[9px] sm:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.18em] text-accent-terracotta hover:underline inline-flex items-center gap-0.5 shrink-0 cursor-pointer"
                        >
                          <span className="hidden sm:inline">VIEW </span>DETAILS →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Action Button */}
          <div className="mt-12 text-center">
            <Link
              to="/crafts"
              className="inline-block px-10 py-3.5 bg-text-primary text-surface-crisp font-label-action text-label-action uppercase tracking-[0.2em] rounded-none hover:bg-accent-terracotta transition-colors shadow-sm cursor-pointer"
            >
              VIEW ENTIRE HERITAGE ARCHIVE
            </Link>
          </div>
        </div>
      </section>

      {/* 4. TRUST STRIP */}
      <section className="w-full bg-surface-subtle border-y border-border-neutral py-8 sm:py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-neutral">
            {/* Column 1 */}
            <div className="py-4 md:py-0 md:px-8 first:pl-0 flex flex-col justify-start">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="font-spec-code text-[11px] sm:text-spec-code text-accent-terracotta font-semibold">
                  01 / ORIGIN
                </span>
                <span className="w-6 sm:w-8 h-px bg-border-neutral"></span>
              </div>
              <h4 className="font-label-action text-[11px] sm:text-[13px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-text-primary font-semibold mb-1.5 sm:mb-2">
                DIRECT FROM VILLAGES
              </h4>
              <p className="font-body-spec text-[12px] sm:text-body-spec text-text-secondary leading-relaxed">
                Direct connection without middlemen to master artisans, guild lineages, and ancestral craft studios.
              </p>
            </div>

            {/* Column 2 */}
            <div className="py-4 md:py-0 md:px-8 flex flex-col justify-start">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="font-spec-code text-[11px] sm:text-spec-code text-accent-terracotta font-semibold">
                  02 / CRAFTSMANSHIP
                </span>
                <span className="w-6 sm:w-8 h-px bg-border-neutral"></span>
              </div>
              <h4 className="font-label-action text-[11px] sm:text-[13px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-text-primary font-semibold mb-1.5 sm:mb-2">
                100% HANDCRAFTED
              </h4>
              <p className="font-body-spec text-[12px] sm:text-body-spec text-text-secondary leading-relaxed">
                Purely skilled hands and generational secrets. Steadfastly rejecting mass-produced industrial molds.
              </p>
            </div>

            {/* Column 3 */}
            <div className="py-4 md:py-0 md:px-8 last:pr-0 flex flex-col justify-start">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="font-spec-code text-[11px] sm:text-spec-code text-accent-terracotta font-semibold">
                  03 / LINEAGE
                </span>
                <span className="w-6 sm:w-8 h-px bg-border-neutral"></span>
              </div>
              <h4 className="font-label-action text-[11px] sm:text-[13px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-text-primary font-semibold mb-1.5 sm:mb-2">
                PRESERVATION &amp; TRACEABILITY
              </h4>
              <p className="font-body-spec text-[12px] sm:text-body-spec text-text-secondary leading-relaxed">
                Each work accompanied by a digital archival certificate, preserving heritage records, precious glaze recipes, and weaving methods for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 50/50 DUAL EDITORIAL SPLIT */}
      <section className="w-full bg-canvas-linen py-8 sm:py-12 md:py-space-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="flex items-center justify-between mb-6 md:mb-8 pb-3 md:pb-4 border-b border-border-neutral">
            <div className="flex items-center gap-2">
              <span className="font-display-hero text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-text-primary font-light">
                FIELDWORK &amp; RESTORATION PERSPECTIVES
              </span>
              <span className="text-border-neutral opacity-60">|</span>
              <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-accent-terracotta">
                EXPEDITION RECORD #42
              </span>
            </div>
            <span className="font-spec-code text-spec-code text-text-secondary hidden sm:inline-block">
              20°58'48"N - 105°54'50"E
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
            {/* Left Panel: Crackle Glaze */}
            <div className="bg-surface-crisp border border-border-neutral p-4 sm:p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-video sm:aspect-[16/10] overflow-hidden bg-surface-subtle border border-border-neutral mb-4 sm:mb-6">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="Extreme macro shot of antique celadon crackle glaze pottery, fine fissure network in ceramic surface, subtle iron oxide rim, natural light grazing the uneven glaze texture, muted earthy ivory and soft moss hues, serene contemplative museum mood."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFC4Tg8NvBiTcsIssdqzY7hYtEO9NC_6TnsfZiJ4heO_hm4zJ4ks7zYx1avpYgp1A1T_d0-qp23LS9tNRYRXuoEnHq6QSE9vJzo2gjoOvehuAoeNPKCWrr0AgG2FR6rmMmWVLLL2JsEHrSquDplNaqYv1wyp-AwvQ8jRlVvVW_7igR3cLB_HYIOCjoy875H9cUIuxUUjtIUVRSMAEvmsBdrm4wP7Pb7AxrD-mXwVg"
                    alt="Crackle glaze technique magnification"
                  />
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-canvas-linen/90 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-spec-code tracking-[0.1em] sm:tracking-[0.12em] uppercase text-text-primary border border-border-neutral">
                    MAGNIFIED: ×12 // CRACKLE GLAZE TECHNIQUE
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-accent-terracotta">
                    BAT TRANG CERAMICS
                  </span>
                  <span className="text-border-neutral opacity-60">|</span>
                  <span className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary">
                    16TH CENTURY ERA
                  </span>
                </div>
                <h3 className="font-headline-title text-[18px] sm:text-[22px] md:text-headline-title text-text-primary font-medium mb-3 sm:mb-4">
                  Fluctuations of Kiln Fire &amp; Earth Fractures
                </h3>
                <p className="font-body-default text-[13px] sm:text-body-default text-text-secondary leading-relaxed mb-4 sm:mb-6">
                  Crackle glaze forms through differing thermal expansion coefficients between clay body and glaze during rapid kiln cooling. Master potters control flame temp by eye and generational intuition over four lineages of wood firing.
                </p>
              </div>
              <div className="pt-4 sm:pt-6 border-t border-border-neutral grid grid-cols-2 gap-3 sm:gap-4 font-spec-code text-[10.5px] sm:text-[11px]">
                <div>
                  <span className="text-text-secondary block">Firing temperature:</span>
                  <span className="text-text-primary font-semibold">1,280°C - 1,300°C</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Crackle raw elements:</span>
                  <span className="text-text-primary font-semibold">Crushed limestone &amp; rice husk ash</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Loom Weaver */}
            <div className="bg-surface-crisp border border-border-neutral p-4 sm:p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-video sm:aspect-[16/10] overflow-hidden bg-surface-subtle border border-border-neutral mb-4 sm:mb-6">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="Weathered, wrinkled hands of an elderly artisan weaver maneuvering an ancient dark hardwood loom, threading vibrant indigo cotton yarns with absolute precision, shaft of warm morning light slicing through the wooden workshop, poignant heritage portrait."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf6RA2pFPyDJFRrTLXYYj_dcvpnGFB9d276fdvUy7b5m6sAFL-Jy0HOXz_Jy6zgxf8595QvlECHxVVWrcLpliDTVEpYJVJ7CiYg_-cCRj3m9n3QHqEJia5Wkh0zNohHdoWnngG6ms-Ac3UV4IdAUra24MY4HTSzXs8t2xG2OwSRNnNz5aXBkXDAr7g2SUsFsVd47aka7LVKNiwJyVIkwJo_jic3hqZf9PWOzFmk9s"
                    alt="Cham master weaver"
                  />
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-canvas-linen/90 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-spec-code tracking-[0.1em] sm:tracking-[0.12em] uppercase text-text-primary border border-border-neutral">
                    ARTISAN: THI HONG // 68 YRS CRAFT
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-accent-terracotta">
                    CHAM WEAVING VILLAGE
                  </span>
                  <span className="text-border-neutral opacity-60">|</span>
                  <span className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary">
                    INTANGIBLE HERITAGE
                  </span>
                </div>
                <h3 className="font-headline-title text-[18px] sm:text-[22px] md:text-headline-title text-text-primary font-medium mb-3 sm:mb-4">
                  Rhythm of the Loom &amp; Sacred Patterns
                </h3>
                <blockquote className="font-label-signature text-[13px] sm:text-label-signature italic text-text-primary mb-4 sm:mb-6 pl-3 sm:pl-4 border-l-2 border-accent-terracotta leading-relaxed">
                  "The loom never lies. Shift the shuttle by a millimeter, and the sacred lion emblem fractures. We sit here not merely to weave fabric for commerce, but to safeguard the cadence of our ancestors."
                </blockquote>
              </div>
              <div className="pt-4 sm:pt-6 border-t border-border-neutral flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary">
                  FIELD NOTES: PHUOC DAN, NINH THUAN
                </div>
                <Link
                  to="/artisans"
                  className="font-label-action text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-accent-terracotta hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                >
                  READ EXPEDITION ESSAY →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REGIONAL INDEX TEASER */}
      <section className="w-full bg-surface-subtle border-t border-border-neutral py-8 sm:py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-6 md:mb-8 pb-3 md:pb-4 border-b border-border-neutral">
            <h3 className="font-display-hero text-[13px] sm:text-[16px] md:text-[18px] tracking-[0.15em] sm:tracking-[0.25em] text-text-primary uppercase font-light">
              GEOGRAPHIC CRAFT VILLAGE MAP
            </h3>
            <span className="font-spec-code text-spec-code text-text-secondary mt-2 sm:mt-0">
              NETWORK OF {siteStats.regions || regionsList.length || 6} CULTURAL TRADITION REGIONS
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(regionsList.length > 0 ? regionsList.slice(0, 4) : [
              { id: 1, name: 'Red River Delta', villageCount: 18, craftSummary: 'Bat Trang Ceramics & Pearl Inlay' },
              { id: 4, name: 'Thanh - Nghe - Tinh Lands', villageCount: 14, craftSummary: 'Sa Silk & Fine Woodworking' },
              { id: 5, name: 'Brocade & Agarwood Highlands', villageCount: 16, craftSummary: 'Cham Weaving & Bau Truc Pottery' },
              { id: 6, name: 'Mekong River Basin', villageCount: 12, craftSummary: 'Rattan Weaving & Boatbuilding' },
            ]).map((reg, idx) => {
              const villageNum = reg.registeredVillageCount || reg.villageCount || 0;
              const craftDesc = reg.craftSummary || reg.craft_summary || 'Craft village heritage';
              const regionTitle = reg.name;

              return (
                <Link
                  key={reg.id || idx}
                  to="/regions"
                  className="p-5 bg-surface-crisp border border-border-neutral hover:border-accent-terracotta transition-colors group cursor-pointer"
                >
                  <span className="font-spec-code text-[10px] uppercase tracking-[0.15em] text-accent-terracotta block mb-1">
                    REGION 0{idx + 1}
                  </span>
                  <span className="font-title-card text-[15px] text-text-primary font-medium block group-hover:text-accent-terracotta transition-colors">
                    {regionTitle}
                  </span>
                  <span className="font-spec-code text-[11px] text-text-secondary mt-2 block">
                    {villageNum} Craft Villages • {craftDesc}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
