const { pool } = require('../server/src/config/db');

async function run() {
  try {
    await pool.query(`
      INSERT INTO seasonal_collections (
        id, title, slug, season_code, year, theme_concept, philosophy_quote, quote_source,
        metrics, process_steps, archive_code, banner_url, color_tone, start_date, end_date, is_active
      ) VALUES 
      (
        2,
        'Bộ Sưu Tập Mùa Xuân 2026: Khởi Sắc Đất Trời & Lụa Sa Tơ Tằm',
        'mua-xuan-2026-khoi-sac-dat-troi',
        'spring', 2026,
        'Đón sinh khí mùa xuân cùng sắc tơ tằm óng ả, hoa văn rạng rỡ và tinh hoa làng nghề gốm men cổ phục vụ ngày Tết cổ truyền.',
        'Mùa xuân là mùa của sự hồi sinh, mỗi đường kim mũi chỉ hay nét vuốt gốm đều mang theo ước vọng bình an và thịnh vượng của dân tộc.',
        'Nghệ nhân Nhân dân Nguyễn Văn Bình',
        '[{"label": "Tác phẩm tiêu biểu", "value": "10 Kiệt tác"}, {"label": "Chất liệu chủ đạo", "value": "Tơ tằm • Men rạn cổ • Gấm thêu"}, {"label": "Làng nghề tham gia", "value": "3 Làng di sản"}]'::jsonb,
        '[{"title": "Dệt the lụa mùa xuân", "desc": "Sợi tơ vàng tự nhiên đón nắng ấm đầu năm"}, {"title": "Men rạn khai xuân", "desc": "Khai lò đầu năm cầu may mắn thịnh vượng"}]'::jsonb,
        'CR-ARCH-SPRING-26',
        'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1400&q=80',
        '#10b981', '2026-01-01', '2026-04-30', TRUE
      ),
      (
        3,
        'Bộ Sưu Tập Mùa Thu 2026: Thu Trầm & Gốm Mộc Sa Thạch',
        'mua-thu-2026-thu-tram-gom-moc',
        'autumn', 2026,
        'Khi gió heo may về trên phố cũ, chén trà ấm cùng chiếc khay mây mộc mạc đưa con người trở về với nhịp thở nguyên sơ của đất trời.',
        'Hương sen Tây Hồ quyện trong làn khói ấm, gốm mộc giữ nhiệt ngày se lạnh như lắng đọng mọi giá trị ngàn năm của xứ sở.',
        'Giám tuyển Văn hóa Lê Hoài Nam',
        '[{"label": "Tác phẩm tiêu biểu", "value": "8 Kiệt tác"}, {"label": "Chất liệu chủ đạo", "value": "Đất nung sa thạch • Mây nếp • Trà shan tuyết"}, {"label": "Làng nghề tham gia", "value": "4 Làng di sản"}]'::jsonb,
        '[{"title": "Ủ đất sa thạch", "desc": "Đất phù sa sông Hồng nung củi giữ vị trà thanh khiết"}, {"title": "Đan nan mắt cáo", "desc": "Bện mây rừng thoáng đãng cho tiết thu khô mát"}]'::jsonb,
        'CR-ARCH-AUTUMN-26',
        'https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&w=1400&q=80',
        '#d97706', '2026-09-01', '2026-11-30', TRUE
      ),
      (
        4,
        'Bộ Sưu Tập Mùa Đông 2026: Hơi Ấm Điêu Khắc & Đỉnh Đồng Men Hỏa',
        'mua-dong-2026-hoi-am-dieu-khac-men-hoa',
        'winter', 2026,
        'Hơi ấm từ lò đúc đồng Ngũ Xã và khối đá cẩm thạch kiên định xua tan giá lạnh mùa đông, tôn vinh kỹ nghệ kim khí ngàn năm thăng trầm.',
        'Trong giá buốt mùa đông, ánh lửa lò đúc đồng và đường nét chạm khắc đá thể hiện ý chí quật cường và sự trường tồn của văn hóa Việt.',
        'Nghệ nhân Ưu tú Vũ Kim Long',
        '[{"label": "Tác phẩm tiêu biểu", "value": "9 Kiệt tác"}, {"label": "Chất liệu chủ đạo", "value": "Đồng mắt cua • Đá cẩm thạch • Bạc nguyên chất"}, {"label": "Làng nghề tham gia", "value": "3 Làng di sản"}]'::jsonb,
        '[{"title": "Nung đồng men hỏa", "desc": "Lửa nhiệt độ cao tôi luyện sắc đồng trầm uy nghi"}, {"title": "Chạm bạc bách thú", "desc": "Kỹ pháp gò thúc bạc tinh xảo sưởi ấm không gian"}]'::jsonb,
        'CR-ARCH-WINTER-26',
        'https://images.unsplash.com/photo-1482867996988-29ec3a0f1aac?auto=format&fit=crop&w=1400&q=80',
        '#6366f1', '2026-12-01', '2026-12-31', TRUE
      )
      ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title, 
        season_code = EXCLUDED.season_code,
        theme_concept = EXCLUDED.theme_concept,
        philosophy_quote = EXCLUDED.philosophy_quote,
        quote_source = EXCLUDED.quote_source,
        banner_url = EXCLUDED.banner_url,
        color_tone = EXCLUDED.color_tone;
    `);

    await pool.query(`
      INSERT INTO seasonal_collection_crafts (seasonal_collection_id, craft_id, curator_note, highlight_badge, is_hero, display_order) VALUES
      (2, 2, 'Lụa tơ tằm Vạn Phúc mang lại vẻ đẹp quý phái cho những ngày đầu năm mới.', 'HERO MÙA XUÂN', TRUE, 1),
      (2, 1, 'Bình gốm tỳ bà cắm hoa đào hoa mai mang vượng khí sum vầy.', 'KHAI XUÂN ĐẮC LỘC', FALSE, 2),
      (2, 6, 'Họa tiết thổ cẩm sấm sét mừng mùa màng tươi tốt.', 'SẮC MÀU BẢN ĐỊA', FALSE, 3),
      (3, 8, 'Khay trà mây nếp cùng chén trà sen ấm áp trong tiết heo may se lạnh.', 'HERO MÙA THU', TRUE, 1),
      (3, 4, 'Chum sành giữ nước thanh mát, bình dị nơi hiên nhà mùa thu.', 'MỘC MẠC THANH TAO', FALSE, 2),
      (3, 3, 'Hộp bạc Đồng Xâm đựng hương trầm mùa thu thanh khiết.', 'HOÀI NIỆM KIM HOÀN', FALSE, 3),
      (4, 7, 'Đỉnh đồng tỏa khói trầm ấm cúng cho không gian thờ tự ngày đông.', 'HERO MÙA ĐÔNG', TRUE, 1),
      (4, 5, 'Tượng thiền sư đá cẩm thạch an nhiên trong tĩnh lặng mùa đông.', 'TĨNH TÂM GIÁ RÉT', FALSE, 2),
      (4, 3, 'Chạm trổ bạc xua tan u ám mùa đông với ánh sáng kim khí rực rỡ.', 'ẤM ÁP TẾT ĐÔNG', FALSE, 3)
      ON CONFLICT (seasonal_collection_id, craft_id) DO NOTHING;
    `);

    await pool.query(`SELECT setval('seasonal_collections_id_seq', (SELECT MAX(id) FROM seasonal_collections));`);
    console.log('SEEDING_SEASONS_SUCCESS');
  } catch (err) {
    console.error('Error seeding seasons:', err);
  } finally {
    await pool.end();
  }
}

run();
