/**
 * Test script toàn diện kiểm tra 17 API endpoints theo api-contract.yaml
 */
const runTests = async () => {
  // Kiểm tra nếu server chưa chạy thì khởi động
  try {
    await fetch('http://localhost:5000/api/health');
  } catch (_) {
    const { startServer } = require('./server');
    if (startServer) await startServer();
    await new Promise((r) => setTimeout(r, 1500));
  }

  const BASE_URL = 'http://localhost:5000/api';
  let passed = 0;
  let failed = 0;
  let authToken = '';

  const assert = (condition, title, details = '') => {
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title} - ${details}`);
      failed++;
    }
  };

  console.log('\n======================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG TẤT CẢ ENDPOINTS API');
  console.log('======================================================\n');

  try {
    // 1. Health check
    console.log('--- 1. Kiểm tra Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.success, 'GET /api/health');

    // 2. Metadata: Categories, Materials, Techniques
    console.log('\n--- 2. Kiểm tra Metadata (Categories, Materials, Techniques) ---');
    const catRes = await fetch(`${BASE_URL}/categories`);
    const catData = await catRes.json();
    assert(catRes.status === 200 && Array.isArray(catData.data) && catData.data.length > 0, 'GET /api/categories');

    const matRes = await fetch(`${BASE_URL}/materials`);
    const matData = await matRes.json();
    assert(matRes.status === 200 && Array.isArray(matData.data) && matData.data.length > 0, 'GET /api/materials');

    const techRes = await fetch(`${BASE_URL}/techniques`);
    const techData = await techRes.json();
    assert(techRes.status === 200 && Array.isArray(techData.data) && techData.data.length > 0, 'GET /api/techniques');

    // 3. Regions
    console.log('\n--- 3. Kiểm tra Vùng miền (Regions) ---');
    const regRes = await fetch(`${BASE_URL}/regions`);
    const regData = await regRes.json();
    assert(regRes.status === 200 && Array.isArray(regData.data), 'GET /api/regions');

    const regCraftsRes = await fetch(`${BASE_URL}/regions/1/crafts`);
    const regCraftsData = await regCraftsRes.json();
    assert(regCraftsRes.status === 200 && Array.isArray(regCraftsData.data), 'GET /api/regions/1/crafts');

    // 4. Crafts
    console.log('\n--- 4. Kiểm tra Sản phẩm (Crafts) ---');
    const craftsRes = await fetch(`${BASE_URL}/crafts?page=1&limit=5`);
    const craftsData = await craftsRes.json();
    assert(craftsRes.status === 200 && craftsData.pagination && Array.isArray(craftsData.data), 'GET /api/crafts (Phân trang)');

    const craftDetailRes = await fetch(`${BASE_URL}/crafts/1`);
    const craftDetailData = await craftDetailRes.json();
    assert(
      craftDetailRes.status === 200 &&
      craftDetailData.data &&
      Array.isArray(craftDetailData.data.artisans) &&
      Array.isArray(craftDetailData.data.materials),
      'GET /api/crafts/1 (Chi tiết quan hệ N-N)'
    );

    const relatedRes = await fetch(`${BASE_URL}/crafts/1/related`);
    const relatedData = await relatedRes.json();
    assert(relatedRes.status === 200 && Array.isArray(relatedData.data), 'GET /api/crafts/1/related');

    // 5. Artisans
    console.log('\n--- 5. Kiểm tra Nghệ nhân (Artisans) ---');
    const artisansRes = await fetch(`${BASE_URL}/artisans`);
    const artisansData = await artisansRes.json();
    assert(artisansRes.status === 200 && Array.isArray(artisansData.data), 'GET /api/artisans');

    const artisanDetailRes = await fetch(`${BASE_URL}/artisans/1`);
    const artisanDetailData = await artisanDetailRes.json();
    assert(
      artisanDetailRes.status === 200 &&
      artisanDetailData.data &&
      Array.isArray(artisanDetailData.data.crafts),
      'GET /api/artisans/1 (Hồ sơ kèm tác phẩm N-N)'
    );

    // 6. Collections & Seasonal Collections
    console.log('\n--- 6. Kiểm tra Bộ sưu tập & Bộ sưu tập mùa ---');
    const colsRes = await fetch(`${BASE_URL}/collections`);
    const colsData = await colsRes.json();
    assert(colsRes.status === 200 && Array.isArray(colsData.data), 'GET /api/collections');

    const seasonRes = await fetch(`${BASE_URL}/seasonal-collections`);
    const seasonData = await seasonRes.json();
    assert(seasonRes.status === 200 && Array.isArray(seasonData.data), 'GET /api/seasonal-collections');

    const seasonDetailRes = await fetch(`${BASE_URL}/seasonal-collections/1`);
    const seasonDetailData = await seasonDetailRes.json();
    assert(
      seasonDetailRes.status === 200 &&
      seasonDetailData.data &&
      seasonDetailData.data.heroCraft !== undefined &&
      Array.isArray(seasonDetailData.data.curatedCrafts),
      'GET /api/seasonal-collections/1 (Hero Craft & Curated Items)'
    );

    // 7. Gallery
    console.log('\n--- 7. Kiểm tra Gallery ---');
    const galleryRes = await fetch(`${BASE_URL}/gallery`);
    const galleryData = await galleryRes.json();
    assert(galleryRes.status === 200 && Array.isArray(galleryData.data), 'GET /api/gallery');

    // 8. Auth: Register / Login / Me
    console.log('\n--- 8. Kiểm tra Xác thực (Auth) ---');
    const testEmail = `test_${Date.now()}@craftroots.vn`;
    const regAuthRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Kiểm Thử Viên',
        email: testEmail,
        password: 'Password@2026',
      }),
    });
    const regAuthData = await regAuthRes.json();
    assert(regAuthRes.status === 201 && regAuthData.token, 'POST /api/auth/register');

    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password@2026',
      }),
    });
    const loginData = await loginRes.json();
    authToken = loginData.token;
    assert(loginRes.status === 200 && authToken, 'POST /api/auth/login');

    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.data && meData.data.email === testEmail, 'GET /api/auth/me (BearerAuth)');

    // 9. Favourites & Hybrid Sync
    console.log('\n--- 9. Kiểm tra Yêu thích (Favourites & Hybrid Sync) ---');
    const addFavRes = await fetch(`${BASE_URL}/favourites/1`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(addFavRes.status === 201, 'POST /api/favourites/1');

    const getFavRes = await fetch(`${BASE_URL}/favourites`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const getFavData = await getFavRes.json();
    assert(getFavRes.status === 200 && Array.isArray(getFavData.data) && getFavData.data.length > 0, 'GET /api/favourites');

    const syncFavRes = await fetch(`${BASE_URL}/favourites/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ craftIds: [2, 3] }),
    });
    const syncFavData = await syncFavRes.json();
    assert(syncFavRes.status === 200 && syncFavData.syncedCount >= 0, 'POST /api/favourites/sync (Hybrid Sync)');

    const delFavRes = await fetch(`${BASE_URL}/favourites/1`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(delFavRes.status === 200, 'DELETE /api/favourites/1');

    // 10. Contact
    console.log('\n--- 10. Kiểm tra Form Liên hệ (Contact) ---');
    const contactRes = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Nguyễn Văn Test',
        email: 'test@example.com',
        phone: '0987654321',
        subject: 'Hỏi về làng gốm Bát Tràng',
        message: 'Nội dung tin nhắn kiểm thử hệ thống CraftRoots ít nhất 10 ký tự',
      }),
    });
    const contactData = await contactRes.json();
    assert(contactRes.status === 201 && contactData.success, 'POST /api/contact');

    console.log('\n======================================================');
    console.log(`📊 TỔNG KẾT: ${passed} PASSED | ${failed} FAILED`);
    console.log('======================================================\n');

    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error('Lỗi kiểm thử:', err);
    process.exit(1);
  }
};

runTests();
