---
name: CraftRoots
colors:
  surface: '#fdf8f6'
  surface-dim: '#ddd9d7'
  surface-bright: '#fdf8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f0'
  surface-container: '#f2edeb'
  surface-container-high: '#ece7e5'
  surface-container-highest: '#e6e2df'
  on-surface: '#1c1b1a'
  on-surface-variant: '#54433a'
  inverse-surface: '#31302f'
  inverse-on-surface: '#f4f0ee'
  outline: '#867368'
  outline-variant: '#d9c2b5'
  surface-tint: '#914c18'
  primary: '#8e4a16'
  on-primary: '#ffffff'
  primary-container: '#ac612c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb689'
  secondary: '#605e5a'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2dc'
  on-secondary-container: '#666460'
  tertiary: '#006670'
  on-tertiary: '#ffffff'
  tertiary-container: '#00818d'
  on-tertiary-container: '#f6feff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc7'
  primary-fixed-dim: '#ffb689'
  on-primary-fixed: '#311300'
  on-primary-fixed-variant: '#733500'
  secondary-fixed: '#e6e2dc'
  secondary-fixed-dim: '#cac6c1'
  on-secondary-fixed: '#1c1b18'
  on-secondary-fixed-variant: '#484743'
  tertiary-fixed: '#90f1ff'
  tertiary-fixed-dim: '#6ed5e3'
  on-tertiary-fixed: '#001f23'
  on-tertiary-fixed-variant: '#004f57'
  background: '#fdf8f6'
  on-background: '#1c1b1a'
  surface-variant: '#e6e2df'
  canvas-linen: '#F9F8F6'
  surface-crisp: '#FFFFFF'
  surface-subtle: '#F4F2EE'
  border-neutral: '#E6E2DA'
  text-primary: '#1C1B1A'
  text-secondary: '#5A5854'
  accent-terracotta: '#B86B35'
  overlay-backdrop: 'rgba(28, 27, 26, 0.60)'
typography:
  display-hero:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '300'
    lineHeight: 56px
    letterSpacing: 0.3em
  display-hero-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '300'
    lineHeight: 36px
    letterSpacing: 0.2em
  headline-statement:
    fontFamily: Montserrat
    fontSize: 22px
    fontWeight: '300'
    lineHeight: 32px
    letterSpacing: 0.25em
  headline-title:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.02em
  title-card:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-default:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-spec:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.02em
  spec-code:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.06em
  label-signature:
    fontFamily: Playfair Display
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.04em
  label-action:
    fontFamily: Montserrat
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.15em
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  modal-max-width: 1040px
elevation:
  modal-shadow: '0 12px 24px rgba(0, 0, 0, 0.08)'
motion:
  modal-transition-duration: 250ms
  modal-slide-distance: 16px
z-index:
  backdrop: 50
  modal: 60
---

# Human-Crafted Sharp Linework Design System - CraftRoots

## Foundations
- **Color Palette**:
  - Background Canvas: Linen White `#F9F8F6`
  - Secondary Surface / Containers: Pure Crisp Linen `#FFFFFF` or `#F4F2EE`
  - Text Primary: Ink Black `#1C1B1A`
  - Text Secondary: Muted Slate / Charcoal `#5A5854`
  - Brand Accent: Terracotta Warm Rust `#B86B35`
  - Neutral Borders & Lines: `#E6E2DA`
  - Active / Highlight: Terracotta `#B86B35`
- **Border Radii**: 
  - Containers & Cards: `0px` to `2px` (strictly sharp and geometric, no bubbly 20px+ radii)
  - Inputs & Badges: `50px` (clean minimal pill shape where explicitly required)
- **Delimiters**: Vertical pipe separator `|` with opacity `0.35` and `16px` lateral margins (`.choice-item:not(:last-child)::after { content: "|"; margin: 0 16px; opacity: 0.35; font-weight: 300; }`).
- **Elevation**: Flat default with crisp 1px borders (`#E6E2DA`); On hover, crisp vertical lift `translateY(-6px)` to `translateY(-8px)` and grounded shadow `box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08)`.

## Typography
- **Monogram / Brand Touch**: Script / Cursive (`Great Vibes`, `Playfair Display`, or serif italic), refined artisan signature feel.
- **Statement Headlines**: Clean Geometric Sans-serif (`Montserrat` or `Inter`), Uppercase, Weight 200 - 300, Letter-spacing: `4px` - `8px`.
- **Card Titles & Values**: High-contrast Serif or Sans, Medium/Semi-bold, 18px - 24px.
- **Technical Specifications**: Muted Charcoal, 12px - 14px, Line-height 1.6, concrete metrics, Ref/SKU codes, real materials (đất sét cao lanh, đồng thau, tre tự nhiên, men tro củi nung 1300°C).

## Component Disciplines
- **Anti-AI Content**: Strict realistic Vietnamese cultural craft data, verified village origins, genuine master craftsman profiles, exact physical dimensions and materials, no filler or generic marketing hype.
- **Choice Boundaries**: Explicit separation using `|` pipe dividers for menus, tabs, and action icons.
- **Sharp Cards**: Crisp rectangular containers, geometric aspect ratios, object-fit cover imagery.

## Artisan Detail Popup

