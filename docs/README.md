# CraftRoots – Cổng thông tin khám phá nghề thủ công truyền thống

CraftRoots là cổng thông tin số (craft discovery portal) tập hợp thông tin về các nghề thủ công truyền thống vào một trải nghiệm web duy nhất, có tổ chức và trực quan. Người dùng có thể khám phá sản phẩm theo vùng miền, chất liệu, kỹ thuật; tìm hiểu hồ sơ nghệ nhân; xem bộ sưu tập ảnh tương tác và lưu các sản phẩm yêu thích.

> Dự án thuộc chương trình **eProject – Aptech**, xây dựng dưới dạng ứng dụng một trang (SPA) responsive, có hỗ trợ xác thực người dùng an toàn.

---

## Mục lục

1. [Tính năng](#1-tính-năng)
2. [Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
5. [Cơ sở dữ liệu PostgreSQL](#5-cơ-sở-dữ-liệu-postgresql)
6. [Xác thực: JWT + bcrypt](#6-xác-thực-jwt--bcrypt)
7. [Danh sách API](#7-danh-sách-api)
8. [Yêu cầu hệ thống](#8-yêu-cầu-hệ-thống)
9. [Hướng dẫn cài đặt và chạy](#9-hướng-dẫn-cài-đặt-và-chạy)
10. [Biến môi trường](#10-biến-môi-trường)
11. [Dữ liệu kiểm thử](#11-dữ-liệu-kiểm-thử)
12. [Yêu cầu phi chức năng](#12-yêu-cầu-phi-chức-năng)
13. [Sản phẩm bàn giao](#13-sản-phẩm-bàn-giao)
14. [Giả định](#14-giả-định)

---

## 1. Tính năng

### Dành cho khách truy cập
| # | Chức năng | Mô tả |
|---|-----------|-------|
| 1 | Trang chủ / Landing page | Giới thiệu thương hiệu, sản phẩm/vùng miền/bộ sưu tập nổi bật, thanh tìm kiếm nổi bật, lối tắt đến các danh mục chính |
| 2 | Danh mục sản phẩm (Craft Directory) | Hiển thị dạng lưới/thẻ responsive: tên, vùng miền, danh mục, chất liệu, ảnh đại diện; có sắp xếp và lọc |
| 3 | Tìm kiếm & bộ lọc thông minh | Tìm theo tên/từ khóa/vùng miền; lọc theo loại hình, vùng miền, chất liệu, kỹ thuật; tự cập nhật kết quả; thông báo khi không có kết quả |
| 4 | Chi tiết sản phẩm | Ảnh, bối cảnh văn hóa, vật liệu & dụng cụ, kỹ thuật chế tác, công dụng/ý nghĩa, sản phẩm liên quan |
| 5 | Hồ sơ nghệ nhân | Tên, vùng miền, chuyên môn, tiểu sử và các tác phẩm liên quan |
| 6 | Thư viện ảnh tương tác | Gallery responsive, lightbox phóng to, chuyển ảnh qua lại, alt text và chú thích |
| 7 | Khám phá vùng miền / bản đồ văn hóa | Chọn vùng miền để xem các sản phẩm gắn liền (bản đồ minh họa tĩnh) |
| 8 | Bộ sưu tập theo mùa / nổi bật | Bộ sưu tập tuyển chọn (lễ hội, dệt may, trang trí nội thất...) bằng component tái sử dụng |
| 9 | Giới thiệu CraftRoots | Mục đích, tầm nhìn, tầm quan trọng của nghề thủ công và tri thức nghệ nhân |
| 10 | Liên hệ | Form họ tên / email / tin nhắn, validate phía client + server, lưu vào PostgreSQL |
| 11 | Điều hướng & UI dùng chung | Header, footer, breadcrumbs, mobile menu, hỗ trợ bàn phím và focus rõ ràng, back-to-top, trạng thái loading/empty/validation |

### Dành cho người dùng đã đăng nhập
| # | Chức năng | Mô tả |
|---|-----------|-------|
| 12 | Đăng ký / tạo mật khẩu | Tạo tài khoản với email + mật khẩu, mật khẩu được băm bằng **bcrypt** |
| 13 | Đăng nhập / đăng xuất | Xác thực bằng **JWT** |
| 14 | Yêu thích (Favourites) | Khách lưu bằng **Local Storage**; khi đăng nhập, danh sách được đồng bộ vào **PostgreSQL** để dùng trên nhiều thiết bị |
| 15 | Hồ sơ cá nhân | Xem thông tin tài khoản và đổi mật khẩu |

---

## 2. Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | **React 18+** (SPA), React Router, Axios / Fetch API |
| Backend | **Node.js** + **Express.js** (REST API) |
| Cơ sở dữ liệu | **PostgreSQL** (driver `pg`) |
| Xác thực | **JSON Web Token (JWT)** – `jsonwebtoken` |
| Mã hóa mật khẩu | **bcrypt** (`bcrypt` hoặc `bcryptjs`) |
| Validation | `express-validator` (server), validate form (client) |
| Bảo mật bổ sung | `helmet`, `cors`, `express-rate-limit` |
| Công cụ phát triển | VS Code (+ tiện ích AI), Figma (+ plugin AI), Git, Postman |

---

## 3. Kiến trúc hệ thống

```
┌────────────────────┐   HTTP/JSON    ┌──────────────────────┐    SQL    ┌──────────────┐
│  React SPA         │ ─────────────► │  Express.js API      │ ────────► │ PostgreSQL   │
│  (client)          │ ◄───────────── │  (Node.js)           │ ◄──────── │ (craftroots) │
│  - Router, UI      │  Bearer JWT    │  - Routes/Controllers│           └──────────────┘
│  - LocalStorage    │                │  - Auth middleware   │
│    (khách)         │                │  - bcrypt, JWT       │
└────────────────────┘                └──────────────────────┘
```

**Luồng xác thực**

1. Người dùng đăng ký → server băm mật khẩu bằng bcrypt → lưu `password_hash` vào PostgreSQL.
2. Người dùng đăng nhập → server so sánh mật khẩu bằng `bcrypt.compare` → ký và trả về JWT.
3. Client lưu token và gửi kèm header `Authorization: Bearer <token>` ở các request cần bảo vệ.
4. Middleware `authenticate` xác minh JWT trước khi cho truy cập route được bảo vệ.

---

## 4. Cấu trúc thư mục

```
craftroots/
├── client/                      # React SPA
│   ├── public/
│   └── src/
│       ├── api/                 # axios instance, các hàm gọi API
│       ├── assets/
│       ├── components/          # Navbar, Footer, CraftCard, FilterBar, Lightbox, Breadcrumbs...
│       ├── context/             # AuthContext, FavouritesContext
│       ├── hooks/               # useDebounce, useLocalStorage...
│       ├── pages/               # Home, Directory, CraftDetail, Artisans, Gallery,
│       │                        # Regions, Collections, Favourites, About, Contact,
│       │                        # Login, Register, Profile
│       ├── routes/              # PrivateRoute, cấu hình router
│       ├── App.jsx
│       └── main.jsx
│
├── server/                      # Express API
│   ├── src/
│   │   ├── config/              # db.js (pg Pool), env.js
│   │   ├── controllers/         # auth, crafts, artisans, regions, collections, favourites, contact
│   │   ├── middleware/          # authenticate.js, validate.js, errorHandler.js
│   │   ├── routes/
│   │   ├── utils/               # token.js (JWT), password.js (bcrypt)
│   │   ├── app.js
│   │   └── server.js
│   ├── db/
│   │   ├── schema.sql           # tạo bảng
│   │   └── seed.sql             # dữ liệu mẫu
│   ├── .env.example
│   └── package.json
│
├── docs/                        # Báo cáo, flowchart, DFD, test data
└── README.md
```

---

## 5. Cơ sở dữ liệu PostgreSQL

> 💡 **Chi tiết thiết kế dữ liệu & Data Dictionary đầy đủ:** Xem tại [docs/data.md](file:///e:/eproject1/docs/data.md).

### Các bảng chính

| Bảng | Mục đích |
|------|----------|
| `users` | Tài khoản người dùng (email, `password_hash`, họ tên, vai trò) |
| `regions` | Vùng miền / tiểu bang và thông tin văn hóa |
| `craft_categories` | Loại hình thủ công (gốm, dệt, mây tre đan, điêu khắc...) |
| `materials` | Chất liệu |
| `techniques` | Kỹ thuật chế tác |
| `artisans` | Hồ sơ nghệ nhân |
| `crafts` | Sản phẩm thủ công |
| `craft_artisans` | **Liên kết nhiều-nhiều: nghệ nhân ↔ sản phẩm** (1 nghệ nhân nhiều sản phẩm, 1 sản phẩm nhiều nghệ nhân) |
| `craft_materials` | Liên kết nhiều-nhiều: sản phẩm ↔ chất liệu |
| `craft_techniques` | Liên kết nhiều-nhiều: sản phẩm ↔ kỹ thuật |
| `craft_images` | Ảnh của sản phẩm (có alt text và chú thích) |
| `collections` / `collection_crafts` | Bộ sưu tập chuyên đề / nổi bật |
| `seasonal_collections` / `seasonal_collection_crafts` | **Bộ sưu tập theo mùa** (Bộ mùa hè, thu, đông, xuân & các sản phẩm được chọn vào mùa) |
| `favourites` | Sản phẩm yêu thích của từng người dùng |
| `contact_messages` | Tin nhắn từ form liên hệ |

### Schema rút gọn (`server/db/schema.sql`)

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,          -- bcrypt hash, KHÔNG lưu mật khẩu gốc
  role          VARCHAR(20)  NOT NULL DEFAULT 'user',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE regions (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE craft_categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE materials (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE techniques (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE artisans (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  region_id   INT REFERENCES regions(id),
  specialty   VARCHAR(150),
  biography   TEXT,
  avatar_url  TEXT
);

CREATE TABLE crafts (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  region_id        INT REFERENCES regions(id),
  category_id      INT REFERENCES craft_categories(id),
  thumbnail_url    TEXT,
  cultural_context TEXT,
  tools            TEXT,
  process          TEXT,
  traditional_use  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quan hệ nhiều - nhiều giữa Nghệ nhân và Sản phẩm
CREATE TABLE craft_artisans (
  craft_id           INT NOT NULL REFERENCES crafts(id) ON DELETE CASCADE,
  artisan_id         INT NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
  role_title         VARCHAR(100) DEFAULT 'Chủ trì chế tác',
  contribution_notes TEXT,
  is_lead            BOOLEAN NOT NULL DEFAULT FALSE,
  display_order      INT NOT NULL DEFAULT 1,
  PRIMARY KEY (craft_id, artisan_id)
);

CREATE TABLE craft_materials (
  craft_id    INT REFERENCES crafts(id)    ON DELETE CASCADE,
  material_id INT REFERENCES materials(id) ON DELETE CASCADE,
  PRIMARY KEY (craft_id, material_id)
);

CREATE TABLE craft_techniques (
  craft_id     INT REFERENCES crafts(id)     ON DELETE CASCADE,
  technique_id INT REFERENCES techniques(id) ON DELETE CASCADE,
  PRIMARY KEY (craft_id, technique_id)
);

CREATE TABLE craft_images (
  id        SERIAL PRIMARY KEY,
  craft_id  INT REFERENCES crafts(id) ON DELETE CASCADE,
  url       TEXT NOT NULL,
  alt_text  VARCHAR(255) NOT NULL,
  caption   VARCHAR(255)
);

CREATE TABLE collections (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(150) NOT NULL,
  description TEXT,
  season      VARCHAR(50),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE collection_crafts (
  collection_id INT REFERENCES collections(id) ON DELETE CASCADE,
  craft_id      INT REFERENCES crafts(id)      ON DELETE CASCADE,
  PRIMARY KEY (collection_id, craft_id)
);

CREATE TABLE favourites (
  user_id    INT REFERENCES users(id)  ON DELETE CASCADE,
  craft_id   INT REFERENCES crafts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, craft_id)
);

CREATE TABLE contact_messages (
  id         SERIAL PRIMARY KEY,
  full_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chỉ mục hỗ trợ tìm kiếm / lọc nhanh
CREATE INDEX idx_crafts_region   ON crafts(region_id);
CREATE INDEX idx_crafts_category ON crafts(category_id);
CREATE INDEX idx_crafts_name     ON crafts USING gin (to_tsvector('simple', name));
```

---

## 6. Xác thực: JWT + bcrypt

### Quy tắc mật khẩu (khi tạo mật khẩu)
- Tối thiểu **8 ký tự**, gồm chữ hoa, chữ thường và chữ số (khuyến nghị thêm ký tự đặc biệt).
- Kiểm tra ở cả client (phản hồi tức thì) và server (bắt buộc).
- Có ô **xác nhận mật khẩu** khi đăng ký.

### Băm và kiểm tra mật khẩu – `server/src/utils/password.js`
```js
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

exports.hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);
exports.comparePassword = (plain, hash) => bcrypt.compare(plain, hash);
```

### Tạo và xác minh JWT – `server/src/utils/token.js`
```js
const jwt = require('jsonwebtoken');

exports.signToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
```

### Middleware bảo vệ route – `server/src/middleware/authenticate.js`
```js
const { verifyToken } = require('../utils/token');

module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
```

### Nguyên tắc bảo mật
- Không bao giờ lưu mật khẩu gốc; chỉ lưu `password_hash`.
- `JWT_SECRET` phải dài, ngẫu nhiên và chỉ nằm trong file `.env` (không commit lên Git).
- Thông báo lỗi đăng nhập chung chung ("Email hoặc mật khẩu không đúng") để tránh lộ thông tin tài khoản.
- Dùng truy vấn tham số hóa (`$1, $2...`) để chống SQL Injection.
- Bật `helmet`, cấu hình `cors` đúng origin, giới hạn tần suất đăng nhập bằng `express-rate-limit`.
- Phục vụ qua **HTTPS** khi triển khai thực tế.

---

## 7. Danh sách API

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Bảo vệ | Mô tả |
|--------|----------|:------:|-------|
| POST | `/auth/register` | – | Đăng ký (body: `fullName`, `email`, `password`) |
| POST | `/auth/login` | – | Đăng nhập, trả về `token` + thông tin user |
| GET | `/auth/me` | ✔ | Lấy thông tin người dùng hiện tại |
| PUT | `/auth/change-password` | ✔ | Đổi mật khẩu (`currentPassword`, `newPassword`) |

### Nội dung (công khai)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/crafts` | Danh sách sản phẩm. Query: `q`, `region`, `category`, `material`, `technique`, `sort`, `page`, `limit` |
| GET | `/crafts/:id` | Chi tiết sản phẩm (kèm ảnh, chất liệu, kỹ thuật, nghệ nhân) |
| GET | `/crafts/:id/related` | Sản phẩm liên quan |
| GET | `/artisans` · `/artisans/:id` | Danh sách / hồ sơ nghệ nhân |
| GET | `/regions` · `/regions/:id/crafts` | Vùng miền và sản phẩm theo vùng |
| GET | `/categories` · `/materials` · `/techniques` | Dữ liệu cho bộ lọc |
| GET | `/collections` · `/collections/:id` | Bộ sưu tập nổi bật / theo mùa |
| GET | `/gallery` | Ảnh cho thư viện ảnh |
| POST | `/contact` | Gửi form liên hệ |

### Yêu thích (cần đăng nhập)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/favourites` | Lấy danh sách yêu thích |
| POST | `/favourites/:craftId` | Thêm vào yêu thích |
| DELETE | `/favourites/:craftId` | Xóa khỏi yêu thích |
| POST | `/favourites/sync` | Đồng bộ danh sách từ Local Storage lên server sau khi đăng nhập |

### Ví dụ
```http
POST /api/auth/register
Content-Type: application/json

{ "fullName": "Nguyen Van A", "email": "a@example.com", "password": "Craft@1234" }
```
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "a@example.com", "password": "Craft@1234" }
```
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "fullName": "Nguyen Van A", "email": "a@example.com", "role": "user" }
}
```

---

## 8. Yêu cầu hệ thống

### Phần cứng
- CPU Intel Core i5/i7 (hoặc tương đương)
- RAM 8 GB trở lên
- Ổ cứng 500 GB HDD/SSD
- Kết nối Internet

### Phần mềm
- **Node.js** 18 LTS trở lên (kèm npm)
- **PostgreSQL** 14 trở lên
- **React** 18.x trở lên
- VS Code (khuyến nghị cài thêm tiện ích AI), Figma (plugin AI) cho thiết kế
- Trình duyệt hiện đại (Chrome, Edge, Firefox, Safari)
- Postman hoặc công cụ tương đương để kiểm thử API (tùy chọn)

---

## 9. Hướng dẫn cài đặt và chạy

### Bước 1 – Lấy mã nguồn
```bash
git clone <repository-url>
cd craftroots
```

### Bước 2 – Tạo cơ sở dữ liệu PostgreSQL
```bash
psql -U postgres
```
```sql
CREATE DATABASE craftroots;
\q
```
Nạp schema và dữ liệu mẫu:
```bash
psql -U postgres -d craftroots -f server/db/schema.sql
psql -U postgres -d craftroots -f server/db/seed.sql
```

### Bước 3 – Cài đặt và chạy Backend
```bash
cd server
npm install
cp .env.example .env     # sau đó chỉnh sửa giá trị trong .env
npm run dev              # chạy tại http://localhost:5000
```

### Bước 4 – Cài đặt và chạy Frontend
```bash
cd client
npm install
cp .env.example .env     # đặt VITE_API_URL hoặc REACT_APP_API_URL
npm run dev              # chạy tại http://localhost:5173 (Vite) hoặc :3000 (CRA)
```

### Các script thường dùng

| Thư mục | Lệnh | Mô tả |
|---------|------|-------|
| `server` | `npm run dev` | Chạy API với nodemon |
| `server` | `npm start` | Chạy API ở chế độ production |
| `client` | `npm run dev` / `npm start` | Chạy React ở chế độ phát triển |
| `client` | `npm run build` | Build bản production |

### Triển khai (tùy chọn)
- Build frontend (`npm run build`) và host trên dịch vụ static (Netlify, Vercel...) hoặc cho Express phục vụ thư mục build.
- Triển khai backend lên dịch vụ Node (Render, Railway...) và dùng PostgreSQL được quản lý (managed).
- Đặt biến môi trường production, bật HTTPS và cấu hình `CORS_ORIGIN` đúng tên miền frontend.

---

## 10. Biến môi trường

### `server/.env.example`
```env
PORT=5000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=craftroots
DB_USER=postgres
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=thay_bang_chuoi_bi_mat_dai_va_ngau_nhien
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### `client/.env.example`
```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Không commit file `.env` lên Git. Hãy thêm `.env` vào `.gitignore`.

---

## 11. Dữ liệu kiểm thử

Tài khoản mẫu (nằm trong `seed.sql`, mật khẩu đã được băm bcrypt):

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Người dùng | `user@craftroots.test` | `Craft@1234` |

Các kịch bản kiểm thử gợi ý:

| Kịch bản | Kết quả mong đợi |
|----------|------------------|
| Đăng ký email đã tồn tại | Trả về lỗi 409 |
| Đăng ký mật khẩu yếu | Báo lỗi validation |
| Đăng nhập sai mật khẩu | Lỗi 401, thông báo chung chung |
| Gọi `/favourites` không có token | Lỗi 401 |
| Gọi `/favourites` với token hết hạn | Lỗi 401 |
| Tìm kiếm từ khóa không có kết quả | Hiển thị trạng thái rỗng (empty state) |
| Lọc kết hợp vùng miền + chất liệu | Kết quả cập nhật đúng |
| Gửi form liên hệ thiếu trường / sai email | Hiển thị lỗi validation |
| Thêm/xóa yêu thích khi chưa đăng nhập | Lưu/xóa trong Local Storage |
| Đăng nhập sau khi đã có yêu thích ở Local Storage | Dữ liệu được đồng bộ lên server |

---

## 12. Yêu cầu phi chức năng

- Hoạt động mượt mà trên các trình duyệt hiện đại.
- Responsive hoàn toàn trên máy tính, máy tính bảng và thiết bị di động.
- Truy cập an toàn và xác thực đáng tin cậy (JWT + bcrypt).
- Tốc độ tải trang nhanh (lazy loading ảnh, code splitting, phân trang API).
- Kiến trúc dễ mở rộng cho các mô-đun AI trong tương lai.
- Thiết kế UI/UX thẩm mỹ, hỗ trợ truy cập (keyboard navigation, focus rõ ràng, alt text).

---

## 13. Sản phẩm bàn giao

- Định nghĩa bài toán (Problem Definition)
- Đặc tả thiết kế (Design Specifications)
- Sơ đồ: flowchart, DFD, ERD...
- Toàn bộ mã nguồn (Source Code)
- Dữ liệu kiểm thử (Test Data)
- Hướng dẫn cài đặt và triển khai (file này)
- Video clip quay lại hoạt động thực tế của website
- (Tùy chọn) URL website đã triển khai online

Toàn bộ dự án được nộp dưới dạng một tệp **ZIP** kèm tệp ReadMe liệt kê các giả định.

---

## 14. Giả định

- Đề bài gốc ưu tiên xử lý dữ liệu phía client và lưu yêu thích bằng Local Storage. Dự án này **mở rộng** thêm backend Express + PostgreSQL và xác thực JWT/bcrypt; Local Storage vẫn được giữ cho khách chưa đăng nhập.
- Nội dung sản phẩm, nghệ nhân và hình ảnh trong `seed.sql` là dữ liệu mẫu phục vụ minh họa.
- Bản đồ vùng miền dùng hình minh họa tĩnh, không phụ thuộc dịch vụ bản đồ trực tuyến.
- Mã nguồn do AI hỗ trợ tạo ra đã được rà soát, kiểm thử và chỉnh sửa trước khi nộp.

---

## Giấy phép & Liên hệ

Dự án phục vụ mục đích học tập trong chương trình eProject – Aptech.
Mọi thắc mắc vui lòng liên hệ Đội ngũ eProjects hoặc qua mục **Liên hệ** trên website.
