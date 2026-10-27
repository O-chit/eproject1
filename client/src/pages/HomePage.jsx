import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CraftCardSkeleton from '../components/common/CraftCardSkeleton';
import api from '../services/api';

const HIGHLIGHT_CRAFTS = [
  {
    id: 1,
    code: 'BT-MR01',
    badge: 'NUNG CỦI 1300°C',
    village: 'Làng Gốm Bát Tràng',
    province: 'Hà Nội',
    name: 'Ấm Trà Men Rạn Cổ Điển',
    description: 'Chế tác từ đất sét phù sa sông Hồng nung men tro cổ truyền. Mỗi đường rạn nứt tự nhiên theo biến thiên nhiệt độ lò bầu, không trùng lặp.',
    material: 'Cao lanh men tro gỗ',
    dimension: '180ml | Ø 9.5cm',
    price: '1.850.000 ₫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaUrvFnVxj2lsHDRkr-yaTRJCRIumrtcbAoBO8T7gJK22rF-l8LFMNoASMdtx_N8hQkmINE6HE7xtmJmzGpxqvbiG5mzG2TvxNKGDuu4MZjKV7e4q6ixIFOJ1PSNsl56IqQagawz_SCLeDfMjYY1bGxxdBh3e-6wBJ15RkSXBTpEZHEoWqpB_uzbwmdJy82jUtSMpkv6zROQGRW5W2GKqEOL2DxfhNLSsVd1T7ujM',
    alt: 'Close-up macro of an artisanal Vietnamese cracked-glaze teapot from Bat Trang pottery village, delicate web-like crazing across ivory porcelain surface, brass arched handle, rustic earthen wood-fired aesthetic, natural atmospheric diffused daylight, museum catalog detail.',
  },
  {
    id: 2,
    code: 'MN-TC04',
    badge: 'DỆT KHUNG GỖ CỔ',
    village: 'Làng Dệt Mỹ Nghiệp',
    province: 'Ninh Thuận',
    name: 'Khăn Choàng Thổ Cẩm Hoa Văn Thần Sư',
    description: 'Sợi bông trồng tự nhiên ven đồi cát, nhuộm bằng vỏ cây rừng và lá chàm ngâm ủ 20 ngày. Họa tiết cổ xưa mang tính bảo hộ tâm linh.',
    material: 'Bông thô nhuộm thực vật',
    dimension: '65 × 200 cm',
    price: '1.420.000 ₫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBay0c69D5JK7FMaxyn9PSRxcsgUqgVBC4moSSxlmkFLgKHiKIqdRgYLDbsNkoDNTWbn3aE3tjfmDVjmU7b0uCCCWly4AJRKvMbcSnFUrimhvpDJ528ysIaEbq7Vk675AvADO51B7vRlzladV4zbFP22E6K0TREwBbPB2PY6e9MzBG80dTaXhPHGxL-GcbgknPoVSiq1dmnBko_BQVJIGRkPk_Vx46iUTqabaRYxTU',
    alt: 'Traditional Cham handwoven brocade scarf laid flat on raw linen, complex geometric diamond patterns in natural indigo and madder root red, fine organic cotton fringe, authentic village craft aesthetic from My Nghiep Ninh Thuan, rich tactile fiber detail.',
  },
  {
    id: 3,
    code: 'PV-MT09',
    badge: 'CHUỐT NAN TƠ',
    village: 'Làng Mây Tre Phú Vinh',
    province: 'Chương Mỹ',
    name: 'Khay Trà Mây Nếp Vót Chuốt',
    description: 'Sử dụng mây nếp rừng già phơi khô 6 tháng, nan được vót mỏng như sợi cước bằng dao rèn thủ công. Đan kín không một vết nối thừa.',
    material: 'Mây nếp rừng & nan tre già',
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
        console.warn('Không thể nạp dữ liệu từ API DB, sử dụng dữ liệu dự phòng:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION CHUẨN DEMO */}
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
                LƯU TRỮ VÀ BẢO TỒN THỦ CÔNG VIỆT NAM
              </span>
            </div>

            <h1 className="font-headline-title text-[20px] sm:text-[28px] md:text-[38px] leading-[1.25] tracking-[0.04em] sm:tracking-[0.1em] md:tracking-[0.15em] text-text-primary uppercase font-light mb-4 sm:mb-6">
              DI SẢN SỐNG TRONG TỪNG ĐƯỜNG NÉT
            </h1>

            <p className="font-body-default text-[13px] sm:text-body-default text-text-secondary leading-relaxed mb-6 sm:mb-8">
              Không gian số vinh danh tinh hoa làng nghề truyền thống từ Bắc chí Nam. Từng thớ đất, sợi tơ, nan tre đều chứa đựng ký ức bàn tay người Việt qua hàng thế kỷ.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-border-neutral">
              <Link
                to="/crafts"
                className="group inline-flex items-center gap-2 sm:gap-3 font-label-action text-[11px] sm:text-label-action uppercase tracking-[0.18em] sm:tracking-[0.25em] text-text-primary border-b border-text-primary pb-1 hover:text-accent-terracotta hover:border-accent-terracotta transition-colors"
              >
                <span>KHÁM PHÁ DANH MỤC DI SẢN</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.15em] text-text-secondary">
                BẢN GHI: {siteStats.crafts || crafts.length || 8} TÁC PHẨM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION DIVIDER WITH PIPE ALIGNMENT & COORD PINS */}
      <div className="w-full bg-surface-subtle border-y border-border-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 font-spec-code text-[10.5px] sm:text-spec-code text-text-secondary">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-accent-terracotta">
              history_edu
            </span>
            <span className="uppercase tracking-[0.08em] sm:tracking-[0.12em] text-text-primary">
              TẬP HỒ SƠ 01 // KHẢO TẢ LÀNG NGHỀ
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] tracking-[0.08em]">
            <span>KINH ĐỘ: 105°55' E</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span>VĨ ĐỘ: 21°02' N</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span className="text-accent-terracotta font-medium">XÁC THỰC HIỆN TRƯỜNG: 2024</span>
          </div>
        </div>
      </div>

      {/* 3. 3-COLUMN / 2-COLUMN MOBILE CRAFT HIGHLIGHTS GRID */}
      <section className="w-full py-8 sm:py-12 md:py-space-xl bg-canvas-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          {/* Header nhóm tác phẩm */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 pb-3 md:pb-6 border-b border-border-neutral gap-3">
            <div>
              <span className="font-display-hero text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-accent-terracotta font-medium block mb-1.5 sm:mb-2">
                TUYỂN CHỌN ĐỊNH KỲ
              </span>
              <h2 className="font-display-hero text-[16px] sm:text-[22px] tracking-[0.15em] sm:tracking-[0.25em] text-text-primary uppercase font-light">
                TÁC PHẨM ĐẶC SẮC <span className="mx-2 sm:mx-3 text-border-neutral opacity-60 font-light select-none">|</span> NGUYÊN BẢN TỪ LÀNG NGHỀ
              </h2>
            </div>
            <div className="font-spec-code text-[11px] sm:text-spec-code text-text-secondary flex items-center gap-2">
              <span>HIỂN THỊ: {Math.min(3, siteStats.crafts) || '03'} TRÊN {siteStats.crafts || '—'} VẬT PHẨM LƯU CHIỂU</span>
            </div>
          </div>

          {/* Lưới sản phẩm: 2 cột trên mobile (gap: 12px), 3 cột trên desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-gutter">
            {loading ? (
              <CraftCardSkeleton count={3} />
            ) : (
              crafts.slice(0, 3).map((item) => (
                <article
                  key={item.id}
                  className="group bg-surface-crisp border border-border-neutral rounded-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between"
                >
                  {/* Khung ảnh tỷ lệ vuông 1:1, object-cover */}
                  <div className="relative w-full aspect-square md:aspect-[4/5] overflow-hidden bg-surface-subtle">
                    <img
                      src={item.image || item.thumbnailUrl || item.thumbnail_url}
                      alt={item.name}
                      data-alt={item.alt || item.name}
                      className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Đã ẩn hoàn toàn nhãn MÃ: KHAN-SA-LUA... đè lên ảnh theo yêu cầu */}

                    {/* Thu nhỏ nhãn ĐẶC SẮC TUYỂN CHỌN (font-size: 10px, padding: 4px 6px) */}
                    <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-text-primary text-surface-crisp px-[6px] py-[4px] leading-none shadow-xs">
                      <span className="font-spec-code text-[10px] uppercase tracking-[0.08em] md:tracking-[0.15em] block">
                        {item.badge || (item.isFeatured ? 'ĐẶC SẮC TUYỂN CHỌN' : 'THỦ CÔNG TRUYỀN ĐỜI')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Chỉ giữ lại 1 nhãn vùng miền duy nhất, loại bỏ nhãn bị lặp thứ 2 */}
                      <div className="flex items-center text-accent-terracotta font-spec-code text-[10px] md:text-[11px] uppercase tracking-wider mb-1 md:mb-2 truncate">
                        <span className="truncate">
                          {item.region?.name || (typeof item.region === 'string' ? item.region : '') || item.village?.name || item.village || 'ĐỒNG BẰNG BẮC BỘ'}
                        </span>
                      </div>

                      {/* Tiêu đề sản phẩm giảm cỡ chữ xuống 15px - 16px, giới hạn tối đa 2 dòng */}
                      <h3 className="font-title-card text-[15px] sm:text-[16px] md:text-title-card text-text-primary font-medium mb-1.5 md:mb-3 line-clamp-2 leading-snug">
                        <Link to={`/crafts/${item.id}`} className="hover:text-accent-terracotta transition-colors">
                          {item.name}
                        </Link>
                      </h3>

                      {/* Ẩn đoạn mô tả dài trên thẻ danh sách để giao diện gọn gàng */}
                      <p className="hidden md:block font-body-spec text-body-spec text-text-secondary leading-relaxed mb-4">
                        {item.description || item.shortDescription || item.short_description}
                      </p>
                    </div>

                    <div className="pt-2 md:pt-4 border-t border-border-neutral">
                      {/* Ẩn bảng thông số chất liệu và kích thước trên thẻ danh sách */}
                      <div className="hidden md:block space-y-2 mb-3">
                        <div className="flex items-center justify-between font-spec-code text-[11px]">
                          <span className="text-text-secondary">Chất liệu:</span>
                          <span className="text-text-primary font-medium truncate max-w-[140px]">
                            {Array.isArray(item.materials) ? item.materials.map(m => m.name || m).join(', ') : (item.material || 'Nguyên liệu tự nhiên')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-spec-code text-[11px]">
                          <span className="text-text-secondary">Kích thước:</span>
                          <span className="text-text-primary font-medium">
                            {item.dimension || 'Quy chuẩn truyền thống'}
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
                          <span className="hidden sm:inline">XEM </span>CHI TIẾT →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Nút hành động đáy kho lưu trữ */}
          <div className="mt-12 text-center">
            <Link
              to="/crafts"
              className="inline-block px-10 py-3.5 bg-text-primary text-surface-crisp font-label-action text-label-action uppercase tracking-[0.2em] rounded-none hover:bg-accent-terracotta transition-colors shadow-sm cursor-pointer"
            >
              XEM TOÀN BỘ KHO LƯU TRỮ DI SẢN
            </Link>
          </div>
        </div>
      </section>

      {/* 4. 3-COLUMN TRUST STRIP (BẢN SẮC & CAM KẾT) */}
      <section className="w-full bg-surface-subtle border-y border-border-neutral py-8 sm:py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-neutral">
            {/* Cột 1 */}
            <div className="py-4 md:py-0 md:px-8 first:pl-0 flex flex-col justify-start">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="font-spec-code text-[11px] sm:text-spec-code text-accent-terracotta font-semibold">
                  01 / NGUỒN GỐC
                </span>
                <span className="w-6 sm:w-8 h-px bg-border-neutral"></span>
              </div>
              <h4 className="font-label-action text-[11px] sm:text-[13px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-text-primary font-semibold mb-1.5 sm:mb-2">
                NGUỒN GỐC TẬN LÀNG NGHỀ
              </h4>
              <p className="font-body-spec text-[12px] sm:text-body-spec text-text-secondary leading-relaxed">
                Kết nối trực tiếp không qua trung gian với các nghệ nhân ưu tú, tổ nghề và xưởng chế tác cổ truyền tại địa phương.
              </p>
            </div>

            {/* Cột 2 */}
            <div className="py-4 md:py-0 md:px-8 flex flex-col justify-start">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="font-spec-code text-[11px] sm:text-spec-code text-accent-terracotta font-semibold">
                  02 / TÁC CHẾ
                </span>
                <span className="w-6 sm:w-8 h-px bg-border-neutral"></span>
              </div>
              <h4 className="font-label-action text-[11px] sm:text-[13px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-text-primary font-semibold mb-1.5 sm:mb-2">
                CHẾ TÁC THỦ CÔNG 100%
              </h4>
              <p className="font-body-spec text-[12px] sm:text-body-spec text-text-secondary leading-relaxed">
                Thuần đôi bàn tay khéo léo và bí quyết gia truyền ngàn đời. Kiên định khước từ các quy trình sản xuất dập khuôn công nghiệp.
              </p>
            </div>

            {/* Cột 3 */}
            <div className="py-4 md:py-0 md:px-8 last:pr-0 flex flex-col justify-start">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="font-spec-code text-[11px] sm:text-spec-code text-accent-terracotta font-semibold">
                  03 / TRUYỀN THỪA
                </span>
                <span className="w-6 sm:w-8 h-px bg-border-neutral"></span>
              </div>
              <h4 className="font-label-action text-[11px] sm:text-[13px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-text-primary font-semibold mb-1.5 sm:mb-2">
                BẢO TỒN VÀ TRUY XUẤT
              </h4>
              <p className="font-body-spec text-[12px] sm:text-body-spec text-text-secondary leading-relaxed">
                Mỗi tác phẩm đi kèm chứng thư lưu trữ số, lưu giữ hồ sơ di sản, công thức men quý và phương thức dệt cho thế hệ mai sau.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 50/50 DUAL EDITORIAL SPLIT (GÓC NHÌN CHẾ TÁC) */}
      <section className="w-full bg-canvas-linen py-8 sm:py-12 md:py-space-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          {/* Nhãn thẻ mục */}
          <div className="flex items-center justify-between mb-6 md:mb-8 pb-3 md:pb-4 border-b border-border-neutral">
            <div className="flex items-center gap-2">
              <span className="font-display-hero text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-text-primary font-light">
                GÓC NHÌN ĐIỀN DÃ &amp; PHỤC DỰNG
              </span>
              <span className="text-border-neutral opacity-60">|</span>
              <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-accent-terracotta">
                HỒ SƠ THỰC ĐỊA #42
              </span>
            </div>
            <span className="font-spec-code text-spec-code text-text-secondary hidden sm:inline-block">
              20°58'48"N - 105°54'50"E
            </span>
          </div>

          {/* Bố cục 2 cột cân xứng */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
            {/* Panel Trái: Kỹ Thuật Men Rạn */}
            <div className="bg-surface-crisp border border-border-neutral p-4 sm:p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-video sm:aspect-[16/10] overflow-hidden bg-surface-subtle border border-border-neutral mb-4 sm:mb-6">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="Extreme macro shot of antique celadon crackle glaze pottery, fine fissure network in ceramic surface, subtle iron oxide rim, natural light grazing the uneven glaze texture, muted earthy ivory and soft moss hues, serene contemplative museum mood."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFC4Tg8NvBiTcsIssdqzY7hYtEO9NC_6TnsfZiJ4heO_hm4zJ4ks7zYx1avpYgp1A1T_d0-qp23LS9tNRYRXuoEnHq6QSE9vJzo2gjoOvehuAoeNPKCWrr0AgG2FR6rmMmWVLLL2JsEHrSquDplNaqYv1wyp-AwvQ8jRlVvVW_7igR3cLB_HYIOCjoy875H9cUIuxUUjtIUVRSMAEvmsBdrm4wP7Pb7AxrD-mXwVg"
                    alt="Phóng đại kỹ thuật men rạn"
                  />
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-canvas-linen/90 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-spec-code tracking-[0.1em] sm:tracking-[0.12em] uppercase text-text-primary border border-border-neutral">
                    PHÓNG ĐẠI: ×12 // KỸ THUẬT MEN RẠN
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-accent-terracotta">
                    GỐM SỨ BÁT TRÀNG
                  </span>
                  <span className="text-border-neutral opacity-60">|</span>
                  <span className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary">
                    NIÊN ĐẠI THẾ KỶ XVI
                  </span>
                </div>
                <h3 className="font-headline-title text-[18px] sm:text-[22px] md:text-headline-title text-text-primary font-medium mb-3 sm:mb-4">
                  Biến Biến Của Lửa &amp; Vết Nứt Của Đất
                </h3>
                <p className="font-body-default text-[13px] sm:text-body-default text-text-secondary leading-relaxed mb-4 sm:mb-6">
                  Men rạn hình thành do sự chênh lệch hệ số giãn nở giữa cốt gốm và lớp men phủ khi hạ nhiệt độ lò bầu đột ngột. Người thợ gốm lão thành điều khiển ngọn lửa bằng mắt thường và kinh nghiệm tích lũy qua bốn thế hệ nung củi gỗ nghiến.
                </p>
              </div>
              <div className="pt-4 sm:pt-6 border-t border-border-neutral grid grid-cols-2 gap-3 sm:gap-4 font-spec-code text-[10.5px] sm:text-[11px]">
                <div>
                  <span className="text-text-secondary block">Nhiệt độ nung:</span>
                  <span className="text-text-primary font-semibold">1.280°C - 1.300°C</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Nguyên liệu tạo rạn:</span>
                  <span className="text-text-primary font-semibold">Đá vôi nghiền &amp; tro trấu</span>
                </div>
              </div>
            </div>

            {/* Panel Phải: Nghệ Nhân Dệt Khung Gỗ Cổ */}
            <div className="bg-surface-crisp border border-border-neutral p-4 sm:p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-video sm:aspect-[16/10] overflow-hidden bg-surface-subtle border border-border-neutral mb-4 sm:mb-6">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="Weathered, wrinkled hands of an elderly artisan weaver maneuvering an ancient dark hardwood loom, threading vibrant indigo cotton yarns with absolute precision, shaft of warm morning light slicing through the wooden workshop, poignant heritage portrait."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf6RA2pFPyDJFRrTLXYYj_dcvpnGFB9d276fdvUy7b5m6sAFL-Jy0HOXz_Jy6zgxf8595QvlECHxVVWrcLpliDTVEpYJVJ7CiYg_-cCRj3m9n3QHqEJia5Wkh0zNohHdoWnngG6ms-Ac3UV4IdAUra24MY4HTSzXs8t2xG2OwSRNnNz5aXBkXDAr7g2SUsFsVd47aka7LVKNiwJyVIkwJo_jic3hqZf9PWOzFmk9s"
                    alt="Nghệ nhân dệt Chăm"
                  />
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-canvas-linen/90 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-spec-code tracking-[0.1em] sm:tracking-[0.12em] uppercase text-text-primary border border-border-neutral">
                    NGHỆ NHÂN: THỊ HỒNG // 68 TUỔI NGHỀ
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-accent-terracotta">
                    LÀNG DỆT CHĂM
                  </span>
                  <span className="text-border-neutral opacity-60">|</span>
                  <span className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary">
                    DI SẢN PHI VẬT THỂ
                  </span>
                </div>
                <h3 className="font-headline-title text-[18px] sm:text-[22px] md:text-headline-title text-text-primary font-medium mb-3 sm:mb-4">
                  Nhịp Thoi Gỗ Cổ &amp; Tâm Thức Hoa Văn
                </h3>
                <blockquote className="font-label-signature text-[13px] sm:text-label-signature italic text-text-primary mb-4 sm:mb-6 pl-3 sm:pl-4 border-l-2 border-accent-terracotta leading-relaxed">
                  "Khung cửi không biết nói dối. Tay giật thoi lệch một li, hoa văn thần sư sẽ gãy khúc. Ta ngồi đây không phải để dệt vải bán, mà để giữ lại tiếng lách cách của tổ tiên."
                </blockquote>
              </div>
              <div className="pt-4 sm:pt-6 border-t border-border-neutral flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary">
                  GHI CHÉP: XÃ PHƯỚC DÂN, NINH THUẬN
                </div>
                <Link
                  to="/artisans"
                  className="font-label-action text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-accent-terracotta hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                >
                  ĐỌC KÝ SỰ ĐIỀN DÃ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE REGIONAL INDEX TEASER */}
      <section className="w-full bg-surface-subtle border-t border-border-neutral py-8 sm:py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-6 md:mb-8 pb-3 md:pb-4 border-b border-border-neutral">
            <h3 className="font-display-hero text-[13px] sm:text-[16px] md:text-[18px] tracking-[0.15em] sm:tracking-[0.25em] text-text-primary uppercase font-light">
              BẢN ĐỒ LÀNG NGHỀ THEO VÙNG ĐỊA LÝ
            </h3>
            <span className="font-spec-code text-spec-code text-text-secondary mt-2 sm:mt-0">
              HỆ THỐNG {siteStats.regions || regionsList.length || 6} VÙNG VĂN HÓA TRUYỀN THỐNG
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(regionsList.length > 0 ? regionsList.slice(0, 4) : [
              { id: 1, name: 'Đồng Bằng Sông Hồng', villageCount: 18, craftSummary: 'Gốm Bát Tràng & Khảm Trai' },
              { id: 4, name: 'Xứ Thanh - Nghệ - Tĩnh', villageCount: 14, craftSummary: 'Lụa Sa & Mộc Mỹ Nghệ' },
              { id: 5, name: 'Đất Thổ Cẩm & Trầm Hương', villageCount: 16, craftSummary: 'Dệt Chăm & Gốm Bàu Trúc' },
              { id: 6, name: 'Vùng Đất Cửu Long', villageCount: 12, craftSummary: 'Đan Đát & Đóng Xuồng' },
            ]).map((reg, idx) => {
              const villageNum = reg.registeredVillageCount || reg.villageCount || 0;
              const craftDesc = reg.craftSummary || reg.craft_summary || 'Di sản làng nghề';
              const regionTitle = reg.name;

              return (
                <Link
                  key={reg.id || idx}
                  to="/regions"
                  className="p-5 bg-surface-crisp border border-border-neutral hover:border-accent-terracotta transition-colors group cursor-pointer"
                >
                  <span className="font-spec-code text-[10px] uppercase tracking-[0.15em] text-accent-terracotta block mb-1">
                    VÙNG 0{idx + 1}
                  </span>
                  <span className="font-title-card text-[15px] text-text-primary font-medium block group-hover:text-accent-terracotta transition-colors">
                    {regionTitle}
                  </span>
                  <span className="font-spec-code text-[11px] text-text-secondary mt-2 block">
                    {villageNum} Làng Nghề • {craftDesc}
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