### 3.1 Trigger & hành vi
- **Kích hoạt mở popup**: Người dùng bấm vào bất kỳ vị trí nào trên thẻ `<article>` (toàn bộ diện tích thẻ, không giới hạn ở liên kết "Xem Hồ Sơ"). Con trỏ chuột chuyển sang `cursor: pointer`. Thẻ `<article>` bổ sung các thuộc tính trợ năng `role="button"`, `tabindex="0"`, cho phép người dùng kích hoạt mở popup trực tiếp bằng phím `Enter` hoặc `Space`.
- **Hiệu ứng hover thẻ gốc**: Giữ nguyên trạng thái tương tác visual của thẻ khi hover: nâng nhẹ theo trục đứng `transform: translateY(-8px)` (hoặc `-translate-y-2`), đổi màu viền sang Terracotta Warm Rust `border-color: #B86B35`, kết hợp bóng đổ nổi bật `box-shadow: 0 16px 36px rgba(28, 27, 26, 0.12)`.
- **Hành vi đóng modal**:
  - Hỗ trợ 3 phương thức đóng:
    1. Nhấp chuột vào nút đóng "X" (`close` icon ở góc trên container).
    2. Nhấp chuột vào lớp phủ nền backdrop mờ bên ngoài hộp thoại.
    3. Nhấn phím `Escape` (`Esc`) trên bàn phím.
  - Khi popup đóng lại, hệ thống tự động trả tiêu điểm (focus return) về đúng thẻ `<article>` vừa kích hoạt mở trước đó để bảo đảm mạch trải nghiệm liên tục của người dùng.
- **Quản lý cuộn trang & Focus Trap**:
  - Khóa cuộn trang nền (`overflow: hidden` trên thẻ `body`) khi popup hiển thị để ngăn hiện tượng cuộn kép ngoài ý muốn.
  - Thiết lập bẫy tiêu điểm (focus trap) giữ phím `Tab` và `Shift+Tab` tuần hoàn bên trong popup trong suốt thời gian mở.
  - Khai báo thuộc tính trợ năng trên hộp thoại: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="artisan-popup-title"` (trỏ tới `id` của tiêu đề tên nghệ nhân), `aria-describedby="artisan-popup-desc"` (trỏ tới dòng chức danh, niên đại và kỹ pháp).
- **Chuyển đổi tuần tự Trước / Sau**:
  - Tích hợp cụm điều hướng chuyển tiếp tuần hoàn giữa 6 nghệ nhân trong danh sách hiển thị:
    - Định dạng nhãn hiển thị: `← #01 | #03 →` (ví dụ khi đang duyệt hồ sơ của nghệ nhân `#02`).
    - Tuân thủ quy chuẩn ký tự phân cách pipe `|` (`font-weight: 300`, opacity `0.35` – `0.4`, khoảng đệm hai bên `12px` – `16px`).
    - Cho phép điều hướng nhanh bằng phím mũi tên trái `ArrowLeft` (hồ sơ trước) và mũi tên phải `ArrowRight` (hồ sơ tiếp theo).
- **Đồng bộ liên kết URL & Deep Linking (Hash Sync)**:
  - Tự động cập nhật hash trên thanh địa chỉ URL khi popup mở theo cú pháp: `#nghe-nhan/{ref}` (ví dụ: `#nghe-nhan/ART-BT-001`).
  - Hash được cập nhật đồng bộ mỗi khi người dùng bấm chuyển nghệ nhân Trước / Sau (`history.replaceState` hoặc cập nhật `window.location.hash`).
  - Khi đóng popup, hash được dọn dẹp để trả về URL trang danh sách hiện hành.
  - Khi người dùng truy cập trực tiếp đường link có chứa hash hợp lệ, hệ thống tự động nhận diện tham số và kích hoạt mở đúng popup của nghệ nhân đó ngay khi tải trang xong.

### 3.2 Layout & visual
- **Lớp phủ nền (Backdrop)**:
  - Màu nền: Sử dụng màu sắc thương hiệu `text-primary` (`#1C1B1A`) với độ mờ opacity ~`60%` (`rgba(28, 27, 26, 0.60)`).
  - Hiệu ứng kính mờ: Kết hợp `backdrop-filter: blur(8px)` tương đồng với ngăn kéo điều hướng (drawer navigation) hiện có trên giao diện.
  - Vị trí: `fixed inset-0 z-50` che phủ toàn bộ viewport.
- **Hộp chứa nội dung (Container)**:
  - Nền: Màu trắng thuần khiết `surface-crisp` (`#FFFFFF`).
  - Viền: Đường nét sắc cạnh `1px solid #E6E2DA` (`border-neutral`).
  - Bán kính góc bo: Nghiêm ngặt từ `0px` đến `2px` (`rounded-none` đến `rounded-sm`), tuyệt đối tuân thủ triết lý Sharp Linework (không sử dụng góc bo mềm `16px` – `24px` dạng bubble hiện đại).
  - Đổ bóng: Tầng bóng đổ chiều sâu `box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08)`.
  - Giới hạn kích thước: Chiều cao tối đa `calc(100vh - 4rem)` (khoảng `90vh`) trên desktop, có phân vùng cuộn riêng biệt.
