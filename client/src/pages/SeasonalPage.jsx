import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SEASONAL_ITEMS = [
  {
    id: 'THU-GM-01',
    craftId: 1,
    tag: 'Gốm Mộc',
    ref: 'REF: THU-GM-01',
    region: 'Hà Nội',
    artisan: 'Nghệ Nhân Lò Nung Củi',
    title: 'Bộ Trà Gốm Mộc Đất Nung Sa Thạch',
    description: 'Dung tích ấm 280ml, đất phù sa lòng sông Hồng ngâm ủ 3 năm, nung củi liên tục 72 giờ ở nhiệt độ 1250°C tạo lớp men tro tự nhiên phong hóa.',
    price: '3.200.000',
    unit: 'đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDifivacaZsk9y5DZ8WJyfTpMp_FKaks_8hRGemnkBfsOFmOezTMtoFZBDAarQS3JbOgev_2n2DdAuNBoYTeP9TB9AnhuTJoNJE-Fw6rKwMSLAXw7_49OaorYeHLWxc0kR0zeioCitqB97vl6Obh2ZFbVzJKqJsQWmvCRNO2-bo_woZrG7dkPoRpT7o3g4nv_BMkGiRzKXd34UjfZ5Yj4IwUU3iU-WU6FMyqNTtDnw'
  },
  {
    id: 'THU-TR-05',
    craftId: 3,
    tag: 'Trà Cổ Thụ',
    ref: 'REF: THU-TR-05',
    region: 'Hà Giang & Tây Hồ',
    artisan: 'Thu Hái Đỉnh Đèo',
    title: 'Trà Sen Cổ Thụ Bách Diệp Tây Hồ',
    description: '100% búp trà Shan Tuyết cổ thụ 300 năm tuổi vùng núi cao Hoàng Su Phì ngậm sương, ướp từng cánh sen Bách Diệp hái trước bình minh lộng gió.',
    price: '1.850.000',
    unit: 'đ / 100g',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPGPeefjkcxyjRMvMCuJXfmPIXXZHqZGv_X5p7nUoK2iayjCOf8NKi4rA0Pr-VW5dzNqoQE9pE7C1BAmoFFQ3zs3r3LYgq6ZE6NF7CHNEtrF9emyvuD6K5vxMyfut7b0z0_Z9uNPLsH6GulEXrEz0dVubv097TBkwJN20-fWD30lNev9kh7W1vE5Dt-c4GtWgbCfIBbzJ1jiFWEvKaUvf9TLF3onsKdUa6jan6NMM'
  },
  {
    id: 'THU-MN-03',
    craftId: 5,
    tag: 'Mây Tre Đan',
    ref: 'REF: THU-MN-03',
    region: 'Làng Phú Vinh',
    artisan: 'Đan Nan Mắt Cáo',
    title: 'Khay Trà Mây Nếp Bện Nan Đan Mắt Cáo',
    description: 'Khai thác từ mây nếp rừng già dẻo dai kết hợp tre đực hong gác bếp 6 tháng chống ẩm mọt tự nhiên, hoàn toàn không hóa chất bảo quản.',
    price: '1.150.000',
    unit: 'đ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATU5lGoFKB-HXZ8O_uWDx7nkGCGOUHUlnW2Ot3CT13hJN3P3dmbdKT0Bisv4_RGYMcxt0tfhXeDgTKqqMrr9mMrgrPlLLBG0ugfvulf8M_MX6_-sPP470qLsEjZIOLfNitrnoJ0c7qi9-sWqcIDTxF9VnGSyLJrGosMIJdWECtGMeMaQ-bVpC5cmU-C-yNe7YzwoJm17jTYd85RZaiokXarV4anhk_cTf2331UFe0'
  }
];

