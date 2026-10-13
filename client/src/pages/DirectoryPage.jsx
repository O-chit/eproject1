import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATALOG_ITEMS = [
  {
    id: 1,
    name: 'Bình Vôi Men Lam Cổ',
    category: 'gom-su',
    categoryLabel: 'GỐM BÁT TRÀNG',
    origin: 'Hà Nội — 400 năm truyền thống',
    description: 'Đất sét cao lanh, men rạn tam thái nung củi truyền thống 1.300°C. Chạm khắc hình tượng hoa sen nổi và quai cuốn đắp nổi thủ công.',
    refCode: 'CR-BT-7721',
    edition: 'Độc bản số #03/12',
    price: '3.800.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqduILIjCsF1Kr_gNwT3HzCol9ezbm28IM-WATA6u3a0Kr8CYRzu98P3zWTne8NLrEGuVggHoQ89zJCBrkJbC8wQoA7JqQqJ2oSQM5h6CVd1OHhsmIKgJsgtVtnyopCOs05V63JZo8I6k5-nAo8X_b4jyLWbBoMi6bJctZ6aMadrS7-0MkDyYuXEvLZFi2TgKBBbD7_yBTT0-K43uVnlY0MZrXFsEgsPrvfb4lcX8',
  },
  {
    id: 2,
    name: 'Khăn Lụa Tơ Tằm Tự Nhiên Vân Mây',
    category: 'det-may',
    categoryLabel: 'LỤA VẠN PHÚC',
    origin: 'Hà Đông — Đệ nhất lụa Việt',
    description: '100% tơ tằm nguyên chất dệt khung cửi cổ truyền. Họa tiết Vân Mây chìm dệt thoi con lụa tự nhiên, nhuộm thảo mộc lá dâu tằm.',
    refCode: 'CR-VP-1044',
    edition: 'Tơ xe thủ công',
    price: '1.650.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4K0Ol_73pxBmMM06fPDnGy41xLK2PbS3YgyPz35OkZ89IlWSnrnTeNLP454FyU9Mofzp1eDB9cSEAIG6aRZQiNlDT6pM-Vb0przrjZjiKc1utp1Cn5ONbNZ6j1B4M9E5sgLqRScZWRTvOeYOtWhLmkBSlNsSmesxZG__GjNUp5AbcSbH16gvVC0IzlTzoX-ob_No1jkXX0KpC1EX6KbfmzwEyF3OzciW7_wu2UyA',
  },
  {
    id: 3,
    name: 'Bộ Lẵng Hoa Mây Nếp Bện Đôi',
    category: 'may-tre',
    categoryLabel: 'MÂY TRE PHÚ VINH',
    origin: 'Chương Mỹ — Tuyệt kỹ mây tre đan',
    description: 'Mây rừng Tây Bắc vót sợi tăm mảnh 0.8mm ngâm sáp ong rừng. Kỹ pháp bện xương cá hai lớp chống ẩm mốc tự nhiên qua nhiều thập kỷ.',
    refCode: 'CR-PV-4402',
    edition: 'Xử lý sáp ong',
    price: '890.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsV1MZDEYI8Nqf-4wUPU2aRGOHgJyRlpKy__7C3hDznp7PwSvv3dh1OIfgtI4lusKj_3ZzdMCN-POKuMLeY8F2GRP-70PD9sunYB0INYwp1cCROecqA20b7_nZAyH6fNHwH0CKDDsgbL2Y-Cb236NRLwWcnZ5PB5TlXjRBTf4TDPRHqcuAsIrVUb0FG0M-IwEhMX-nmotxP-ugnLtNavxvDUx5bme36Bo1EY-7KAs',
  },
  {
    id: 4,
    name: 'Khay Trà Sơn Mài Vỏ Trứng & Bạc Phủ',
    category: 'son-mai',
    categoryLabel: 'SƠN MÀI HẠ THÁI',
    origin: 'Thường Tín — 18 lớp mài nước',
    description: 'Cốt gỗ muồng già sấy khô 1 năm, cẩn vỏ trứng gà ta tạo rạn đồng điệu và dát bạc quỳ tán mịn. Bề mặt nhẵn bóng như gương nước.',
    refCode: 'CR-HT-8830',
    edition: 'Phiên bản bảo tàng #02',
    price: '4.200.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFC4Tg8NvBiTcsIssdqzY7hYtEO9NC_6TnsfZiJ4heO_hm4zJ4ks7zYx1avpYgp1A1T_d0-qp23LS9tNRYRXuoEnHq6QSE9vJzo2gjoOvehuAoeNPKCWrr0AgG2FR6rmMmWVLLL2JsEHrSquDplNaqYv1wyp-AwvQ8jRlVvVW_7igR3cLB_HYIOCjoy875H9cUIuxUUjtIUVRSMAEvmsBdrm4wP7Pb7AxrD-mXwVg',
  },
  {
    id: 5,
    name: 'Hộp Đựng Trang Sức Bạc Chạm Kênh Bong',
    category: 'cham-bac',
    categoryLabel: 'CHẠM BẠC ĐỒNG XÂM',
    origin: 'Thái Bình — Bạc ta 99.9%',
    description: 'Chạm trổ hình tượng Tứ Linh bằng ve búa đục nhỏ li ti. Đỉnh nắp chạm rồng cuộn kênh bong nổi khối 3D sống động.',
    refCode: 'CR-DX-3312',
    edition: 'Chế tác theo đơn #01',
    price: '6.500.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaUrvFnVxj2lsHDRkr-yaTRJCRIumrtcbAoBO8T7gJK22rF-l8LFMNoASMdtx_N8hQkmINE6HE7xtmJmzGpxqvbiG5mzG2TvxNKGDuu4MZjKV7e4q6ixIFOJ1PSNsl56IqQagawz_SCLeDfMjYY1bGxxdBh3e-6wBJ15RkSXBTpEZHEoWqpB_uzbwmdJy82jUtSMpkv6zROQGRW5W2GKqEOL2DxfhNLSsVd1T7ujM',
  },
  {
    id: 6,
    name: 'Tấm Vải Thổ Cẩm Hoa Văn Chăm Cổ Điển',
    category: 'tho-cam',
    categoryLabel: 'THỔ CẨM CHĂM',
    origin: 'Mỹ Nghiệp — Nhuộm chàm tự nhiên',
    description: 'Sợi bông thô trồng rẫy, dệt trên khung cửi nằm cổ xưa. Hoa văn hình kỷ hà và thần sư tượng trưng cho sự sinh sôi và che chở gia đạo.',
    refCode: 'CR-MN-9920',
    edition: 'Di sản làng dệt #08',
    price: '2.100.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBay0c69D5JK7FMaxyn9PSRxcsgUqgVBC4moSSxlmkFLgKHiKIqdRgYLDbsNkoDNTWbn3aE3tjfmDVjmU7b0uCCCWly4AJRKvMbcSnFUrimhvpDJ528ysIaEbq7Vk675AvADO51B7vRlzladV4zbFP22E6K0TREwBbPB2PY6e9MzBG80dTaXhPHGxL-GcbgknPoVSiq1dmnBko_BQVJIGRkPk_Vx46iUTqabaRYxTU',
  },
];