- **Bố cục đa thiết bị (Responsive Layout)**:
  - **Desktop (≥ 1024px)**:
    - Độ rộng tối đa: `max-w-[1040px]` (`~1040px`), căn giữa màn hình theo cả hai trục.
    - Cấu trúc 2 cột bất đối xứng tỷ lệ 5/12 và 7/12:
      - **Cột trái (~5/12 - 41.67%)**: Khối hình ảnh chân dung nghệ nhân chiều cao đầy đủ (full height). Mặc định hiển thị hiệu ứng đơn sắc cổ kính (`grayscale contrast-[1.05]`) và tự động chuyển sang màu sắc nguyên bản chân thực kèm độ phóng nhẹ (`grayscale-0 scale-102`) khi tương tác hover chuột. Cột ảnh được phủ lớp gradient tối (`from-black/95 via-black/60 to-transparent`) bảo vệ độ tương phản chữ; hiển thị ghim cố định các thông số định danh: Mã lưu trữ `REF: ART-BT-001`, số thứ tự ma trận `#01`, và nhãn phân ngành nghề truyền thống.
      - **Cột phải (~7/12 - 58.33%)**: Khối nội dung hồ sơ chuyên sâu, phân cách với cột ảnh bằng đường kẻ dọc `border-l border-border-neutral`, padding thoải mái `p-6 md:p-8`, hỗ trợ vùng cuộn dọc độc lập (`overflow-y-auto max-h-[85vh]`).
  - **Mobile (< 768px)**:
    - Chế độ hiển thị toàn màn hình: `inset-0 w-full h-full min-h-screen rounded-none max-w-none`.
    - Bố cục 1 cột cuộn dọc duy nhất (`overflow-y-auto` toàn màn hình).
    - Cụm ảnh chân dung đặt ở phần đầu trang (tỷ lệ `aspect-[4/3]` hoặc `aspect-[16/9]`), có dải gradient tối để hiển thị tên và mã REF.
    - Nút đóng "X" cố định ở góc trên bên phải (`fixed top-3 right-3 z-30`), kích thước vùng bấm tối thiểu `44px × 44px` với nền kính mờ `bg-surface-crisp/80 backdrop-blur-md` hoặc nút tròn tối màu có viền để đảm bảo luôn dễ chạm và nổi bật trên mọi nền ảnh.
- **Hiệu ứng chuyển động (Motion & Animation)**:
  - Trạng thái mở vào: Backdrop chuyển tiếp mờ dần (`opacity: 0 → 1`), Container kết hợp trượt nhẹ lên từ dưới `16px` (`transform: translateY(16px) → translateY(0)`) và tăng dần độ mờ (`opacity: 0 → 1`) trong thời lượng chuẩn `250ms`, gia tốc `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Hỗ trợ giảm chuyển động: Tuân thủ truy vấn phương tiện `@media (prefers-reduced-motion: reduce)`: vô hiệu hóa toàn bộ chuyển dịch `translateY`, chuyển đổi tức thời hoặc chỉ làm mờ dần với thời lượng rút ngắn `100ms`.

### 3.3 Cấu trúc nội dung (thứ tự từ trên xuống)
Hồ sơ chi tiết bên trong cột nội dung được tổ chức chặt chẽ theo thứ tự phân cấp thông tin từ trên xuống dưới gồm 9 phân mục chuẩn mực:
- **a. Breadcrumb điều hướng nhỏ có pipe delimiter**:
  - Cú pháp: `Nghệ Nhân Ưu Tú | <Tên Lĩnh Vực Nghề> | <Làng Nghề, Tỉnh Thành>`
  - Typography: `font-spec-code`, kích thước `11px`, `uppercase`, `tracking-[0.18em]`, màu `text-secondary`, ký tự pipe `|` màu `border-neutral` với opacity `0.6`.
- **b. Tên nghệ nhân & Dòng chức danh**:
  - Tên nghệ nhân: `font-headline-title` (`Playfair Display`, `24px` – `28px`, `font-weight: 600`, màu `text-primary`, `leading-tight`).
  - Dòng chức danh • tuổi: Nằm ngay dưới tên, hiển thị chức vụ/danh hiệu và độ tuổi: `Chức Danh • Tuổi (Kỹ pháp chuyên sâu)`, định dạng `font-spec-code`, `12px` – `13px`, màu `accent-terracotta` hoặc `text-secondary`.
- **c. Hàng huy hiệu định danh (Badges Row)**:
  - Tái sử dụng đồng bộ cấu trúc và phong cách huy hiệu trên thẻ ma trận:
    - Badge thâm niên: Nền màu đất nung `bg-accent-terracotta text-surface-crisp font-spec-code text-[10px] uppercase px-2.5 py-0.5 tracking-wider font-medium` (ví dụ: `50 Năm Nghề`).
    - Badge thế hệ truyền thừa: Nền sáng viền mảnh `bg-surface-subtle text-text-primary border border-border-neutral font-spec-code text-[10px] uppercase px-2 py-0.5 tracking-wider font-semibold` (ví dụ: `Đời Thứ 6`).
    - Badge chứng thực di sản: Khung xác thực `bg-surface-subtle text-accent-terracotta border border-accent-terracotta/40 font-spec-code text-[10px] uppercase px-2 py-0.5 tracking-wider font-semibold flex items-center gap-1` (ví dụ: `Di Sản Quốc Gia`).
- **d. Lời trích dẫn triết lý nghề (Artisan Quote)**:
  - Trích dẫn câu nói tâm huyết của nghệ nhân về bí quyết và tâm thức nghề:
    - Typography: `font-label-signature` (`Playfair Display`, chữ nghiêng `italic`, kích thước `14px` – `15px`, `leading-relaxed`, màu `text-primary`).
    - Trình bày viền: Đường kẻ dọc bên trái nổi bật `border-l-2 border-accent-terracotta`, khoảng đệm lề trái `pl-4 py-2.5 pr-2`, nền nhẹ trang nhã `bg-surface-subtle/50`.
- **e. Thân Thế & Hành Trình (Biography & Historical Timeline)**:
  - Tiêu đề mục: `font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold` kết hợp dấu chấm vuông thương hiệu.
  - Đoạn văn tiểu sử ngắn: `font-body-default text-[14px] text-text-secondary leading-relaxed` tóm lược nguồn cội, truyền thống gia đình và con đường gắn bó với lửa nghề.
  - Niên biểu mốc son (Timeline): Danh sách dọc các sự kiện lịch sử nghề nghiệp; mỗi mốc phân tách bằng ký tự pipe: `<Năm> | <Dấu ấn sự kiện / Kỹ pháp phục dựng>` (ví dụ: `1974 | Khởi sự học việc tạo cốt đất lò bầu` ; `1992 | Phục dựng thành công công thức men rạn lam thời Lê`).
- **f. Kỹ Pháp Đặc Trưng (Signature Craftsmanship & Technical Specs Table)**:
  - Đoạn tóm tắt kỹ thuật: Mô tả tri thức bản địa, độ khắt khe trong chọn lọc nguyên liệu và thao tác tinh xảo.
  - Bảng thông số kỹ thuật (Specs Table): Thiết kế bảng 2 cột tối giản, đường kẻ ngang phân tách các dòng `1px solid #E6E2DA`:
    - Cột thông số: `font-spec-code text-[11px] text-text-secondary uppercase tracking-wider`.
    - Cột giá trị thực tế: `font-body-spec text-[13px] text-text-primary font-medium`.
    - Các trường cụ thể: Vật liệu cốt lõi, Kỹ thuật men / Xử lý bề mặt, Nhiệt độ & Lò nung, Thời gian chế tác hoàn thiện, Kỹ pháp đặc trưng độc bản.
