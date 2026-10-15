# CraftRoots – Cổng Thông Tin Khám Phá Nghề Thủ Công Truyền Thống

> **Dự án:** CraftRoots – Cổng Thông Tin Khám Phá Nghề Thủ Công Truyền Thống  
> **Chương trình:** eProject – Aptech Computer Education  
> **Phiên bản hệ thống:** v1.1.0  
> **Kiến trúc:** React 18 SPA + Node.js Express REST API + PostgreSQL 14+ (22 bảng)  
> Ứng dụng Web khám phá di sản làng nghề truyền thống Việt Nam: kiệt tác thủ công, nghệ nhân bậc thầy, 6 vùng di sản, làng nghề xác thực, chất liệu, kỹ pháp và bộ sưu tập theo mùa bám sát 9 mẫu thiết kế trực quan Stitch.

---

## 1. Cấu trúc thư mục dự án

Hệ thống được tổ chức phân tách rõ ràng giữa Frontend (`client`), Backend (`server`), Dữ liệu chung (`db`), và Môi trường thư viện phụ thuộc dùng chung (`node_modules`):

```
eproject1/
├── client/                      # Thư mục Frontend (React 18 + Vite SPA, bám sát 9 thiết kế Stitch)
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
├── server/                      # Thư mục Backend (Node.js & Express REST API v1.1.0)
│   ├── src/
│   │   ├── config/              # db.js (PostgreSQL pool), env.js (biến môi trường an toàn)
│   │   ├── controllers/         # auth, crafts, artisans, regions, collections, favourites, contact, home, search, bookings, newsletter
│   │   ├── middleware/          # authenticate.js, validate.js, errorHandler.js
│   │   ├── routes/              # Định nghĩa API routes RESTful v1.1.0
│   │   ├── utils/               # Tiện ích mã hóa bcrypt, JWT token...
│   │   └── test-db.js           # Kịch bản kiểm thử kết nối CSDL và ràng buộc dữ liệu 22 bảng
│   ├── .env                     # Cấu hình môi trường riêng của backend
│   ├── .env.example             # File mẫu biến môi trường backend
│   └── package.json             # Cấu hình package riêng của backend
│
├── db/                          # Dữ liệu & CSDL dùng chung toàn dự án (PostgreSQL 22 bảng)
│   ├── migrations/              # Kịch bản nâng cấp schema (001_expand_schema.sql)
│   ├── schema.sql               # DDL khởi tạo 22 bảng, khóa ngoại và chỉ mục (B-Tree, GIN FTS)
│   └── seed.sql                 # Bộ dữ liệu mẫu hạt giống chuẩn di sản (Anti-AI Content)
│
├── node_modules/                # Môi trường thư viện phụ thuộc dùng chung của toàn dự án
├── demo/                        # Mẫu giao diện & Hệ thống thiết kế (Design System)
│   └── artisan-page/            # Giao diện Danh sách & Chi tiết Nghệ nhân
│       ├── DESIGN.md            # Hệ thống thiết kế CraftRoots & đặc tả Artisan Detail Popup
│       ├── code.html            # Bản mẫu giao diện HTML hoàn chỉnh
│       └── screen.png           # Ảnh chụp màn hình giao diện
├── docs/                        # Toàn bộ tài liệu đặc tả, thiết kế & kiểm thử
│   ├── README.md                # Tài liệu kỹ thuật chi tiết
│   ├── DECISIONS.md             # Nhật ký quyết định kiến trúc & đối soát 9 trang Stitch
│   ├── DESIGN.md                # Design system CraftRoots & đặc tả Artisan Detail Popup Modal
│   ├── feature-spec.md          # Đặc tả nghiệp vụ v1.1.0 & User Stories
│   ├── architecture.md          # Kiến trúc hệ thống v1.1.0 & giao tiếp module
│   ├── database-schema.md       # Thiết kế CSDL v1.1.0 (22 bảng) & Migration
│   ├── data.md                  # Từ điển dữ liệu toàn diện 22 bảng & DDL
│   ├── api-contract.yaml        # Đặc tả OpenAPI 3.0.3 v1.1.0 (REST API)
│   ├── task-breakdown.md        # Phân rã công việc WBS Phases 0 – 8
│   ├── test-plan.md             # Kế hoạch & 10 kịch bản kiểm thử chi tiết v1.1.0
│   └── design/                  # 9 bản thiết kế HTML / Stitch tham chiếu
│
├── package.json                 # Quản lý scripts khởi chạy & dependencies chung tại root
├── .env                         # Cấu hình biến môi trường hệ thống chung
├── .gitignore                   # Cấu hình loại trừ Git (node_modules, .env...)
└── README.md                    # Hướng dẫn tổng quan toàn dự án (file này)
```

