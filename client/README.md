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
├── public/                 # Tài nguyên tĩnh (favicon.svg, media assets)
├── src/
│   ├── components/         # Linh kiện giao diện tái sử dụng
│   │   ├── common/         # Breadcrumbs, CraftCardSkeleton, PrivateRoute, Toast...
│   │   ├── layout/         # Navbar (sticky header, search, favs badge), Footer, Layout
│   │   └── modals/         # ArtisanDetailPopup, VisitBookingModal, LightboxModal, SearchModal
│   ├── context/            # Quản lý trạng thái toàn cục (AuthContext, FavouritesContext)
│   ├── hooks/              # Custom hooks: useDebounce, useLocalStorage, useModal...
│   ├── pages/              # 9 trang giao diện chính theo Stitch + trang bổ trợ
│   │   ├── HomePage.jsx             # Trang chủ: kiệt tác CR-BT-2025-08MR, stats động, field note
│   │   ├── DirectoryPage.jsx        # Danh bạ tác phẩm: facets đa diện, sort giá, phân trang
│   │   ├── CraftDetailPage.jsx      # Chi tiết tác phẩm: layout 4 cột, specs, 4 quy trình, N-N
│   │   ├── ArtisansPage.jsx         # Danh bạ nghệ nhân: lưới 3x2, click mở ArtisanDetailPopup
│   │   ├── ArtisanDetailPage.jsx    # Hồ sơ chuyên sâu: milestones, specs, widget đặt lịch hẹn
│   │   ├── RegionsPage.jsx          # Bản đồ tương tác 6 vùng di sản SVG, làng nghề, điền dã
│   │   ├── SeasonalPage.jsx         # BST Mùa Hạ 2026 CR-ARCH-SUMMER-26, curator note, Hero Craft
│   │   ├── FavouritesPage.jsx       # Yêu thích: hybrid sync, tóm tắt danh mục, xóa hàng loạt
│   │   ├── ContactPage.jsx          # Liên hệ chuyên đề (thẩm định di sản, đặt lịch), cam kết 24h
│   │   ├── LoginPage.jsx            # Đăng nhập tài khoản & tự động đồng bộ Favourites
│   │   ├── RegisterPage.jsx         # Đăng ký tài khoản mới (validate mật khẩu bcrypt)
│   │   ├── ProfilePage.jsx          # Quản lý hồ sơ cá nhân (cập nhật info, đổi mật khẩu)
│   │   └── NotFoundPage.jsx         # Trang báo lỗi 404 chuẩn giao diện di sản
│   ├── services/           # api.js (Axios client tích hợp JWT Bearer & error interceptor)
│   ├── styles/             # Design Tokens, variables.css, typography, animations
│   ├── App.jsx             # Định tuyến ứng dụng React Router v6
│   ├── index.css           # Toàn bộ CSS chuẩn hóa & Design System CraftRoots
│   └── main.jsx            # Entrypoint khởi tạo React 18 DOM
├── index.html              # Template HTML chuẩn SEO & nạp phông chữ di sản
├── vite.config.js          # Cấu hình Vite & Reverse Proxy (/api -> http://localhost:5000)
└── package.json            # Cấu hình dependencies Frontend
```