- **g. Tác Phẩm Tiêu Biểu (Masterworks Showcase)**:
  - Tuyển tập 2–4 tác phẩm tiêu biểu mang dấu ấn đỉnh cao của nghệ nhân.
  - Mỗi tác phẩm được trình bày trong khung chữ nhật chỉn chu gồm: Tên tác phẩm (`font-headline-title text-[15px] font-semibold`), Kích thước quy chuẩn, Chất liệu chế tác nguyên bản, Niên đại tạo tác, và Mã phân loại SKU/Ref lưu trữ.
- **h. Khối "Ghé Thăm Xưởng & Gặp Gỡ Bậc Thầy" (Workshop Protocol)**:
  - Đồng bộ trọn vẹn thông điệp và mỹ cảm từ section `#dat-lich` của trang chủ:
    - Tiêu đề phụ: Biểu tượng `local_cafe` cùng dòng chữ `font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold`: `QUY TRÌNH GẶP GỠ NGHỆ NHÂN TIỀN BỐI`.
    - Nội dung giới hạn: Ghi rõ quy định tôn trọng không gian sáng tạo của nghệ nhân: xưởng tiếp tối đa 06 khách/buổi, yêu cầu đặt lịch hẹn trước 48 giờ để điều phối viên bản địa chuẩn bị.
    - Bộ đôi nút hành động chuẩn:
      - Nút chính (Hotline): `Hotline Điều Phối: 0988.246.810` (nền `bg-text-primary text-surface-crisp hover:bg-accent-terracotta font-label-action text-[11px] uppercase tracking-[0.18em] py-3 px-5 text-center transition-colors`).
      - Nút thứ cấp (Gửi thư): `Gửi Hồ Sơ Yêu Cầu Ghé Thăm` (nền `bg-surface-crisp border border-text-primary hover:bg-canvas-linen text-text-primary font-label-action text-[11px] uppercase tracking-[0.18em] py-3 px-5 text-center transition-colors`).
- **i. Chân trang Popup (Popup Footer Actions)**:
  - Dải hành động dưới cùng phân cách bằng đường viền trên `border-t border-border-neutral pt-4 mt-6 flex items-center justify-between font-label-action text-[11px] tracking-[0.15em] uppercase text-text-secondary`:
    - Nút "Lưu Hồ Sơ" (icon bookmark, chuyển đổi trạng thái đã lưu vào danh mục yêu thích cá nhân).
    - Phân cách pipe `|`.
    - Nút "Chia Sẻ" (sao chép liên kết có chứa mã hash định danh vào clipboard).
    - Phân cách pipe `|`.
    - Nút "Đóng" (cho phép đóng nhanh popup bằng văn bản).

### 3.4 Data model
Cấu trúc dữ liệu JSON quy chuẩn cho một nghệ nhân (áp dụng mẫu thực tế của Bậc thầy gốm Nguyễn Văn Bình, mã lưu trữ `ART-BT-001`):

