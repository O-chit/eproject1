import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ArtisanDetailPopup from '../components/modals/ArtisanDetailPopup';
import VisitBookingModal from '../components/modals/VisitBookingModal';

// 6 NGHỆ NHÂN BẬC THẦY TIÊU BIỂU THEO ĐÚNG MA TRẬN 3x2 (demo/artisan-page & docs/feature-spec.md)
const MASTER_ARTISANS = [
  {
    id: 1,
    ref: 'ART-BT-001',
    code: 'ART-BT-001',
    name: 'Nguyễn Văn Bình',
    title: 'Bậc thầy lò bầu',
    age: 72,
    village: 'Bát Tràng',
    province: 'Hà Nội',
    category: 'gom',
    craft_category: 'Gốm Sa Thạch Men Rạn',
    years_of_experience: 50,
    generation: 'Đời Thứ 6',
    matrix_index: '#01',
    description: 'Chuyên phục dựng men rạn lam triều Lê',
    quote: 'Đất sét phải ủ ba mùa mưa nắng, men tro nung củi gỗ dâu mới ra được đường rạn của thời gian.',
    masterwork_name: 'Bình vôi men rạn cổ thế kỷ XVIII',
    material: 'Đất sét cao lanh Trúc Thôn, tro trấu lọc nếp',
    firing_technique: 'Lò bầu nung củi nhiệt 1280°C liên tục 72 giờ',
    signature_style: 'Men rạn tam thái vẽ chỉ lam chàm thủy mặc',
    biography: 'Sinh ra trong gia đình gốm danh gia kế nghiệp 6 đời tại châu thổ sông Hồng. Trải qua hơn nửa thế kỷ gắn bó cùng lò nung củi truyền thống, ông đã phục dựng thành công nhiều kỹ pháp men rạn thất truyền từ thời Hậu Lê.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsI9aPyBln6KwNTduyuzUQsX3URliV1Lme3MJ-LRjuusu4bzRy8Pg1p4qxcQ20-bV982DIaUPJeSYINYU3RqJQr402-Fg4v9teM9X_SOYh5i4sV9_nm-K-QRB0kom3klpQBV5PHVsgpUuay47yNjVhkwP-9zcQ4vxT9Top5WXmRIElWWrk5aYrLmODShqcU1RgRAYGUCWARylylg4Sh4NR0wxLI2f7AFUlG34agHAgtokI1OJFalxJ',
  },
  {
    id: 2,
    ref: 'ART-VP-002',
    code: 'ART-VP-002',
    name: 'Nguyễn Thị Tâm',
    title: 'Bảo tồn lụa Vân cổ',
    age: 68,
    village: 'Vạn Phúc',
    province: 'Hà Đông',
    category: 'lua',
    craft_category: 'Dệt Lụa Cổ Vạn Phúc',
    years_of_experience: 45,
    generation: 'Đời Thứ 4',
    matrix_index: '#02',
    description: 'Khung dệt Jacquard thủ công truyền thống',
    quote: 'Dệt sợi Vân không được nôn nóng; tơ tằm nhả hạt đều thì hoa văn ẩn hiện như mây cuốn sau cơn mưa ngâu.',
    masterwork_name: 'Khăn lụa tơ tằm dệt nổi Vân Mây',
    material: 'Tơ tằm tự nhiên Bảo Lộc, phẩm nhuộm củ nâu và mặc nưa',
    firing_technique: 'Kéo sợi tay và dệt khung cửi gỗ luồn con thoi',
    signature_style: 'Lụa Vân hoa chìm hoa nổi mỏng nhẹ như cánh ve',
    biography: 'Kế thừa bí quyết dệt lụa tiến vua qua 4 thế hệ tại làng Vạn Phúc. Bà đã khôi phục lại kỹ thuật dệt lụa sa và gấm vân cổ từng mai một trong thời kỳ cơ giới hóa.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDpzmZMP5beuKKdUQqp2GTZkGbhJCpF7R7tXabnkXuzBoFcimjcJ7jqN-azz-ws2VqqQIEtRtu_fGYz_90SiB2RAT8f52s4tSMf_2bk7FWwVPjUz4Wp2g7Z7VJw4t2l64k6MRkKoECQHEsDyx-HsyvZegff3g6JrUu6HKmt12RHuwyUmDjD9i4SqUDQu2TmpX_Lp2hxRiPLlsCXEniTWIwuv1hHnhsl-DsIM4yo4X53Mii8NfgfPZC',
  },
  {
    id: 3,
    ref: 'ART-PV-003',
    code: 'ART-PV-003',
    name: 'Nguyễn Văn Trung',
    title: 'Bàn tay vàng đan lát',
    age: 70,
    village: 'Phú Vinh',
    province: 'Chương Mỹ',
    category: 'may',
    craft_category: 'Mây Tre Đan Mắt Cáo',
    years_of_experience: 52,
    generation: 'Đời Thứ 5',
    matrix_index: '#03',
    description: 'Kỹ pháp nan mây chuốt tơ tinh vi',
    quote: 'Cọng mây chuốt mỏng như sợi tóc, luồn qua ngón tay phải nghe được tiếng đàn mới thành hình chiếc lẵng cung đình.',
    masterwork_name: 'Bộ lẵng hoa mây nếp bện đôi thủ công',
    material: 'Mây nếp tự nhiên ngâm nước giếng đá ong 6 tháng',
    firing_technique: 'Sấy khói trấu chống mối mọt không dùng hóa chất',
    signature_style: 'Đan mắt cáo kép và kỹ thuật gài nan ẩn khớp',
    biography: 'Được phong tặng danh hiệu Bàn tay vàng năm 1985. Ông là người đưa nghệ thuật đan mây tre truyền thống Phú Vinh vượt khỏi biên giới sang hơn 20 quốc gia.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2As0HjmiHinDMAMk-j1g9Xylhh7BSDIW_zoKq2Q4GjwL6AoeBHrhiIOxxOeL5zQVx9wJYyZxnwRVdhFvy_Hb9nv9hwP_mSaXHgS7v0fvU8kh8f1Cxn9pgBAjORVQZxFo46w-IX86m6fyc2ZQpoUzexJe2285NdDOF_fOCVtRoBC5yz9gK_VdOzFoaD_6EwIPQhL9SPpPPHpeCqOQY9WT3tNbHJxo_taNNDY6FaUzeNyz75qtPty9',
  },
  {
    id: 4,
    ref: 'ART-HT-004',
    code: 'ART-HT-004',
    name: 'Đinh Văn Dương',
    title: 'Nghệ nhân ưu tú sơn ta',
    age: 65,
    village: 'Hạ Thái',
    province: 'Thường Tín',
    category: 'sonmai',
    craft_category: 'Sơn Mài Then Cổ',
    years_of_experience: 40,
    generation: 'Đời Thứ 3',
    matrix_index: '#04',
    description: 'Kỹ pháp mài nước & cẩn vỏ trứng vịt',
    quote: 'Sơn ta kén thời tiết. Phải mài dưới dòng nước chảy chậm thì lớp vàng quỳ và vỏ trứng vịt mới phát sáng từ trong bóng tối.',
    masterwork_name: 'Hộp tròn sơn mài then cẩn vỏ trứng vịt',
    material: 'Sơn then tự nhiên Phú Thọ, vàng quỳ Kiêu Kỵ, vỏ trứng vịt',
    firing_technique: 'Ủ ẩm phòng kín và mài nước thủ công 25 tầng',
    signature_style: 'Sơn then sâu thẳm kết hợp cẩn xà cừ óng ánh',
    biography: 'Bậc thầy chế tác sơn mài truyền thống làng Hạ Thái. Các tác phẩm của ông lưu giữ kỹ pháp sơn ta nguyên bản với độ bền bóng sâu thẳm trường tồn qua nhiều thập kỷ.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuanLpTw2XveHgfpZC_icHfliYFe3VlCMddEToLmfkJkhwo42NvSxudY1CEO8kNLSAfyJP8KxjNnesrqAwdJ9g7tFOxoBWafdRb_OYBMPfESRDn0Lz3m0eY9iaOz7jnYdVCCjIFC5CEN3JPPDEqXATM-QDg5f7JKtMcjHVFDLWo4rFYMl378BMuQhj4zeX6q93ruf1RmYMrRjIpckdqTxZuhYDtO-aW4p3CC_VNvoKR_itEPtTsqdB',
  },
  {
    id: 5,
    ref: 'ART-DX-005',
    code: 'ART-DX-005',
    name: 'Nguyễn Văn Ứng',
    title: 'Bậc thầy chạm thúc gò',
    age: 74,
    village: 'Đồng Xâm',
    province: 'Thái Bình',
    category: 'kimhoan',
    craft_category: 'Chạm Bạc Đồng Xâm',
    years_of_experience: 55,
    generation: 'Đời Thứ 7',
    matrix_index: '#05',
    description: 'Kỹ pháp gò đồng trui bạc cung đình',
    quote: 'Mỗi nhát búa lên tấm bạc dày một ly đòi hỏi nhịp thở đều; chạm gõ rồng múa thì rồng phải toát thần sắc uy nghi.',
    masterwork_name: 'Bộ ấm trà bạc chạm thúc hoa văn Tứ Linh',
    material: 'Bạc ta 9999 nguyên chất, đe đục thép trui than củi',
    firing_technique: 'Thúc nổi khối âm dương và chạm trổ trổ thủng vi tế',
    signature_style: 'Chạm hoa văn rồng phượng tinh vi đạt độ sắc cạnh tuyệt đối',
    biography: 'Đại diện đời thứ 7 gia tộc kim hoàn Đồng Xâm. Ông nắm giữ trọn vẹn 36 thế đục thúc bạc truyền thống và từng tham gia trùng tu nhiều bảo vật triều đình.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKX11c4b5FVZPwGjjJSU78Amvq24mYSwvisp6_ka2p_N3aQ3SIbMxKB_VizguFdluwk5AoSLkujmIG_h-txxPcQbPfwZSXBB1mUF1iE_P0UHTDIPpdD4gOxgE_s_Ns5MyAT8PjG-EaUb44d8yQtMrol_ivXv0IxESnFI0tZ_6Kq_cslIXlNp-tdAvoG-5H1_pEqsSdv5G3x7gcNMVVPhX-0N1ooKJyMSJsfKYaEiHqLh3FppcCm-vP',
  },
  {
    id: 6,
    ref: 'ART-MN-006',
    code: 'ART-MN-006',
    name: 'Trần Đình Thành',
    title: 'Bảo tồn hoa văn cổ Chăm',
    age: 61,
    village: 'Mỹ Nghiệp',
    province: 'Ninh Thuận',
    category: 'lua',
    craft_category: 'Thổ Cẩm Chăm Mỹ Nghiệp',
    years_of_experience: 38,
    generation: 'Đời Thứ 4',
    matrix_index: '#06',
    description: 'Khung dệt lưng ikat truyền thống',
    quote: 'Tấm dệt không chỉ che thân, mà lưu giữ lời thì thầm của thần linh qua từng đường chỉ quả trám và cánh chim thần.',
    masterwork_name: 'Tấm thổ cẩm cổ lễ hội Ka-tê truyền thống',
    material: 'Sợi bông tự nhiên nhuộm vỏ cây vang và chàm rừng',
    firing_technique: 'Khung dệt luồn tay luồn dây thắt lưng Chăm pa',
    signature_style: 'Hoa văn mây cuộn, chim phượng và họa tiết thần Siva',
    biography: 'Nghệ nhân người Chăm đã dành cả đời để sưu tầm và giải mã hơn 50 họa tiết thổ cẩm thiêng của vương quốc Chăm Pa cổ, truyền dạy nghề cho hàng trăm phụ nữ trong buôn làng.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE_A4vEhY4fCBkZTBX1kq8FrJavWMuNbDIaEpfo_pvaOHGKVTGtjIX5T7H4X4tVoInH-ooXovIDZhICwZnJIHEAONivTXcy3yQWIxtcFQcXGpYYjKxFQEul1NtSrr9VaCfQhqcaAP4IJwGWN0DQ-o490W5EBrTQNWhAZfNfilbaX_VdemxXSE7mInKTnZrzipyIJJkSktT6eD_BqzaAE6mjCVSIt8PDO3og1Sxtp6phDkX11GX6Nkp',
  },
];

