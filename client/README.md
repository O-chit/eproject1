# CraftRoots – Giao Diện Người Dùng (Client)

> Module Frontend xây dựng trên nền tảng **React 18** và **Vite**, cung cấp trải nghiệm khám phá các làng nghề và sản phẩm thủ công truyền thống Việt Nam.

---

## 1. Cổng hoạt động & Cơ chế chạy ngầm

* **Cổng giao diện chính:** `http://localhost:5173` (Tự động mở khi chạy `npm run dev`).
* **Kết nối Backend ngầm:** Giao diện giao tiếp với Backend API qua cơ chế **Vite Reverse Proxy** cấu hình tại [`vite.config.js`](file:///e:/eproject1/client/vite.config.js):
  * Mọi request từ Frontend có tiền tố `/api/*` sẽ được tự động chuyển tiếp ngầm đến máy chủ Backend chạy tại `http://localhost:5000`.
  * Người dùng và kiểm thử viên chỉ cần tương tác trên một địa chỉ duy nhất: `http://localhost:5173`.

---

## 2. Các lệnh khởi chạy

### Cách 1: Khởi chạy tích hợp cùng Backend (Khuyến nghị)
Đứng tại **thư mục gốc dự án** (`eproject1`), chạy:
```bash
npm run dev
```
*(Backend sẽ tự động bật ngầm, Frontend sẽ mở giao diện chính trên trình duyệt).*

### Cách 2: Khởi chạy riêng Frontend
Từ thư mục gốc dự án:
```bash
# Khởi động máy chủ phát triển Vite:
npm run client:dev

# Đóng gói mã nguồn cho môi trường Production:
npm run client:build

# Xem thử bản đóng gói (preview production build):
npm run client:preview
```

---

## 3. Cấu trúc thư mục Frontend

```
client/
├── public/                 # Tài nguyên tĩnh (favicon.svg)
├── src/
│   ├── components/         # Các thành phần giao diện tái sử dụng (Navbar, Footer, Card...)
│   ├── context/            # Context API (AuthContext quản lý trạng thái đăng nhập)
│   ├── pages/              # Các trang chính (Home, Directory, Artisans, Regions, Seasonal...)
│   ├── App.jsx             # Định tuyến Router (react-router-dom)
│   ├── index.css           # Toàn bộ CSS & Design System chuẩn CraftRoots
│   └── main.jsx            # Entrypoint của React ứng dụng
├── index.html              # Template HTML chuẩn SEO
├── vite.config.js          # Cấu hình Vite Dev Server & Reverse Proxy (/api -> :5000)
└── package.json            # Quản lý dependencies Frontend
```