```json
{
  "ref": "ART-BT-001",
  "slug": "nguyen-van-binh",
  "name": "Nguyễn Văn Bình",
  "craft": "Gốm Sa Thạch Men Rạn",
  "village": "Bát Tràng",
  "district": "Gia Lâm",
  "province": "Hà Nội",
  "age": 72,
  "title": "Bậc thầy lò bầu • Nghệ nhân Ưu tú",
  "yearsInCraft": 50,
  "generation": 6,
  "quote": "Đất sét phải ủ ba mùa mưa nắng, men tro nung củi gỗ dâu mới ra được đường rạn của thời gian.",
  "portrait": {
    "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuCsI9aPyBln6KwNTduyuzUQsX3URliV1Lme3MJ-LRjuusu4bzRy8Pg1p4qxcQ20-bV982DIaUPJeSYINYU3RqJQr402-Fg4v9teM9X_SOYh5i4sV9_nm-K-QRB0kom3klpQBV5PHVsgpUuay47yNjVhkwP-9zcQ4vxT9Top5WXmRIElWWrk5aYrLmODShqcU1RgRAYGUCWARylylg4Sh4NR0wxLI2f7AFUlG34agHAgtokI1OJFalxJ",
    "alt": "Chân dung nghệ nhân gốm sứ Nguyễn Văn Bình 72 tuổi bên bàn xoay gốm lò bầu Bát Tràng"
  },
  "bio": "Hơn nửa thế kỷ gắn liền với ngọn lửa lò bầu Bát Tràng, nghệ nhân Nguyễn Văn Bình là một trong số ít bậc thầy còn nắm giữ trọn vẹn kỹ pháp chế tác men rạn lam thời Lê trung hưng. Sinh ra trong gia tộc có 6 đời truyền thừa nghề gốm, ông dành trọn cuộc đời gìn giữ kỹ thuật nung củi gỗ dâu tự nhiên ở nhiệt độ 1.300°C và bí quyết luyện cốt đất sa thạch trầm tích sông Hồng.",
  "timeline": [
    {
      "year": "1974",
      "event": "Tiếp quản bàn xoay gốm lò bầu gia tộc đời thứ 6 tại xóm 1 làng Bát Tràng."
    },
    {
      "year": "1992",
      "event": "Phục chế thành công công thức men rạn lam cổ thời Lê sau 18 năm thất truyền."
    },
    {
      "year": "2010",
      "event": "Được nhà nước phong tặng danh hiệu Nghệ nhân Ưu tú ngành gốm sứ truyền thống [CẦN XÁC MINH: Số quyết định và cơ quan ký duyệt]."
    },
    {
      "year": "2024",
      "event": "Chủ trì chương trình tư liệu hóa kỹ pháp chế tác men tro củi cùng CraftRoots."
    }
  ],
  "technique": {
    "summary": "Kỹ pháp luyện đất sét phù sa sông Hồng ủ tối thiểu 36 tháng, chuốt gốm hoàn toàn bằng tay trên bàn xoay gỗ, phủ men tro củi dâu tự nhiên và nung lò bầu liên tục 72 giờ ở 1.300°C.",
    "specs": [
      {
        "label": "Vật liệu cốt gốm",
        "value": "Đất sét sa thạch cao lanh sông Hồng (ủ phong hóa 36 tháng)"
      },
      {
        "label": "Kỹ thuật men",
        "value": "Men rạn tro trấu kết hợp tro củi gỗ dâu rừng nguyên chất"
      },
      {
        "label": "Nhiệt độ & Lò nung",
        "value": "1.280°C – 1.300°C (Lò bầu nung củi truyền thống 3 ngày 3 đêm)"
      },
      {
        "label": "Thời gian tạo tác",
        "value": "45 – 60 ngày/tác phẩm (từ nhào cốt đến hạ lò hoàn thiện)"
      },
      {
        "label": "Kỹ pháp đặc trưng",
        "value": "Vẽ lam chìm dưới men, rạn tam cấp tự nhiên theo độ co ngót nhiệt"
      }
    ]
  },
  "works": [
    {
      "id": "W-BT-001",
      "name": "Bình vôi men rạn cổ thế kỷ XVIII",
      "dimensions": "Cao 38cm × Đường kính 26cm",
      "material": "Gốm sa thạch men rạn lam triều Lê",
      "year": "2024",
      "sku": "CR-BT-MS-01"
    },
    {
      "id": "W-BT-002",
      "name": "Chóe thờ men rạn họa tiết Tứ Linh",
      "dimensions": "Cao 52cm × Đường kính 32cm",
      "material": "Đất sét cao lanh nung củi 1.300°C",
      "year": "2023",
      "sku": "CR-BT-MS-02"
    },
    {
      "id": "W-BT-003",
      "name": "Đĩa cảnh vẽ lam men tro củi nếp",
      "dimensions": "Đường kính 42cm",
      "material": "Men tro trấu Bát Tràng cổ",
      "year": "2024",
      "sku": "CR-BT-MS-03"
    }
  ],
  "visit": {
    "maxGuests": 6,
    "leadTimeHours": 48,
    "address": "Thôn 1 Bát Tràng, Huyện Gia Lâm, Hà Nội"
  },
  "verification": "XÁC THỰC: DI SẢN QUỐC GIA (Hồ sơ chứng thực 100%)"
}
```

- **Phân loại thuộc tính (Field Specifications)**:
  - **Trường bắt buộc (Required)**: `ref`, `slug`, `name`, `craft`, `village`, `district`, `province`, `title`, `yearsInCraft`, `generation`, `quote`, `portrait` (gồm `src`, `alt`), `verification`. Các trường này phải luôn có dữ liệu hợp lệ để bảo đảm cấu trúc nhận diện cốt lõi của nghệ nhân.
  - **Trường tùy chọn (Optional)**: `age`, `bio`, `timeline`, `technique` (gồm `summary`, `specs`), `works`, `visit` (gồm `maxGuests`, `leadTimeHours`, `address`).
- **Quy tắc hiển thị linh hoạt (Graceful Degradation)**:
  - Khi một trường tùy chọn mang giá trị `null`, `undefined` hoặc mảng rỗng `[]`, component popup bắt buộc phải tự động ẩn hoàn toàn khối giao diện (section) tương ứng, không được hiển thị vùng nội dung trống, không chừa khoảng trắng đệm bất thường, và tuyệt đối không in ra các ký tự mặc định như "undefined" hay "null".

