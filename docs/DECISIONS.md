# CraftRoots — Ghi Chép Quyết Định Kỹ Thuật (Architecture & Technical Decisions)

Tài liệu này ghi lại toàn bộ kết quả kiểm toán (Audit), phân tích khoảng lệch (Gap Analysis) giữa thiết kế Stitch UI và hệ thống hiện hành, cùng toàn bộ các quyết định giải quyết mâu thuẫn dữ liệu và kiến trúc nâng cấp.

---

## 1. Audit & Gap Analysis (Kiểm toán & Khoảng lệch)

### 1.1. Bảng đối chiếu thực trạng hệ thống hiện hành
- **Module System Backend:** CommonJS (`require` / `module.exports`), Node.js 18+ Express.
- **Thư viện xác thực & mã hóa:** `jsonwebtoken` (JWT HS256), `bcrypt` (mã hóa mật khẩu).
- **Thư viện Validation:** Chưa có thư viện chuyên biệt (trước đây validate thủ công). Quyết định: Sử dụng **Zod** cho server request validation.
- **Cơ sở dữ liệu:** PostgreSQL 14+ kết nối qua `pg.Pool`, 17 bảng hiện hành (`users`, `regions`, `craft_categories`, `materials`, `techniques`, `artisans`, `crafts`, `craft_artisans`, `craft_materials`, `craft_techniques`, `craft_images`, `collections`, `collection_crafts`, `seasonal_collections`, `seasonal_collection_crafts`, `favourites`, `contact_messages`).
- **Extensions PostgreSQL:** Chưa kích hoạt `unaccent`. Quyết định: Kích hoạt `unaccent` và `pg_trgm` (nếu có quyền trên server, kèm fallback xử lý SQL an toàn).
- **Frontend:** React 18 + Vite + React Router DOM 6.

### 1.2. Bảng phân tích: Thiết kế cần gì → Đã có / Cần mở rộng / Cần mới