export default function SeasonalPage() {
  const [savedItems, setSavedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('craftroots_favourites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState('');

  const toggleSave = (item) => {
    const isSaved = savedItems.some((s) => s.id === item.id);
    let updated;
    if (isSaved) {
      updated = savedItems.filter((s) => s.id !== item.id);
      setToastMessage(`Đã bỏ lưu "${item.title}"`);
    } else {
      updated = [...savedItems, item];
      setToastMessage(`Đã thêm "${item.title}" vào mục lưu trữ`);
    }
    setSavedItems(updated);
    try {
      localStorage.setItem('craftroots_favourites', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1B1A] text-[#FFFFFF] px-5 py-3 shadow-lg border border-[#B86B35] font-['Montserrat'] text-[12px] uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-[#B86B35] text-[18px]">bookmark_added</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Immersive Editorial Hero */}
      <section className="relative w-full overflow-hidden bg-[#ECE7E5]">
        <div
          className="w-full min-h-[520px] lg:min-h-[600px] bg-cover bg-center flex items-center relative"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTQztKdNfWpJJ1vzPaxPp6KYzUsTZTp0DdzMaEblwLq1W-lli8QibsbrkwGXeYeWv1lbFhxKhdlMpxWgHTzADAbZ5iSutJQSoOZJ44DXPFO_o-KlTzqtyY3XZ2cl3Wzja1ZIN0kOmR4OEI8OkN_VBFFP_TLURLBO_09F46RyCsOauB_Ld4DEt6xZrI5NLNDezpfdh9N20CcyOWj8_iVuiKLSE_ONkzcaMAG8aluEs')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1B1A]/90 via-[#1C1B1A]/70 to-transparent"></div>
          <div className="absolute inset-0 bg-[#8E4A16]/10 mix-blend-multiply"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full pt-16 pb-12">
            <div className="max-w-2xl text-[#FFFFFF] flex flex-col items-start">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-['Inter'] text-[12px] tracking-[0.25em] uppercase text-[#FFB689]">
                  Tuyển Tập Giới Hạn
                </span>
                <span className="text-[#E6E2DF]/40 select-none">|</span>
                <span className="font-['Playfair_Display'] italic text-[15px] text-[#E6E2DC]">
                  Tiết Thu Phân & Thưởng Trà Cổ Điển
                </span>
              </div>

              <h1 className="font-['Montserrat'] text-3xl sm:text-5xl lg:text-6xl uppercase text-[#FFFFFF] font-light tracking-[6px] sm:tracking-[8px] leading-[1.15] mb-4">
                THU TRẦM &<br />GỐM MỘC
              </h1>

              <div className="h-0.5 w-16 bg-[#B86B35] mb-4"></div>

              <p className="font-['Inter'] text-[15px] text-[#E6E2DF] font-normal leading-relaxed mb-8 max-w-xl">
                Khi gió heo may về trên phố cũ, chén trà ấm cùng chiếc khay mây mộc mạc đưa con người trở về với nhịp thở nguyên sơ của đất trời.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#tuyen-tap"
                  className="inline-flex items-center justify-center bg-[#B86B35] hover:bg-[#8E4A16] text-[#FFFFFF] font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 transition-colors shadow-sm font-semibold"
                >
                  Khám Phá Bộ Sưu Tập
                </a>
                <div className="flex items-center font-['Inter'] text-[12px] text-[#E6E2DF] tracking-[0.12em] uppercase">
                  <span>Đợt nung: 08/2024</span>
                  <span className="mx-3 text-[#E6E2DF]/40">|</span>
                  <span>Phiên bản hữu hạn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Callout Block */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-10">
        <div className="bg-[#F4F2EE] p-6 lg:p-10 relative shadow-sm border border-[#E6E2DA]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#B86B35] text-[20px]">spa</span>
                <span className="font-['Inter'] text-[12px] uppercase tracking-[0.2em] text-[#5A5854] font-medium">
                  Triết Lý Chậm & Cốt Cách Đất Nung
                </span>
              </div>
              <blockquote className="font-['Playfair_Display'] text-xl sm:text-2xl text-[#1C1B1A] font-normal italic leading-snug tracking-tight mb-3">
                “Uống một ngụm trà trong chén gốm mộc nung củi, cảm nhận sự thô ráp chân thật của đất và men rạn tự nhiên. Thủ công không vội vã; mỗi vết nứt men là một câu chuyện của nhiệt độ và thời gian.”
              </blockquote>
              <cite className="font-['Inter'] text-[12px] uppercase tracking-[0.14em] text-[#B86B35] not-italic block font-medium">
                — Ghi chép từ trà thất CraftRoots, Tiết Thu 2024
              </cite>
            </div>
            
            <div className="shrink-0 flex flex-col items-start md:items-end justify-center pl-0 md:pl-8 text-[#5A5854] font-['Inter'] text-[12px] border-t md:border-t-0 md:border-l border-[#E6E2DA] pt-4 md:pt-0">
              <div className="text-[#1C1B1A] font-medium tracking-[0.15em] uppercase">Nhiệt độ nung đạt</div>
              <div className="text-[32px] leading-tight font-['Montserrat'] font-light text-[#8E4A16]">1250°C</div>
              <div className="text-[11px] tracking-[0.1em] text-[#5A5854]/80">Lò bầu truyền thống 72 giờ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated 3-Column Sharp Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 pb-16" id="tuyen-tap">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-[#E6E2DA]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 bg-[#B86B35]"></span>
              <span className="font-['Inter'] text-[12px] tracking-[0.2em] uppercase text-[#5A5854]">
                Danh Mục Tuyển Chọn
              </span>
            </div>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1C1B1A] font-semibold tracking-tight uppercase">
              Tác Phẩm Mùa Thu
            </h2>
          </div>
          <div className="flex items-center gap-3 mt-3 md:mt-0 font-['Inter'] text-[12px] text-[#5A5854]">
            <span className="text-[#1C1B1A] font-semibold">03 Tác phẩm tiêu biểu</span>
            <span className="text-[#E6E2DA]">|</span>
            <span>Kiểm định văn hóa & niên biểu</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEASONAL_ITEMS.map((item) => {
            const isSaved = savedItems.some((s) => s.id === item.id);
            return (
              <article
                key={item.id}
                className="group bg-[#FFFFFF] flex flex-col border border-[#E6E2DA] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F2EDEB]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#1C1B1A] text-[#FFFFFF] font-['Inter'] text-[10px] tracking-[0.15em] uppercase px-2.5 py-1">
                    {item.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#F9F8F6]/90 backdrop-blur-sm text-[#1C1B1A] font-['Inter'] text-[11px] px-2 py-0.5 shadow-sm">
                    {item.ref}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
                  <div>
                    <div className="flex items-center font-['Inter'] text-[12px] text-[#5A5854] tracking-[0.1em] uppercase mb-2">
                      <span>{item.region}</span>
                      <span className="mx-2 text-[#E6E2DA]">|</span>
                      <span>{item.artisan}</span>
                    </div>
                    <Link to={`/crafts/${item.craftId}`}>
                      <h3 className="font-['Playfair_Display'] text-[18px] text-[#1C1B1A] font-medium tracking-tight mb-2 group-hover:text-[#B86B35] transition-colors leading-snug">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E6E2DA] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-['Inter'] text-[11px] uppercase tracking-[0.12em] text-[#5A5854]">
                        Định Giá Lưu Trữ
                      </span>
                      <span className="font-['Playfair_Display'] text-xl text-[#1C1B1A] font-semibold">
                        {item.price}{' '}
                        <span className="text-[13px] font-normal text-[#5A5854] font-['Inter']">
                          {item.unit}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSave(item)}
                      className={`w-10 h-10 flex items-center justify-center transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-[#B86B35] text-[#FFFFFF]'
                          : 'bg-[#1C1B1A] hover:bg-[#B86B35] text-[#FFFFFF]'
                      }`}
                      title={isSaved ? 'Đã lưu trong tuyển tập' : 'Thêm vào tuyển tập'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isSaved ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Editorial Process Feature: From High Mountain to Tea Table */}
      <section className="w-full bg-[#F4F2EE] py-14 border-t border-b border-[#E6E2DA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <span className="font-['Inter'] text-[12px] uppercase tracking-[0.25em] text-[#B86B35] mb-2 font-medium">
              Hành Trình Của Đất & Lá
            </span>
            <h2 className="font-['Montserrat'] text-xl sm:text-2xl font-light uppercase text-[#1C1B1A] tracking-[0.2em]">
              QUY TRÌNH THỰC HIỆN MÙA THU: TỪ NÚI CAO VỀ BÀN TRÀ
            </h2>
            <div className="h-0.5 w-12 bg-[#B86B35] mt-3"></div>
          </div>

          {/* 3-Step Process Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-[#FFFFFF] p-6 border border-[#E6E2DA] flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-['Montserrat'] text-[36px] leading-none font-light text-[#B86B35]">
                    01
                  </span>
                  <span className="font-['Inter'] text-[12px] uppercase tracking-[0.15em] text-[#5A5854]">
                    Giai Đoạn I
                  </span>
                </div>
                <h3 className="font-['Playfair_Display'] text-[18px] text-[#1C1B1A] font-medium mb-2">
                  Thu Hái Búp Chè
                </h3>
                <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed">
                  Những búp chè Shan Tuyết một tôm hai lá phủ lớp nhung trắng được đồng bào Dao đỏ thu hái khi sương sớm còn đọng trên chóp lá, giữ trọn vị chát thanh dịu ngọt hậu của núi rừng.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#E6E2DA] flex items-center font-['Inter'] text-[11px] text-[#5A5854] uppercase tracking-[0.1em]">
                <span>Độ cao: 1.400m</span>
                <span className="mx-2 text-[#E6E2DA]">|</span>
                <span>Tiết Thu phân</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FFFFFF] p-6 border border-[#E6E2DA] flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-['Montserrat'] text-[36px] leading-none font-light text-[#8E4A16]">
                    02
                  </span>
                  <span className="font-['Inter'] text-[12px] uppercase tracking-[0.15em] text-[#5A5854]">
                    Giai Đoạn II
                  </span>
                </div>
                <h3 className="font-['Playfair_Display'] text-[18px] text-[#1C1B1A] font-medium mb-2">
                  Ủ Men Tro & Luyện Đất
                </h3>
                <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed">
                  Đất sa thạch sông Hồng ủ đầm trong hầm sâu qua 3 mùa mưa nắng để đạt độ dẻo mịn tối đa. Men tro rơm nếp cổ truyền được nghiền mịn thủ công, phủ mỏng để tương tác cùng ngọn lửa lò củi.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#E6E2DA] flex items-center font-['Inter'] text-[11px] text-[#5A5854] uppercase tracking-[0.1em]">
                <span>Men tro tự nhiên</span>
                <span className="mx-2 text-[#E6E2DA]">|</span>
                <span>Khử oxy 1250°C</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FFFFFF] p-6 border border-[#E6E2DA] flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-['Montserrat'] text-[36px] leading-none font-light text-[#B86B35]">
                    03
                  </span>
                  <span className="font-['Inter'] text-[12px] uppercase tracking-[0.15em] text-[#5A5854]">
                    Giai Đoạn III
                  </span>
                </div>
                <h3 className="font-['Playfair_Display'] text-[18px] text-[#1C1B1A] font-medium mb-2">
                  Hoàn Thiện Tại Xưởng
                </h3>
                <p className="font-['Inter'] text-[13px] text-[#5A5854] leading-relaxed">
                  Mỗi ấm chén sau khi ra lò được mài phẳng đáy bằng đá suối, kiểm tra tiếng chuông ngân và ghép bộ tương hợp cùng khay mây tre đan tay trước khi lưu kho di sản CraftRoots.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#E6E2DA] flex items-center font-['Inter'] text-[11px] text-[#5A5854] uppercase tracking-[0.1em]">
                <span>Nghiệm thu thủ công</span>
                <span className="mx-2 text-[#E6E2DA]">|</span>
                <span>Chứng thư xuất xưởng</span>
              </div>
            </div>
          </div>

          {/* Workshop Metadata Bar */}
          <div className="mt-8 bg-[#FFFFFF] p-4 border border-[#E6E2DA] flex flex-col md:flex-row items-center justify-between shadow-sm text-[#5A5854] font-['Inter'] text-[12px]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B86B35] text-[18px]">verified</span>
              <span className="uppercase tracking-[0.1em] text-[#1C1B1A] font-semibold">
                Quy Chuẩn Giám Tuyển Văn Hóa:
              </span>
              <span>Bảo toàn 100% nguyên liệu tự nhiên bản địa Việt Nam</span>
            </div>
            <div className="flex items-center gap-3 mt-2 md:mt-0 uppercase tracking-[0.12em]">
              <span>Mã lưu trữ: CR-AUTUMN-24</span>
              <span className="text-[#E6E2DA]">|</span>
              <Link to="/crafts" className="text-[#B86B35] hover:underline font-medium">
                Khám phá danh mục di sản →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
