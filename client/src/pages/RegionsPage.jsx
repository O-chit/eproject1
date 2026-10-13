import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const REGIONS_DATA = {
  'dong-bang-bac-bo': {
    id: 'dong-bang-bac-bo',
    name: 'ĐỒNG BẰNG BẮC BỘ',
    code: 'CR-GEO-BAC-BO',
    index: '03/07',
    verified: 'DỮ LIỆU ĐÃ XÁC MINH',
    coordinates: '105°51\' E — 21°01\' N',
    focusArea: 'Hà Nội — Bắc Ninh — Thái Bình — Nam Định',
    villagesCount: 120,
    artisansCount: 45,
    heritageCount: 14,
    description: 'Cái nôi ngàn năm của văn hóa lúa nước và các phường nghề thủ công tinh xảo bậc nhất xứ Kinh Kỳ. Nơi lưu giữ mật mã di sản từ thời Lý - Trần - Lê qua các dòng sản phẩm đạt chuẩn mực cung đình và đời sống dân gian thuần túy.',
    villages: [
      {
        name: 'Gốm Sứ Bát Tràng',
        era: 'THẾ KỶ XIV',
        location: 'Gia Lâm, Hà Nội',
        description: 'Tinh hoa men rạn & cốt đất phù sa sông Hồng nung nhiệt củi truyền thống.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
        craftId: 1
      },
      {
        name: 'Tranh Dân Gian Đông Hồ',
        era: 'THẾ KỶ XVI',
        location: 'Thuận Thành, Bắc Ninh',
        description: 'Kỹ nghệ khắc ván mộc bản, in trên giấy điệp giã từ vỏ sò tự nhiên và sắc màu cỏ cây.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
        craftId: 3
      },
      {
        name: 'Lụa Tơ Tằm Vạn Phúc',
        era: 'HƠN 1000 NĂM',
        location: 'Hà Đông, Hà Nội',
        description: 'Đệ nhất lụa Vân cổ truyền với cấu trúc sợi tơ tằm dệt hoa chìm tinh xảo lưu truyền hoàng cung.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
        craftId: 2
      }
    ]
  },
  'tay-bac': {
    id: 'tay-bac',
    name: 'TÂY BẮC',
    code: 'CR-GEO-TAY-BAC',
    index: '01/07',
    verified: 'DỮ LIỆU ĐÃ XÁC MINH',
    coordinates: '103°20\' E — 21°30\' N',
    focusArea: 'Hòa Bình — Sơn La — Điện Biên — Lai Châu',
    villagesCount: 42,
    artisansCount: 28,
    heritageCount: 9,
    description: 'Vùng đất hùng vĩ với văn hóa thổ cẩm sặc sỡ của các dân tộc Thái, Mông, Dao. Các sản phẩm dệt nhuộm chàm tự nhiên và rèn nông cụ thủ công gắn liền với đời sống nương rẫy rẻo cao.',
    villages: [
      {
        name: 'Dệt Thổ Cẩm Mai Châu',
        era: 'THẾ KỶ XVII',
        location: 'Bản Lác, Hòa Bình',
        description: 'Kỹ nghệ dệt hoa văn quả trám, nhuộm vỏ cây và củ nâu của đồng bào Thái trắng.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
        craftId: 2
      },
      {
        name: 'Nghề Rèn Thủ Công Người Mông',
        era: 'TRUYỀN ĐỜI',
        location: 'Bắc Hà, Lào Cai',
        description: 'Dao mèo rèn thủ công tôi nước lạnh tự nhiên, bén ngọt và bền bỉ.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
        craftId: 4
      }
    ]
  },
  'dong-bac': {
    id: 'dong-bac',
    name: 'ĐÔNG BẮC',
    code: 'CR-GEO-DONG-BAC',
    index: '02/07',
    verified: 'DỮ LIỆU ĐÃ XÁC MINH',
    coordinates: '106°15\' E — 22°40\' N',
    focusArea: 'Hà Giang — Cao Bằng — Lạng Sơn — Bắc Kạn',
    villagesCount: 56,
    artisansCount: 31,
    heritageCount: 11,
    description: 'Vùng biên cương nổi tiếng với kỹ nghệ làm giấy bản cổ truyền, chế tác khèn bè bạc chạm và trồng chè cổ thụ Shan Tuyết hàng trăm năm tuổi.',
    villages: [
      {
        name: 'Giấy Bản Dân Tộc Nùng',
        era: 'THẾ KỶ XVIII',
        location: 'Quảng Uyên, Cao Bằng',
        description: 'Làm từ vỏ cây dướng tự nhiên ngâm vôi, giã nhuyễn và xeo thủ công từng tờ.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
        craftId: 3
      }
    ]
  },
  'bac-trung-bo': {
    id: 'bac-trung-bo',
    name: 'BẮC TRUNG BỘ',
    code: 'CR-GEO-BAC-TRUNG',
    index: '04/07',
    verified: 'DỮ LIỆU ĐÃ XÁC MINH',
    coordinates: '107°35\' E — 16°28\' N',
    focusArea: 'Thanh Hóa — Nghệ An — Hà Tĩnh — Quảng Bình — Thừa Thiên Huế',
    villagesCount: 88,
    artisansCount: 52,
    heritageCount: 18,
    description: 'Địa bàn tụ hội các làng nghề cung đình xứ Huế: thêu tay cung phụng, nón bài thơ, kim hoàn Kế Môn và mộc mỹ nghệ chạm khắc kinh kỳ.',
    villages: [
      {
        name: 'Nón Bài Thơ Xứ Huế',
        era: 'THẾ KỶ XVII',
        location: 'Làng Dạ Lê, Thừa Thiên Huế',
        description: 'Lá nón chằm thanh mảnh, cài thơ và hoa văn danh thắng ẩn hiện dưới nắng.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATU5lGoFKB-HXZ8O_uWDx7nkGCGOUHUlnW2Ot3CT13hJN3P3dmbdKT0Bisv4_RGYMcxt0tfhXeDgTKqqMrr9mMrgrPlLLBG0ugfvulf8M_MX6_-sPP470qLsEjZIOLfNitrnoJ0c7qi9-sWqcIDTxF9VnGSyLJrGosMIJdWECtGMeMaQ-bVpC5cmU-C-yNe7YzwoJm17jTYd85RZaiokXarV4anhk_cTf2331UFe0',
        craftId: 5
      }
    ]
  },
  'nam-trung-bo': {
    id: 'nam-trung-bo',
    name: 'NAM TRUNG BỘ & TÂY NGUYÊN',
    code: 'CR-GEO-NAM-TRUNG',
    index: '05/07',
    verified: 'DỮ LIỆU ĐÃ XÁC MINH',
    coordinates: '108°58\' E — 11°34\' N',
    focusArea: 'Quảng Nam — Bình Định — Ninh Thuận — Gia Lai — Đắk Lắk',
    villagesCount: 74,
    artisansCount: 40,
    heritageCount: 16,
    description: 'Đặc trưng với gốm Bàu Trúc - di sản văn hóa phi vật thể UNESCO cần bảo vệ khẩn cấp, làng đá mỹ nghệ Non Nước và cồng chiêng dệt Dèng Tây Nguyên.',
    villages: [
      {
        name: 'Gốm Chăm Bàu Trúc',
        era: 'THẾ KỶ XII',
        location: 'Ninh Phước, Ninh Thuận',
        description: 'Tạo hình không dùng bàn xoay - người thợ đi giật lùi quanh khối đất nung lộ thiên.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
        craftId: 1
      }
    ]
  },
  'nam-bo': {
    id: 'nam-bo',
    name: 'NAM BỘ',
    code: 'CR-GEO-NAM-BO',
    index: '06/07',
    verified: 'DỮ LIỆU ĐÃ XÁC MINH',
    coordinates: '106°40\' E — 10°46\' N',
    focusArea: 'Bình Dương — Đồng Nai — TP.HCM — An Giang — Đồng Tháp',
    villagesCount: 95,
    artisansCount: 48,
    heritageCount: 15,
    description: 'Văn hóa miệt vườn trù phú với gốm Nam Bộ nung lò rồng (Lái Thiêu, Tân Phước Khánh), làng dệt chiếu Định Yên và mây tre lục bình đan xuất khẩu.',
    villages: [
      {
        name: 'Gốm Cây Mai & Lái Thiêu',
        era: 'THẾ KỶ XIX',
        location: 'Thuận An, Bình Dương',
        description: 'Men xanh đồng, men da lươn tráng dầy với tạo hình lu mái vú và tượng gốm hoa văn phóng khoáng.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
        craftId: 1
      }
    ]
  }
};