### 3.5 Ràng buộc nội dung (giữ đúng nguyên tắc "Anti-AI Content")
- **Nguyên tắc không hư cấu dữ liệu (Zero Fabrication Rule)**:
  - Mọi thông tin định danh khởi tạo phải xuất phát 100% từ dữ liệu thực tế đã có trên thẻ article của trang danh sách.
  - Tuyệt đối không tự suy đoán hoặc sáng tác thêm các giải thưởng ảo, ngày tháng năm sinh chính xác, huân huy chương chưa có xác nhận từ cơ quan quản lý di sản.
  - Đối với các thông tin mở rộng cần thiết nhưng chưa có số liệu chứng thực từ hồ sơ điền dã thực địa, bắt buộc ghi rõ placeholder quy chuẩn: `[CẦN XÁC MINH]` kèm chỉ dẫn nguồn dữ liệu cụ thể cần đối soát (ví dụ: `[CẦN XÁC MINH: Quyết định phong tặng Nghệ nhân Ưu tú của Bộ VHTTDL]`, `[CẦN XÁC MINH: Niên giám gia phả làng nghề Bát Tràng]`).
- **Sử dụng thuật ngữ nghề truyền thống chân thực (Authentic Vernacular Terminology)**:
  - Toàn bộ nội dung mô tả kỹ thuật phải sử dụng đúng tên gọi cổ truyền và thuật ngữ chuyên ngành của nghệ nhân Việt Nam: men rạn, men tro củi nung 1300°C, lò bầu, lò rồng, đất sét cao lanh sa thạch, sơn then, sơn cánh gián, mài nước, cẩn vỏ trứng vịt, dát vàng quỳ, khung dệt Jacquard, tơ tằm nhả hạt, lụa Vân mây, nan mây chuốt tơ, chạm thúc gò đồng bạc, hoa văn Tứ Linh, dệt ikat Chăm...
  - Ngôn ngữ thể hiện bằng tiếng Việt chuẩn ngữ pháp, đầy đủ dấu thanh điệu, tuyệt đối không dịch máy cẩu thả hay dùng từ ngữ lai căng.
- **Văn phong tư liệu hóa điền dã (Archival Ethnographic Tone)**:
  - Tuyệt đối loại bỏ các từ ngữ quảng cáo thương mại hóa, sáo rỗng hoặc phóng đại ("tuyệt tác vô tiền khoáng hậu", "đỉnh cao sang trọng", "hoàn hảo không tì vết").
  - Duy trì giọng văn điềm đạm, trang trọng, tôn vinh công sức lao động thủ công và tâm thức gìn giữ văn hóa truyền thống của bậc thầy di sản.

### 3.6 Responsive & accessibility checklist
- **Bảng kiểm điểm Breakpoints**:
  - `Mobile (< 768px)`: Bố cục 1 cột toàn màn hình (`h-full w-full inset-0 rounded-none`), ảnh chân dung nằm phía trên, nút đóng X cố định ở góc trên, cuộn nội dung tự nhiên theo trục dọc.
  - `Tablet (768px – 1023px)`: Hộp chứa căn giữa màn hình, chiều rộng `max-w-2xl`, tối ưu khoảng đệm nội dung `p-6`.
  - `Desktop (≥ 1024px)`: Bố cục 2 cột bất đối xứng tỷ lệ 5/12 (cột ảnh full-height có ghim nhãn di sản) và 7/12 (cột nội dung cuộn riêng biệt), chiều rộng tối đa `1040px`, chiều cao tối đa `calc(100vh - 4rem)`.
- **Kích thước vùng chạm tương tác (Touch Target Size)**:
  - Mọi nút bấm và phần tử có thể nhấp (nút đóng X, nút mũi tên Trước/Sau, nút Hotline, nút Gửi hồ sơ, nút Lưu, nút Chia sẻ) phải có kích thước vùng chạm thực tế tối thiểu `44px × 44px` trên màn hình cảm ứng (đạt chuẩn WCAG 2.5.5 Target Size).
- **Độ tương phản thị giác (Color Contrast & Legibility)**:
  - Lớp văn bản phủ trên hình ảnh chân dung nghệ nhân bắt buộc phải có lớp chuyển màu tối bảo vệ (`bg-gradient-to-t from-black/95 via-black/60 to-black/40`), bảo đảm tỷ lệ tương phản chữ đạt tối thiểu `4.5:1` đối với chữ thông thường và `3:1` đối với chữ cỡ lớn theo chuẩn WCAG 2.1 cấp độ AA.
  - Đường viền ngăn cách `#E6E2DA` trên nền trắng `#FFFFFF` bảo đảm độ tương phản phân định vùng chứa rõ nét.
- **Thứ tự điều hướng bàn phím & Focus Trap (Keyboard Navigation & Focus Trap)**:
  - Khi mở popup: Tiêu điểm bàn phím tự động chuyển ngay vào phần tử đầu tiên có thể tương tác (nút đóng X hoặc chính hộp thoại modal).
  - Phím `Tab` và `Shift+Tab` bị bẫy tuần hoàn bên trong popup, không lọt ra ngoài nền trang bên dưới.
  - Khi đóng popup (bằng phím `Escape`, nút đóng hoặc bấm ra ngoài): Tiêu điểm bàn phím tự động trả về đúng thẻ `<article>` nghệ nhân ban đầu.
- **Gắn nhãn hỗ trợ công nghệ đọc màn hình (Screen Reader & ARIA Semantics)**:
  - Container chính: Khai báo đầy đủ `role="dialog"`, `aria-modal="true"`, `aria-labelledby="artisan-popup-title"`, `aria-describedby="artisan-popup-desc"`.
  - Nút biểu tượng (icon-only buttons): Toàn bộ nút biểu tượng phải có thuộc tính `aria-label` minh bạch ngữ nghĩa (ví dụ: `aria-label="Đóng cửa sổ chi tiết nghệ nhân"`, `aria-label="Xem nghệ nhân tiếp theo: #03"`, `aria-label="Lưu hồ sơ nghệ nhân vào mục yêu thích"`).
  - Hình ảnh chân dung & tác phẩm: Mọi thẻ `<img>` phải có thuộc tính `alt` mô tả chân thực nội dung hình ảnh, tuyệt đối không để trống hoặc đặt văn bản vô nghĩa.

