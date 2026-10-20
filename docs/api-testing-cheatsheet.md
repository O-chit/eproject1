# CraftRoots – Sổ Tay Tổng Hợp & Hướng Dẫn Kiểm Thử REST API (API Cheatsheet)

> **Dự án:** CraftRoots – Cổng Thông Tin Khám Phá Nghề Thủ Công Truyền Thống  
> **Chương trình:** eProject – Aptech Computer Education  
> **Phiên bản:** v1.1.0  
> **Base URL:** `http://localhost:5000/api`  
> **Đặc tả gốc OpenAPI:** [api-contract.yaml](file:///c:/Users/admin/OneDrive/Desktop/aptech/eproject/eproject1/docs/api-contract.yaml) | [craftroots.postman_collection.json](file:///c:/Users/admin/OneDrive/Desktop/aptech/eproject/eproject1/docs/craftroots.postman_collection.json)

---

## Mục lục

1. [Thông tin tài khoản kiểm thử & Xác thực (Auth)](#1-thông-tin-tài-khoản-kiểm-thử--xác-thực-auth)
2. [Bảng tổng hợp nhanh toàn bộ 42 API Endpoints](#2-bảng-tổng-hợp-nhanh-toàn-bộ-42-api-endpoints)
3. [Chi tiết từng nhóm API & Lệnh mẫu kiểm thử (cURL / PowerShell)](#3-chi-tiết-từng-nhóm-api--lệnh-mẫu-kiểm-thử)
   - [3.1. Hệ thống, Trang chủ & Tìm kiếm toàn cục](#31-hệ-thống-trang-chủ--tìm-kiếm-toàn-cục)
   - [3.2. Xác thực tài khoản & Hồ sơ cá nhân (Auth & Profile)](#32-xác-thực-tài-khoản--hồ-sơ-cá-nhân-auth--profile)
   - [3.3. Dữ liệu tham chiếu Metadata (Danh mục, Chất liệu, Kỹ pháp)](#33-dữ-liệu-tham-chiếu-metadata)
   - [3.4. Vùng di sản & Bản đồ văn hóa (Regions)](#34-vùng-di-sản--bản-đồ-văn-hóa-regions)
   - [3.5. Sản phẩm & Kiệt tác thủ công (Crafts)](#35-sản-phẩm--kiệt-tác-thủ-công-crafts)
   - [3.6. Danh bạ Nghệ nhân bậc thầy (Artisans)](#36-danh-bạ-nghệ-nhân-bậc-thầy-artisans)
   - [3.7. Bộ sưu tập thường & Bộ sưu tập Mùa (Collections)](#37-bộ-sưu-tập-thường--bộ-sưu-tập-mùa-collections)
   - [3.8. Thư viện ảnh tương tác (Gallery)](#38-thư-viện-ảnh-tương-tác-gallery)
   - [3.9. Danh sách Yêu thích & Đồng bộ lưỡng thể (Favourites)](#39-danh-sách-yêu-thích--đồng-bộ-lưỡng-thể-favourites)
   - [3.10. Đặt lịch hẹn thăm xưởng (Visit Bookings)](#310-đặt-lịch-hẹn-thăm-xưởng-visit-bookings)
   - [3.11. Bản tin di sản & Biểu mẫu liên hệ (Newsletter & Contact)](#311-bản-tin-di-sản--biểu-mẫu-liên-hệ-newsletter--contact)
   - [3.12. Phân hệ Trợ lý Di sản AI Chatbot (Ollama Local)](#312-phân-hệ-trợ-lý-di-sản-ai-chatbot-ollama-local)
4. [Kiểm thử tự động toàn diện bằng 1 lệnh duy nhất](#4-kiểm-thử-tự-động-toàn-diện-bằng-1-lệnh-duy-nhất)

---

## 1. Thông tin tài khoản kiểm thử & Xác thực (Auth)

Hệ thống phân quyền **RBAC 3 cấp độ** (Admin, Editor, User). Để test các API cần quyền đăng nhập, bạn dùng các tài khoản hạt giống (Seed) sau:

| Vai trò (Role) | Email đăng nhập | Mật khẩu | Quyền hạn chính |
|---|---|---|---|
| **Admin** | `admin@craftroots.vn` | `Password123!` | Toàn quyền hệ thống: Thêm, sửa, xóa tác phẩm/nghệ nhân, duyệt liên hệ, xem booking |
| **Editor** | `editor@craftroots.vn` | `Password123!` | Thêm và chỉnh sửa nội dung kiệt tác, nghệ nhân, cập nhật trạng thái liên hệ |
| **User** | `user@craftroots.vn` | `Password123!` | Lưu yêu thích (Favourites), đồng bộ sync, đặt lịch thăm xưởng, đổi mật khẩu |

> **Quy cách truyền Token:**  
> Sau khi gọi API `/api/auth/login`, lấy chuỗi `token` trả về và gán vào Header:  
> `Authorization: Bearer <CHUỖI_JWT_TOKEN>`

---

## 2. Bảng tổng hợp nhanh toàn bộ 42 API Endpoints

### 🟢 Phân hệ Chung & Public (Khách vãng lai)
| Method | Endpoint | Mô tả ngắn gọn |
|:---:|---|---|
| `GET` | `/api/health` | Kiểm tra tình trạng máy chủ Express & kết nối PostgreSQL |
| `GET` | `/api/home` | Dữ liệu tổng hợp Trang chủ: Kiệt tác Spotlight, Featured, Stats, Làng nghề |
| `GET` | `/api/stats` | Thống kê số lượng động toàn hệ thống (Crafts, Artisans, Villages...) |
| `GET` | `/api/search?q={keyword}` | Tìm kiếm toàn văn bản đa thực thể (Tác phẩm, Nghệ nhân, Làng nghề) |
| `GET` | `/api/categories` | Danh sách danh mục phân loại thủ công |
| `GET` | `/api/materials` | Danh mục chất liệu chế tác (gốm, đất sét, lụa, đồng...) |
| `GET` | `/api/techniques` | Danh mục kỹ thuật thủ công truyền thống |
| `GET` | `/api/regions` | Danh sách 6 vùng di sản văn hóa Việt Nam |
| `GET` | `/api/regions/:id` | Chi tiết một vùng di sản |
| `GET` | `/api/regions/:id/crafts` | Danh sách tác phẩm thuộc vùng di sản tương ứng |
| `GET` | `/api/crafts` | Danh bạ tác phẩm: lọc đa diện (category, region, price, sort, pagination) |
| `GET` | `/api/crafts/:id` | Chi tiết kiệt tác: 4 giai đoạn, thông số specs, đội ngũ nghệ nhân N-N |
| `GET` | `/api/crafts/:id/related` | Danh sách tác phẩm liên quan cùng loại hoặc cùng vùng |
| `GET` | `/api/artisans` | Danh sách nghệ nhân bậc thầy (phân trang, sắp xếp) |
| `GET` | `/api/artisans/:id` | Hồ sơ chi tiết nghệ nhân: niên biểu sự nghiệp, thông số kỹ thuật, tác phẩm N-N |
| `GET` | `/api/collections` | Danh sách các bộ sưu tập tác phẩm tiêu biểu |
| `GET` | `/api/collections/:id` | Chi tiết bộ sưu tập kèm danh sách tác phẩm liên kết |
| `GET` | `/api/seasonal-collections` | Danh sách bộ sưu tập theo mùa (Xuân, Hạ, Thu, Đông) |
| `GET` | `/api/seasonal-collections/latest` | Bộ sưu tập mùa đang kích hoạt (Mùa Hạ 2026 + Tác phẩm Hero) |
| `GET` | `/api/seasonal-collections/:id` | Chi tiết bộ sưu tập mùa theo ID |
| `GET` | `/api/gallery` | Thư viện hình ảnh phục vụ Lightbox toàn màn hình |
| `POST` | `/api/newsletter` | Đăng ký nhận bản tin di sản (kiểm tra RFC 5322 & chống trùng 409) |
| `POST` | `/api/contact` | Gửi tin nhắn liên hệ chuyên đề (hỗ trợ, giám tuyển, báo chí) |
| `POST` | `/api/visit-bookings` | Đăng ký phiếu hẹn tham quan xưởng nghệ nhân |

### 🔵 Phân hệ Xác thực & Thành viên (Member / Authenticated)
| Method | Endpoint | Header yêu cầu | Mô tả ngắn gọn |
|:---:|---|:---:|---|
| `POST` | `/api/auth/register` | Không | Đăng ký tài khoản người dùng mới (mã hóa bcrypt salt 10) |
| `POST` | `/api/auth/login` | Không | Đăng nhập nhận JWT Token (thời hạn 24h) |
| `GET` | `/api/auth/me` | Bearer Token | Lấy thông tin cá nhân của tài khoản đang đăng nhập |
| `PUT` | `/api/auth/change-password` | Bearer Token | Đổi mật khẩu tài khoản |
| `GET` | `/api/favourites` | Bearer Token | Lấy danh sách tác phẩm yêu thích của người dùng |
| `POST` | `/api/favourites/:craftId` | Bearer Token | Thêm một tác phẩm vào danh sách yêu thích |
| `DELETE`| `/api/favourites/:craftId` | Bearer Token | Xóa tác phẩm khỏi danh sách yêu thích |
| `POST` | `/api/favourites/sync` | Bearer Token | Đồng bộ mảng ID từ `localStorage` lên CSDL sau khi đăng nhập |
| `GET` | `/api/favourites/summary` | Bearer Token | Thống kê số lượng yêu thích gom nhóm theo danh mục |
| `DELETE`| `/api/favourites/bulk` | Bearer Token | Xóa hàng loạt nhiều tác phẩm yêu thích cùng lúc |

### 🟡 Phân hệ Quản trị & Biên tập Di sản (Admin & Editor CMS)
| Method | Endpoint | Quyền hạn | Mô tả ngắn gọn |
|:---:|---|:---:|---|
| `POST` | `/api/crafts` | Editor / Admin | Tạo mới một tác phẩm thủ công kèm specs & process |
| `PUT` | `/api/crafts/:id` | Editor / Admin | Cập nhật thông tin tác phẩm |
| `DELETE`| `/api/crafts/:id` | Admin | Xóa bỏ tác phẩm khỏi hệ thống |
| `POST` | `/api/artisans` | Editor / Admin | Tạo hồ sơ nghệ nhân mới |
| `PUT` | `/api/artisans/:id` | Editor / Admin | Cập nhật hồ sơ nghệ nhân |
| `DELETE`| `/api/artisans/:id` | Admin | Xóa nghệ nhân khỏi hệ thống |
| `GET` | `/api/visit-bookings` | Editor / Admin | Quản lý danh sách các phiếu hẹn thăm xưởng |
| `PATCH`| `/api/visit-bookings/:id/status`| Editor / Admin | Duyệt / Từ chối phiếu hẹn (`confirmed`, `cancelled`...) |
| `GET` | `/api/contact/messages` | Editor / Admin | Xem hòm thư các tin nhắn liên hệ từ khách |
| `PATCH`| `/api/contact/messages/:id/status`| Editor / Admin | Đánh dấu trạng thái xử lý tin nhắn (`read`, `replied`...) |

### 🟣 Phân hệ Trợ lý Di sản AI Chatbot (Ollama Local)
| Method | Endpoint | Quyền hạn | Mô tả ngắn gọn |
|:---:|---|:---:|---|
| `GET` | `/api/ai/status` | Public | Kiểm tra kết nối Ollama Local & danh sách model AI sẵn sàng |
| `POST` | `/api/ai/chat` | Public | Gửi câu hỏi đến AI, nhận phản hồi kèm Rich Cards từ CSDL |
| `GET` | `/api/ai/sessions/:sessionId/history` | Public | Lấy lịch sử phiên hội thoại |
| `DELETE`| `/api/ai/sessions/:sessionId` | Public | Xóa lịch sử phiên hội thoại |

---

## 3. Chi tiết từng nhóm API & Lệnh mẫu kiểm thử

> 💡 **Mẹo:** Bạn có thể mở PowerShell trên Windows hoặc Terminal để copy dán trực tiếp các lệnh bên dưới.

### 3.1. Hệ thống, Trang chủ & Tìm kiếm toàn cục

#### 1. Kiểm tra Health Check
```powershell
# PowerShell:
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# cURL:
curl -X GET "http://localhost:5000/api/health"
```
*Phản hồi mẫu (`200 OK`):*
```json
{
  "success": true,
  "status": "UP",
  "database": "connected",
  "timestamp": "2026-10-20T10:45:00.000Z"
}
```

#### 2. Dữ liệu Trang chủ (`GET /api/home`)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/home"
```
*Trả về tác phẩm Spotlight (`CR-BT-2025-08MR`), danh sách Featured Crafts, thống kê nhanh và các làng nghề tiêu biểu.*

#### 3. Thống kê toàn trang (`GET /api/stats`)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/stats"
```

#### 4. Tìm kiếm toàn cục đa thực thể (`GET /api/search`)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/search?q=Bát Tràng"
```
*Trả về đồng thời mảng `crafts` (sản phẩm), `artisans` (nghệ nhân) và `villages` (làng nghề) khớp với từ khóa.*

---

### 3.2. Xác thực tài khoản & Hồ sơ cá nhân (Auth & Profile)

#### 1. Đăng nhập (`POST /api/auth/login`)
```powershell
$body = @{
  email = "admin@craftroots.vn"
  password = "Password123!"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $loginRes.data.token
Write-Host "JWT Token lấy được:" $token
```

#### 2. Đăng ký tài khoản mới (`POST /api/auth/register`)
```powershell
$newEmail = "tester_" + (Get-Date -Format "yyyyMMddHHmmss") + "@craftroots.vn"
$body = @{
  fullName = "Nguyễn Văn Test"
  email = $newEmail
  password = "Password123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

#### 3. Lấy thông tin cá nhân (`GET /api/auth/me`)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Headers @{ Authorization = "Bearer $token" }
```

#### 4. Đổi mật khẩu (`PUT /api/auth/change-password`)
```powershell
$body = @{
  currentPassword = "Password123!"
  newPassword = "NewPassword456!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/change-password" -Method PUT -Body $body -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
```

---

### 3.3. Dữ liệu tham chiếu Metadata

```powershell
# Danh mục:
Invoke-RestMethod -Uri "http://localhost:5000/api/categories"

# Chất liệu:
Invoke-RestMethod -Uri "http://localhost:5000/api/materials"

# Kỹ pháp chế tác:
Invoke-RestMethod -Uri "http://localhost:5000/api/techniques"
```

---

### 3.4. Vùng di sản & Bản đồ văn hóa (Regions)

```powershell
# Danh sách 6 vùng văn hóa:
Invoke-RestMethod -Uri "http://localhost:5000/api/regions"

# Chi tiết vùng Đồng Bằng Bắc Bộ (ID = 1):
Invoke-RestMethod -Uri "http://localhost:5000/api/regions/1"

# Danh sách tác phẩm thuộc vùng 1:
Invoke-RestMethod -Uri "http://localhost:5000/api/regions/1/crafts"
```

---

### 3.5. Sản phẩm & Kiệt tác thủ công (Crafts)

#### 1. Lọc danh bạ tác phẩm đa tiêu chí (Facets & Pagination)
```powershell
# Lấy trang 1, 6 tác phẩm mỗi trang, sắp xếp theo giá giảm dần:
Invoke-RestMethod -Uri "http://localhost:5000/api/crafts?page=1&limit=6&sortBy=price_desc"

# Lọc theo danh mục Gốm (category_id = 1) và khoảng giá:
Invoke-RestMethod -Uri "http://localhost:5000/api/crafts?category=1&minPrice=1000000&maxPrice=20000000"
```

#### 2. Chi tiết kiệt tác kiệt xuất (`GET /api/crafts/:id`)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/crafts/1"
```
*Trả về đầy đủ thông số kích thước (`specs`), 4 quy trình chế tác (`process_stages`) và danh sách nghệ nhân chế tác.*

#### 3. Tác phẩm liên quan (`GET /api/crafts/:id/related`)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/crafts/1/related"
```

#### 4. Thêm tác phẩm mới (Yêu cầu quyền Admin / Editor)
```powershell
$craftBody = @{
  name = "Bình Hoa Gốm Đất Đỏ Mẫu Mới"
  code = "CR-TEST-2026-01"
  regionId = 1
  categoryId = 1
  priceVnd = 3500000
  shortDescription = "Mô tả tác phẩm kiểm thử API"
  originLine = "Bát Tràng • Hà Nội"
  dimensions = "Cao 35cm x Rộng 18cm"
  specs = @(
    @{ label = "Chất liệu"; value = "Đất sét cao lanh nung củi" }
  )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/crafts" -Method POST -Body $craftBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
```

---

### 3.6. Danh bạ Nghệ nhân bậc thầy (Artisans)

```powershell
# Danh sách nghệ nhân:
Invoke-RestMethod -Uri "http://localhost:5000/api/artisans"

# Chi tiết nghệ nhân Nguyễn Văn Bình (ID = 1):
Invoke-RestMethod -Uri "http://localhost:5000/api/artisans/1"
```
*Trả về niên biểu sự nghiệp (`milestones`), chính sách đón khách xưởng (`visit_max_guests`, `visit_lead_time_hours`) và danh sách tác phẩm của nghệ nhân.*

---

### 3.7. Bộ sưu tập thường & Bộ sưu tập Mùa (Collections)

```powershell
# Danh sách BST:
Invoke-RestMethod -Uri "http://localhost:5000/api/collections"

# BST Mùa đang kích hoạt (Mùa Hạ 2026 kèm Hero Item):
Invoke-RestMethod -Uri "http://localhost:5000/api/seasonal-collections/latest"
```

---

### 3.8. Đặt lịch hẹn thăm xưởng (Visit Bookings)

#### 1. Khách gửi phiếu hẹn thăm xưởng (`POST /api/visit-bookings`)
```powershell
$booking = @{
  artisanId = 1
  fullName = "Trần Hoàng Long"
  phone = "0988123456"
  email = "long.tran@example.com"
  visitDate = "2026-11-25"
  timeSlot = "10:00"
  purpose = "Tham quan lò gốm và học hỏi kỹ pháp men rạn"
  note = "Đoàn gồm 3 người lớn"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/visit-bookings" -Method POST -Body $booking -ContentType "application/json"
```

#### 2. Admin xem và duyệt phiếu hẹn
```powershell
# Xem danh sách phiếu:
Invoke-RestMethod -Uri "http://localhost:5000/api/visit-bookings" -Headers @{ Authorization = "Bearer $token" }

# Cập nhật trạng thái duyệt (ID phiếu = 1):
$statusBody = @{ status = "confirmed" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/visit-bookings/1/status" -Method PATCH -Body $statusBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
```

---

### 3.9. Danh sách Yêu thích & Đồng bộ (Favourites)

```powershell
# Xem danh sách yêu thích:
Invoke-RestMethod -Uri "http://localhost:5000/api/favourites" -Headers @{ Authorization = "Bearer $token" }

# Thêm sản phẩm ID 1 vào yêu thích:
Invoke-RestMethod -Uri "http://localhost:5000/api/favourites/1" -Method POST -Headers @{ Authorization = "Bearer $token" }

# Đồng bộ mảng ID từ localStorage lên tài khoản:
$syncBody = @{ craftIds = @(1, 2, 3) } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/favourites/sync" -Method POST -Body $syncBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }

# Xóa sản phẩm khỏi yêu thích:
Invoke-RestMethod -Uri "http://localhost:5000/api/favourites/1" -Method DELETE -Headers @{ Authorization = "Bearer $token" }
```

---

### 3.10. Bản tin di sản & Liên hệ (Newsletter & Contact)

```powershell
# Đăng ký nhận bản tin:
$sub = @{ email = "visitor_aptech@gmail.com" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/newsletter" -Method POST -Body $sub -ContentType "application/json"

# Gửi tin nhắn liên hệ:
$contact = @{
  fullName = "Lê Thị Thảo"
  email = "thao.le@example.com"
  phone = "0909123456"
  topic = "artisan_verification"
  subject = "Yêu cầu thẩm định hiện vật cổ"
  message = "Tôi có một bình gốm muốn nhờ nghệ nhân giám định chất men..."
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/contact" -Method POST -Body $contact -ContentType "application/json"
```

---

### 3.11. Phân hệ Trợ lý Di sản AI Chatbot (Ollama Local)

#### 1. Kiểm tra trạng thái AI (`GET /api/ai/status`)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/ai/status"
```
*Phản hồi mẫu:*
```json
{
  "success": true,
  "data": {
    "provider": "ollama",
    "available": true,
    "recommendedModel": "qwen2.5:1.5b",
    "message": "Dịch vụ Ollama AI Local đang chạy sẵn sàng!"
  }
}
```

#### 2. Gửi tin nhắn hỏi đáp (`POST /api/ai/chat`)
```powershell
$aiChat = @{
  sessionId = "test_session_user_01"
  message = "Tôi muốn tìm bình gốm Bát Tràng độc bản làm quà đối tác"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/ai/chat" -Method POST -Body $aiChat -ContentType "application/json"
```
*Trả về câu trả lời tự nhiên của Ollama + mảng `richCards` chứa thông tin thực tế từ CSDL để hiển thị thẻ sản phẩm.*

#### 3. Lịch sử & Xóa hội thoại
```powershell
# Xem lịch sử phiên:
Invoke-RestMethod -Uri "http://localhost:5000/api/ai/sessions/test_session_user_01/history"

# Xóa lịch sử phiên:
Invoke-RestMethod -Uri "http://localhost:5000/api/ai/sessions/test_session_user_01" -Method DELETE
```

---

## 4. Kiểm thử tự động toàn diện bằng 1 lệnh duy nhất

Dự án đã tích hợp sẵn kịch bản kiểm thử tự động toàn bộ 100% các API trên. Bạn chỉ cần mở terminal tại thư mục gốc và chạy:

```bash
npm run api:test
```

Hệ thống sẽ tự động gửi request đến từng endpoint và hiển thị kết quả kiểm tra `[PASS]` / `[FAIL]` trực quan theo từng phân hệ.
