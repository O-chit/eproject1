# CraftRoots – Cổng Thông Tin Khám Phá Nghề Thủ Công Truyền Thống

CraftRoots là cổng thông tin số (craft discovery portal) tập hợp thông tin về các nghề thủ công truyền thống vào một trải nghiệm web duy nhất, có tổ chức và trực quan. Người dùng có thể khám phá sản phẩm theo vùng miền, chất liệu, kỹ thuật; tìm hiểu hồ sơ nghệ nhân; xem bộ sưu tập ảnh tương tác; lưu các sản phẩm yêu thích; đăng ký bản tin di sản; và đặt lịch hẹn thăm xưởng thủ công.

> Dự án thuộc chương trình **eProject – Aptech Computer Education**, xây dựng dưới dạng ứng dụng một trang (SPA) responsive bám sát 9 mẫu thiết kế trực quan Stitch, có hỗ trợ xác thực người dùng an toàn.
>
> 📚 **Bộ tài liệu đặc tả kỹ thuật chi tiết:**
> - [DECISIONS.md](file:///e:/eproject1/docs/DECISIONS.md): Nhật ký quyết định kiến trúc & đối soát 9 trang Stitch.
> - [DESIGN.md](file:///e:/eproject1/docs/DESIGN.md): Hệ thống thiết kế CraftRoots & đặc tả component **Artisan Detail Popup Modal**.
> - [feature-spec.md](file:///e:/eproject1/docs/feature-spec.md): Mô tả nghiệp vụ v1.1.0, user flows, business rules (BR-01 đến BR-15).
> - [architecture.md](file:///e:/eproject1/docs/architecture.md): Các module và cách chúng giao tiếp, sơ đồ tuần tự v1.1.0.
> - [database-schema.md](file:///e:/eproject1/docs/database-schema.md): 22 bảng, quan hệ N-N và kịch bản migration.
> - [data.md](file:///e:/eproject1/docs/data.md): Từ điển dữ liệu toàn diện 22 bảng & DDL.
> - [api-contract.yaml](file:///e:/eproject1/docs/api-contract.yaml): OpenAPI 3.0.3 v1.1.0 đặc tả đầy đủ request/response.
> - [task-breakdown.md](file:///e:/eproject1/docs/task-breakdown.md): WBS theo Phases 0 – 8, phân công, phụ thuộc và acceptance criteria.
> - [test-plan.md](file:///e:/eproject1/docs/test-plan.md): Kế hoạch và 10 luồng kiểm thử chi tiết v1.1.0.

---

## Mục lục

1. [Tính năng](#1-tính-năng)
2. [Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
5. [Cơ sở dữ liệu PostgreSQL (22 Bảng)](#5-cơ-sở-dữ-liệu-postgresql-22-bảng)
6. [Xác thực: JWT + bcrypt](#6-xác-thực-jwt--bcrypt)
7. [Danh sách API RESTful v1.1.0](#7-danh-sách-api-restful-v110)
8. [Yêu cầu hệ thống](#8-yêu-cầu-hệ-thống)
9. [Hướng dẫn cài đặt và chạy](#9-hướng-dẫn-cài-đặt-và-chạy)
10. [Biến môi trường](#10-biến-môi-trường)
11. [Dữ liệu kiểm thử & Tiêu chuẩn Anti-AI](#11-dữ-liệu-kiểm-thử--tiêu-chuẩn-anti-ai)
12. [Yêu cầu phi chức năng](#12-yêu-cầu-phi-chức-năng)
13. [Sản phẩm bàn giao](#13-sản-phẩm-bàn-giao)
14. [Giả định](#14-giả-định)

---

## 1. Tính năng

### Dành cho khách truy cập
| # | Chức năng | Mô tả |
|---|-----------|-------|
| 1 | Trang chủ / Landing page | Kiệt tác spotlight `CR-BT-2025-08MR`, thống kê động (`GET /api/stats`), sản phẩm/vùng miền/bộ sưu tập nổi bật, thanh tìm kiếm nổi bật, lối tắt danh mục chính |
| 2 | Danh mục sản phẩm (Craft Directory) | Hiển thị dạng lưới/thẻ responsive: tên, vùng miền, danh mục, chất liệu, ảnh đại diện, giá VND, nhãn tag; có sắp xếp theo giá và facets đa diện |
| 3 | Tìm kiếm & bộ lọc đa diện | Tìm kiếm toàn văn bản (FTS tsvector) theo tên/từ khóa; lọc theo loại hình, vùng miền, làng nghề (`craft_villages`), chất liệu, khoảng giá; debounce 350ms |
| 4 | Chi tiết kiệt tác Masterwork | Bố cục 4 cột: Tác phẩm & Kỹ pháp, Đội ngũ nghệ nhân N-N, Kích thước & Thông số (`specs`), Quy trình 4 bước (`process_stages`), tác phẩm liên quan |
| 5 | Hồ sơ nghệ nhân & Artisan Detail Popup | Ma trận 3×2 hồ sơ bậc thầy; click bất kỳ vị trí nào trên thẻ mở popup chi tiết (tiểu sử, kỹ pháp, thông số kỹ thuật, tác phẩm tiêu biểu, quy trình hẹn xưởng, focus trap) |
| 6 | Thư viện ảnh tương tác Lightbox | Gallery responsive, lightbox phóng to toàn màn hình, chuyển ảnh bằng chuột hoặc phím mũi tên `←`/`→`, alt text và caption chuẩn WCAG |
| 7 | Bản đồ văn hóa 6 vùng di sản | Tương tác bản đồ SVG 6 vùng di sản văn hóa Việt Nam (`map_key`), lọc danh sách làng nghề đã xác thực (`craft_villages`) và ghi chú điền dã (`field_notes`) |
| 8 | Bộ sưu tập theo mùa tuyển chọn | Bộ sưu tập Mùa Hạ 2026 (`CR-ARCH-SUMMER-26`), lời bình của Giám tuyển Văn hóa (`curator_note`), tác phẩm tiêu điểm (`is_hero`) |
| 9 | Giới thiệu CraftRoots | Mục đích, tầm nhìn, bảo tồn tri thức dân gian và nghệ nhân thủ công truyền thống |
| 10 | Biểu mẫu liên hệ chuyên đề | Form chọn chủ đề (`general`, `workshop_booking`, `artisan_verification`, `press_media`), cam kết phản hồi xác thực di sản trong vòng 24h |
| 11 | Đăng ký bản tin di sản | Nhập email nhận ấn phẩm số hàng tuần, kiểm tra chuẩn RFC 5322, lưu bảng `newsletter_subscribers` |
| 12 | Điều hướng & UI dùng chung | Header sticky, footer di sản, breadcrumbs, mobile drawer, hỗ trợ bàn phím và focus trap rõ ràng, back-to-top, skeletons |

### Dành cho người dùng đã đăng nhập
| # | Chức năng | Mô tả |
|---|-----------|-------|
| 13 | Đăng ký / tạo mật khẩu | Tạo tài khoản với email + mật khẩu, mật khẩu được băm một chiều bằng **bcrypt (salt rounds = 10)** |
| 14 | Đăng nhập / đăng xuất | Xác thực bằng **JWT HS256** (hạn 1 ngày) |
| 15 | Yêu thích lưỡng thể (Hybrid Favourites) | Khách lưu bằng **Local Storage**; khi đăng nhập, danh sách tự động đồng bộ vào **PostgreSQL** (`/api/favourites/sync`); hỗ trợ xóa hàng loạt và tóm tắt theo danh mục |
| 16 | Đặt lịch thăm xưởng thủ công | Đăng ký tham quan xưởng nghệ nhân (`visit_bookings`), kiểm tra lead time 24h/48h, ngày mở cửa (`open_days`), quy mô đoàn (`max_guests_per_slot`) |
| 17 | Quản lý hồ sơ cá nhân | Xem thông tin tài khoản, cập nhật họ tên / số điện thoại / ảnh đại diện (`PUT /api/auth/profile`), và đổi mật khẩu an toàn |

---

## 2. Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | **React 18+** (SPA), React Router v6, Axios, Vanilla CSS (Design Tokens) |
| Backend | **Node.js** + **Express.js** (REST API v1.1.0) |
| Cơ sở dữ liệu | **PostgreSQL 14+** (driver `pg.Pool`, 22 bảng quan hệ) |
| Xác thực | **JSON Web Token (JWT)** – `jsonwebtoken` |
| Mã hóa mật khẩu | **bcrypt** (`bcrypt` hoặc `bcryptjs`, salt = 10) |
| Validation | `express-validator` (server), validation form (client) |
| Bảo mật bổ sung | `helmet`, `cors` (whitelist multi-origin), `express-rate-limit` |
| Công cụ phát triển | VS Code, Figma, Git, Postman |

---

## 3. Kiến trúc hệ thống

```
┌────────────────────┐   HTTP/JSON    ┌──────────────────────┐    SQL    ┌──────────────┐
│  React 18 SPA      │ ─────────────► │  Express.js API      │ ────────► │ PostgreSQL   │
│  (client)          │ ◄───────────── │  (Node.js v18+)      │ ◄──────── │ (22 bảng)    │
│  - 9 Stitch Pages  │  Bearer JWT    │  - Routes/Controllers│           └──────────────┘
│  - Modals (Popup)  │                │  - Auth middleware   │
│  - LocalStorage    │                │  - bcrypt, JWT HS256 │
│    (khách)         │                │  - Anti-AI & Stats   │
└────────────────────┘                └──────────────────────┘
```

---

## 4. Cấu trúc thư mục

```
craftroots/
├── client/                      # Frontend (React 18 + Vite SPA bám sát 9 thiết kế Stitch)
│   ├── public/                  # Tài nguyên tĩnh (favicon.svg, media assets)
│   ├── src/
│   │   ├── components/          # Linh kiện giao diện tái sử dụng
│   │   │   ├── common/          # Breadcrumbs, CraftCardSkeleton, PrivateRoute, Toast...
│   │   │   ├── layout/          # Navbar (sticky header, search, favs badge), Footer, Layout
│   │   │   └── modals/          # ArtisanDetailPopup, VisitBookingModal, LightboxModal, SearchModal
│   │   ├── context/             # Quản lý trạng thái toàn cục (AuthContext, FavouritesContext)
│   │   ├── hooks/               # Custom hooks: useDebounce, useLocalStorage, useModal...
│   │   ├── pages/               # 9 trang giao diện chính theo Stitch + trang bổ trợ
│   │   │   ├── HomePage.jsx             # Trang chủ: kiệt tác CR-BT-2025-08MR, stats động, field note
│   │   │   ├── DirectoryPage.jsx        # Danh bạ tác phẩm: facets đa diện, sort giá, phân trang
│   │   │   ├── CraftDetailPage.jsx      # Chi tiết tác phẩm: layout 4 cột, specs, 4 quy trình, N-N
│   │   │   ├── ArtisansPage.jsx         # Danh bạ nghệ nhân: lưới 3x2, click mở ArtisanDetailPopup
│   │   │   ├── ArtisanDetailPage.jsx    # Hồ sơ chuyên sâu: milestones, specs, widget đặt lịch hẹn
│   │   │   ├── RegionsPage.jsx          # Bản đồ tương tác 6 vùng di sản SVG, làng nghề, điền dã
│   │   │   ├── SeasonalPage.jsx         # BST Mùa Hạ 2026 CR-ARCH-SUMMER-26, curator note, Hero Craft
│   │   │   ├── FavouritesPage.jsx       # Yêu thích: hybrid sync, tóm tắt danh mục, xóa hàng loạt
│   │   │   ├── ContactPage.jsx          # Liên hệ chuyên đề (thẩm định di sản, đặt lịch), cam kết 24h
│   │   │   ├── LoginPage.jsx            # Đăng nhập tài khoản & tự động đồng bộ Favourites
│   │   │   ├── RegisterPage.jsx         # Đăng ký tài khoản mới (validate mật khẩu bcrypt)
│   │   │   ├── ProfilePage.jsx          # Quản lý hồ sơ cá nhân (cập nhật info, đổi mật khẩu)
│   │   │   └── NotFoundPage.jsx         # Trang báo lỗi 404 chuẩn giao diện di sản
│   │   ├── services/            # api.js (Axios client tích hợp JWT Bearer & error interceptor)
│   │   ├── styles/              # Design Tokens, variables.css, typography, animations
│   │   ├── App.jsx              # Định tuyến ứng dụng React Router v6
│   │   ├── index.css            # Toàn bộ CSS chuẩn hóa & Design System CraftRoots
│   │   └── main.jsx             # Entrypoint khởi tạo React 18 DOM
│   ├── index.html               # Template HTML chuẩn SEO & nạp phông chữ di sản
│   ├── vite.config.js           # Cấu hình Vite & Reverse Proxy (/api -> http://localhost:5000)
│   └── package.json             # Cấu hình dependencies Frontend
├── server/                      # Backend (Node.js + Express REST API v1.1.0)
│   ├── src/
│   │   ├── config/              # db.js (pg Pool), env.js (kiểm tra an toàn production)
│   │   ├── controllers/         # auth, crafts, artisans, regions, collections, favourites, contact, home, search, bookings, newsletter
│   │   ├── middleware/          # authenticate.js, validate.js, errorHandler.js
│   │   ├── routes/              # Định nghĩa API routes RESTful v1.1.0
│   │   ├── utils/               # token.js (JWT), password.js (bcrypt)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── db/                          # Dữ liệu chung toàn dự án (PostgreSQL 22 bảng)
│   ├── migrations/              # 001_expand_schema.sql (mở rộng lên 22 bảng)
│   ├── schema.sql               # Tạo cấu trúc 22 bảng, chỉ mục và quan hệ N-N
│   └── seed.sql                 # Dữ liệu hạt giống chuẩn di sản (Anti-AI Content)
│
├── node_modules/                # Thư viện phụ thuộc dùng chung
├── demo/                        # Mẫu giao diện & Hệ thống thiết kế
│   └── artisan-page/            # Giao diện Danh sách & Chi tiết Nghệ nhân
│       ├── DESIGN.md            # Hệ thống thiết kế CraftRoots & đặc tả Artisan Detail Popup
│       ├── code.html            # Bản mẫu giao diện HTML hoàn chỉnh
│       └── screen.png           # Ảnh chụp màn hình giao diện
├── docs/                        # Báo cáo, đặc tả kỹ thuật, kiến trúc, API contract, WBS
│   └── design/                  # 9 bản thiết kế HTML / Stitch tham chiếu
├── package.json                 # Quản lý scripts tại thư mục gốc
├── .env                         # Biến môi trường hệ thống
└── README.md                    # Tài liệu tổng quan dự án
```

---

## 5. Cơ sở dữ liệu PostgreSQL (22 Bảng)

> 💡 **Chi tiết thiết kế dữ liệu & Data Dictionary đầy đủ:** Xem tại [docs/data.md](file:///e:/eproject1/docs/data.md) và [docs/database-schema.md](file:///e:/eproject1/docs/database-schema.md).

### Danh mục 22 Bảng hệ thống

| Nhóm | Tên bảng | Mục đích |
|---|---|---|
| **Người dùng** | `users` | Tài khoản người dùng (email, `password_hash`, họ tên, số điện thoại, vai trò) |
| **Phân loại di sản** | `regions` | 6 vùng di sản văn hóa Việt Nam (`code`, `map_key`, `cultural_summary`) |
| | `craft_villages` | **(Mới)** Làng nghề truyền thống đã xác thực gắn với vùng miền |
| | `craft_categories` | Loại hình thủ công (gốm sứ, dệt may, mây tre đan, điêu khắc, chạm bạc...) |
| | `materials` | Chất liệu chế tác (đất sét cao lanh, tơ tằm, tre luồng, đồng đỏ...) |
| | `techniques` | Kỹ pháp truyền thống (chuốt gốm bàn xoay, men rạn tam thái, dệt ikat...) |
| **Nghệ nhân** | `artisans` | Hồ sơ nghệ nhân (REF code, đời thứ, thâm niên, thông số kỹ thuật `technique_specs`, thông tin xưởng) |
| | `artisan_milestones` | **(Mới)** Niên biểu sự nghiệp và danh hiệu vinh danh của nghệ nhân |
| **Tác phẩm & N-N** | `crafts` | Sản phẩm kiệt tác (mã code, giá VND, nhãn tag, thông số `specs`, quy trình `process_stages`) |
| | `craft_artisans` | **Liên kết N-N:** Nghệ nhân ↔ Tác phẩm (vai trò `role_title`, nghệ nhân đại diện `is_lead`) |
| | `craft_materials` | **Liên kết N-N:** Tác phẩm ↔ Chất liệu |
| | `craft_techniques` | **Liên kết N-N:** Tác phẩm ↔ Kỹ pháp |
| | `craft_images` | Album ảnh tác phẩm (URL, alt text, caption WCAG) |
| **Bộ sưu tập** | `collections` | Bộ sưu tập chuyên đề thông thường |
| | `collection_crafts` | Liên kết Bộ sưu tập ↔ Tác phẩm |
| | `seasonal_collections` | **Bộ sưu tập theo mùa** (Hạ 2026 `CR-ARCH-SUMMER-26`, `curator_note`, `is_hero`) |
| | `seasonal_collection_crafts`| Tác phẩm được tuyển chọn vào mùa (`highlight_badge`, `display_order`) |
| **Tương tác & Dịch vụ** | `favourites` | Danh sách yêu thích của người dùng trên đám mây |
| | `contact_messages` | Tin nhắn liên hệ theo chuyên đề (`topic`, trạng thái `unread`) |
| | `visit_bookings` | **(Mới)** Phiếu đăng ký đặt lịch thăm xưởng thủ công (mã `VB-...`, lead time, số khách) |
| | `newsletter_subscribers` | **(Mới)** Danh bạ đăng ký nhận bản tin di sản hàng tuần |
| | `field_notes` | **(Mới)** Ghi chép điền dã thực địa của chuyên gia tại làng nghề |

---

## 6. Xác thực: JWT + bcrypt

### Quy tắc mật khẩu
- Tối thiểu **8 ký tự**, gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số.
- Băm một chiều bằng **bcrypt** (salt rounds = 10), tuyệt đối không lưu plain text.
- Kiểm tra ở cả Client (phản hồi tức thì) và Server (bắt buộc).

### Tạo và xác minh JWT HS256
- `JWT_SECRET` ngẫu nhiên, bí mật, tối thiểu 32 ký tự, cấu hình an toàn trong `.env`.
- Thời hạn mặc định 24 giờ (`1d`). Request đến route bảo vệ bắt buộc có header `Authorization: Bearer <token>`.

---

## 7. Danh sách API RESTful v1.1.0

Base URL: `http://localhost:5000/api`

### 7.1. Cổng thông tin & Thống kê động (Home & Stats)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/home` | Dữ liệu tổng hợp Trang chủ: kiệt tác spotlight `CR-BT-2025-08MR`, stats, featured grid, seasonal snippet, field note |
| GET | `/stats` | Chỉ số thống kê động thời gian thực từ CSDL 22 bảng (tác phẩm, nghệ nhân, làng nghề, vùng văn hóa) |
| GET | `/search` | Tìm kiếm đa diện tập trung trên tác phẩm, nghệ nhân và làng nghề di sản |

### 7.2. Tác phẩm thủ công (Crafts)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/crafts` | Danh sách tác phẩm (query: `q`, `region`, `category`, `village`, `material`, `priceRange`, `ids`, `sort=newest|price_asc|price_desc`, `page`, `limit`) kèm `facets` |
| GET | `/crafts/:id` | Chi tiết kiệt tác (hỗ trợ ID số hoặc mã `CR-BT-2025-08MR`, trả về `specs`, `processStages`, nghệ nhân N-N) |
| GET | `/crafts/:id/related` | Gợi ý sản phẩm liên quan (`by=artisan|region|category`) |

### 7.3. Nghệ nhân & Lịch hẹn thăm xưởng (Artisans & Bookings)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/artisans` | Danh sách nghệ nhân bậc thầy (phân trang, lọc theo làng nghề, vùng miền) |
| GET | `/artisans/:idOrCode` | Hồ sơ nghệ nhân (hỗ trợ ID hoặc mã REF `ART-BT-001`, trả về `milestones`, `techniqueSpecs`, `visitInfo`) |
| POST | `/visit-bookings` | Đăng ký lịch hẹn thăm xưởng (validate lead time 24h/48h, open days, max guests) |
| GET | `/visit-bookings` | Danh sách lịch hẹn đã đăng ký (yêu cầu Bearer Token) |

### 7.4. Vùng miền, Làng nghề & Bộ sưu tập mùa (Regions & Collections)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/regions` | Danh sách 6 vùng di sản văn hóa Việt Nam |
| GET | `/regions/:idOrCode` | Chi tiết vùng kèm làng nghề xác thực (`craft_villages`), tác phẩm và ghi chú điền dã (`field_notes`) |
| GET | `/seasonal-collections` | Danh sách bộ sưu tập theo mùa |
| GET | `/seasonal-collections/latest` | Bộ sưu tập mùa hiện tại (Mùa Hạ 2026 `CR-ARCH-SUMMER-26` kèm tác phẩm Hero) |

### 7.5. Yêu thích lưỡng thể (Favourites)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/favourites` | Lấy danh sách tác phẩm yêu thích của người dùng đã đăng nhập |
| GET | `/favourites/summary` | Thống kê số lượng yêu thích theo danh mục |
| POST | `/favourites/:craftId` | Thêm tác phẩm vào danh sách yêu thích |
| DELETE | `/favourites/:craftId` | Xóa một tác phẩm khỏi danh sách yêu thích |
| DELETE | `/favourites` | Xóa hàng loạt tác phẩm yêu thích (body `{ ids: [...] }` hoặc query `all=true`) |
| POST | `/favourites/sync` | Đồng bộ mảng `craftIds` từ Local Storage lên CSDL (`ON CONFLICT DO NOTHING`) |

### 7.6. Liên hệ, Bản tin & Xác thực (Contact, Newsletter & Auth)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/contact` | Gửi form liên hệ theo chủ đề (`topic`: thẩm định di sản, đặt lịch, báo chí...) |
| POST | `/newsletter` | Đăng ký nhận bản tin di sản hàng tuần (RFC 5322 regex, idempotent) |
| POST | `/auth/register` | Đăng ký tài khoản người dùng mới |
| POST | `/auth/login` | Đăng nhập tài khoản, nhận JWT token |
| GET | `/auth/me` | Lấy thông tin tài khoản hiện tại |
| PUT | `/auth/profile` | Cập nhật thông tin cá nhân (họ tên, ảnh đại diện, số điện thoại) |
| PUT | `/auth/change-password` | Đổi mật khẩu tài khoản an toàn |

---

## 8. Hướng dẫn cài đặt và chạy

### Bước 1: Khởi tạo CSDL PostgreSQL
```bash
psql -U postgres
CREATE DATABASE craftroots;
\q
```

### Bước 2: Nạp CSDL 22 Bảng và Dữ liệu hạt giống
```bash
npm run db:init          # Khởi tạo 22 bảng từ db/schema.sql
npm run db:seed          # Nạp dữ liệu chuẩn di sản từ db/seed.sql
npm run db:test          # Kiểm tra tính toàn vẹn CSDL
```

### Bước 3: Khởi chạy toàn bộ hệ thống
```bash
npm run dev              # Chạy cả Frontend (5173) và Backend (5000)
```

---

## 9. Dữ liệu kiểm thử & Tiêu chuẩn Anti-AI

- **Tài khoản mẫu đã nạp sẵn:**
  - Email: `user@craftroots.test` | Mật khẩu: `Craft@1234`
  - Email: `admin@craftroots.test` | Mật khẩu: `Craft@1234` (Vai trò `admin`)
- **Nguyên tắc Anti-AI Content (BR-15):**
  - Thuật ngữ nghề truyền thống chính xác: "men rạn tam thái", "nung củi lò bầu", "chuốt gốm bàn xoay", "sa Nam Đàn", "cẩn xà cừ".
  - Nghệ nhân Nguyễn Văn Bình: Đời thứ 5 làng gốm Bát Tràng, 42 năm nghề, thời gian tiếp nhận đặt hẹn xưởng trước 24 giờ.
  - Kiệt tác trung tâm: `CR-BT-2025-08MR` (Bình Gốm Men Rạn Cổ Dáng Tỳ Bà), giá 18.500.000 VND.

---

## 10. Tiêu chuẩn bàn giao eProject Aptech

Dự án bàn giao đầy đủ:
1. Mã nguồn hoàn chỉnh `client/`, `server/`, `db/`.
2. Toàn bộ 11 tài liệu kỹ thuật chuẩn mực trong thư mục `docs/`.
3. Bản mẫu thiết kế 9 trang Stitch trong `docs/design/` và `demo/artisan-page/`.
4. Cơ sở dữ liệu PostgreSQL 22 bảng với kịch bản migration và seed data hoàn chỉnh.