const TABS = [
  { id: 'all', label: 'TẤT CẢ (ALL)' },
  { id: 'gom-su', label: 'GỐM BÁT TRÀNG' },
  { id: 'det-may', label: 'LỤA VẠN PHÚC' },
  { id: 'may-tre', label: 'MÂY TRE PHÚ VINH' },
  { id: 'son-mai', label: 'SƠN MÀI HẠ THÁI' },
  { id: 'cham-bac', label: 'CHẠM BẠC ĐỒNG XÂM' },
  { id: 'tho-cam', label: 'THỔ CẨM CHĂM' },
];

export default function DirectoryPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState(new Set([1, 3]));

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

  const filteredItems = CATALOG_ITEMS.filter((item) => {
    const matchesTab = selectedTab === 'all' || item.category === selectedTab;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
                {filteredItems.length} HIỆN VẬT KHẢ DỤNG
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
      <section className="w-full bg-surface-crisp border-b border-border-neutral sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-margin overflow-x-auto no-scrollbar">
          <div className="flex items-center py-4 font-label-action text-label-action tracking-[0.15em] uppercase whitespace-nowrap">
            {TABS.map((tab, idx) => (
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
          {filteredItems.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredItems.map((item) => (
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
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-canvas-linen/90 backdrop-blur-sm border border-border-neutral px-2.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta"></span>
                      <span className="font-spec-code text-[10px] tracking-[0.12em] uppercase text-text-primary">
                        {item.edition}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSave(item)}
                      aria-label="Lưu tác phẩm"
                      className="absolute top-3 right-3 w-8 h-8 rounded-none bg-surface-crisp/90 backdrop-blur-sm border border-border-neutral flex items-center justify-center text-text-secondary hover:text-accent-terracotta hover:bg-surface-crisp transition-colors cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${savedIds.has(item.id) ? 'text-accent-terracotta filled' : ''}`}>
                        bookmark
                      </span>
                    </button>
                  </div>

                  <div className="p-space-lg flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-space-xs">
                        <span className="font-spec-code text-[11px] uppercase tracking-[0.14em] text-accent-terracotta">
                          {item.origin}
                        </span>
                      </div>
                      <h3 className="font-headline-title text-headline-title text-text-primary tracking-tight mb-space-xs group-hover:text-accent-terracotta transition-colors">
                        <Link to={`/crafts/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed mb-space-md">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-space-md border-t border-border-neutral flex items-center justify-between font-spec-code text-spec-code">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-text-secondary tracking-[0.08em] uppercase">
                          Ref: {item.refCode}
                        </span>
                        <span className="text-[14px] font-semibold text-text-primary mt-0.5">
                          {item.price}
                        </span>
                      </div>
                      <Link
                        to={`/crafts/${item.id}`}
                        className="font-label-action text-label-action tracking-[0.15em] uppercase text-text-primary border-b border-text-primary pb-0.5 hover:text-accent-terracotta hover:border-accent-terracotta transition-colors"
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