const REGION_KEYS = [
  { key: 'all', label: 'TẤT CẢ VÙNG' },
  { key: 'tay-bac', label: 'TÂY BẮC' },
  { key: 'dong-bac', label: 'ĐÔNG BẮC' },
  { key: 'dong-bang-bac-bo', label: 'ĐỒNG BẰNG BẮC BỘ' },
  { key: 'bac-trung-bo', label: 'BẮC TRUNG BỘ' },
  { key: 'nam-trung-bo', label: 'NAM TRUNG BỘ & TÂY NGUYÊN' },
  { key: 'nam-bo', label: 'NAM BỘ' }
];

export default function RegionsPage() {
  const [activeRegionKey, setActiveRegionKey] = useState('dong-bang-bac-bo');

  const currentRegion = REGIONS_DATA[activeRegionKey] || REGIONS_DATA['dong-bang-bac-bo'];

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* SECTION HEADER: Cultural Coordinates & Title */}
      <section className="w-full bg-canvas-linen pt-10 pb-8 border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-margin">
          {/* Category Tag & Archival Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-accent-terracotta"></span>
              <span className="font-spec-code text-spec-code uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
                HỆ THỐNG ĐỊA LÝ DI SẢN THỦ CÔNG VIỆT NAM
              </span>
            </div>
            <div className="flex items-center text-text-secondary font-spec-code text-spec-code">
              <span>HỆ TOẠ ĐỘ VN-2000</span>
              <span className="mx-3 opacity-30 select-none">|</span>
              <span>BẢN GHI: {currentRegion.code}</span>
              <span className="mx-3 opacity-30 select-none">|</span>
              <span className="text-accent-terracotta font-semibold">TRUY CẬP TRỰC TUYẾN</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-display-hero text-text-primary text-[28px] md:text-[40px] lg:text-[46px] font-[200] leading-tight uppercase tracking-[6px] mb-8">
            BẢN ĐỒ VĂN HÓA &amp; LÀNG NGHỀ TRUYỀN THỐNG
          </h1>

          {/* Pipe-delimited Region Switcher / Filter */}
          <div className="w-full overflow-x-auto pb-2 scrollbar-none">
            <nav className="flex items-center whitespace-nowrap font-label-action text-label-action tracking-[0.18em] uppercase text-text-secondary">
              {REGION_KEYS.map((item, idx) => {
                const isActive = activeRegionKey === item.key;
                return (
                  <React.Fragment key={item.key}>
                    {idx > 0 && (
                      <span className="mx-4 text-border-neutral opacity-50 select-none font-light">
                        |
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveRegionKey(item.key === 'all' ? 'dong-bang-bac-bo' : item.key)}
                      className={`py-1 transition-colors cursor-pointer ${
                        isActive
                          ? 'text-accent-terracotta font-semibold border-b-2 border-accent-terracotta'
                          : 'hover:text-accent-terracotta'
                      }`}
                    >
                      {item.label} {isActive && '(ĐANG CHỌN)'}
                    </button>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      {/* MAIN EXPLORER: Split Composition */}
      <section className="w-full bg-surface-subtle py-8 lg:py-12 border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: High-Precision Vector Map Canvas */}
            <div className="lg:col-span-7 bg-surface-crisp border border-border-neutral p-6 md:p-8 relative flex flex-col justify-between overflow-hidden shadow-sm">
              {/* Map Canvas Controls & Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border-neutral z-10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-accent-terracotta">explore</span>
                  <span className="font-spec-code text-spec-code tracking-[0.1em] text-text-primary font-medium uppercase">
                    Bản đồ địa chí không gian di sản
                  </span>
                </div>
                <div className="flex items-center gap-4 font-spec-code text-[11px] text-text-secondary tracking-wider">
                  <span className="hidden sm:inline">TỶ LỆ 1:1.500.000</span>
                  <span className="hidden sm:inline opacity-30 select-none">|</span>
                  <span className="flex items-center gap-1.5 text-accent-terracotta font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta animate-ping"></span>
                    TRỰC VỊ
                  </span>
                </div>
              </div>

              {/* Stylized High-Precision Vector Map of Vietnam */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] md:aspect-[4/4.5] flex items-center justify-center my-4 overflow-hidden bg-canvas-linen/40">
                {/* Lat/Long Cartographic Grid Lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-40 stroke-border-neutral"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern height="48" id="carto-grid" patternUnits="userSpaceOnUse" width="48">
                      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#E6E2DA" strokeDasharray="2 3" strokeWidth="0.75"></path>
                    </pattern>
                  </defs>
                  <rect fill="url(#carto-grid)" height="100%" width="100%"></rect>
                </svg>

                {/* Coordinate Text Labels around perimeter */}
                <div className="absolute top-2 left-3 font-spec-code text-[10px] text-text-secondary/70 tracking-widest pointer-events-none">
                  23°23' N / 102°09' E
                </div>
                <div className="absolute top-2 right-3 font-spec-code text-[10px] text-text-secondary/70 tracking-widest pointer-events-none">
                  21°30' N / 108°03' E
                </div>
                <div className="absolute bottom-2 left-3 font-spec-code text-[10px] text-text-secondary/70 tracking-widest pointer-events-none">
                  08°30' N / 104°45' E
                </div>
                <div className="absolute bottom-2 right-3 font-spec-code text-[10px] text-text-secondary/70 tracking-widest pointer-events-none">
                  HẢI PHẬN QUỐC GIA
                </div>

                {/* Stylized Geographic SVG of Vietnam with Territorial Polygons */}
                <svg
                  className="w-full h-full max-h-[580px] p-4 drop-shadow-sm select-none"
                  fill="none"
                  viewBox="0 0 500 620"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background Sea Tone & Subtle Bathymetry Accents */}
                  <path d="M380,120 Q420,180 440,280 T370,500" fill="none" opacity="0.6" stroke="#E6E2DA" strokeDasharray="4 4" strokeWidth="1"></path>
                  <path d="M320,80 Q390,200 400,320 T330,550" fill="none" opacity="0.4" stroke="#E6E2DA" strokeDasharray="2 4" strokeWidth="0.75"></path>
                  
                  {/* Maritime Sovereignty Notations */}
                  <text fill="#5A5854" fontFamily="Inter" fontSize="9" fontWeight="600" letterSpacing="3" opacity="0.5" x="360" y="240">
                    BIỂN ĐÔNG
                  </text>
                  <text fill="#5A5854" fontFamily="Inter" fontSize="8" letterSpacing="2" opacity="0.4" x="350" y="320">
                    QUẦN ĐẢO HOÀNG SA (VIỆT NAM)
                  </text>
                  <text fill="#5A5854" fontFamily="Inter" fontSize="8" letterSpacing="2" opacity="0.4" x="340" y="490">
                    QUẦN ĐẢO TRƯỜNG SA (VIỆT NAM)
                  </text>

                  {/* REGION 1: Tây Bắc */}
                  <path
                    className="transition-all duration-300 cursor-pointer"
                    d="M120,40 L165,30 L180,65 L190,85 L165,115 L140,110 L105,75 Z"
                    fill={activeRegionKey === 'tay-bac' ? '#B86B35' : '#D5D0C9'}
                    stroke={activeRegionKey === 'tay-bac' ? '#FFFFFF' : '#E6E2DA'}
                    strokeWidth={activeRegionKey === 'tay-bac' ? '2' : '1.25'}
                    onClick={() => setActiveRegionKey('tay-bac')}
                  >
                    <title>Khu vực Tây Bắc — Dệt Thổ cẩm & Đan lát</title>
                  </path>

                  {/* REGION 2: Đông Bắc */}
                  <path
                    className="transition-all duration-300 cursor-pointer"
                    d="M190,25 L280,20 L275,65 L245,95 L200,90 L180,65 Z"
                    fill={activeRegionKey === 'dong-bac' ? '#B86B35' : '#D5D0C9'}
                    stroke={activeRegionKey === 'dong-bac' ? '#FFFFFF' : '#E6E2DA'}
                    strokeWidth={activeRegionKey === 'dong-bac' ? '2' : '1.25'}
                    onClick={() => setActiveRegionKey('dong-bac')}
                  >
                    <title>Khu vực Đông Bắc — Rèn đúc & Giấy bản</title>
                  </path>

                  {/* REGION 3: ĐỒNG BẰNG BẮC BỘ */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveRegionKey('dong-bang-bac-bo')}
                  >
                    {activeRegionKey === 'dong-bang-bac-bo' && (
                      <path
                        d="M165,115 L190,85 L200,90 L245,95 L275,65 L295,95 L270,145 L220,165 L175,150 Z"
                        fill="none"
                        stroke="#B86B35"
                        strokeLinejoin="round"
                        strokeOpacity="0.25"
                        strokeWidth="5"
                      />
                    )}
                    <path
                      className="filter drop-shadow-md transition-all duration-300 hover:brightness-110"
                      d="M165,115 L190,85 L200,90 L245,95 L275,65 L295,95 L270,145 L220,165 L175,150 Z"
                      fill={activeRegionKey === 'dong-bang-bac-bo' ? '#B86B35' : '#D5D0C9'}
                      stroke={activeRegionKey === 'dong-bang-bac-bo' ? '#FFFFFF' : '#E6E2DA'}
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    {/* Pulsing Core Craft Center: Thăng Long / Bát Tràng */}
                    <circle cx="218" cy="120" fill="#FFFFFF" r="4.5" stroke="#B86B35" strokeWidth="2"></circle>
                    <circle className="animate-ping" cx="218" cy="120" fill="none" opacity="0.8" r="10" stroke="#FFFFFF" strokeWidth="1"></circle>
                    {/* Secondary Craft Nodes */}
                    <circle cx="236" cy="112" fill="#FFFFFF" r="3.5" stroke="#B86B35" strokeWidth="1.5"></circle>
                    <circle cx="206" cy="130" fill="#FFFFFF" r="3.5" stroke="#B86B35" strokeWidth="1.5"></circle>
                    {/* Callout Pointer & Label */}
                    <polyline fill="none" points="218,120 250,118 275,124" stroke="#1C1B1A" strokeDasharray="2 2" strokeWidth="1"></polyline>
                    <rect fill="#1C1B1A" height="20" width="98" x="275" y="114"></rect>
                    <text fill="#FFFFFF" fontFamily="Montserrat" fontSize="8.5" fontWeight="600" letterSpacing="1" x="281" y="128">
                      ĐỒNG BẰNG BẮC BỘ
                    </text>
                  </g>

                  {/* REGION 4: Bắc Trung Bộ */}
                  <path
                    className="transition-all duration-300 cursor-pointer"
                    d="M175,150 L220,165 L255,200 L275,245 L260,255 L225,215 L190,185 Z"
                    fill={activeRegionKey === 'bac-trung-bo' ? '#B86B35' : '#D5D0C9'}
                    stroke={activeRegionKey === 'bac-trung-bo' ? '#FFFFFF' : '#E6E2DA'}
                    strokeWidth={activeRegionKey === 'bac-trung-bo' ? '2' : '1.25'}
                    onClick={() => setActiveRegionKey('bac-trung-bo')}
                  >
                    <title>Khu vực Bắc Trung Bộ — Mộc mỹ nghệ & Kim hoàn</title>
                  </path>

                  {/* REGION 5: Nam Trung Bộ & Tây Nguyên */}
                  <path
                    className="transition-all duration-300 cursor-pointer"
                    d="M275,245 L320,290 L345,340 L340,400 L295,430 L270,390 L260,330 L260,255 Z"
                    fill={activeRegionKey === 'nam-trung-bo' ? '#B86B35' : '#D5D0C9'}
                    stroke={activeRegionKey === 'nam-trung-bo' ? '#FFFFFF' : '#E6E2DA'}
                    strokeWidth={activeRegionKey === 'nam-trung-bo' ? '2' : '1.25'}
                    onClick={() => setActiveRegionKey('nam-trung-bo')}
                  >
                    <title>Khu vực Nam Trung Bộ & Tây Nguyên — Gốm Chăm & Dệt Dèng</title>
                  </path>

                  {/* REGION 6: Nam Bộ */}
                  <path
                    className="transition-all duration-300 cursor-pointer"
                    d="M295,430 L340,400 L325,455 L285,520 L240,545 L220,530 L240,480 L270,445 Z"
                    fill={activeRegionKey === 'nam-bo' ? '#B86B35' : '#D5D0C9'}
                    stroke={activeRegionKey === 'nam-bo' ? '#FFFFFF' : '#E6E2DA'}
                    strokeWidth={activeRegionKey === 'nam-bo' ? '2' : '1.25'}
                    onClick={() => setActiveRegionKey('nam-bo')}
                  >
                    <title>Khu vực Nam Bộ — Gốm Cây Mai, Chiếu Định Yên & Đan Lục Bình</title>
                  </path>

                  {/* Island Cartographic Nodes */}
                  <circle cx="365" cy="275" fill="#D5D0C9" r="2.5" stroke="#E6E2DA"></circle>
                  <circle cx="372" cy="285" fill="#D5D0C9" r="2" stroke="#E6E2DA"></circle>
                  <circle cx="355" cy="460" fill="#D5D0C9" r="2.5" stroke="#E6E2DA"></circle>
                  <circle cx="368" cy="475" fill="#D5D0C9" r="2" stroke="#E6E2DA"></circle>
                  <circle cx="215" cy="545" fill="#D5D0C9" r="3.5" stroke="#E6E2DA"></circle>
                  <text fill="#5A5854" fontFamily="Inter" fontSize="8" letterSpacing="1" x="180" y="558">
                    Đ. PHÚ QUỐC
                  </text>
                </svg>

                {/* Coordinate Callout Tag Floating Inside Left */}
                <div className="absolute bottom-4 left-4 bg-surface-crisp/95 backdrop-blur-sm border border-border-neutral p-3 max-w-[210px] hidden sm:block">
                  <div className="font-spec-code text-[10px] text-accent-terracotta uppercase tracking-[0.15em] font-semibold mb-1">
                    TÂM ĐIỂM QUAN SÁT
                  </div>
                  <div className="font-body-spec text-[12px] text-text-primary font-medium leading-tight">
                    {currentRegion.focusArea}
                  </div>
                  <div className="text-[11px] font-spec-code text-text-secondary mt-1">
                    {currentRegion.coordinates}
                  </div>
                </div>
              </div>

              {/* Bottom Legend & Map Metadata */}
              <div className="pt-4 border-t border-border-neutral flex flex-wrap items-center justify-between gap-3 text-text-secondary text-[12px]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 bg-accent-terracotta inline-block"></span>
                    <span className="font-spec-code uppercase">Vùng Đang Chọn</span>
                  </div>
                  <span className="text-border-neutral select-none">|</span>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 bg-[#D5D0C9] inline-block"></span>
                    <span className="font-spec-code uppercase">Vùng Lưu Trữ Khác</span>
                  </div>
                </div>
                <div className="font-spec-code text-[11px] tracking-wide text-text-secondary">
                  CLICK VÀO TỪNG VÙNG ĐỂ TẢI DỮ LIỆU
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Sharp Rectangular Archival Preview Card */}
            <div className="lg:col-span-5 bg-surface-crisp border border-border-neutral p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                {/* Region Index & Status Marker */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-neutral">
                  <span className="font-spec-code text-[12px] text-accent-terracotta tracking-[0.2em] uppercase font-semibold">
                    MỤC LỤC ĐỊA BÀN {currentRegion.index}
                  </span>
                  <span className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary border border-border-neutral px-2 py-0.5 bg-canvas-linen">
                    {currentRegion.verified}
                  </span>
                </div>

                {/* Region Title */}
                <h2 className="font-headline-title text-xl sm:text-2xl text-text-primary tracking-[2px] uppercase mb-3 font-semibold">
                  {currentRegion.name} — {currentRegion.villagesCount} LÀNG NGHỀ
                </h2>

                {/* Region Description */}
                <p className="font-body-default text-body-default text-text-secondary leading-relaxed mb-6">
                  {currentRegion.description}
                </p>

                {/* Divider Line */}
                <div className="flex items-center gap-3 my-5">
                  <span className="h-[1px] flex-1 bg-border-neutral"></span>
                  <span className="font-spec-code text-[10px] tracking-[0.2em] uppercase text-text-secondary/70">
                    CÁC ĐIỂM NGHỀ TIÊU BIỂU
                  </span>
                  <span className="h-[1px] flex-1 bg-border-neutral"></span>
                </div>

                {/* Featured Craft Village Thumbnails */}
                <div className="space-y-4 mb-6">
                  {currentRegion.villages.map((village, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 p-3 border border-border-neutral bg-canvas-linen/40 hover:bg-canvas-linen transition-all duration-200"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 border border-border-neutral overflow-hidden bg-surface-subtle">
                        <img
                          src={village.image}
                          alt={village.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-1">
                          <Link to={`/crafts/${village.craftId}`}>
                            <h3 className="font-title-card text-[16px] text-text-primary group-hover:text-accent-terracotta transition-colors truncate font-medium">
                              {village.name}
                            </h3>
                          </Link>
                          <span className="font-spec-code text-[10px] text-accent-terracotta uppercase tracking-wider shrink-0 ml-2">
                            {village.era}
                          </span>
                        </div>
                        <div className="font-body-spec text-[12px] text-text-secondary tracking-wide mb-1">
                          {village.location}
                        </div>
                        <p className="font-body-spec text-[12px] text-text-secondary line-clamp-2">
                          {village.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Concrete Region Statistics Bar */}
                <div className="bg-surface-subtle border border-border-neutral p-4 mb-6">
                  <div className="grid grid-cols-3 gap-2 text-center divide-x divide-border-neutral">
                    <div className="px-1">
                      <div className="font-headline-title text-[20px] text-text-primary font-semibold leading-tight">
                        {currentRegion.villagesCount}
                      </div>
                      <div className="font-spec-code text-[10px] tracking-wider uppercase text-text-secondary mt-1">
                        Làng nghề hoạt động
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="font-headline-title text-[20px] text-accent-terracotta font-semibold leading-tight">
                        {currentRegion.artisansCount}
                      </div>
                      <div className="font-spec-code text-[10px] tracking-wider uppercase text-text-secondary mt-1">
                        Nghệ nhân ưu tú
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="font-headline-title text-[20px] text-text-primary font-semibold leading-tight">
                        {currentRegion.heritageCount}
                      </div>
                      <div className="font-spec-code text-[10px] tracking-wider uppercase text-text-secondary mt-1">
                        Di sản quốc gia
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              <div className="pt-2">
                <Link
                  to="/crafts"
                  className="flex items-center justify-between w-full bg-text-primary hover:bg-accent-terracotta text-surface-crisp px-6 py-4 font-label-action text-label-action uppercase tracking-[2px] transition-colors duration-200 group font-semibold"
                >
                  <span>KHÁM PHÁ DANH MỤC DI SẢN VÙNG</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform duration-200">
                    arrow_forward
                  </span>
                </Link>
                <div className="flex items-center justify-between mt-3 px-1 text-text-secondary font-spec-code text-[11px]">
                  <span>CẬP NHẬT: THÁNG 10/2024</span>
                  <span className="flex items-center gap-1 text-accent-terracotta">
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    HỒ SƠ ĐỊA CHÍ TRỰC TUYẾN
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK ACCESS SECONDARY STRIP: Field Methodology & Heritage Criteria */}
      <section className="w-full bg-canvas-linen py-10 border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex items-start gap-4 p-4 border border-border-neutral bg-surface-crisp">
              <div className="w-10 h-10 shrink-0 bg-surface-subtle flex items-center justify-center border border-border-neutral text-accent-terracotta">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div>
                <div className="font-label-action text-[12px] uppercase tracking-[0.1em] text-text-primary font-semibold mb-1">
                  TIÊU CHÍ ĐIỀN DÃ BẢN ĐỊA
                </div>
                <p className="font-body-spec text-[13px] text-text-secondary">
                  Mỗi làng nghề được ghi nhận phải đạt tối thiểu 3 thế hệ trao truyền liên tục cùng nguyên vật liệu truy xuất nguồn gốc địa phương.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-border-neutral bg-surface-crisp">
              <div className="w-10 h-10 shrink-0 bg-surface-subtle flex items-center justify-center border border-border-neutral text-accent-terracotta">
                <span className="material-symbols-outlined text-[20px]">layers</span>
              </div>
              <div>
                <div className="font-label-action text-[12px] uppercase tracking-[0.1em] text-text-primary font-semibold mb-1">
                  PHÂN LỚP NGHỆ NHÂN &amp; XƯỞNG
                </div>
                <p className="font-body-spec text-[13px] text-text-secondary">
                  Tích hợp danh bạ 450+ xưởng gia đình, tạo điều kiện kết nối kiến trúc sư, nhà nghiên cứu và người yêu mến văn hóa thực thụ.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-border-neutral bg-surface-crisp">
              <div className="w-10 h-10 shrink-0 bg-surface-subtle flex items-center justify-center border border-border-neutral text-accent-terracotta">
                <span className="material-symbols-outlined text-[20px]">share_location</span>
              </div>
              <div>
                <div className="font-label-action text-[12px] uppercase tracking-[0.1em] text-text-primary font-semibold mb-1">
                  ĐỊNH HƯỚNG TRẢI NGHIỆM VĂN HÓA
                </div>
                <p className="font-body-spec text-[13px] text-text-secondary">
                  Cung cấp lộ trình hành hương nghề tôn trọng sinh hoạt cộng đồng, hạn chế thương mại hóa du lịch xô bồ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
