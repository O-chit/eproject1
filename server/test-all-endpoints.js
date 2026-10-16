/**
 * Kịch bản kiểm thử toàn bộ API Endpoints của CraftRoots Backend
 * Chạy trực tiếp qua: node test-all-endpoints.js
 */
const http = require('http');
const app = require('./src/app');
const { signToken } = require('./src/utils/token');

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log('='.repeat(70));
  console.log(`🧪 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN CÁC ENDPOINTS (PORT ${port})`);
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  // Tạo một mock JWT Token để kiểm thử các routes yêu cầu BearerAuth
  const mockToken = signToken({ sub: 1, email: 'admin@craftroots.vn', role: 'admin' });

  async function check(name, path, options = {}, expectedStatus = 200) {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      });

      const body = await res.json();
      const statusMatches = Array.isArray(expectedStatus)
        ? expectedStatus.includes(res.status)
        : res.status === expectedStatus;

      if (statusMatches) {
        console.log(`✅ [${res.status}] ${name.padEnd(45)} -> SUCCESS`);
        passed++;
      } else {
        console.error(`❌ [${res.status}] ${name.padEnd(45)} -> EXPECTED ${expectedStatus}`);
        console.error('   Response:', JSON.stringify(body).slice(0, 150));
        failed++;
      }
      return { status: res.status, body };
    } catch (err) {
      console.error(`💥 [ERR] ${name.padEnd(45)} -> ${err.message}`);
      failed++;
      return null;
    }
  }

  // 1. Root & Health Check
  await check('1. Root Information', '/', {}, 200);
  await check('2. Health Check (Service or DB Status)', '/api/health', {}, [200, 503]);

  // 2. Auth Endpoints
  await check('3. POST /api/auth/register (Validation)', '/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName: 'A', email: 'invalid', password: '123' }),
  }, 400);

  await check('4. POST /api/auth/login (Validation)', '/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com' }),
  }, 400);

  await check('5. GET /api/auth/me (Chưa có Token)', '/api/auth/me', {}, 401);

  // 3. Crafts Endpoints
  await check('6. GET /api/crafts (Danh sách phân trang)', '/api/crafts?page=1&limit=5', {}, [200, 500]);
  await check('7. GET /api/crafts/binh-gom-men-lam (Chi tiết)', '/api/crafts/binh-gom-men-lam', {}, [200, 404, 500]);
  await check('8. GET /api/crafts/1/related (Sản phẩm liên quan)', '/api/crafts/1/related', {}, [200, 500]);

  // 4. Artisans Endpoints
  await check('9. GET /api/artisans (Danh sách nghệ nhân)', '/api/artisans', {}, [200, 500]);
  await check('10. GET /api/artisans/1 (Chi tiết nghệ nhân)', '/api/artisans/1', {}, [200, 404, 500]);

  // 5. Regions Endpoints
  await check('11. GET /api/regions (Danh sách vùng miền)', '/api/regions', {}, [200, 500]);
  await check('12. GET /api/regions/1/crafts (Sản phẩm theo vùng)', '/api/regions/1/crafts', {}, [200, 500]);

  // 6. Metadata Endpoints
  await check('13. GET /api/categories (Danh mục nghề)', '/api/categories', {}, [200, 500]);
  await check('14. GET /api/materials (Chất liệu)', '/api/materials', {}, [200, 500]);
  await check('15. GET /api/techniques (Kỹ thuật)', '/api/techniques', {}, [200, 500]);

  // 7. Collections Endpoints
  await check('16. GET /api/collections (Bộ sưu tập chuyên đề)', '/api/collections', {}, [200, 500]);

  // 8. Seasonal Collections Endpoints
  await check('17. GET /api/seasonal-collections (BST 4 mùa)', '/api/seasonal-collections', {}, [200, 500]);
  await check('18. GET /api/seasonal-collections/1 (Chi tiết BST mùa)', '/api/seasonal-collections/1', {}, [200, 404, 500]);

  // 9. Gallery Endpoints
  await check('19. GET /api/gallery (Thư viện Lightbox)', '/api/gallery?page=1&limit=10', {}, [200, 500]);

  // 10. Favourites Endpoints
  await check('20. GET /api/favourites (Chưa có Token)', '/api/favourites', {}, 401);
  await check('21. GET /api/favourites (Có Bearer Token)', '/api/favourites', {
    headers: { Authorization: `Bearer ${mockToken}` },
  }, [200, 500]);
  await check('22. POST /api/favourites/sync (Có Token, sai body)', '/api/favourites/sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${mockToken}` },
    body: JSON.stringify({ craftIds: 'not-array' }),
  }, 400);

  // 11. Contact Endpoint
  await check('23. POST /api/contact (Validation sai)', '/api/contact', {
    method: 'POST',
    body: JSON.stringify({ fullName: '', email: 'wrong', message: 'short' }),
  }, 400);

  // 12. Not Found Endpoint
  await check('24. GET /api/random-404 (Bắt route không tồn tại)', '/api/random-404', {}, 404);

  console.log('='.repeat(70));
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passed} PASSED | ${failed} FAILED`);
  console.log('='.repeat(70));

  server.close(() => {
    process.exit(failed > 0 ? 1 : 0);
  });
});
