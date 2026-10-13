import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CATALOG_ITEMS = [
  {
    id: 1,
    name: 'Bình Vôi Men Lam Cổ',
    category: 'gom-su',
    categoryLabel: 'Gốm Bát Tràng',
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
    categoryLabel: 'Lụa Vạn Phúc',
    origin: 'Hà Đông — Dệt gấm hoa cúc',
    description: 'Tơ nõn tằm dâu nguyên chất kéo sợi thủ công trên khung cửi cổ. Họa tiết mây cuộn dệt chìm tạo ánh biến sắc theo góc chiếu ánh sáng.',
    refCode: 'CR-VP-1029',
    edition: 'Mẻ dệt mùa thu #18',
    price: '1.650.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4K0Ol_73pxBmMM06fPDnGy41xLK2PbS3YgyPz35OkZ89IlWSnrnTeNLP454FyU9Mofzp1eDB9cSEAIG6aRZQiNlDT6pM-Vb0przrjZjiKc1utp1Cn5ONbNZ6j1B4M9E5sgLqRScZWRTvOeYOtWhLmkBSlNsSmesxZG__GjNUp5AbcSbH16gvVC0IzlTzoX-ob_No1jkXX0KpC1EX6KbfmzwEyF3OzciW7_wu2UyA',
  },
  {
    id: 3,
    name: 'Bộ Lẵng Hoa Mây Nếp Bện Đôi',
    category: 'may-tre',
    categoryLabel: 'Mây Tre Phú Vinh',
    origin: 'Chương Mỹ — Nan mịn 0.8mm',
    description: 'Kỹ nghệ vót nan sậy dẻo bện hình hoa cúc 12 cánh. Xông khói rơm tạo lớp phủ kháng mối mọt tự nhiên không hóa chất.',
    refCode: 'CR-PV-4402',
    edition: 'Tác chế giới hạn #05',
    price: '890.000 đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqtjQ5mo5cRimsDw-0a1cXtEfhsOYh5Em5ML9l64b0Hc7BtO4oQu0rQCKeojkVUo26ovuW7WQJi9O9HWREIBgFJQ54jYdAVaqFw_qoJKFU5nDAJnK3m_SuzktfK4177Hs6U0AZ6NjMS-0nZHrlaberLVVzTzO0pAj5wvYnyap_2yX0pGsWUYWItuudPhk86mrePax74Ug2wRYKiBJ1_4Y22e-lHlXxzgQsUnUvcqw',
  },
  {
    id: 4,
    name: 'Khay Trà Sơn Mài Vỏ Trứng & Bạc Phủ',
    category: 'son-mai',
    categoryLabel: 'Sơn Mài Hạ Thái',
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
    categoryLabel: 'Chạm Bạc Đồng Xâm',
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
    categoryLabel: 'Thổ Cẩm Chăm',
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

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
    <div className="w-full bg-[#F9F8F6]">
      {/* Header Banner */}
      <section className="w-full bg-[#F9F8F6] pt-12 pb-8 border-b border-[#E6E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#B86B35] font-semibold">
              HỒ SƠ TƯ LIỆU HÓA
            </span>
            <span className="text-[#E6E2DA] opacity-60">|</span>
            <span className="font-['Inter'] text-[11px] text-[#5A5854] tracking-wider">
              MÃ DANH MỤC: CAT-VN-2026
            </span>
            <span className="text-[#E6E2DA] opacity-60">|</span>
            <span className="font-['Inter'] text-[11px] text-[#5A5854]">
              CẬP NHẬT: QUÝ I/2026
            </span>
          </div>

          <h1 className="font-['Montserrat'] text-[28px] sm:text-[40px] uppercase tracking-[0.25em] text-[#1C1B1A] font-light leading-tight mb-3">
            DANH MỤC DI SẢN THỦ CÔNG
          </h1>
          <p className="font-['Inter'] text-[14px] sm:text-[15px] text-[#5A5854] max-w-3xl leading-relaxed">
            Kho lưu trữ hơn 240 tác phẩm thủ công nguyên bản từ các làng nghề truyền thống Việt Nam. Mỗi hiện vật được định danh độc bản cùng chứng thư nguồn gốc địa dư và kỹ pháp chế tác nguyên bản.
          </p>

          {/* Search bar & Metadata */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5854] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên tác phẩm, làng nghề hoặc chất liệu..."
                className="w-full h-12 pl-12 pr-6 rounded-full bg-[#FFFFFF] border border-[#E6E2DA] text-[13px] text-[#1C1B1A] placeholder:text-[#5A5854]/60 focus:outline-none focus:border-[#B86B35] transition-colors shadow-sm"
              />
            </div>

            <div className="flex items-center gap-4 self-end md:self-center font-['Inter'] text-[11px] text-[#5A5854]">
              <span className="text-[#1C1B1A] font-semibold">
                {filteredItems.length} HIỆN VẬT KHẢ DỤNG
              </span>
              <span className="text-[#E6E2DA] opacity-60">|</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-[#B86B35] transition-colors">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                LỌC KỸ PHÁP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pipe-delimited Tab Navigation */}
      <section className="w-full bg-[#FFFFFF] border-b border-[#E6E2DA] sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 overflow-x-auto">
          <div className="flex items-center py-4 font-['Montserrat'] text-[11px] tracking-[0.15em] uppercase whitespace-nowrap">
            {TABS.map((tab, idx) => (
              <React.Fragment key={tab.id}>
                {idx > 0 && <span className="mx-4 text-[#E6E2DA] opacity-60 select-none">|</span>}
                <button
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-1 transition-colors ${
                    selectedTab === tab.id
                      ? 'text-[#1C1B1A] font-semibold border-b-2 border-[#B86B35]'
                      : 'text-[#5A5854] hover:text-[#B86B35]'
                  }`}
                >
                  {tab.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Grid sản phẩm */}
      <section className="w-full py-14 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {filteredItems.length === 0 ? (
            <div className="p-16 border border-[#E6E2DA] bg-[#FFFFFF] text-center">
              <span className="material-symbols-outlined text-5xl text-[#B86B35] mb-3">inventory_2</span>
              <h3 className="font-['Playfair_Display'] text-xl font-medium text-[#1C1B1A] mb-2">
                Không tìm thấy tác phẩm phù hợp
              </h3>
              <p className="font-['Inter'] text-[14px] text-[#5A5854] mb-6">
                Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedTab('all'); }}
                className="px-6 py-2.5 bg-[#B86B35] text-white font-['Montserrat'] text-[11px] uppercase tracking-wider font-semibold"
              >
                Xóa Bộ Lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="group relative bg-[#FFFFFF] border border-[#E6E2DA] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-[#F4F2EE]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#F9F8F6]/90 backdrop-blur-sm border border-[#E6E2DA] px-2.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B86B35]"></span>
                      <span className="font-['Inter'] text-[10px] tracking-wider uppercase text-[#1C1B1A]">
                        {item.edition}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSave(item.id)}
                      aria-label="Lưu tác phẩm"
                      className="absolute top-3 right-3 w-8 h-8 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#E6E2DA] flex items-center justify-center text-[#5A5854] hover:text-[#B86B35] transition-colors"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${savedIds.has(item.id) ? 'text-[#B86B35] filled' : ''}`}>
                        bookmark
                      </span>
                    </button>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#B86B35] block mb-1">
                        {item.origin}
                      </span>
                      <h3 className="font-['Playfair_Display'] text-[19px] font-medium text-[#1C1B1A] mb-2 group-hover:text-[#B86B35] transition-colors">
                        <Link to={`/crafts/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E6E2DA] flex items-center justify-between font-['Inter']">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[#5A5854] tracking-wider uppercase">
                          Ref: {item.refCode}
                        </span>
                        <span className="text-[15px] font-semibold text-[#1C1B1A] mt-0.5">
                          {item.price}
                        </span>
                      </div>
                      <Link
                        to={`/crafts/${item.id}`}
                        className="font-['Montserrat'] text-[11px] tracking-[0.15em] uppercase text-[#1C1B1A] border-b border-[#1C1B1A] pb-0.5 hover:text-[#B86B35] hover:border-[#B86B35] transition-colors font-medium"
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
