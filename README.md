# CraftRoots – Cổng Thông Tin Khám Phá Nghề Thủ Công Truyền Thống

> Dự án thuộc chương trình **eProject – Aptech Computer Education**  
> Ứng dụng Web khám phá di sản làng nghề truyền thống Việt Nam: sản phẩm, nghệ nhân, vùng miền, chất liệu, kỹ thuật và bộ sưu tập theo mùa.

---

## 1. Cấu trúc thư mục dự án

Hệ thống được tổ chức phân tách rõ ràng giữa Frontend (`client`), Backend (`server`), Dữ liệu chung (`db`), và Môi trường thư viện phụ thuộc dùng chung (`node_modules`):

```
eproject1/
├── client/                      # Thư mục Frontend (giao diện người dùng)
├── server/                      # Thư mục Backend (Node.js & Express REST API)
│   ├── src/
│   │   ├── config/              # db.js (PostgreSQL pool), env.js (biến môi trường)
│   │   ├── controllers/         # Các controller xử lý logic nghiệp vụ
│   │   ├── middleware/          # authenticate.js, validate.js, errorHandler.js
│   │   ├── routes/              # Định nghĩa API routes RESTful
│   │   ├── utils/               # Tiện ích mã hóa bcrypt, JWT token...
│   │   └── test-db.js           # Kịch bản kiểm thử kết nối CSDL và ràng buộc dữ liệu
│   ├── .env                     # Cấu hình môi trường riêng của backend
│   ├── .env.example             # File mẫu biến môi trường backend
│   └── package.json             # Cấu hình package riêng của backend
│
├── db/                          # Dữ liệu & CSDL dùng chung toàn dự án (PostgreSQL)
│   ├── schema.sql               # DDL khởi tạo 17 bảng, khóa ngoại và chỉ mục (B-Tree, GIN FTS)
│   └── seed.sql                 # Bộ dữ liệu mẫu hạt giống (Users, Nghệ nhân, Sản phẩm, Mùa hè 2026)
│
├── node_modules/                # Môi trường thư viện phụ thuộc dùng chung của toàn dự án
├── docs/                        # Toàn bộ tài liệu đặc tả, thiết kế & kiểm thử
│   ├── README.md                # Tài liệu kỹ thuật chi tiết
│   ├── feature-spec.md          # Đặc tả nghiệp vụ & User Stories
│   ├── architecture.md          # Kiến trúc hệ thống & giao tiếp module
│   ├── database-schema.md       # Thiết kế CSDL & kịch bản Migration
│   ├── api-contract.yaml        # Đặc tả OpenAPI 3.0.3 (REST API)
│   ├── task-breakdown.md        # Phân rã công việc WBS & Sprints
│   ├── data.md                  # Thiết kế dữ liệu toàn diện & Data Dictionary
│   └── test-plan.md             # Kế hoạch & 10 kịch bản kiểm thử chi tiết
│
├── package.json                 # Quản lý scripts khởi chạy & dependencies chung tại root
├── .env                         # Cấu hình biến môi trường hệ thống chung
├── .gitignore                   # Cấu hình loại trừ Git (node_modules, .env...)
└── README.md                    # Hướng dẫn tổng quan toàn dự án
```

---

## 2. Các lệnh khởi chạy nhanh (Scripts tại Root)

Hệ thống hỗ trợ chạy tập trung chỉ bằng **1 lệnh duy nhất** từ thư mục gốc. 

### 🚀 Khởi chạy dự án (Khuyến nghị)
```bash
# 1. Cài đặt toàn bộ dependencies (Root & Client)
npm run install:all

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
| `npm run install:all` | Tự động cài đặt dependencies cho cả thư mục gốc và `client` |
| `npm run db:init` | Khởi tạo cấu trúc 17 bảng từ `db/schema.sql` vào CSDL PostgreSQL |
| `npm run db:seed` | Nạp dữ liệu hạt giống từ `db/seed.sql` |
| `npm run db:test` | Kiểm tra kết nối CSDL, thống kê bảng và kiểm chứng quan hệ N-N |

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
# Nạp schema (tạo bảng, khóa ngoại, indexes):
npm run db:init

# Nạp dữ liệu mẫu (nghệ nhân, tác phẩm, người dùng):
npm run db:seed

# Kiểm tra kết nối và tính toàn vẹn:
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

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 5. Tài liệu đặc tả kỹ thuật chi tiết

Để tìm hiểu chi tiết các phân hệ, vui lòng tham khảo thư mục [`docs/`](file:///e:/eproject1/docs/):
- **Kiến trúc hệ thống:** [docs/architecture.md](file:///e:/eproject1/docs/architecture.md)
- **Đặc tả API:** [docs/api-contract.yaml](file:///e:/eproject1/docs/api-contract.yaml)
- **Thiết kế CSDL & Migration:** [docs/database-schema.md](file:///e:/eproject1/docs/database-schema.md)
- **Data Dictionary:** [docs/data.md](file:///e:/eproject1/docs/data.md)
- **Đặc tả tính năng:** [docs/feature-spec.md](file:///e:/eproject1/docs/feature-spec.md)
- **Kế hoạch kiểm thử:** [docs/test-plan.md](file:///e:/eproject1/docs/test-plan.md)