---

## 2. Các lệnh khởi chạy nhanh (Scripts tại Root)

Hệ thống hỗ trợ chạy tập trung chỉ bằng **1 lệnh duy nhất** từ thư mục gốc. 

### 🚀 Khởi chạy dự án (Khuyến nghị)
```bash
# 1. Cài đặt toàn bộ dependencies (Frontend & Backend gộp chung)
npm install

# 2. Khởi chạy toàn bộ hệ thống
npm run dev
```

> [!NOTE]
> **Cơ chế hoạt động khi chạy `npm run dev`:**
> * **Cổng chính giao diện:** Frontend (React + Vite) khởi chạy tại `http://localhost:5173` và tự động mở trình duyệt.
> * **Backend chạy ngầm:** Máy chủ Express API chạy ngầm tại `http://localhost:5000`.
> * **Vite Reverse Proxy:** Toàn bộ request gọi đến `/api/*` từ giao diện sẽ được Vite tự động chuyển tiếp ngầm về backend `http://localhost:5000`, giúp người dùng chỉ cần tập trung làm việc trên một cổng duy nhất là `5173`.

### 📋 Bảng danh mục lệnh điều khiển tại Root

| Lệnh | Mô tả chi tiết |
|---|---|
| `npm run dev` | **[Chính]** Chạy đồng thời: Backend chạy ngầm, Frontend mở cổng chính `http://localhost:5173` |
| `npm run client:dev` | Chỉ chạy riêng Frontend Vite (`http://localhost:5173`) |
| `npm run client:build` | Build đóng gói mã nguồn Frontend ra thư mục `client/dist` |
| `npm run server:dev` | Chỉ chạy riêng máy chủ Backend API với nodemon (`http://localhost:5000`) |
| `npm run server:start` | Khởi động máy chủ backend API ở chế độ Production |
| `npm run api:test` | Kiểm thử tự động endpoints REST API (Auth, Crafts, Artisans, Collections...) |
| `npm run db:test` | Kiểm tra kết nối CSDL, thống kê 22 bảng và kiểm chứng quan hệ N-N |
| `npm run db:init` | Khởi tạo cấu trúc 22 bảng từ `db/schema.sql` vào CSDL PostgreSQL |
| `npm run db:seed` | Nạp dữ liệu hạt giống từ `db/seed.sql` chuẩn di sản (Anti-AI) |

---

## 3. Hướng dẫn thiết lập Cơ sở dữ liệu

### Bước 1: Tạo Database PostgreSQL
```bash
psql -U postgres
CREATE DATABASE craftroots;
\q
```

### Bước 2: Nạp dữ liệu và kiểm tra
Chạy trực tiếp từ thư mục gốc dự án:
```bash
# Nạp schema (tạo 22 bảng, khóa ngoại, indexes):
npm run db:init

# Nạp dữ liệu mẫu (6 vùng di sản, 6 nghệ nhân bậc thầy, kiệt tác Bát Tràng, BST mùa hạ):
npm run db:seed

# Kiểm tra kết nối và tính toàn vẹn 22 bảng:
npm run db:test
```

---

## 4. Cấu hình biến môi trường (`.env`)