---

## 4. Đặc tả Popup Trang Chi Tiết Vùng Văn Hóa Làng Nghề (Region Detail Modal Specification)

### 4.1 Bối cảnh & Mục tiêu Kiến trúc UX
- **Vấn đề bản đồ cũ**: Khung hiển thị cố định side panel 420px bên phải thu hẹp diện tích canvas bản đồ, làm dải đất chữ S và biển đảo bị dồn ép sang một bên và gây lỗi tràn padding âm khi tính toán bounds trên màn hình nhỏ.
- **Giải pháp thiết kế mới**: 
  - Toàn bộ khung bản đồ chiếm 100% full-width và full-height, cân đối hoàn hảo dải đất liền và hai quần đảo Hoàng Sa, Trường Sa ở trung tâm màn hình.
  - Khi người dùng bấm vào một vùng văn hóa (trên bản đồ hoặc trên thanh điều hướng pills), hệ thống mở **Popup Trang Chi Tiết Vùng Văn Hóa (`RegionDetailModal.jsx`)** ở dạng modal độc lập, nổi bật trên lớp backdrop tối sâu (`bg-black/80 backdrop-blur-md`).

### 4.2 Cấu trúc Giao diện & Thành phần Popup Modal (`RegionDetailModal`)
- **Bảng màu chủ đạo đồng bộ hệ thống CraftRoots (Human-Crafted Sharp Linework)**:
  - **Backdrop**: Màu mực đen `bg-[#1C1B1A]/65` kết hợp hiệu ứng mờ kính `backdrop-blur-sm`, tạo chiều sâu trầm tĩnh, ấm áp.
  - **Khung chứa Modal Container**: Nền Canvas Linen mộc `bg-[#F9F8F6]`, đường viền sắc nét `border border-[#E6E2DA]`, đổ bóng `shadow-2xl` kết hợp viền mộc tinh tế.
  - **Bề mặt thẻ & Khối nội dung**: Thẻ làng nghề và khối bài viết mang màu bề mặt tinh khiết `bg-[#FFFFFF]` nổi bật trên nền kem linen, phân tách bằng đường kẻ `border-[#E6E2DA]`.
  - **Kiểu chữ (Ink Typography)**: Tiêu đề và nội dung sử dụng mực đen cổ điển `text-[#1C1B1A]`, phụ đề và thông số kỹ thuật dùng xám than `text-[#5A5854]`, nhãn phân loại dùng nâu ấm `text-[#867368]`.
  - **Điểm nhấn thương hiệu (Brand Accent)**: Gam màu đất nung Terracotta `text-[#B86B35]` / `bg-[#B86B35]` xuất hiện ở nhãn tiêu đề, số liệu thống kê làng nghề, viền hover thẻ card, nút hành động chính và các liên kết tác phẩm.
1. **Accent Identification Stripe**: Đường viền line 6px trên đỉnh mang màu sắc nhận diện đặc trưng của vùng văn hóa (ví dụ: Đỏ son gốm sứ `#B91C1C` cho Đồng bằng Bắc Bộ, Vàng thổ hoàng `#D97706` cho Bắc Trung Bộ, Xanh ngọc men `#0284C7` cho Duyên hải Nam Trung Bộ...).
2. **Modal Header**:
   - Badge mã vùng văn hóa (V01 - V07) và nhãn "DI SẢN LÀNG NGHỀ TRUYỀN THỐNG" màu Terracotta `#B86B35`.
   - Tên vùng văn hóa in hoa font serif trang trọng (`Playfair Display`), kèm phụ đề đặc trưng (ví dụ: *Nôi di sản thủ công ngàn năm & cái nôi gốm, lụa, đồng, khắc gỗ*).
   - Nút đóng `✕` tinh tế với nền `bg-[#F4F2EE] hover:bg-[#1C1B1A] text-[#5A5854] hover:text-white border-[#E6E2DA]`, hỗ trợ phím tắt `Esc` và click backdrop.
3. **Heritage Stats Bar (Thanh chỉ số di sản)**:
   - Nền `bg-[#F4F2EE] border-b border-[#E6E2DA] divide-x divide-[#E6E2DA]`: Thống kê 3 cột chia vạch: Số tỉnh thành địa phương, Số làng nghề tiêu biểu (màu Terracotta `#B86B35`), Bản sắc thủ công cốt lõi.
4. **Scrollable Heritage Content (Nội dung cuộn)**:
   - **Đặc trưng văn hóa nghề & Không gian di sản**: Bài viết tư liệu điền dã chuyên sâu trên nền `bg-[#FFFFFF]` với đường viền mộc `#E6E2DA`.
   - **Danh sách làng nghề tiêu biểu (Lưới 2 cột)**: Mỗi làng nghề là một thẻ card trắng `bg-[#FFFFFF]` có viền `#E6E2DA`, hover chuyển viền `#B86B35`, nhãn xuất xứ mộc, đoạn mô tả kỹ pháp và nút điều hướng "Xem tác phẩm →" màu `#B86B35` dẫn tới kho tư liệu `/crafts?q=...`.
   - **Địa giới tỉnh thành trực thuộc**: Hệ thống badge `bg-[#F9F8F6] border-[#E6E2DA] hover:border-[#B86B35]` liệt kê đầy đủ toàn bộ các tỉnh thành thuộc phân vùng văn hóa.