export default function ArtisansPage() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeArtisanIndex, setActiveArtisanIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingArtisan, setBookingArtisan] = useState(null);

  // 1. Đồng bộ mở Modal khi truy cập đường link có hash #nghe-nhan/{ref}
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#nghe-nhan/')) {
      const targetRef = hash.replace('#nghe-nhan/', '').trim().toUpperCase();
      const foundIdx = MASTER_ARTISANS.findIndex(
        (a) => a.ref.toUpperCase() === targetRef || a.code.toUpperCase() === targetRef || String(a.id) === targetRef
      );
      if (foundIdx !== -1) {
        setActiveArtisanIndex(foundIdx);
        setIsPopupOpen(true);
      }
    }
  }, [location]);

  // 2. Lọc danh sách nghệ nhân theo danh mục
  const filteredArtisans = selectedCategory === 'all'
    ? MASTER_ARTISANS
    : MASTER_ARTISANS.filter((a) => a.category === selectedCategory);

  const currentArtisan = MASTER_ARTISANS[activeArtisanIndex] || MASTER_ARTISANS[0];

  // 3. Xử lý mở popup của 1 nghệ nhân
  const handleOpenArtisanPopup = (artisanObj) => {
    const idx = MASTER_ARTISANS.findIndex((a) => a.id === artisanObj.id);
    setActiveArtisanIndex(idx !== -1 ? idx : 0);
    setIsPopupOpen(true);
  };

  // 4. Chuyển tuần hoàn Trước / Sau
  const handlePrevArtisan = () => {
    setActiveArtisanIndex((prev) => (prev > 0 ? prev - 1 : MASTER_ARTISANS.length - 1));
  };

  const handleNextArtisan = () => {
    setActiveArtisanIndex((prev) => (prev < MASTER_ARTISANS.length - 1 ? prev + 1 : 0));
  };

  const prevIdx = (activeArtisanIndex > 0 ? activeArtisanIndex - 1 : MASTER_ARTISANS.length - 1);
  const nextIdx = (activeArtisanIndex < MASTER_ARTISANS.length - 1 ? activeArtisanIndex + 1 : 0);

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* SECTION 1: EDITORIAL HEADER & METADATA STRIP */}
      <section className="w-full bg-surface-crisp border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin py-space-md">
          {/* Breadcrumb with pipes */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center font-spec-code text-[11px] uppercase tracking-[0.18em] text-text-secondary mb-space-sm">
            <a className="hover:text-accent-terracotta transition-colors" href="/">Trang Chủ</a>
            <span className="mx-3 text-border-neutral select-none opacity-60">|</span>
            <a className="hover:text-accent-terracotta transition-colors" href="/crafts">Danh Mục Di Sản</a>
            <span className="mx-3 text-border-neutral select-none opacity-60">|</span>
            <span className="text-accent-terracotta font-medium">Nghệ Nhân Ưu Tú</span>
            <span className="mx-3 text-border-neutral select-none opacity-60">|</span>
            <span className="text-text-secondary/70">Mã lưu trữ: ARTISAN-ARCHIVE-MATRIX-2025</span>
          </nav>

          {/* Main Headline Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end pt-2 pb-space-sm">
            <div className="lg:col-span-8 flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-accent-terracotta"></span>
                <span className="font-spec-code text-[10px] tracking-[0.25em] uppercase text-accent-terracotta font-semibold">
                  HỒ SƠ LƯU TRỮ DI SẢN • MA TRẬN NGHỆ NHÂN TOÀN QUỐC • BẢO TỒN NGUYÊN BẢN
                </span>
              </div>
              <h1 className="font-headline-title text-[32px] md:text-[40px] leading-[1.15] text-text-primary tracking-tight font-semibold">
                Danh Sách Nghệ Nhân &amp; Bậc Thầy Chế Tác
              </h1>
              <p className="font-body-default text-text-secondary text-[14px] md:text-[15px] max-w-3xl leading-relaxed pt-1">
                Kho tư liệu mở trực quan về các bậc thầy di sản phi vật thể Việt Nam. Sơ đồ lưu trữ 2 chiều hệ thống hóa theo vùng nguyên liệu, kỹ pháp độc bản, niên đại truyền thừa và tác phẩm tiêu biểu.
              </p>
            </div>

            {/* Archival Stamp Badge */}
            <div className="lg:col-span-4 flex lg:justify-end items-center">
              <div className="p-4 bg-canvas-linen border border-border-neutral flex items-center gap-3 w-full lg:w-auto">
                <div className="w-10 h-10 border border-accent-terracotta/40 flex items-center justify-center shrink-0 text-accent-terracotta">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-spec-code text-[10px] uppercase tracking-widest text-text-secondary">Chuẩn Quốc Gia</span>
                  <span className="font-spec-code text-[12px] font-semibold text-text-primary uppercase tracking-wider">Hồ Sơ Xác Thực 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Counter Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter pt-space-md mt-space-sm border-t border-border-neutral font-spec-code">
            <div className="flex flex-col border-r border-border-neutral last:border-r-0 pr-4">
              <span className="text-[26px] md:text-[30px] font-headline-title font-semibold text-text-primary leading-tight">84</span>
              <span className="text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">Nghệ Nhân Phục Dựng</span>
            </div>
            <div className="flex flex-col border-r border-border-neutral last:border-r-0 pr-4">
              <span className="text-[26px] md:text-[30px] font-headline-title font-semibold text-text-primary leading-tight">500+</span>
              <span className="text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">Năm Gia Truyền Bình Quân</span>
            </div>
            <div className="flex flex-col border-r border-border-neutral last:border-r-0 pr-4">
              <span className="text-[26px] md:text-[30px] font-headline-title font-semibold text-text-primary leading-tight">1.200+</span>
              <span className="text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">Hiện Vật Độc Bản</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[26px] md:text-[30px] font-headline-title font-semibold text-accent-terracotta leading-tight">100%</span>
              <span className="text-[11px] uppercase tracking-wider text-text-secondary mt-0.5">Chứng Thực Di Sản Phi Vật Thể</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FILTER STRIP WITH DELIMITERS (STICKY) */}
      <section className="w-full bg-canvas-linen border-b border-border-neutral sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="overflow-x-auto flex items-center py-3 text-[12px] font-label-action uppercase tracking-[0.14em] whitespace-nowrap no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`pb-1 transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'text-accent-terracotta font-semibold border-b-2 border-accent-terracotta'
                  : 'text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              TẤT CẢ (84)
            </button>
            <span className="mx-4 text-border-neutral select-none opacity-40 font-light">|</span>

            <button
              type="button"
              onClick={() => setSelectedCategory('gom')}
              className={`pb-1 transition-colors cursor-pointer ${
                selectedCategory === 'gom'
                  ? 'text-accent-terracotta font-semibold border-b-2 border-accent-terracotta'
                  : 'text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              GỐM SỨ SA THẠCH (24)
            </button>
            <span className="mx-4 text-border-neutral select-none opacity-40 font-light">|</span>

            <button
              type="button"
              onClick={() => setSelectedCategory('lua')}
              className={`pb-1 transition-colors cursor-pointer ${
                selectedCategory === 'lua'
                  ? 'text-accent-terracotta font-semibold border-b-2 border-accent-terracotta'
                  : 'text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              DỆT LỤA &amp; THỔ CẨM (18)
            </button>
            <span className="mx-4 text-border-neutral select-none opacity-40 font-light">|</span>

            <button
              type="button"
              onClick={() => setSelectedCategory('may')}
              className={`pb-1 transition-colors cursor-pointer ${
                selectedCategory === 'may'
                  ? 'text-accent-terracotta font-semibold border-b-2 border-accent-terracotta'
                  : 'text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              MÂY TRE ĐAN (14)
            </button>
            <span className="mx-4 text-border-neutral select-none opacity-40 font-light">|</span>

            <button
              type="button"
              onClick={() => setSelectedCategory('sonmai')}
              className={`pb-1 transition-colors cursor-pointer ${
                selectedCategory === 'sonmai'
                  ? 'text-accent-terracotta font-semibold border-b-2 border-accent-terracotta'
                  : 'text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              SƠN MÀI THEN (16)
            </button>
            <span className="mx-4 text-border-neutral select-none opacity-40 font-light">|</span>

            <button
              type="button"
              onClick={() => setSelectedCategory('kimhoan')}
              className={`pb-1 transition-colors cursor-pointer ${
                selectedCategory === 'kimhoan'
                  ? 'text-accent-terracotta font-semibold border-b-2 border-accent-terracotta'
                  : 'text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              CHẠM KHẮC BẠC &amp; ĐỒNG (12)
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: 2D GRID MATRIX SHOWCASE (MA TRẬN 3 CỘT X 2 HÀNG) */}
      <section className="w-full bg-canvas-linen py-space-xl border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          {/* Section Control Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-border-neutral gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-spec-code text-[10px] uppercase tracking-[0.25em] text-accent-terracotta font-semibold">
                  SƠ ĐỒ LƯỚI MA TRẬN 2 CHIỀU
                </span>
                <span className="w-1.5 h-1.5 bg-accent-terracotta rounded-full"></span>
                <span className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">
                  HỒ SƠ BẬC THẦY • BẢO TỒN NGUYÊN BẢN
                </span>
              </div>
              <h2 className="font-headline-title text-[24px] md:text-[28px] text-text-primary tracking-tight font-semibold">
                Bậc Thầy Chế Tác Tiêu Biểu &amp; Tác Phẩm Cốt Lõi
              </h2>
            </div>
            <div className="flex items-center gap-4 font-spec-code text-[11px] text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-text-primary"></span> 06 Vị Trí Trọng Điểm
              </span>
              <span className="text-border-neutral opacity-60">|</span>
              <span>MA TRẬN: 3 CỘT × 2 HÀNG</span>
              <span className="text-border-neutral opacity-60">|</span>
              <span className="text-accent-terracotta font-semibold">CẬP NHẬT 2025</span>
            </div>
          </div>

          {/* 2-Dimensional Full-Width Architectural Grid Matrix: 2 cột trên mobile, 3 cột trên desktop */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {filteredArtisans.map((artisan, index) => (
              <article
                key={artisan.id}
                onClick={() => handleOpenArtisanPopup(artisan)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenArtisanPopup(artisan);
                  }
                }}
                className="relative z-0 hover:z-10 flex flex-col justify-between group transition-all duration-300 ease-out border border-border-neutral hover:-translate-y-1.5 hover:border-accent-terracotta hover:shadow-[0_16px_36px_rgba(28,27,26,0.12)] cursor-pointer bg-surface-crisp overflow-hidden"
                aria-label={`Xem hồ sơ nghệ nhân: ${artisan.name}`}
              >
                {/* 1. Phần Ảnh Nghệ Nhân: Vuông 1:1 trên mobile, 4:3 trên desktop */}
                <div className="relative w-full aspect-square md:aspect-[4/3] bg-[#1C1B1A] overflow-hidden shrink-0 border-b border-border-neutral">
                  <img
                    className="w-full h-full object-cover grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    src={artisan.avatar_url}
                    alt={artisan.name}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none"></div>

                  {/* Nhãn thể loại gọn gàng ở góc trên */}
                  <div className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 flex items-center justify-between font-spec-code text-[10px] uppercase tracking-wider pointer-events-none">
                    <div className="flex items-center gap-1 bg-black/75 backdrop-blur-sm px-1.5 py-0.5 md:px-2.5 md:py-1 text-surface-crisp border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta"></span>
                      <span className="text-[#ffb689] font-semibold text-[9px] md:text-[10px] truncate max-w-[85px] sm:max-w-none">{artisan.craft_category}</span>
                    </div>
                    <span className="hidden sm:inline-block bg-black/75 backdrop-blur-sm text-surface-crisp/90 px-2 py-0.5 border border-white/20 text-[9px] md:text-[10px]">
                      REF: {artisan.ref}
                    </span>
                  </div>

                  {/* Nhãn mã ma trận góc dưới ảnh */}
                  <div className="hidden md:block absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-surface-crisp/90 px-2 py-0.5 border border-white/20 font-spec-code text-[10px] uppercase font-semibold pointer-events-none">
                    {artisan.matrix_index}
                  </div>
                </div>

                {/* 2. Phần Mô Tả Thông Tin Nghệ Nhân */}
                <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-between bg-surface-crisp space-y-2 md:space-y-4">
                  <div className="space-y-1.5 md:space-y-3">
                    {/* Hàng nhãn vị trí */}
                    <div className="flex items-center justify-between font-spec-code text-[10px] md:text-[11px] gap-1">
                      <div className="flex items-center gap-1.5 text-accent-terracotta uppercase tracking-wider font-medium truncate">
                        <span className="truncate">{artisan.village || artisan.province || 'Làng Nghề'}</span>
                      </div>
                      <span className="hidden sm:inline-block text-text-secondary text-[9px] md:text-[10px] uppercase bg-surface-subtle border border-border-neutral px-1.5 py-0.5 font-medium shrink-0">
                        {artisan.generation}
                      </span>
                    </div>

                    {/* Tên & Danh xưng */}
                    <div>
                      <h3 className="font-headline-title text-[15px] sm:text-[17px] md:text-[22px] font-semibold text-text-primary group-hover:text-accent-terracotta transition-colors leading-snug line-clamp-2">
                        {artisan.name}
                      </h3>
                      <p className="font-spec-code text-[11px] md:text-[12px] text-text-secondary mt-0.5 truncate">
                        {artisan.title} • <span className="text-accent-terracotta font-medium">{artisan.years_of_experience} Năm Nghề</span>
                      </p>
                      <p className="hidden md:block font-body-default text-[12px] text-text-secondary/80 mt-1 line-clamp-1">
                        {artisan.description}
                      </p>
                    </div>

                    {/* Trích dẫn triết lý nghề - Ẩn trên mobile để thẻ gọn gàng */}
                    <blockquote className="hidden md:block font-label-signature italic text-[13px] text-text-primary/90 leading-relaxed border-l-2 border-accent-terracotta pl-3.5 py-2 bg-surface-subtle my-2">
                      “{artisan.quote}”
                    </blockquote>
                  </div>

                  {/* Chân thẻ: Tác phẩm tiêu biểu & Điều hướng xem hồ sơ */}
                  <div className="pt-2 md:pt-3 border-t border-border-neutral space-y-2 md:space-y-3">
                    <div className="p-2 md:p-3 bg-surface-subtle border border-border-neutral flex items-center justify-between gap-1">
                      <div className="flex flex-col min-w-0 pr-1">
                        <span className="font-spec-code text-[8px] md:text-[9px] uppercase tracking-wider text-accent-terracotta font-semibold">
                          Tác Phẩm Tiêu Biểu
                        </span>
                        <span className="font-body-spec text-[11px] md:text-[12px] font-medium text-text-primary truncate">
                          {artisan.masterwork_name}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-accent-terracotta text-[16px] md:text-[20px] shrink-0">grain</span>
                    </div>

                    <div className="pt-0.5 md:pt-1 flex items-center justify-between font-spec-code text-[10px] md:text-[11px]">
                      <span className="hidden sm:inline text-text-secondary text-[10px] uppercase">DI SẢN QUỐC GIA</span>
                      <span className="font-label-action text-[10px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.15em] text-accent-terracotta group-hover:translate-x-1 flex items-center gap-0.5 md:gap-1 font-semibold transition-transform">
                        Xem Hồ Sơ <span className="material-symbols-outlined text-[13px] md:text-[15px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Matrix System Bottom Strip */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between py-3 px-4 bg-surface-crisp border border-border-neutral font-spec-code text-[11px] text-text-secondary gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-terracotta"></span>
              <span className="uppercase tracking-wider">ĐANG HIỂN THỊ 06 / 84 HỒ SƠ NGHỆ NHÂN TRỌNG ĐIỂM</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenArtisanPopup(MASTER_ARTISANS[0])}
                className="px-3 py-1.5 border border-border-neutral bg-canvas-linen text-text-primary uppercase tracking-wider text-[10px] hover:border-accent-terracotta transition-colors cursor-pointer"
              >
                Mở Xem Chi Tiết Tuần Hoàn
              </button>
              <a
                className="px-3 py-1.5 bg-text-primary text-surface-crisp uppercase tracking-wider text-[10px] hover:bg-accent-terracotta transition-colors flex items-center gap-1 font-semibold"
                href="#dat-lich"
              >
                Quy Trình Gặp Gỡ Bậc Thầy ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WORKSHOP VISIT & HERITAGE PROTOCOL NOTICE */}
      <section className="w-full bg-canvas-linen border-t border-border-neutral py-space-xl" id="dat-lich">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
          <div className="bg-surface-crisp border border-border-neutral p-space-lg md:p-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-terracotta text-[20px]">local_cafe</span>
                  <span className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
                    QUY TRÌNH GẶP GỠ NGHỆ NHÂN TIỀN BỐI
                  </span>
                </div>
                <h3 className="font-headline-title text-[24px] text-text-primary font-semibold">
                  Đăng Ký Đàm Đạo Trà &amp; Tham Quan Xưởng Chế Tác Trực Tiếp
                </h3>
                <p className="font-body-default text-text-secondary text-[14px] leading-relaxed max-w-2xl">
                  Nhằm tôn trọng nhịp điệu lao động và không gian tĩnh tại của các bậc thầy, mỗi xưởng chỉ tiếp tối đa 06 khách/buổi. Mọi lịch hẹn được điều phối viên CraftRoots xác nhận trước 48 giờ cùng chỉ dẫn phong tục bản địa.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  className="w-full bg-text-primary hover:bg-accent-terracotta text-surface-crisp font-label-action text-[11px] uppercase tracking-[0.18em] py-3.5 px-6 text-center transition-colors shadow-sm"
                  href="tel:0988246810"
                >
                  Hotline Điều Phối: 0988.246.810
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setBookingArtisan(currentArtisan);
                    setIsBookingOpen(true);
                  }}
                  className="w-full bg-surface-crisp border border-text-primary hover:bg-canvas-linen text-text-primary font-label-action text-[11px] uppercase tracking-[0.18em] py-3.5 px-6 text-center transition-colors cursor-pointer"
                >
                  Gửi Hồ Sơ Yêu Cầu Ghé Thăm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPUP MODAL HỒ SƠ CHI TIẾT NGHỆ NHÂN (TÍCH HỢP ĐIỀU HƯỚNG TUẦN HOÀN TRƯỚC/SAU) */}
      <ArtisanDetailPopup
        artisan={currentArtisan}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onPrev={handlePrevArtisan}
        onNext={handleNextArtisan}
        currentIndex={activeArtisanIndex}
        totalArtisans={MASTER_ARTISANS.length}
        prevIndexLabel={MASTER_ARTISANS[prevIdx]?.matrix_index || '#01'}
        nextIndexLabel={MASTER_ARTISANS[nextIdx]?.matrix_index || '#03'}
        onBookVisit={(art) => {
          setBookingArtisan(art);
          setIsBookingOpen(true);
        }}
      />

      {/* MODAL ĐẶT LỊCH THĂM XƯỞNG */}
      <VisitBookingModal
        artisan={bookingArtisan || currentArtisan}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
