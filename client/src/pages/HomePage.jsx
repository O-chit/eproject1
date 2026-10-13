import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/crafts?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/crafts');
    }
  };

  const featuredCrafts = [
    {
      id: 1,
      name: 'Ấm Trà Men Rạn Cổ Điển',
      region: 'Bát Tràng, Hà Nội',
      category: 'Gốm Sứ',
      technique: 'Nung Lò Bầu & Khử Men',
      artisan: 'NN. Nguyễn Văn Bình',
      leadRole: 'Chủ trì chế tác cốt gốm',
      year: 'Thế kỷ XIX phục dựng',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      name: 'Khăn Choàng Thổ Cẩm Hoa Văn Thần Sư',
      region: 'Chăm Ninh Thuận',
      category: 'Dệt Tự Nhiên',
      technique: 'Dệt Khung Cổ & Nhuộm Chàm',
      artisan: 'NN. Đàng Thị Phan',
      leadRole: 'Bậc thầy phối màu thảo mộc',
      year: 'Di sản phi vật thể',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      name: 'Lẵng Hoa Mây Nếp Bện Kép Nan Mịn',
      region: 'Phú Vinh, Hà Nội',
      category: 'Mây Tre Đan',
      technique: 'Vót Nan Tơ & Bện Hoa Cúc',
      artisan: 'NN. Trần Văn Đạo',
      leadRole: 'Nghệ nhân Ưu tú',
      year: 'Kỹ nghệ truyền đời',
      image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      name: 'Hộp Trà Sơn Mài Cẩn Trứng & Dát Vàng',
      region: 'Hạ Thái, Hà Nội',
      category: 'Sơn Mài',
      technique: 'Mài Nước & Dát Vàng Quỳ 24K',
      artisan: 'NN. Vũ Huy Mến',
      leadRole: 'Chủ xưởng mài ngọc',
      year: 'Mộc bản sơn ta',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const categories = [
    { name: 'Gốm Sứ Bát Tràng & Đất Nung', count: '18 Tác phẩm', slug: 'gom-su', icon: 'local_cafe' },
    { name: 'Dệt Thổ Cẩm & Lụa Tơ Tằm', count: '14 Tác phẩm', slug: 'det-tho-cam', icon: 'texture' },
    { name: 'Mây Tre Đan & Thủ Công Nan Mịn', count: '12 Tác phẩm', slug: 'may-tre-dan', icon: 'grid_view' },
    { name: 'Chạm Khắc Mộc & Tượng Dân Gian', count: '9 Tác phẩm', slug: 'cham-khac-go', icon: 'carpenter' },
    { name: 'Sơn Mài Ta & Cẩn Xà Cừ', count: '7 Tác phẩm', slug: 'son-mai', icon: 'brush' },
    { name: 'Đúc Đồng Ngũ Xã & Kim Hoàn', count: '6 Tác phẩm', slug: 'duc-dong', icon: 'diamond' },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION LINIEWORK */}
      <section className="relative border-b border-[#E6E2DA] bg-[#F9F8F6] pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl">
            {/* Nhãn trên cùng */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#B86B35]"></span>
              <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.25em] text-[#B86B35] font-semibold">
                ĐIỀN DÃ & PHỤC DỰNG DI SẢN THỦ CÔNG
              </span>
            </div>

            {/* Tiêu đề Statement Hero */}
            <h1 className="font-['Montserrat'] text-[32px] sm:text-[44px] md:text-[52px] font-light uppercase tracking-[0.22em] text-[#1C1B1A] leading-[1.15] mb-6">
              DI SẢN SỐNG TRONG TỪNG ĐƯỜNG NÉT
            </h1>

            {/* Đoạn dẫn dắt */}
            <p className="font-['Inter'] text-[15px] sm:text-[17px] text-[#5A5854] leading-relaxed mb-10 max-w-2xl">
              Cổng thông tin lưu trữ và tôn vinh tri thức các nghệ nhân truyền đời Việt Nam. Mỗi tác phẩm là một câu chuyện độc bản về đất, lửa, sợi chỉ và đôi bàn tay tài hoa.
            </p>

            {/* Thanh Tìm Kiếm Hero Nổi Bật */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5854]">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tra cứu tên sản phẩm, nghệ nhân, chất liệu..."
                  className="w-full h-12 pl-12 pr-4 bg-[#FFFFFF] border border-[#E6E2DA] text-[14px] text-[#1C1B1A] placeholder:text-[#5A5854]/60 focus:outline-none focus:border-[#B86B35] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-7 bg-[#B86B35] hover:bg-[#8E4A16] text-white font-['Montserrat'] text-[12px] uppercase tracking-[0.18em] font-semibold transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                <span>Khám Phá</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            {/* Lối tắt nhanh */}
            <div className="mt-8 flex flex-wrap items-center gap-2 text-[12px] font-['Inter'] text-[#5A5854]">
              <span className="font-medium text-[#1C1B1A]">Gợi ý tra cứu:</span>
              <Link to="/crafts?q=men+rạn" className="underline hover:text-[#B86B35]">Men rạn Bát Tràng</Link>
              <span className="opacity-40">/</span>
              <Link to="/crafts?q=thổ+cẩm" className="underline hover:text-[#B86B35]">Thổ cẩm dệt tay</Link>
              <span className="opacity-40">/</span>
              <Link to="/crafts?q=mây+nếp" className="underline hover:text-[#B86B35]">Mây nếp Phú Vinh</Link>
              <span className="opacity-40">/</span>
              <Link to="/seasonal" className="underline text-[#B86B35]">Mùa Triển Lãm 2026</Link>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FAST TRACK: DANH MỤC LÀNG NGHỀ */}
      <section className="border-b border-[#E6E2DA] py-14 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E6E2DA]">
            <div>
              <span className="font-['Montserrat'] text-[10px] uppercase tracking-[0.2em] text-[#B86B35] font-semibold block mb-1">
                PHÂN HỆ NGÀNH NGHỀ
              </span>
              <h2 className="font-['Playfair_Display'] text-[26px] font-semibold text-[#1C1B1A]">
                Các Trụ Cột Thủ Công Truyền Thống
              </h2>
            </div>
            <Link
              to="/crafts"
              className="font-['Montserrat'] text-[11px] uppercase tracking-[0.15em] text-[#B86B35] hover:text-[#8E4A16] font-semibold flex items-center gap-1"
            >
              Xem Toàn Bộ <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/crafts?category=${cat.slug}`}
                className="p-6 border border-[#E6E2DA] hover:border-[#B86B35] bg-[#F9F8F6] hover:bg-[#FFFFFF] transition-all group flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-[#FFFFFF] group-hover:bg-[#B86B35] border border-[#E6E2DA] flex items-center justify-center text-[#B86B35] group-hover:text-white transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    {cat.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-[17px] font-semibold text-[#1C1B1A] group-hover:text-[#B86B35] transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <span className="font-['Inter'] text-[12px] text-[#5A5854]">
                    {cat.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. TÁC PHẨM ĐẶC SẮC (FEATURED CRAFTS) */}
      <section className="py-16 md:py-20 border-b border-[#E6E2DA] bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-[#E6E2DA]">
            <div>
              <span className="font-['Montserrat'] text-[10px] uppercase tracking-[0.2em] text-[#B86B35] font-semibold block mb-1">
                TUYỂN TẬP TIÊU BIỂU
              </span>
              <h2 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#1C1B1A]">
                Tác Phẩm Đặc Sắc | Nguyên Bản Từ Làng Nghề
              </h2>
            </div>
            <span className="font-['Inter'] text-[13px] text-[#5A5854]">
              Được bảo chứng kỹ thuật bởi các Nghệ nhân Bậc thầy
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCrafts.map((item) => (
              <article
                key={item.id}
                className="craft-card flex flex-col justify-between group"
              >
                <div>
                  {/* Khung ảnh tác phẩm */}
                  <div className="relative aspect-[4/3] bg-[#ECE7E5] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#1C1B1A]/85 backdrop-blur-sm text-white px-2 py-0.5 text-[10px] font-['Montserrat'] uppercase tracking-wider">
                      {item.category}
                    </div>
                  </div>

                  {/* Thông tin mô tả */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] font-['Inter'] text-[#867368] mb-1.5">
                      <span>{item.region}</span>
                      <span>{item.year}</span>
                    </div>

                    <h3 className="font-['Playfair_Display'] text-[17px] font-semibold text-[#1C1B1A] group-hover:text-[#B86B35] transition-colors mb-2 line-clamp-1">
                      <Link to={`/crafts/${item.id}`}>{item.name}</Link>
                    </h3>

                    <div className="pt-3 border-t border-[#E6E2DA]/60 space-y-1 font-['Inter'] text-[12px]">
                      <div className="text-[#1C1B1A] font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#B86B35]">person</span>
                        {item.artisan}
                      </div>
                      <div className="text-[#5A5854] text-[11px]">
                        {item.leadRole}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/crafts/${item.id}`}
                    className="w-full py-2 border border-[#E6E2DA] hover:border-[#B86B35] bg-[#FFFFFF] text-center font-['Montserrat'] text-[11px] uppercase tracking-[0.15em] text-[#1C1B1A] hover:text-[#B86B35] transition-colors block"
                  >
                    Xem Chi Tiết & Kỹ Thuật
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* 4. SHOWCASE BỘ SƯU TẬP THEO MÙA (SEASONAL HERO) */}
      <section className="py-16 bg-[#F4F2EE] border-b border-[#E6E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-[#E6E2DA] bg-[#FFFFFF] p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7">
              <span className="inline-block text-[11px] font-['Montserrat'] uppercase tracking-[0.2em] text-[#B86B35] border border-[#B86B35] px-3 py-1 mb-4">
                MÙA TRIỂN LÃM 2026
              </span>
              <h2 className="font-['Playfair_Display'] text-[32px] md:text-[38px] font-semibold text-[#1C1B1A] leading-tight mb-4">
                Thu Trầm & Gốm Mộc Sa Thạch
              </h2>
              <p className="font-['Inter'] text-[15px] text-[#5A5854] leading-relaxed mb-6">
                Khi gió heo may chớm lạnh, bộ sưu tập giới thiệu các tác phẩm đất nung không tráng men, quạt nan bện đôi và khay trà mây vót chuốt — mang lại nét bình an, tĩnh tại cho không gian sống đương đại.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/seasonal"
                  className="px-6 py-3 bg-[#B86B35] hover:bg-[#8E4A16] text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <span>Khám Phá Tuyển Tập Mùa</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
                <span className="text-[13px] font-['Inter'] text-[#5A5854]">
                  12 Tác Phẩm Độc Bản
                </span>
              </div>
            </div>

            <div className="md:col-span-5 relative aspect-square border border-[#E6E2DA] overflow-hidden bg-[#ECE7E5]">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"
                alt="Thu Trầm & Gốm Mộc"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#FFFFFF]/90 backdrop-blur-sm p-3 border border-[#E6E2DA] text-[12px] font-['Inter'] text-[#1C1B1A]">
                <strong className="block font-['Playfair_Display'] text-[14px]">Bộ Trà Mộc Nung Củi</strong>
                Nghệ nhân Nguyễn Văn Bình • Đất Sa Thạch Thôn 1 Bát Tràng
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CÂU CHUYỆN VĂN HÓA & LÀNG NGHỀ */}
      <section className="py-16 md:py-20 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="font-['Montserrat'] text-[10px] uppercase tracking-[0.25em] text-[#B86B35] font-semibold block mb-2">
            TÔN VINH BÀN TAY VÀNG
          </span>
          <h2 className="font-['Playfair_Display'] text-[32px] md:text-[38px] font-semibold text-[#1C1B1A] mb-6">
            Mỗi Nghệ Nhân Là Một Pho Tàng Sống
          </h2>
          <p className="font-['Inter'] text-[15px] text-[#5A5854] leading-relaxed mb-8">
            Hệ thống CraftRoots thiết lập hồ sơ độc lập cho từng nghệ nhân và ghi nhận đa tầng sự phối hợp chế tác Nhiều-Nhiều (N-N), bảo đảm tri thức văn hóa được trao truyền trọn vẹn và minh bạch.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/artisans"
              className="px-6 py-3 border border-[#B86B35] text-[#B86B35] hover:bg-[#B86B35] hover:text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors"
            >
              Gặp Gỡ Các Nghệ Nhân
            </Link>
            <Link
              to="/regions"
              className="px-6 py-3 border border-[#E6E2DA] bg-[#FFFFFF] hover:border-[#1C1B1A] text-[#1C1B1A] font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors"
            >
              Bản Đồ 120+ Làng Nghề
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