Cập nhật thông tin kết nối trong file `.env` ở thư mục gốc:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=craftroots
DB_USER=postgres
DB_PASSWORD=your_password
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/craftroots

# JWT Authentication
JWT_SECRET=craftroots_super_secret_jwt_key_2026_very_long_and_secure
JWT_EXPIRES_IN=1d

# CORS (Hỗ trợ nhiều nguồn phân tách bằng dấu phẩy)
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

---

## 5. Tài liệu đặc tả kỹ thuật chi tiết

Vui lòng tham khảo thư viện tài liệu tại thư mục [`docs/`](file:///e:/eproject1/docs/):
- **Nhật ký quyết định & Đối soát Stitch:** [docs/DECISIONS.md](file:///e:/eproject1/docs/DECISIONS.md) (Đối soát 9 trang Stitch và 9 quyết định kỹ thuật cốt lõi)
- **Hệ thống thiết kế & Đặc tả Artisan Popup:** [docs/DESIGN.md](file:///e:/eproject1/docs/DESIGN.md) (Design system "CraftRoots", tokens mở rộng và đặc tả chi tiết component **Artisan Detail Popup Modal**)
- **Kiến trúc hệ thống v1.1.0:** [docs/architecture.md](file:///e:/eproject1/docs/architecture.md)
- **Đặc tả API OpenAPI 3.0.3 v1.1.0:** [docs/api-contract.yaml](file:///e:/eproject1/docs/api-contract.yaml)
- **Thiết kế CSDL & Migration (22 bảng):** [docs/database-schema.md](file:///e:/eproject1/docs/database-schema.md)
- **Data Dictionary 22 bảng & DDL:** [docs/data.md](file:///e:/eproject1/docs/data.md)
- **Đặc tả nghiệp vụ & Business Rules:** [docs/feature-spec.md](file:///e:/eproject1/docs/feature-spec.md)
- **Phân rã công việc WBS Phases 0 – 8:** [docs/task-breakdown.md](file:///e:/eproject1/docs/task-breakdown.md)
- **Kế hoạch & 10 Luồng kiểm thử chi tiết:** [docs/test-plan.md](file:///e:/eproject1/docs/test-plan.md)

---

## 6. Điểm nhấn kiến trúc v1.1.0

1. **Bám sát 9 mẫu thiết kế trực quan Stitch:** Trang chủ, Danh bạ tác phẩm, Chi tiết tác phẩm 4 cột, Danh bạ nghệ nhân, Hồ sơ chuyên sâu, Bản đồ 6 vùng di sản SVG, BST Mùa Hạ 2026, Yêu thích, Liên hệ & Xác thực.
2. **Cơ sở dữ liệu 22 bảng (v1.1.0):** Bổ sung 5 bảng thực thể mở rộng: `craft_villages` (làng nghề xác thực), `artisan_milestones` (niên biểu nghệ nhân), `visit_bookings` (lịch hẹn thăm xưởng), `newsletter_subscribers` (bản tin di sản), `field_notes` (ghi chép điền dã).
3. **Component đặc tả Artisan Detail Popup Modal:** Mở popup chi tiết khi click bất kỳ vị trí nào trên thẻ nghệ nhân, hỗ trợ 6 view, 5 tabs thông tin, bẫy tiêu điểm (focus trap), đóng bằng phím ESC hoặc click backdrop.
4. **Quy chuẩn đặt lịch thăm xưởng (`visit_bookings`):** Quy định lead time 24h cho Nghệ nhân Nguyễn Văn Bình / 48h mặc định, kiểm tra ngày mở cửa (`open_days`), và giới hạn số khách (`max_guests_per_slot`).
5. **Tiêu chuẩn dữ liệu Anti-AI (BR-15):** Toàn bộ dữ liệu sử dụng thuật ngữ di sản chuẩn xác, không bịa đặt niên đại, loại bỏ hoàn toàn số liệu thống kê mock tĩnh (counters tổng hợp trực tiếp từ CSDL).
