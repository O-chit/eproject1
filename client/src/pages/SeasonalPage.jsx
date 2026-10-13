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
        <div className="fixed bottom-6 right-6 z-50 bg-text-primary text-surface-crisp px-5 py-3 shadow-lg border border-accent-terracotta font-label-action text-[12px] uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-terracotta text-[18px]">bookmark_added</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Immersive Editorial Hero */}
      <section className="relative w-full -mt-20 overflow-hidden bg-surface-container-high">
        <div
          className="w-full min-h-[580px] lg:min-h-[640px] bg-cover bg-center flex items-center relative"
          data-alt="Close up editorial shot of a handcrafted Vietnamese rustic wood-fired ceramic teapot and unglazed tea cup set on a coarse raw linen runner beside an artisan woven rattan tray. Soft diffused golden autumn morning light casts gentle horizontal shadows. Warm earthy tones, terracotta dust, deep brown, and subdued cream hues create a serene, tactile wabi-sabi atmosphere."
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTQztKdNfWpJJ1vzPaxPp6KYzUsTZTp0DdzMaEblwLq1W-lli8QibsbrkwGXeYeWv1lbFhxKhdlMpxWgHTzADAbZ5iSutJQSoOZJ44DXPFO_o-KlTzqtyY3XZ2cl3Wzja1ZIN0kOmR4OEI8OkN_VBFFP_TLURLBO_09F46RyCsOauB_Ld4DEt6xZrI5NLNDezpfdh9N20CcyOWj8_iVuiKLSE_ONkzcaMAG8aluEs')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-text-primary/85 via-text-primary/65 to-transparent"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-margin w-full pt-28 pb-space-xl">
            <div className="max-w-2xl text-surface-crisp flex flex-col items-start">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <span className="font-spec-code text-spec-code tracking-[0.25em] uppercase text-primary-fixed-dim">
                  Tuyển Tập Giới Hạn
                </span>
                <span className="text-surface-variant/40 select-none">|</span>
                <span className="font-label-signature italic text-label-signature text-secondary-fixed">
                  Tiết Thu Phân &amp; Thưởng Trà Cổ Điển
                </span>
              </div>

              <h1 className="font-display-hero text-display-hero uppercase text-surface-crisp font-light tracking-[8px] leading-[1.15] mb-space-md">
                THU TRẦM &amp;<br />GỐM MỘC
              </h1>

              <div className="h-0.5 w-16 bg-accent-terracotta mb-space-md"></div>

              <p className="font-body-default text-body-default text-surface-variant font-normal leading-relaxed mb-space-lg max-w-xl">
                Khi gió heo may về trên phố cũ, chén trà ấm cùng chiếc khay mây mộc mạc đưa con người trở về với nhịp thở nguyên sơ của đất trời.
              </p>

              <div className="flex flex-wrap items-center gap-space-md">
                <a
                  href="#tuyen-tap"
                  className="inline-flex items-center justify-center bg-accent-terracotta hover:bg-primary text-surface-crisp font-label-action text-label-action uppercase tracking-[0.18em] px-7 py-3.5 transition-colors shadow-sm"
                >
                  Khám Phá Bộ Sưu Tập
                </a>
                <div className="flex items-center font-spec-code text-spec-code text-surface-variant tracking-[0.12em] uppercase">
                  <span>Đợt nung: 08/2024</span>
                  <span className="mx-3 text-surface-variant/40">|</span>
                  <span>Phiên bản hữu hạn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Callout Block */}
      <section className="w-full max-w-7xl mx-auto px-margin py-space-xl">
        <div className="bg-surface-subtle p-space-lg lg:p-space-xl relative shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-lg">
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <span className="material-symbols-outlined text-accent-terracotta text-[20px]">spa</span>
                <span className="font-spec-code text-spec-code uppercase tracking-[0.2em] text-text-secondary">
                  Triết Lý Chậm &amp; Cốt Cách Đất Nung
                </span>
              </div>
              <blockquote className="font-headline-title text-headline-title text-text-primary font-normal italic leading-snug tracking-tight mb-space-sm">
                “Uống một ngụm trà trong chén gốm mộc nung củi, cảm nhận sự thô ráp chân thật của đất và men rạn tự nhiên. Thủ công không vội vã; mỗi vết nứt men là một câu chuyện của nhiệt độ và thời gian.”
              </blockquote>
              <cite className="font-spec-code text-spec-code uppercase tracking-[0.14em] text-accent-terracotta not-italic block">
                — Ghi chép từ trà thất CraftRoots, Tiết Thu 2024
              </cite>
            </div>
            
            <div className="shrink-0 flex flex-col items-start md:items-end justify-center pl-0 md:pl-space-lg text-text-secondary font-spec-code text-spec-code space-y-1">
              <div className="text-text-primary font-medium tracking-[0.15em] uppercase">Nhiệt độ nung đạt</div>
              <div className="text-[28px] leading-tight font-display-hero font-light text-primary">1250°C</div>
              <div className="text-[11px] tracking-[0.1em] text-text-secondary/80">Lò bầu truyền thống 72 giờ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated 3-Column Sharp Grid */}
      <section className="w-full max-w-7xl mx-auto px-margin pb-space-xl" id="tuyen-tap">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg pb-space-sm">
          <div>
            <div className="flex items-center gap-2 mb-space-xs">
              <span className="h-2 w-2 bg-accent-terracotta"></span>
              <span className="font-spec-code text-spec-code tracking-[0.2em] uppercase text-text-secondary">
                Danh Mục Tuyển Chọn
              </span>
            </div>
            <h2 className="font-headline-title text-headline-title text-text-primary font-semibold tracking-tight uppercase">
              Tác Phẩm Mùa Thu
            </h2>
          </div>
          <div className="flex items-center gap-space-sm mt-space-sm md:mt-0 font-spec-code text-spec-code text-text-secondary">
            <span className="text-text-primary font-semibold">03 Tác phẩm tiêu biểu</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span>Kiểm định văn hóa &amp; niên biểu</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {SEASONAL_ITEMS.map((item) => {
            const isSaved = savedItems.some((s) => s.id === item.id);
            return (
              <article
                key={item.id}
                className="group bg-surface-crisp flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-text-primary text-surface-crisp font-spec-code text-[10px] tracking-[0.15em] uppercase px-2.5 py-1">
                    {item.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-canvas-linen/90 backdrop-blur-sm text-text-primary font-spec-code text-spec-code px-2 py-0.5 shadow-sm">
                    {item.ref}
                  </div>
                </div>

                <div className="p-space-lg flex flex-col flex-1 justify-between bg-surface-crisp">
                  <div>
                    <div className="flex items-center font-spec-code text-spec-code text-text-secondary tracking-[0.1em] uppercase mb-space-xs">
                      <span>{item.region}</span>
                      <span className="mx-2 text-border-neutral opacity-60">|</span>
                      <span>{item.artisan}</span>
                    </div>
                    <Link to={`/crafts/${item.craftId}`}>
                      <h3 className="font-title-card text-title-card text-text-primary font-medium tracking-tight mb-space-xs group-hover:text-accent-terracotta transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed mb-space-md">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-space-md bg-surface-subtle/40 -mx-space-lg -mb-space-lg p-space-lg flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-spec-code text-[11px] uppercase tracking-[0.12em] text-text-secondary">
                        Định Giá Lưu Trữ
                      </span>
                      <span className="font-headline-title text-headline-title text-text-primary font-semibold">
                        {item.price}{' '}
                        <span className="text-body-spec font-normal text-text-secondary">
                          {item.unit}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSave(item)}
                      className={`w-10 h-10 flex items-center justify-center transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-accent-terracotta text-surface-crisp'
                          : 'bg-text-primary hover:bg-accent-terracotta text-surface-crisp'
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
      <section className="w-full bg-surface-subtle py-space-xl">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-xl">
            <span className="font-spec-code text-spec-code uppercase tracking-[0.25em] text-accent-terracotta mb-space-xs">
              Hành Trình Của Đất &amp; Lá
            </span>
            <h2 className="font-headline-statement text-headline-statement font-light uppercase text-text-primary tracking-[0.2em]">
              QUY TRÌNH THỰC HIỆN MÙA THU: TỪ NÚI CAO VỀ BÀN TRÀ
            </h2>
            <div className="h-0.5 w-12 bg-border-neutral mt-space-sm"></div>
          </div>

          {/* 3-Step Process Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter relative">
            {/* Step 1 */}
            <div className="bg-surface-crisp p-space-lg flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-display-hero text-[36px] leading-none font-light text-accent-terracotta">
                    01
                  </span>
                  <span className="font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
                    Giai Đoạn I
                  </span>
                </div>
                <h3 className="font-title-card text-title-card text-text-primary font-medium mb-space-xs">
                  Thu Hái Búp Chè
                </h3>
                <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                  Những búp chè Shan Tuyết một tôm hai lá phủ lớp nhung trắng được đồng bào Dao đỏ thu hái khi sương sớm còn đọng trên chóp lá, giữ trọn vị chát thanh dịu ngọt hậu của núi rừng.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.1em]">
                <span>Độ cao: 1.400m</span>
                <span className="mx-2 text-border-neutral opacity-60">|</span>
                <span>Tiết Thu phân</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-crisp p-space-lg flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-display-hero text-[36px] leading-none font-light text-primary">
                    02
                  </span>
                  <span className="font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
                    Giai Đoạn II
                  </span>
                </div>
                <h3 className="font-title-card text-title-card text-text-primary font-medium mb-space-xs">
                  Ủ Men Tro &amp; Luyện Đất
                </h3>
                <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                  Đất sa thạch sông Hồng ủ đầm trong hầm sâu qua 3 mùa mưa nắng để đạt độ dẻo mịn tối đa. Men tro rơm nếp cổ truyền được nghiền mịn thủ công, phủ mỏng để tương tác cùng ngọn lửa lò củi.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.1em]">
                <span>Men tro tự nhiên</span>
                <span className="mx-2 text-border-neutral opacity-60">|</span>
                <span>Khử oxy 1250°C</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-crisp p-space-lg flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-display-hero text-[36px] leading-none font-light text-accent-terracotta">
                    03
                  </span>
                  <span className="font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
                    Giai Đoạn III
                  </span>
                </div>
                <h3 className="font-title-card text-title-card text-text-primary font-medium mb-space-xs">
                  Hoàn Thiện Tại Xưởng
                </h3>
                <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                  Mỗi ấm chén sau khi ra lò được mài phẳng đáy bằng đá suối, kiểm tra tiếng chuông ngân và ghép bộ tương hợp cùng khay mây tre đan tay trước khi lưu kho di sản CraftRoots.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center font-spec-code text-[11px] text-text-secondary uppercase tracking-[0.1em]">
                <span>Nghiệm thu thủ công</span>
                <span className="mx-2 text-border-neutral opacity-60">|</span>
                <span>Chứng thư xuất xưởng</span>
              </div>
            </div>
          </div>

          {/* Workshop Metadata Bar */}
          <div className="mt-space-lg bg-surface-crisp p-4 border border-border-neutral flex flex-col md:flex-row items-center justify-between shadow-sm text-text-secondary font-body-spec text-[12px]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">verified</span>
              <span className="uppercase tracking-[0.1em] text-text-primary font-semibold">
                Quy Chuẩn Giám Tuyển Văn Hóa:
              </span>
              <span>Bảo toàn 100% nguyên liệu tự nhiên bản địa Việt Nam</span>
            </div>
            <div className="flex items-center gap-3 mt-2 md:mt-0 uppercase tracking-[0.12em] font-spec-code text-[11px]">
              <span>Mã lưu trữ: CR-AUTUMN-24</span>
              <span className="text-border-neutral opacity-60">|</span>
              <Link to="/crafts" className="text-accent-terracotta hover:underline font-medium">
                Khám phá danh mục di sản →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
