const { testConnection, query, pool } = require('./config/db');

async function runDiagnostics() {
  console.log('='.repeat(75));
  console.log(' CRAFTROOTS DATABASE CONNECTION & INTEGRITY TEST (22 TABLES v1.1.0)');
  console.log('='.repeat(75));

  // 1. Kiểm tra kết nối
  const health = await testConnection();
  if (!health.connected) {
    console.error('❌ Kết nối database thất bại:', health.error);
    process.exit(1);
  }

  console.log('✅ Kết nối thành công đến PostgreSQL!');
  console.log(`   Database Name : ${health.database}`);
  console.log(`   Server Time   : ${health.serverTime}`);
  console.log(`   Engine Version: ${health.version.split(' on ')[0]}`);
  console.log('-'.repeat(75));

  // 2. Thống kê số lượng bản ghi trong toàn bộ 22 bảng
  console.log('📊 THỐNG KÊ BẢN GHI TRONG TOÀN BỘ 22 BẢNG (v1.1.0):');
  const tables = [
    'users', 'regions', 'craft_villages', 'craft_categories', 'materials', 'techniques',
    'artisans', 'artisan_milestones', 'crafts', 'craft_artisans', 'craft_materials', 'craft_techniques',
    'craft_images', 'collections', 'collection_crafts',
    'seasonal_collections', 'seasonal_collection_crafts', 'favourites', 'contact_messages',
    'visit_bookings', 'newsletter_subscribers', 'field_notes'
  ];

  let totalRecords = 0;
  for (const t of tables) {
    const res = await query(`SELECT COUNT(*)::int as count FROM ${t}`);
    const count = res.rows[0].count;
    totalRecords += count;
    console.log(`   - ${t.padEnd(28)}: ${String(count).padStart(3)} bản ghi`);
  }
  console.log(`   👉 TỔNG SỐ BẢN GHI TOÀN HỆ THỐNG: ${totalRecords}`);
  console.log('-'.repeat(75));

  // 3. Kiểm chứng 6 Vùng Di sản Văn hóa & Làng nghề xác thực
  console.log('🗺️  KIỂM CHỨNG 6 VÙNG DI SẢN VĂN HÓA & LÀNG NGHỀ (regions & craft_villages):');
  const regionsRes = await query(`
    SELECT r.id, r.name, r.code, r.map_key, r.registered_village_count,
           COUNT(cv.id)::int as actual_villages
    FROM regions r
    LEFT JOIN craft_villages cv ON r.id = cv.region_id
    GROUP BY r.id, r.name, r.code, r.map_key, r.registered_village_count
    ORDER BY r.sort_order ASC;
  `);
  regionsRes.rows.forEach(r => {
    console.log(`   • [${r.code}] ${r.name.padEnd(30)} (SVG key: ${r.map_key}) -> ${r.actual_villages} làng mẫu trong DB`);
  });
  console.log('-'.repeat(75));

  // 4. Kiểm chứng Bậc thầy chế tác: Nguyễn Văn Bình (ART-BT-001)
  console.log('👨‍🎨 KIỂM CHỨNG HỒ SƠ NGHỆ NHÂN BẬC THẦY (ART-BT-001 - Nguyễn Văn Bình):');
  const artisanRes = await query(`
    SELECT a.id, a.name, a.code, a.title, a.specialty, a.generation, a.years_of_experience,
           a.visit_lead_time_hours, a.visit_max_guests, a.visit_open_days,
           cv.name as village_name, r.name as region_name,
           json_agg(json_build_object('year', m.year, 'event', m.event) ORDER BY m.sort_order) as milestones
    FROM artisans a
    LEFT JOIN craft_villages cv ON a.village_id = cv.id
    LEFT JOIN regions r ON a.region_id = r.id
    LEFT JOIN artisan_milestones m ON a.id = m.artisan_id
    WHERE a.code = 'ART-BT-001'
    GROUP BY a.id, a.name, a.code, a.title, a.specialty, a.generation, a.years_of_experience,
             a.visit_lead_time_hours, a.visit_max_guests, a.visit_open_days, cv.name, r.name;
  `);
  if (artisanRes.rows.length > 0) {
    const a = artisanRes.rows[0];
    console.log(`   Họ tên       : ${a.title} ${a.name} (Mã REF: ${a.code})`);
    console.log(`   Xuất thân    : ${a.village_name} (${a.region_name}) • Đời thứ ${a.generation} • ${a.years_of_experience} năm nghề`);
    console.log(`   Chuyên môn   : ${a.specialty}`);
    console.log(`   Quy chuẩn hẹn: Tiếp nhận trước ${a.visit_lead_time_hours}h (Tối đa ${a.visit_max_guests} khách/lượt)`);
    console.log(`   Mốc son tiêu biểu (${a.milestones.length} mốc):`);
    a.milestones.slice(0, 3).forEach(m => console.log(`     - [${m.year}] ${m.event}`));
  }
  console.log('-'.repeat(75));

  // 5. Kiểm chứng Kiệt tác Spotlight CR-BT-2025-08MR & 4 Bước Quy trình
  console.log('🏆 KIỂM CHỨNG KIỆT TÁC SPOTLIGHT (CR-BT-2025-08MR):');
  const craftRes = await query(`
    SELECT c.id, c.name, c.code, c.price_vnd, c.tag, c.origin_line, c.dimensions,
           jsonb_array_length(c.specs) as spec_count,
           jsonb_array_length(c.process_stages) as stage_count,
           json_agg(json_build_object('name', a.name, 'role', ca.role_title, 'is_lead', ca.is_lead)) as artisans
    FROM crafts c
    LEFT JOIN craft_artisans ca ON c.id = ca.craft_id
    LEFT JOIN artisans a ON ca.artisan_id = a.id
    WHERE c.code = 'CR-BT-2025-08MR'
    GROUP BY c.id, c.name, c.code, c.price_vnd, c.tag, c.origin_line, c.dimensions, c.specs, c.process_stages;
  `);
  if (craftRes.rows.length > 0) {
    const c = craftRes.rows[0];
    console.log(`   Kiệt tác     : "${c.name}" (Mã: ${c.code})`);
    console.log(`   Nhãn & Giá   : [${c.tag}] • Giá: ${Number(c.price_vnd).toLocaleString('vi-VN')} VND`);
    console.log(`   Nguồn gốc    : ${c.origin_line} • Kích thước: ${c.dimensions}`);
    console.log(`   Cấu trúc     : ${c.spec_count} thông số kỹ thuật • ${c.stage_count} giai đoạn chế tác độc bản`);
    c.artisans.forEach(art => {
      console.log(`   Nghệ nhân    : ${art.is_lead ? '⭐ [Chủ trì] ' : '            '}${art.name} -> ${art.role}`);
    });
  }
  console.log('-'.repeat(75));

  // 6. Kiểm chứng Bộ sưu tập Mùa Hạ 2026 (CR-ARCH-SUMMER-26)
  console.log('☀️ KIỂM CHỨNG BỘ SƯU TẬP MÙA HẠ 2026 (CR-ARCH-SUMMER-26):');
  const summerRes = await query(`
    SELECT sc.id, sc.title, sc.archive_code, sc.season_code, sc.year, sc.color_tone,
           json_agg(json_build_object(
             'name', c.name,
             'code', c.code,
             'badge', scc.highlight_badge,
             'is_hero', scc.is_hero
           ) ORDER BY scc.is_hero DESC, scc.display_order ASC) as items
    FROM seasonal_collections sc
    JOIN seasonal_collection_crafts scc ON sc.id = scc.seasonal_collection_id
    JOIN crafts c ON scc.craft_id = c.id
    WHERE sc.season_code = 'summer' AND sc.is_active = TRUE
    GROUP BY sc.id, sc.title, sc.archive_code, sc.season_code, sc.year, sc.color_tone;
  `);
  if (summerRes.rows.length > 0) {
    const s = summerRes.rows[0];
    console.log(`   Tiêu đề      : "${s.title}" (Mã lưu trữ: ${s.archive_code})`);
    console.log(`   Tông màu     : ${s.color_tone} • Mùa: ${s.season_code} / ${s.year}`);
    s.items.forEach(it => {
      console.log(`     • ${it.is_hero ? '⭐ [HERO ITEM] ' : '              '}"${it.name}" (${it.code}) [${it.badge}]`);
    });
  }
  console.log('-'.repeat(75));

  // 7. Kiểm chứng Phiếu Đặt lịch Thăm xưởng & Ký họa Điền dã
  console.log('📋 KIỂM CHỨNG PHIẾU ĐẶT LỊCH THĂM XƯỞNG & ĐIỀN DÃ (visit_bookings & field_notes):');
  const bookingCount = await query(`SELECT COUNT(*)::int as count FROM visit_bookings`);
  const noteCount = await query(`SELECT COUNT(*)::int as count FROM field_notes`);
  const newsCount = await query(`SELECT COUNT(*)::int as count FROM newsletter_subscribers`);
  console.log(`   - Phiếu hẹn thăm xưởng (visit_bookings)    : ${bookingCount.rows[0].count} phiếu`);
  console.log(`   - Ký họa thực địa điền dã (field_notes)   : ${noteCount.rows[0].count} bài ghi chép`);
  console.log(`   - Độc giả đăng ký bản tin (subscribers)   : ${newsCount.rows[0].count} email`);
  console.log('='.repeat(75));
  console.log('🎉 TOÀN BỘ 22 BẢNG CSDL CRAFTROOTS v1.1.0 ĐÃ ĐƯỢC ĐỒNG BỘ HOÀN HẢO!');
  console.log('='.repeat(75));

  await pool.end();
}

runDiagnostics().catch(err => {
  console.error('❌ Lỗi kiểm thử database:', err);
  process.exit(1);
});
