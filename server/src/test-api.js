/**
 * Test script toàn diện kiểm tra tất cả API endpoints theo OpenAPI 3.0.3 Contract
 * Bao gồm: Endpoints Public, Client User, và Toàn bộ Phân hệ Quản trị Admin/Editor (SEC 6.3)
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
  console.log('🧪 BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN CRAFTROOTS API v1.1.0');
  console.log('======================================================\n');

  try {
    // ----------------------------------------------------
    // 1. Health check
    // ----------------------------------------------------
    console.log('--- 1. Kiểm tra Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.success, 'GET /api/health');

    // ----------------------------------------------------
    // 2. Home, Stats & Search Endpoints
    // ----------------------------------------------------
    console.log('\n--- 2. Kiểm tra Home, Stats & Global Search ---');
    const homeRes = await fetch(`${BASE_URL}/home`);
    const homeData = await homeRes.json();
    assert(
      homeRes.status === 200 &&
      homeData.data &&
      homeData.data.spotlightCraft &&
      Array.isArray(homeData.data.featuredCrafts),
      'GET /api/home (Spotlight, Featured Crafts, Stats)'
    );

    const statsRes = await fetch(`${BASE_URL}/stats`);
    const statsData = await statsRes.json();
    assert(
      statsRes.status === 200 &&
      statsData.data &&
      typeof statsData.data.crafts === 'number',
      'GET /api/stats (Dynamic Statistics)'
    );

    const searchRes = await fetch(`${BASE_URL}/search?q=Bát Tràng`);
    const searchData = await searchRes.json();
    assert(
      searchRes.status === 200 &&
      searchData.data &&
      Array.isArray(searchData.data.crafts),
      'GET /api/search (Cross-Entity Search)'
    );

    // ----------------------------------------------------
    // 3. Metadata: Categories, Materials, Techniques
    // ----------------------------------------------------
    console.log('\n--- 3. Kiểm tra Metadata (Categories, Materials, Techniques) ---');
    const catRes = await fetch(`${BASE_URL}/categories`);
    const catData = await catRes.json();
    assert(catRes.status === 200 && Array.isArray(catData.data) && catData.data.length > 0, 'GET /api/categories');

    const matRes = await fetch(`${BASE_URL}/materials`);
    const matData = await matRes.json();
    assert(matRes.status === 200 && Array.isArray(matData.data) && matData.data.length > 0, 'GET /api/materials');

    const techRes = await fetch(`${BASE_URL}/techniques`);
    const techData = await techRes.json();
    assert(techRes.status === 200 && Array.isArray(techData.data) && techData.data.length > 0, 'GET /api/techniques');

    // ----------------------------------------------------
    // 4. Regions
    // ----------------------------------------------------
    console.log('\n--- 4. Kiểm tra Vùng miền (Regions) ---');
    const regRes = await fetch(`${BASE_URL}/regions`);
    const regData = await regRes.json();
    assert(regRes.status === 200 && Array.isArray(regData.data), 'GET /api/regions');

    const regCraftsRes = await fetch(`${BASE_URL}/regions/1/crafts`);
    const regCraftsData = await regCraftsRes.json();
    assert(regCraftsRes.status === 200 && Array.isArray(regCraftsData.data), 'GET /api/regions/1/crafts');

    // ----------------------------------------------------
    // 5. Crafts Public
    // ----------------------------------------------------
    console.log('\n--- 5. Kiểm tra Sản phẩm (Crafts Public) ---');
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

    // ----------------------------------------------------
    // 6. Artisans Public
    // ----------------------------------------------------
    console.log('\n--- 6. Kiểm tra Nghệ nhân (Artisans Public) ---');
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

    // ----------------------------------------------------
    // 7. Collections & Seasonal Collections Public
    // ----------------------------------------------------
    console.log('\n--- 7. Kiểm tra Bộ sưu tập & Bộ sưu tập mùa Public ---');
    const colsRes = await fetch(`${BASE_URL}/collections`);
    const colsData = await colsRes.json();
    assert(colsRes.status === 200 && Array.isArray(colsData.data), 'GET /api/collections');

    const seasRes = await fetch(`${BASE_URL}/seasonal-collections`);
    const seasData = await seasRes.json();
    assert(seasRes.status === 200 && Array.isArray(seasData.data), 'GET /api/seasonal-collections');

    const seasLatestRes = await fetch(`${BASE_URL}/seasonal-collections/latest`);
    const seasLatestData = await seasLatestRes.json();
    assert(
      seasLatestRes.status === 200 &&
      seasLatestData.data &&
      seasLatestData.data.heroCraft !== undefined,
      'GET /api/seasonal-collections/latest (Active Collection & Hero Item)'
    );

    const seaDetailRes = await fetch(`${BASE_URL}/seasonal-collections/1`);
    const seaDetailData = await seaDetailRes.json();
    assert(
      seaDetailRes.status === 200 &&
      seaDetailData.data &&
      Array.isArray(seaDetailData.data.curatedCrafts),
      'GET /api/seasonal-collections/1 (Curated Items)'
    );

    // ----------------------------------------------------
    // 8. Gallery
    // ----------------------------------------------------
    console.log('\n--- 8. Kiểm tra Gallery ---');
    const galRes = await fetch(`${BASE_URL}/gallery`);
    const galData = await galRes.json();
    assert(galRes.status === 200 && Array.isArray(galData.data), 'GET /api/gallery');

    // ----------------------------------------------------
    // 9. Newsletter & Contact Public
    // ----------------------------------------------------
    console.log('\n--- 9. Kiểm tra Newsletter & Contact Public ---');
    const randomSubEmail = `visitor_${Date.now()}@example.com`;
    const newsRes = await fetch(`${BASE_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: randomSubEmail }),
    });
    assert(newsRes.status === 201, 'POST /api/newsletter (Subscribe)');

    // Kiểm tra duplicate 409
    const newsDupRes = await fetch(`${BASE_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: randomSubEmail }),
    });
    assert(newsDupRes.status === 409, 'POST /api/newsletter (Duplicate Email Conflict 409)');

    const contactRes = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Nguyễn Văn Test',
        email: 'test@example.com',
        phone: '0987654321',
        topic: 'curation',
        subject: 'Hỏi về hợp tác giám tuyển',
        message: 'Nội dung tin nhắn kiểm thử hệ thống CraftRoots ít nhất 10 ký tự',
      }),
    });
    assert(contactRes.status === 201, 'POST /api/contact');

    // ----------------------------------------------------
    // 10. Visit Bookings Public
    // ----------------------------------------------------
    console.log('\n--- 10. Kiểm tra Đặt hẹn Thăm xưởng (Visit Bookings Public) ---');
    const bookingRes = await fetch(`${BASE_URL}/visit-bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artisanId: 1,
        fullName: 'Lê Hoàng Nam',
        phone: '0912345678',
        email: 'nam.le@example.com',
        visitDate: '2026-11-20',
        timeSlot: '09:30',
        purpose: 'Học hỏi quy trình làm men rạn',
        note: 'Đoàn gồm 2 người',
      }),
    });
    const bookingData = await bookingRes.json();
    assert(bookingRes.status === 201 && bookingData.data && bookingData.data.status === 'pending', 'POST /api/visit-bookings (Status pending)');
    const createdBookingId = bookingData.data?.id;

    // ----------------------------------------------------
    // 11. Auth & Profile
    // ----------------------------------------------------
    console.log('\n--- 11. Kiểm tra Xác thực & Profile User ---');
    const testEmail = `user_test_${Date.now()}@craftroots.test`;
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Nguyễn Kiểm Thử',
        email: testEmail,
        password: 'Password@123',
      }),
    });
    assert(registerRes.status === 201, 'POST /api/auth/register');

    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password@123',
      }),
    });
    const loginData = await loginRes.json();
    const userToken = loginData.token;
    assert(loginRes.status === 200 && userToken, 'POST /api/auth/login');

    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.data && meData.data.email === testEmail, 'GET /api/auth/me (BearerAuth)');

    const updateProfileRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        fullName: 'Nguyễn Kiểm Thử (Đã Cập Nhật)',
        avatarUrl: 'https://images.unsplash.com/photo-test.webp',
      }),
    });
    const updateProfileData = await updateProfileRes.json();
    assert(
      updateProfileRes.status === 200 &&
      updateProfileData.data?.fullName === 'Nguyễn Kiểm Thử (Đã Cập Nhật)',
      'PUT /api/auth/profile'
    );

    // ----------------------------------------------------
    // 12. Favourites & Hybrid Sync
    // ----------------------------------------------------
    console.log('\n--- 12. Kiểm tra Yêu thích (Favourites & Hybrid Sync) ---');
    const addFavRes = await fetch(`${BASE_URL}/favourites/1`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(addFavRes.status === 201, 'POST /api/favourites/1');

    const getFavRes = await fetch(`${BASE_URL}/favourites`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const getFavData = await getFavRes.json();
    assert(getFavRes.status === 200 && Array.isArray(getFavData.data) && getFavData.data.length > 0, 'GET /api/favourites');

    const syncFavRes = await fetch(`${BASE_URL}/favourites/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ craftIds: [2, 3] }),
    });
    const syncFavData = await syncFavRes.json();
    assert(syncFavRes.status === 200 && syncFavData.syncedCount >= 0, 'POST /api/favourites/sync (Hybrid Sync)');

    const delFavRes = await fetch(`${BASE_URL}/favourites/1`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(delFavRes.status === 200, 'DELETE /api/favourites/1');

    // ----------------------------------------------------
    // 13. Phân quyền RBAC Protection (Chặn User thường gọi API Admin)
    // ----------------------------------------------------
    console.log('\n--- 13. Kiểm tra RBAC Protection (Chặn User thường gọi API Quản trị) ---');
    const blockedCraftRes = await fetch(`${BASE_URL}/crafts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ name: 'Tác phẩm trái phép' }),
    });
    assert(blockedCraftRes.status === 403, 'User thường gọi POST /api/crafts -> 403 FORBIDDEN');

    const blockedContactMsgRes = await fetch(`${BASE_URL}/contact/messages`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(blockedContactMsgRes.status === 403, 'User thường gọi GET /api/contact/messages -> 403 FORBIDDEN');

    // ----------------------------------------------------
    // 14. ADMIN & EDITOR MANAGEMENT (SEC 6.3)
    // ----------------------------------------------------
    console.log('\n--- 14. Kiểm tra Quản trị Admin / Editor Management (SEC 6.3) ---');
    
    // Đăng nhập Editor
    const editorLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'editor@craftroots.vn',
        password: 'Craft@1234',
      }),
    });
    const editorLoginData = await editorLoginRes.json();
    const editorToken = editorLoginData.token;
    assert(editorLoginRes.status === 200 && editorToken, 'Đăng nhập vai trò Editor (editor@craftroots.vn)');

    // Đăng nhập Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@craftroots.vn',
        password: 'Craft@1234',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.token;
    assert(adminLoginRes.status === 200 && adminToken, 'Đăng nhập vai trò Admin (admin@craftroots.vn)');

    // 14.1. Crafts CRUD (Admin/Editor)
    console.log('\n[SEC 6.3 - Quản trị Tác phẩm Thủ công]');
    const testSku = `CR-TEST-${Date.now()}`;
    const createCraftRes = await fetch(`${BASE_URL}/crafts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        sku: testSku,
        name: 'Bình Gốm Men Rạn Thử Nghiệm SEC 6.3',
        slug: `binh-gom-test-${Date.now()}`,
        categoryId: 1,
        villageId: 1,
        regionId: 1,
        priceVnd: 25000000,
        coverImage: '/images/crafts/test-cover.webp',
        gallery: ['/images/crafts/test-cover.webp', '/images/crafts/test-cover-2.webp'],
        culturalContext: 'Tác phẩm chế tác phục vụ kiểm thử hệ thống quản trị',
        summary: 'Tóm tắt tác phẩm thử nghiệm',
        techniqueSpecs: {
          dimensions: 'Cao 45cm × ĐK 25cm',
          weight: '4.2kg',
          firingTemp: '1250°C',
        },
        processStages: [
          { stageNumber: 1, stageName: 'Luyện đất', description: 'Ủ đất phù sa', durationDays: 5 },
        ],
        materialIds: [1, 2],
        techniqueIds: [1],
        artisans: [{ artisanId: 1, roleTitle: 'Nghệ nhân chủ trì', isLead: true }],
        isSpotlight: false,
        status: 'published',
      }),
    });
    const createCraftData = await createCraftRes.json();
    assert(createCraftRes.status === 201 && createCraftData.data?.sku === testSku, 'POST /api/crafts (Editor tạo tác phẩm)');
    const createdCraftId = createCraftData.data?.id;

    // Cập nhật tác phẩm
    const updateCraftRes = await fetch(`${BASE_URL}/crafts/${createdCraftId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        name: 'Bình Gốm Men Rạn Thử Nghiệm SEC 6.3 (Đã sửa)',
        priceVnd: 28000000,
      }),
    });
    const updateCraftData = await updateCraftRes.json();
    assert(
      updateCraftRes.status === 200 &&
      updateCraftData.data?.name.includes('(Đã sửa)'),
      'PUT /api/crafts/:id (Editor cập nhật tác phẩm)'
    );

    // Editor thử xóa -> Phải bị 403 (Admin Only)
    const editorDelCraftRes = await fetch(`${BASE_URL}/crafts/${createdCraftId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${editorToken}` },
    });
    assert(editorDelCraftRes.status === 403, 'DELETE /api/crafts/:id (Editor bị chặn 403 - Admin Only)');

    // 14.2. Artisans CRUD (Admin/Editor)
    console.log('\n[SEC 6.3 - Quản trị Hồ sơ Nghệ nhân]');
    const testArtCode = `ART-TEST-${Date.now()}`;
    const createArtRes = await fetch(`${BASE_URL}/artisans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        refCode: testArtCode,
        fullName: 'Trần Văn Nghệ Nhân Test',
        avatar: '/images/artisans/test-artisan.webp',
        villageId: 1,
        bio: 'Tiểu sử nghệ nhân thử nghiệm',
        philosophy: 'Triết lý gìn giữ hồn cốt di sản',
        birthYear: 1970,
        yearsOfExperience: 30,
        generation: 3,
        roleTitle: 'Nghệ nhân Ưu tú',
        workshopAddress: 'Xóm 2, Bát Tràng',
        milestones: [
          { year: 2015, title: 'Giải thưởng Bàn tay vàng', description: 'Vinh danh cấp tỉnh' },
        ],
      }),
    });
    const createArtData = await createArtRes.json();
    assert(createArtRes.status === 201 && createArtData.data?.refCode === testArtCode, 'POST /api/artisans (Editor tạo nghệ nhân)');
    const createdArtId = createArtData.data?.id;

    // Cập nhật nghệ nhân
    const updateArtRes = await fetch(`${BASE_URL}/artisans/${createdArtId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        fullName: 'Trần Văn Nghệ Nhân Test (Đã sửa)',
        yearsOfExperience: 35,
      }),
    });
    const updateArtData = await updateArtRes.json();
    assert(
      updateArtRes.status === 200 &&
      updateArtData.data?.fullName.includes('(Đã sửa)'),
      'PUT /api/artisans/:id (Editor cập nhật nghệ nhân)'
    );

    // 14.3. Seasonal Collections CRUD (Admin/Editor)
    console.log('\n[SEC 6.3 - Quản trị Bộ sưu tập theo Mùa]');
    const testSeasonCode = `CR-TEST-SEASON-${Date.now()}`;
    const createSeasonRes = await fetch(`${BASE_URL}/seasonal-collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        code: testSeasonCode,
        title: 'Bộ Sưu Tập Mùa Thu Kiểm Thử 2026',
        seasonCode: 'autumn',
        year: 2026,
        description: 'Mô tả bộ sưu tập mùa thử nghiệm',
        curatorPhilosophy: 'Triết lý giám tuyển mùa thu',
        curatorName: 'Giám tuyển Test',
        bannerImage: '/images/collections/autumn-test.webp',
        heroCraftId: 1,
        crafts: [
          { craftId: 1, displayOrder: 1, isHero: true, curatorNote: 'Tác phẩm tiêu biểu' },
        ],
      }),
    });
    const createSeasonData = await createSeasonRes.json();
    assert(createSeasonRes.status === 201 && createSeasonData.data?.code === testSeasonCode, 'POST /api/seasonal-collections (Editor tạo BST mùa)');
    const createdSeasonId = createSeasonData.data?.id;

    // Cập nhật BST mùa
    const updateSeasonRes = await fetch(`${BASE_URL}/seasonal-collections/${createdSeasonId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        title: 'Bộ Sưu Tập Mùa Thu Kiểm Thử 2026 (Đã sửa)',
      }),
    });
    const updateSeasonData = await updateSeasonRes.json();
    assert(
      updateSeasonRes.status === 200 &&
      updateSeasonData.data?.title.includes('(Đã sửa)'),
      'PUT /api/seasonal-collections/:id (Editor cập nhật BST mùa)'
    );

    // 14.4. Contact Messages Management (Admin/Editor)
    console.log('\n[SEC 6.3 - Quản trị Tin nhắn Liên hệ]');
    const contactMsgsRes = await fetch(`${BASE_URL}/contact/messages?status=all&limit=5`, {
      headers: { Authorization: `Bearer ${editorToken}` },
    });
    const contactMsgsData = await contactMsgsRes.json();
    assert(
      contactMsgsRes.status === 200 &&
      Array.isArray(contactMsgsData.data) &&
      contactMsgsData.summary &&
      typeof contactMsgsData.summary.unreadCount === 'number',
      'GET /api/contact/messages (Editor xem danh sách & summary)'
    );

    // Cập nhật trạng thái tin nhắn
    const msgToUpdate = contactMsgsData.data[0];
    if (msgToUpdate) {
      const patchMsgRes = await fetch(`${BASE_URL}/contact/messages/${msgToUpdate.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${editorToken}`,
        },
        body: JSON.stringify({
          status: 'replied',
          adminNotes: 'Đã liên hệ tư vấn qua email',
        }),
      });
      const patchMsgData = await patchMsgRes.json();
      assert(
        patchMsgRes.status === 200 &&
        patchMsgData.data?.status === 'replied',
        'PATCH /api/contact/messages/:id/status (Editor đổi trạng thái tin nhắn)'
      );
    }

    // 14.5. Visit Bookings Management (Admin/Editor)
    console.log('\n[SEC 6.3 - Quản trị Phiếu hẹn Thăm xưởng]');
    const allBookingsRes = await fetch(`${BASE_URL}/visit-bookings?all=true`, {
      headers: { Authorization: `Bearer ${editorToken}` },
    });
    const allBookingsData = await allBookingsRes.json();
    assert(
      allBookingsRes.status === 200 &&
      Array.isArray(allBookingsData.data),
      'GET /api/visit-bookings?all=true (Editor xem toàn bộ phiếu hẹn)'
    );

    // Cập nhật trạng thái phiếu hẹn
    if (createdBookingId) {
      const patchBookingRes = await fetch(`${BASE_URL}/visit-bookings/${createdBookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${editorToken}`,
        },
        body: JSON.stringify({
          status: 'confirmed',
          adminNote: 'Đã gọi điện xác nhận lịch hẹn với khách hàng',
        }),
      });
      const patchBookingData = await patchBookingRes.json();
      assert(
        patchBookingRes.status === 200 &&
        patchBookingData.data?.status === 'confirmed',
        'PATCH /api/visit-bookings/:id/status (Editor xác nhận lịch hẹn)'
      );
    }

    // 14.6. Admin Only Deletions
    console.log('\n[SEC 6.3 - Quyền Xóa Tối Cao (Admin Only)]');
    const adminDelCraftRes = await fetch(`${BASE_URL}/crafts/${createdCraftId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminDelCraftRes.status === 200, 'DELETE /api/crafts/:id (Admin xóa tác phẩm)');

    const adminDelArtRes = await fetch(`${BASE_URL}/artisans/${createdArtId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminDelArtRes.status === 200, 'DELETE /api/artisans/:id (Admin xóa nghệ nhân)');

    const adminDelSeasonRes = await fetch(`${BASE_URL}/seasonal-collections/${createdSeasonId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminDelSeasonRes.status === 200, 'DELETE /api/seasonal-collections/:id (Admin xóa BST mùa)');

    // ----------------------------------------------------
    // TỔNG KẾT
    // ----------------------------------------------------
    console.log('\n======================================================');
    console.log(`📊 TỔNG KẾT: ${passed} PASSED | ${failed} FAILED`);
    console.log('======================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Lỗi ngoại lệ trong quá trình chạy test:', err);
    process.exit(1);
  }
};

runTests();
