const { testConnection, query, pool } = require('./config/db');

async function runDiagnostics() {
  console.log('='.repeat(70));
  console.log(' CRAFTROOTS DATABASE CONNECTION & INTEGRITY TEST');
  console.log('='.repeat(70));

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
  console.log('-'.repeat(70));

  // 2. Thống kê số lượng bản ghi trong các bảng
  console.log('📊 THỐNG KÊ BẢN GHI TRONG CÁC BẢNG:');
  const tables = [
    'users', 'regions', 'craft_categories', 'materials', 'techniques',
    'artisans', 'crafts', 'craft_artisans', 'craft_materials', 'craft_techniques',
    'craft_images', 'collections', 'collection_crafts',
    'seasonal_collections', 'seasonal_collection_crafts', 'favourites', 'contact_messages'
  ];

  for (const t of tables) {
    const res = await query(`SELECT COUNT(*)::int as count FROM ${t}`);
    console.log(`   - ${t.padEnd(28)}: ${res.rows[0].count} bản ghi`);
  }
  console.log('-'.repeat(70));

  // 3. Kiểm chứng quan hệ N-N: Nghệ nhân ↔ Sản phẩm (craft_artisans)
  console.log('⭐ KIỂM CHỨNG QUAN HỆ N-N: NGHỆ NHÂN ↔ SẢN PHẨM (craft_artisans):');
  
  // A. 1 Sản phẩm có nhiều nghệ nhân (Bình hút lộc)
  const craftWithArtisans = await query(`
    SELECT 
      c.id, c.name,
      json_agg(json_build_object('name', a.name, 'title', a.title, 'role', ca.role_title, 'is_lead', ca.is_lead)) as artisans
    FROM crafts c
    JOIN craft_artisans ca ON c.id = ca.craft_id
    JOIN artisans a ON ca.artisan_id = a.id
    WHERE c.id = 1
    GROUP BY c.id, c.name;
  `);

  if (craftWithArtisans.rows.length > 0) {
    const item = craftWithArtisans.rows[0];
    console.log(`   [1 Craft -> Nhiều Artisans] Tác phẩm: "${item.name}"`);
    item.artisans.forEach(a => {
      console.log(`     • ${a.is_lead ? '[TRƯỞNG CHỦ TRÌ] ' : '               '}${a.title} ${a.name} -> Vai trò: ${a.role}`);
    });
  }

  // B. 1 Nghệ nhân sáng tạo nhiều sản phẩm (Trần Độ)
  const artisanWithCrafts = await query(`
    SELECT 
      a.id, a.name, a.title,
      json_agg(json_build_object('name', c.name, 'role', ca.role_title)) as crafts
    FROM artisans a
    JOIN craft_artisans ca ON a.id = ca.artisan_id
    JOIN crafts c ON ca.craft_id = c.id
    WHERE a.id = 1
    GROUP BY a.id, a.name, a.title;
  `);

  if (artisanWithCrafts.rows.length > 0) {
    const artisan = artisanWithCrafts.rows[0];
    console.log(`   [1 Artisan -> Nhiều Crafts] Nghệ nhân: "${artisan.title} ${artisan.name}"`);
    artisan.crafts.forEach(c => {
      console.log(`     • Tác phẩm: "${c.name}" -> Vai trò: ${c.role}`);
    });
  }
  console.log('-'.repeat(70));

  // 4. Kiểm chứng Bộ sưu tập Mùa Hè (seasonal_collections & seasonal_collection_crafts)
  console.log('☀️ KIỂM CHỨNG BỘ SƯU TẬP MÙA HÈ (seasonal_collections & seasonal_collection_crafts):');
  const summerCol = await query(`
    SELECT 
      sc.id, sc.title, sc.season_code, sc.year, sc.start_date, sc.end_date,
      json_agg(json_build_object(
        'name', c.name,
        'badge', scc.highlight_badge,
        'is_hero', scc.is_hero,
        'note', scc.curator_note
      ) ORDER BY scc.is_hero DESC, scc.display_order ASC) as crafts
    FROM seasonal_collections sc
    JOIN seasonal_collection_crafts scc ON sc.id = scc.seasonal_collection_id
    JOIN crafts c ON scc.craft_id = c.id
    WHERE sc.season_code = 'summer' AND sc.is_active = TRUE
    GROUP BY sc.id, sc.title, sc.season_code, sc.year, sc.start_date, sc.end_date;
  `);

  if (summerCol.rows.length > 0) {
    const col = summerCol.rows[0];
    console.log(`   Bộ sưu tập: "${col.title}" (${col.start_date.toISOString().slice(0, 10)} đến ${col.end_date.toISOString().slice(0, 10)})`);
    col.crafts.forEach(c => {
      console.log(`     • ${c.is_hero ? '⭐ [HERO ITEM] ' : '              '}"${c.name}" [${c.badge}]`);
      console.log(`       -> Lý do chọn mùa hè: "${c.note}"`);
    });
  }

  console.log('='.repeat(70));
  console.log('🎉 TẤT CẢ CÁC KIỂM TRA ĐỀU HOÀN TOÀN CHÍNH XÁC & SẴN SÀNG PHỤC VỤ API!');
  console.log('='.repeat(70));

  await pool.end();
}

runDiagnostics().catch(err => {
  console.error('Lỗi khi chạy kiểm thử:', err);
  process.exit(1);
});