| Hạng mục / Dữ liệu thiết kế | Nguồn thiết kế | Trạng thái hiện tại | Giải pháp nâng cấp |
| :--- | :--- | :--- | :--- |
| **Làng nghề truyền thống (`craft_villages`)** | Danh mục, Chi tiết, Bản đồ vùng | Chưa có bảng riêng | **Tạo mới bảng `craft_villages`**: lưu thông tin làng nghề, niên đại, huyện/tỉnh, liên kết `regions` |
| **Niên biểu nghệ nhân (`artisan_milestones`)** | Hồ sơ nghệ nhân, Popup chi tiết | Chưa có bảng riêng | **Tạo mới bảng `artisan_milestones`**: `artisan_id`, `year`, `event`, `sort_order` |
| **Phiếu đặt hẹn thăm xưởng (`visit_bookings`)** | Hồ sơ nghệ nhân (#dat-lich), Popup | Chưa có bảng riêng | **Tạo mới bảng `visit_bookings`**: `artisan_id`, `user_id`, `full_name`, `phone`, `visit_date`, `time_slot`, `purpose`, `note`, `status` |
| **Đăng ký nhận bản tin (`newsletter_subscribers`)** | Chân trang toàn bộ 9 trang | Chưa có bảng riêng | **Tạo mới bảng `newsletter_subscribers`**: `email` (unique case-insensitive), `created_at` |
| **Ký họa điền dã (`field_notes`)** | Trang chủ | Chưa có bảng riêng | **Tạo mới bảng `field_notes`**: `title`, `body`, `image_url`, `coordinates`, `metrics` (JSONB) |
| **Mã định danh tác phẩm (`crafts.code`)** | Toàn bộ các trang (vd: `CR-BT-2025-08MR`) | Chỉ có `slug` | **Mở rộng `crafts`**: thêm `code` UNIQUE, `price_vnd`, `tag`, `origin_line`, `era`, `dimensions`, `specs` (JSONB), `process_stages` (JSONB), `batch_note`, `village_id`, `is_spotlight`, `handmade` |
| **Mã & Thuộc tính nghệ nhân** | Trang nghệ nhân, Popup, Hồ sơ | Chỉ có `name`, `biography`, `title` | **Mở rộng `artisans`**: thêm `slug`, `code` (`ART-BT-001`), `village_id`, `age`, `generation`, `quote`, `signature_work`, `technique_summary`, `technique_specs` (JSONB), `verification_label`, `is_national_heritage`, `visit_*`, `lat`, `lng`, `sort_order` |
| **Bản đồ 6 vùng văn hóa** | Bản đồ làng nghề (`stitch_eproject__5_`) | Chỉ có `code`, `name` cơ bản | **Mở rộng `regions`**: thêm `map_key`, `craft_summary`, `is_verified`, `registered_village_count`, `national_heritage_count`, `sort_order`; nạp đủ 6 vùng theo thiết kế |
| **Thông điệp giám tuyển bộ sưu tập mùa** | Trang mùa thu (`stitch_eproject__4_`) | Chỉ có `theme_concept`, `color_tone` | **Mở rộng `seasonal_collections`**: thêm `philosophy_quote`, `quote_source`, `metrics` (JSONB), `process_steps` (JSONB), `archive_code` |
| **Chủ đề liên hệ & trạng thái** | Trang liên hệ (`stitch_eproject__7_`) | `contact_messages` chỉ có `subject` | **Mở rộng `contact_messages`**: thêm `topic` (`custom-order`, `visit-village`, `cultural-partnership`, `appraisal`, `other`), `user_id` (nếu đăng nhập) |
| **Endpoint Trang chủ tổng hợp (`GET /api/home`)** | Trang chủ | Chưa có | **Tạo mới endpoint**: gộp `stats`, `featuredCrafts`, `spotlightCraft`, `latestSeasonal`, `fieldNotes` |
| **Endpoint Thống kê tổng thể (`GET /api/stats`)** | Trang chủ, Footer | Chưa có | **Tạo mới endpoint**: tổng hợp `crafts`, `artisans`, `villages`, `regions` từ DB |
| **Endpoint Tìm kiếm đa phân hệ (`GET /api/search?q=`)** | SearchBar trên Navbar mọi trang | Tìm kiếm riêng lẻ trên `/crafts` | **Tạo mới endpoint**: FTS trên tác phẩm, nghệ nhân và làng nghề |
| **Endpoint Đặt lịch hẹn xưởng (`POST /api/visit-bookings`)** | Form đặt hẹn xưởng | Chưa có | **Tạo mới endpoint**: validate nghiệp vụ 48h/24h, slot sáng/chiều, giới hạn số khách |
| **Endpoint Đăng ký nhận tin (`POST /api/newsletter`)** | Form footer | Chưa có | **Tạo mới endpoint**: nhận email, chống trùng lặp, trả HTTP 200 idempotent |
| **Endpoint Xóa toàn bộ yêu thích (`DELETE /api/favourites`)** | Trang Đã Lưu | Chỉ có xóa từng `craftId` | **Tạo mới endpoint**: xóa toàn bộ yêu thích của user đăng nhập |
| **Endpoint Tóm tắt thống kê tủ lưu trữ (`GET /api/favourites/summary`)** | Trang Đã Lưu | Chưa có | **Tạo mới endpoint**: tính số nghệ nhân liên quan, các tỉnh thành xuất xứ của các tác phẩm đã lưu |

---

## 2. Quy Tắc & Quyết Định Xử Lý Mâu Thuẫn Dữ Liệu

1. **Bộ Trà Men Rạn (`CR-BT-2025-08MR`):**
   - *Mâu thuẫn:* Trang Chi tiết ghi nghệ nhân là cụ **Nguyễn Văn Bình**, trang Đã lưu ghi "NNƯT. Trần Độ (Kế thừa)".
   - *Quyết định:* Lấy trang Chi tiết làm chuẩn nguồn sự thật (Source of Truth): nghệ nhân chính là Nguyễn Văn Bình. Mọi trang hiển thị đồng nhất theo quan hệ CSDL PostgreSQL.

2. **Thế hệ truyền thừa của Nguyễn Văn Bình:**
   - *Mâu thuẫn:* Trang Danh sách nghệ nhân & Mẫu DESIGN.md ghi "Đời thứ 6", trang Hồ sơ nghệ nhân chuyên sâu (`stitch_eproject__3_`) ghi "Đời thứ 5".
   - *Quyết định:* Ưu tiên hồ sơ chuyên khảo sâu nhất của cụ tại `stitch_eproject__3_`: xác lập `generation = 5` ("Đời thứ 5 nối nghiệp lò bầu").

3. **Mã lưu trữ nghệ nhân Nguyễn Văn Bình:**
   - *Mâu thuẫn:* Mã `ART-BT-001` vs `VN-BT-ART-0082`.
   - *Quyết định:* Dùng `ART-BT-001` làm `code` chính thức trong URL và truy vấn. Mã `VN-BT-ART-0082` được lưu trữ trong trường `verification_label` (Hồ sơ chứng nhận di sản số).

4. **Thời gian báo trước đặt lịch hẹn xưởng (Lead Time):**
   - *Mâu thuẫn:* Trang Hồ sơ cụ Bình ghi trước 24h, trang Danh sách & Liên hệ ghi trước 48h.
   - *Quyết định:* Cho phép trường `visit_lead_time_hours` linh hoạt theo từng nghệ nhân trong bảng `artisans`. Mặc định hệ thống là 48h; riêng cụ Nguyễn Văn Bình thiết lập 24h đúng theo hồ sơ xưởng tại Bát Tràng.

5. **Nhiệt độ nung men:**
   - *Mâu thuẫn:* Gốm sa thạch ghi 1.280°C ở một số tác phẩm và 1.300°C ở lò bầu nung củi.
   - *Quyết định:* Giữ nguyên thông số kỹ thuật thực tế cho từng sản phẩm và nghệ nhân riêng biệt trong trường `specs` JSONB, không gộp chung.

6. **Định dạng mã sản phẩm:**
   - *Mâu thuẫn:* Xuất hiện nhiều dạng mã (`CR-BT-7721`, `BT-MR01`, `NVB-2025-09`, `THU-GM-01`, `CR-BT-2025-08MR`).
   - *Quyết định:* Tất cả các mã này được lưu vào cột `crafts.code` (với ràng buộc UNIQUE), cho phép tìm kiếm và tra cứu trực tiếp theo mã sản phẩm hoặc slug.

7. **Số liệu thống kê:**
   - *Mâu thuẫn:* Text hardcode trên các file HTML mẫu ghi các con số lệch nhau (84 vs 45 nghệ nhân, 248 vs 2.840 tác phẩm).
   - *Quyết định:* Toàn bộ số liệu trên giao diện web được tính toán bằng câu lệnh tổng hợp `COUNT(...)` trong PostgreSQL (Dynamic Aggregation), tuyệt đối không hardcode số giả. Các con số biên tập cho địa phương (như "120 làng nghề" của Bắc Bộ) được lưu trong cột `registered_village_count` của bảng `regions`.

8. **Ánh xạ 6 Vùng miền Văn hóa:**
   - *Thiết kế quy định 6 vùng:*
     1. Tây Bắc (`tay-bac`)
     2. Đông Bắc (`dong-bac`)
     3. Đồng bằng Bắc Bộ (`dong-bang-bac-bo`) — Vùng trọng điểm
     4. Bắc Trung Bộ (`bac-trung-bo`)
     5. Nam Trung Bộ & Tây Nguyên (`nam-trung-bo-tay-nguyen`)
     6. Nam Bộ (`nam-bo`)
   - *Quyết định:* Giữ nguyên các bản ghi `regions` cũ (nếu có); thêm trường `map_key` để ánh xạ chính xác với SVG Bản đồ Việt Nam tương tác trên trang `RegionsPage`.

9. **Bảo mật lưu trữ Token:**
   - *Quyết định:* Tuân thủ hợp đồng hệ thống, token lưu tại `localStorage` với khóa `craftroots_token`. Để triệt tiêu rủi ro tấn công XSS, tuyệt đối cấm dùng `dangerouslySetInnerHTML` trong toàn bộ mã nguồn React client; mọi đầu vào từ người dùng được xử lý an toàn.
