import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CraftCardSkeleton from '../components/common/CraftCardSkeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  },
  {
    id: 4,
    code: 'HT-SM07',
    badge: 'DÁT VÀNG 24K',
    village: 'Làng Sơn Mài Hạ Thái',
    province: 'Thường Tín',
    name: 'Hộp Trà Sơn Mài Cẩn Trứng & Dát Vàng Quỳ',
    description: 'Sơn ta tinh khiết mài nước 12 lượt, bề mặt bóng sâu hun hút với vỏ trứng vịt vỡ tạo hoa văn và vàng quỳ 24K óng ánh.',
    material: 'Gỗ mộc, sơn ta & vàng quỳ',
    dimension: '12 × 12 × 15 cm',
    price: '2.650.000 ₫',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HomePage() {
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchData() {
      try {
        const res = await fetch(`${API_URL}/crafts?is_featured=true&limit=6`);
        if (!res.ok) throw new Error('API fetch error');
        const data = await res.json();
        const items = data.data || data;
        if (isMounted) {
          if (Array.isArray(items) && items.length > 0) {
            setCrafts(items);
          } else {
            setCrafts(HIGHLIGHT_CRAFTS);
          }
        }
      } catch (err) {
        if (isMounted) {
          setCrafts(HIGHLIGHT_CRAFTS);
        }
      } finally {
        if (isMounted) {
          setTimeout(() => setLoading(false), 300);
        }
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, crafts.length - itemsPerPage);

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const visibleCrafts = crafts.slice(carouselIndex, carouselIndex + itemsPerPage);

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO SECTION (THEO ĐÚNG CHUẨN DEMO STITCH) */}
      <section className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center justify-end overflow-hidden -mt-20 pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCdKDmU3omFnH1-UgCNIGr9SniP8pazrUjo8i70l1xby0267_kF-wWIYx7SF1aDkAQvZDE1sqF2FcYkVr-HFqPyaOgIiGKKfnPwgH4YfBQ1HfvKSnkpIKecG_0XUd6-EPVGqR-bMn9Kclpi2WxHf9VC1lifYUEu-TYH9srXI47L3uxKDI0J9lQnBhD6wklng-H7V-3u3VsXCmCC9D1Avwacl9S1BrzXp7fbTLDSDpE')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1B1A]/70 via-[#1C1B1A]/40 to-[#1C1B1A]/20 lg:to-transparent"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 flex justify-end">
          <div className="w-full max-w-xl bg-[#F9F8F6]/95 backdrop-blur-sm p-8 sm:p-12 border border-[#E6E2DA] rounded-none shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#B86B35] inline-block"></span>
              <span className="font-['Montserrat'] text-[11px] sm:text-[13px] tracking-[0.35em] text-[#B86B35] uppercase font-light">
                LƯU TRỮ VÀ BẢO TỒN THỦ CÔNG VIỆT NAM
              </span>
            </div>

            <h1 className="font-['Playfair_Display'] text-[28px] sm:text-[38px] leading-[1.25] tracking-[0.1em] sm:tracking-[0.15em] text-[#1C1B1A] uppercase font-light mb-6">
              DI SẢN SỐNG TRONG TỪNG ĐƯỜNG NÉT
            </h1>

            <p className="font-['Inter'] text-[15px] text-[#5A5854] leading-relaxed mb-8">
              Không gian số vinh danh tinh hoa làng nghề truyền thống từ Bắc chí Nam. Từng thớ đất, sợi tơ, nan tre đều chứa đựng ký ức bàn tay người Việt qua hàng thế kỷ.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-[#E6E2DA]">
              <Link
                to="/crafts"
                className="group inline-flex items-center gap-3 font-['Montserrat'] text-[11px] uppercase tracking-[0.25em] text-[#1C1B1A] border-b border-[#1C1B1A] pb-1 hover:text-[#B86B35] hover:border-[#B86B35] transition-colors"
              >
                <span>KHÁM PHÁ DANH MỤC DI SẢN</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <span className="font-['Inter'] text-[11px] uppercase tracking-[0.15em] text-[#5A5854]">
                BẢN GHI: 2.840 TÁC PHẨM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION DIVIDER WITH COORD PINS */}
      <div className="w-full bg-[#F4F2EE] border-y border-[#E6E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 flex flex-wrap items-center justify-between gap-4 font-['Inter'] text-[12px] text-[#5A5854]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[16px] text-[#B86B35]">history_edu</span>
            <span className="uppercase tracking-[0.12em] text-[#1C1B1A] font-medium">
              TẬP HỒ SƠ 01 // KHẢO TẢ LÀNG NGHỀ
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] tracking-[0.08em]">
            <span>KINH ĐỘ: 105°55' E</span>
            <span className="text-[#E6E2DA] opacity-60">|</span>
            <span>VĨ ĐỘ: 21°02' N</span>
            <span className="text-[#E6E2DA] opacity-60">|</span>
            <span className="text-[#B86B35] font-medium">XÁC THỰC HIỆN TRƯỜNG: 2026</span>
          </div>
        </div>
      </div>

      {/* 3. CAROUSEL TÁC PHẨM ĐẶC SẮC */}
      <section className="w-full py-16 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E6E2DA] gap-4">
            <div>
              <span className="font-['Montserrat'] text-[11px] tracking-[0.3em] uppercase text-[#B86B35] font-medium block mb-2">
                TUYỂN CHỌN ĐỊNH KỲ
              </span>
              <h2 className="font-['Montserrat'] text-[18px] sm:text-[22px] tracking-[0.25em] text-[#1C1B1A] uppercase font-light">
                TÁC PHẨM ĐẶC SẮC <span className="mx-3 text-[#E6E2DA] opacity-60 font-light select-none">|</span> NGUYÊN BẢN TỪ LÀNG NGHỀ
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#5A5854] hidden sm:inline">
                {String(carouselIndex + 1).padStart(2, '0')} / {String(crafts.length || 3).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-9 h-9 border border-[#E6E2DA] hover:border-[#B86B35] bg-[#FFFFFF] flex items-center justify-center text-[#1C1B1A] hover:text-[#B86B35] transition-colors"
                  aria-label="Tác phẩm trước"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-9 h-9 border border-[#E6E2DA] hover:border-[#B86B35] bg-[#FFFFFF] flex items-center justify-center text-[#1C1B1A] hover:text-[#B86B35] transition-colors"
                  aria-label="Tác phẩm kế tiếp"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <CraftCardSkeleton count={3} />
            ) : (
              visibleCrafts.map((item) => (
                <article
                  key={item.id}
                  className="group bg-[#FFFFFF] border border-[#E6E2DA] rounded-none transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] flex flex-col"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F4F2EE]">
                    <img
                      src={item.image || item.thumbnail_url}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-[#FFFFFF]/95 backdrop-blur-xs px-3 py-1 border border-[#E6E2DA]">
                      <span className="font-['Inter'] text-[11px] uppercase tracking-[0.1em] text-[#1C1B1A]">
                        MÃ: {item.code || `CR-0${item.id}`}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-[#1C1B1A] text-white px-2.5 py-0.5">
                      <span className="font-['Inter'] text-[10px] uppercase tracking-[0.15em]">
                        {item.badge || 'THỦ CÔNG TRUYỀN ĐỜI'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[#5A5854] font-['Inter'] text-[11px] uppercase tracking-wider mb-2">
                        <span>{item.village || item.region?.name || item.region}</span>
                        <span>{item.province || 'Việt Nam'}</span>
                      </div>
                      <h3 className="font-['Playfair_Display'] text-[18px] text-[#1C1B1A] font-medium mb-3">
                        {item.name}
                      </h3>
                      <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed mb-4">
                        {item.description || item.short_description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E6E2DA] space-y-2">
                      <div className="flex items-center justify-between font-['Inter'] text-[11px]">
                        <span className="text-[#5A5854]">Chất liệu:</span>
                        <span className="text-[#1C1B1A] font-medium">{item.material || 'Nguyên liệu tự nhiên'}</span>
                      </div>
                      <div className="flex items-center justify-between font-['Inter'] text-[11px]">
                        <span className="text-[#5A5854]">Quy cách:</span>
                        <span className="text-[#1C1B1A] font-medium">{item.dimension || 'Tiêu chuẩn thủ công'}</span>
                      </div>
                      <div className="pt-3 flex items-center justify-between">
                        <span className="font-['Playfair_Display'] text-[16px] text-[#1C1B1A] font-semibold">
                          {item.price || 'Tác phẩm lưu trữ'}
                        </span>
                        <Link
                          to={`/crafts/${item.id}`}
                          className="font-['Montserrat'] text-[10px] uppercase tracking-[0.18em] text-[#B86B35] hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          XEM CHI TIẾT →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/crafts"
              className="inline-block px-10 py-3.5 bg-[#1C1B1A] text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.2em] rounded-none hover:bg-[#B86B35] transition-colors shadow-sm"
            >
              XEM TOÀN BỘ KHO LƯU TRỮ DI SẢN
            </Link>
          </div>

        </div>
      </section>

      {/* 4. TRUST STRIP (BẢN SẮC & CAM KẾT) */}
      <section className="w-full bg-[#F4F2EE] border-y border-[#E6E2DA] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E6E2DA]">
            <div className="py-6 md:py-0 md:px-8 first:pl-0 flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-['Inter'] text-[12px] text-[#B86B35] font-semibold">01 / NGUỒN GỐC</span>
                <span className="w-8 h-px bg-[#E6E2DA]"></span>
              </div>
              <h4 className="font-['Montserrat'] text-[13px] uppercase tracking-[0.18em] text-[#1C1B1A] font-semibold mb-2">
                NGUỒN GỐC TẬN LÀNG NGHỀ
              </h4>
              <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed">
                Kết nối trực tiếp không qua trung gian với các nghệ nhân ưu tú, tổ nghề và xưởng chế tác cổ truyền tại địa phương.
              </p>
            </div>

            <div className="py-6 md:py-0 md:px-8 flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-['Inter'] text-[12px] text-[#B86B35] font-semibold">02 / TÁC CHẾ</span>
                <span className="w-8 h-px bg-[#E6E2DA]"></span>
              </div>
              <h4 className="font-['Montserrat'] text-[13px] uppercase tracking-[0.18em] text-[#1C1B1A] font-semibold mb-2">
                CHẾ TÁC THỦ CÔNG 100%
              </h4>
              <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed">
                Thuần đôi bàn tay khéo léo và bí quyết gia truyền ngàn đời. Kiên định khước từ các quy trình sản xuất dập khuôn công nghiệp.
              </p>
            </div>

            <div className="py-6 md:py-0 md:px-8 last:pr-0 flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-['Inter'] text-[12px] text-[#B86B35] font-semibold">03 / TRUYỀN THỪA</span>
                <span className="w-8 h-px bg-[#E6E2DA]"></span>
              </div>
              <h4 className="font-['Montserrat'] text-[13px] uppercase tracking-[0.18em] text-[#1C1B1A] font-semibold mb-2">
                BẢO TỒN VÀ TRUY XUẤT
              </h4>
              <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed">
                Mỗi tác phẩm đi kèm chứng thư lưu trữ số, lưu giữ hồ sơ di sản, công thức men quý và phương thức dệt cho thế hệ mai sau.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DUAL EDITORIAL SPLIT (GÓC NHÌN CHẾ TÁC) */}
      <section className="w-full bg-[#F9F8F6] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6E2DA]">
            <div className="flex items-center gap-2">
              <span className="font-['Montserrat'] text-[11px] tracking-[0.3em] uppercase text-[#1C1B1A] font-light">
                GÓC NHÌN ĐIỀN DÃ & PHỤC DỰNG
              </span>
              <span className="text-[#E6E2DA] opacity-60">|</span>
              <span className="font-['Inter'] text-[11px] uppercase tracking-[0.12em] text-[#B86B35]">
                HỒ SƠ THỰC ĐỊA #42
              </span>
            </div>
            <span className="font-['Inter'] text-[12px] text-[#5A5854] hidden sm:inline-block">
              20°58'48"N - 105°54'50"E
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Panel 1: Men Rạn */}
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#F4F2EE] border border-[#E6E2DA] mb-6">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFC4Tg8NvBiTcsIssdqzY7hYtEO9NC_6TnsfZiJ4heO_hm4zJ4ks7zYx1avpYgp1A1T_d0-qp23LS9tNRYRXuoEnHq6QSE9vJzo2gjoOvehuAoeNPKCWrr0AgG2FR6rmMmWVLLL2JsEHrSquDplNaqYv1wyp-AwvQ8jRlVvVW_7igR3cLB_HYIOCjoy875H9cUIuxUUjtIUVRSMAEvmsBdrm4wP7Pb7AxrD-mXwVg"
                    alt="Men Rạn Bát Tràng"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#F9F8F6]/90 px-2.5 py-1 text-[10px] font-['Inter'] tracking-[0.12em] uppercase text-[#1C1B1A] border border-[#E6E2DA]">
                    PHÓNG ĐẠI: ×12 // KỸ THUẬT MEN RẠN
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-['Inter'] text-[11px] uppercase tracking-[0.15em] text-[#B86B35]">GỐM SỨ BÁT TRÀNG</span>
                  <span className="text-[#E6E2DA] opacity-60">|</span>
                  <span className="font-['Inter'] text-[11px] text-[#5A5854]">NIÊN ĐẠI KỸ THUẬT THẾ KỶ XVI</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-[24px] text-[#1C1B1A] font-medium mb-4">
                  Biến Biến Của Lửa & Vết Nứt Của Đất
                </h3>
                <p className="font-['Inter'] text-[14px] text-[#5A5854] leading-relaxed mb-6">
                  Men rạn hình thành do sự chênh lệch hệ số giãn nở giữa cốt gốm và lớp men phủ khi hạ nhiệt độ lò bầu đột ngột. Người thợ gốm lão thành điều khiển ngọn lửa bằng mắt thường và kinh nghiệm tích lũy qua bốn thế hệ nung củi gỗ nghiến.
                </p>
              </div>
              <div className="pt-6 border-t border-[#E6E2DA] grid grid-cols-2 gap-4 font-['Inter'] text-[11px]">
                <div>
                  <span className="text-[#5A5854] block">Nhiệt độ nung:</span>
                  <span className="text-[#1C1B1A] font-semibold">1.280°C - 1.300°C</span>
                </div>
                <div>
                  <span className="text-[#5A5854] block">Nguyên liệu tạo rạn:</span>
                  <span className="text-[#1C1B1A] font-semibold">Đá vôi nghiền & tro trấu</span>
                </div>
              </div>
            </div>

            {/* Panel 2: Nghệ Nhân Dệt */}
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#F4F2EE] border border-[#E6E2DA] mb-6">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf6RA2pFPyDJFRrTLXYYj_dcvpnGFB9d276fdvUy7b5m6sAFL-Jy0HOXz_Jy6zgxf8595QvlECHxVVWrcLpliDTVEpYJVJ7CiYg_-cCRj3m9n3QHqEJia5Wkh0zNohHdoWnngG6ms-Ac3UV4IdAUra24MY4HTSzXs8t2xG2OwSRNnNz5aXBkXDAr7g2SUsFsVd47aka7LVKNiwJyVIkwJo_jic3hqZf9PWOzFmk9s"
                    alt="Nghệ nhân dệt Chăm"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#F9F8F6]/90 px-2.5 py-1 text-[10px] font-['Inter'] tracking-[0.12em] uppercase text-[#1C1B1A] border border-[#E6E2DA]">
                    NGHỆ NHÂN: THỊ HỒNG // 68 TUỔI NGHỀ
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-['Inter'] text-[11px] uppercase tracking-[0.15em] text-[#B86B35]">LÀNG DỆT CHĂM</span>
                  <span className="text-[#E6E2DA] opacity-60">|</span>
                  <span className="font-['Inter'] text-[11px] text-[#5A5854]">DI SẢN PHI VẬT THỂ QUỐC GIA</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-[24px] text-[#1C1B1A] font-medium mb-4">
                  Nhịp Thoi Gỗ Cổ & Tâm Thức Hoa Văn
                </h3>
                <blockquote className="font-['Playfair_Display'] text-[15px] italic text-[#1C1B1A] mb-6 pl-4 border-l-2 border-[#B86B35] leading-relaxed">
                  "Khung cửi không biết nói dối. Tay giật thoi lệch một li, hoa văn thần sư sẽ gãy khúc. Ta ngồi đây không phải để dệt vải bán, mà để giữ lại tiếng lách cách của tổ tiên."
                </blockquote>
              </div>
              <div className="pt-6 border-t border-[#E6E2DA] flex items-center justify-between">
                <div className="font-['Inter'] text-[11px] text-[#5A5854]">
                  GHI CHÉP TẠI BẢN VỊ: XÃ PHƯỚC DÂN, NINH THUẬN
                </div>
                <Link
                  to="/artisans"
                  className="font-['Montserrat'] text-[11px] uppercase tracking-[0.15em] text-[#B86B35] hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  ĐỌC KÝ SỰ ĐIỀN DÃ →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. REGIONAL ATLAS TEASER */}
      <section className="w-full bg-[#F4F2EE] border-t border-[#E6E2DA] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#E6E2DA]">
            <h3 className="font-['Montserrat'] text-[15px] sm:text-[18px] tracking-[0.25em] text-[#1C1B1A] uppercase font-light">
              BẢN ĐỒ LÀNG NGHỀ THEO VÙNG ĐỊA LÝ
            </h3>
            <span className="font-['Inter'] text-[12px] text-[#5A5854] mt-2 sm:mt-0">
              HỆ THỐNG 54 VÙNG VĂN HÓA TRUYỀN THỐNG
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/regions"
              className="p-5 bg-[#FFFFFF] border border-[#E6E2DA] hover:border-[#B86B35] transition-colors group"
            >
              <span className="font-['Inter'] text-[10px] uppercase tracking-[0.15em] text-[#B86B35] block mb-1">
                VÙNG BẮC BỘ
              </span>
              <span className="font-['Playfair_Display'] text-[15px] text-[#1C1B1A] font-medium block group-hover:text-[#B86B35] transition-colors">
                Đồng Bằng Sông Hồng
              </span>
              <span className="font-['Inter'] text-[11px] text-[#5A5854] mt-2 block">
                18 Làng Nghề • Gốm & Khảm Trai
              </span>
            </Link>

            <Link
              to="/regions"
              className="p-5 bg-[#FFFFFF] border border-[#E6E2DA] hover:border-[#B86B35] transition-colors group"
            >
              <span className="font-['Inter'] text-[10px] uppercase tracking-[0.15em] text-[#B86B35] block mb-1">
                VÙNG BẮC TRUNG BỘ
              </span>
              <span className="font-['Playfair_Display'] text-[15px] text-[#1C1B1A] font-medium block group-hover:text-[#B86B35] transition-colors">
                Xứ Thanh - Nghệ - Tĩnh
              </span>
              <span className="font-['Inter'] text-[11px] text-[#5A5854] mt-2 block">
                12 Làng Nghề • Dệt Chiếu & Mộc
              </span>
            </Link>

            <Link
              to="/regions"
              className="p-5 bg-[#FFFFFF] border border-[#E6E2DA] hover:border-[#B86B35] transition-colors group"
            >
              <span className="font-['Inter'] text-[10px] uppercase tracking-[0.15em] text-[#B86B35] block mb-1">
                VÙNG DUYÊN HẢI NAM TRUNG BỘ
              </span>
              <span className="font-['Playfair_Display'] text-[15px] text-[#1C1B1A] font-medium block group-hover:text-[#B86B35] transition-colors">
                Đất Thổ Cẩm & Trầm Hương
              </span>
              <span className="font-['Inter'] text-[11px] text-[#5A5854] mt-2 block">
                14 Làng Nghề • Dệt Chăm & Gốm Bàu Trúc
              </span>
            </Link>

            <Link
              to="/regions"
              className="p-5 bg-[#FFFFFF] border border-[#E6E2DA] hover:border-[#B86B35] transition-colors group"
            >
              <span className="font-['Inter'] text-[10px] uppercase tracking-[0.15em] text-[#B86B35] block mb-1">
                VÙNG NAM BỘ
              </span>
              <span className="font-['Playfair_Display'] text-[15px] text-[#1C1B1A] font-medium block group-hover:text-[#B86B35] transition-colors">
                Vùng Đất Cửu Long
              </span>
              <span className="font-['Inter'] text-[11px] text-[#5A5854] mt-2 block">
                10 Làng Nghề • Đan Chiếu & Đồ Đồng
              </span>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