5. **Modal Action Footer**:
   - Nút hành động chính "Khám Phá Toàn Bộ Di Sản Vùng": Nền Terracotta `bg-[#B86B35] hover:bg-[#8E4A16] text-white`, dẫn tới danh bạ tác phẩm đã lọc theo vùng văn hóa.
   - Nút "Quay Lại Bản Đồ": Nền `bg-[#F4F2EE] hover:bg-[#E6E2DA] text-[#1C1B1A] border-[#E6E2DA]`, đóng popup mượt mà và tiếp tục hành trình tương tác GIS.

### 4.3 Trải nghiệm Tương tác & Khả năng Tiếp cận (Accessibility)
- **Hiệu ứng chuyển động (Micro-animations)**:
  - Backdrop xuất hiện với hiệu ứng mờ dần (`animate-fadeIn`).
  - Hộp modal mở rộng nhẹ nhàng từ tâm với độ nảy nhẹ (`animate-scaleUp`).
- **Focus & Phím tắt**:
  - Hỗ trợ phím `Escape` để đóng modal lập tức.
  - Sự kiện `onClick` của backdrop có `e.stopPropagation()` để ngăn việc vô tình đóng modal khi nhấp chuột đọc nội dung bên trong.
- **Phản hồi bản đồ thời gian thực**:
  - Khi modal đóng, vùng văn hóa vừa chọn vẫn giữ trạng thái highlight nhẹ trên bản đồ, kèm nút bấm nổi "📖 Chi Tiết Vùng" và "← Toàn Cảnh" ở góc dưới bên trái giúp người dùng mở lại nhanh chóng mà không cần tìm kiếm lại.

### 4.4 Hệ Thống Bản Đồ Địa Chí Di Sản Đồng Bộ (Heritage Cartographic GIS System)
- **Hài hòa với bảng màu Website (Light Canvas Heritage Theme)**:
  - **Nền Biển & Đại dương (`#EAF2F4`)**: Mang sắc men ngọc nhạt thanh thoát của gốm men lam, thay thế cho nền đen kịt trước đây, tạo sự kết nối tự nhiên và liền mạch tuyệt đối với nền Canvas Linen `#F9F8F6` của toàn bộ trang web.
  - **Bảng màu 7 Vùng: Ý Tưởng 2 - Ngũ Sắc Tranh Dân Gian & Men Tro Củi**:
    - *V01 - Trung du & Miền núi phía Bắc (`TAY_BAC_VIET_BAC`)*: **Vàng Hoa Hòe** `#D49A24` (Sắc vàng tự nhiên của hoa hòe nhuộm tranh Hàng Trống & trang phục thổ cẩm dân tộc).
    - *V02 - Đồng bằng sông Hồng (`DONG_BANG_SONG_HONG`)*: **Đỏ Vang Gỗ Vang** `#A83827` (Sắc son tự nhiên của gỗ vang trong mộc bản Đông Hồ & gạch gốm nung Bát Tràng).
    - *V03 - Bắc Trung Bộ (`BAC_TRUNG_BO`)*: **Tím Men Tro Lam Huế** `#5E4B7A` (Sắc tím thâm trầm Cung đình Huế hòa quyện với men tro cổ truyền).
    - *V04 - Duyên hải Nam Trung Bộ (`NAM_TRUNG_BO`)*: **Lam Chàm Men Chu Đậu** `#266B88` (Màu lam biển duyên hải & sắc chàm gốm men lam truyền thống).
    - *V05 - Tây Nguyên (`TAY_NGUYEN`)*: **Cam Lửa Nung Củi** `#CE5C23` (Sắc đất đỏ bazan nung củi & ánh lửa cồng chiêng đại ngàn).
    - *V06 - Đông Nam Bộ (`DONG_NAM_BO`)*: **Nâu Hổ Phách Nam Bộ** `#8A5232` (Màu gỗ mật, sơn mài cổ truyền & gốm sành Lái Thiêu / Biên Hòa).
    - *V07 - Đồng bằng sông Cửu Long (`TAY_NAM_BO`)*: **Xanh Gỉ Đồng Cổ Mộc** `#327555` (Màu rêu cổ miệt vườn, phù sa phù sa & lục bình sông nước Cửu Long).
- **Kỹ thuật Ranh giới Nổi bật (Double-Stroke Boundary Casing)**:
  - Để bảo đảm ranh giới giữa 7 vùng luôn sắc nét, rõ ràng trên nền bản đồ sáng:
    - **Outer White Casing (`#FFFFFF`)**: Lớp viền trắng dập nổi bọc ngoài dày từ `2.5px` đến `5.2px`.
    - **Inner Sharp Ink Linework (`#1C1B1A`)**: Đường chỉ rãnh mực đen sắc nét bên trong dày `1.2px` đến `2.6px`, giúp phân định ranh giới giữa các mảng màu tự nhiên như một tác phẩm mộc bản địa chí cổ truyền.
- **Chủ quyền Biển đảo & Linh kiện Điều hướng**:
  - Quần đảo Hoàng Sa và Trường Sa được định danh trang trọng với hộp chỉ dẫn nền trắng viền kép Terracotta `#B86B35`, chữ đen mực `#1C1B1A` và chấm đỏ son rực rỡ.
  - Bộ nút điều khiển Zoom và thanh Quick Pills mang phong cách nền trắng viền kẻ mộc `#E6E2DA`, đổ bóng mềm mại `shadow-md`.


