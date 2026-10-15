-- =============================================================================
-- CRAFTROOTS MOCK DATA SEED SCRIPT (PostgreSQL 14+) - v1.1.0
-- Dữ liệu hạt giống chuẩn xác thực di sản thủ công truyền thống Việt Nam (Anti-AI)
-- Phục vụ 22 bảng CSDL, 9 bản thiết kế Stitch, 6 Vùng Di sản & 6 Nghệ nhân Bậc thầy
-- =============================================================================

SET timezone = 'UTC';

-- -----------------------------------------------------------------------------
-- 1. NẠP USERS (Mật khẩu hash bcrypt salt 10 của 'Craft@1234')
-- -----------------------------------------------------------------------------
INSERT INTO users (id, full_name, email, password_hash, role, avatar_url, is_active) VALUES
(1, 'Ban Quản Trị CraftRoots', 'admin@craftroots.vn', '$2b$10$37130hZp9U6.y8Q2.qO8y.7oT9dJ1n0o9R3t2Y8e4g6v7s8a9b0c1', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', TRUE),
(2, 'Nguyễn Văn An (Người Dùng)', 'user@craftroots.test', '$2b$10$37130hZp9U6.y8Q2.qO8y.7oT9dJ1n0o9R3t2Y8e4g6v7s8a9b0c1', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', TRUE),
(3, 'Trần Thu Hà (Biên Tập Viên)', 'editor@craftroots.vn', '$2b$10$37130hZp9U6.y8Q2.qO8y.7oT9dJ1n0o9R3t2Y8e4g6v7s8a9b0c1', 'editor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', TRUE),
(4, 'Hoàng Minh Nam (Kiến Trúc Sư)', 'nam.hoang@gmail.com', '$2b$10$37130hZp9U6.y8Q2.qO8y.7oT9dJ1n0o9R3t2Y8e4g6v7s8a9b0c1', 'user', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', TRUE);

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- -----------------------------------------------------------------------------
-- 2. NẠP REGIONS (6 Vùng Di sản Văn hóa Việt Nam theo Stitch Map)
-- -----------------------------------------------------------------------------
INSERT INTO regions (id, name, code, map_key, description, craft_summary, image_url, is_verified, registered_village_count, national_heritage_count, sort_order) VALUES
(1, 'Đồng Bằng Bắc Bộ', 'dong-bang-bac-bo', 'dong-bang-bac-bo', 'Cái nôi nghìn năm văn hiến châu thổ sông Hồng với mật độ làng nghề dày đặc nhất Việt Nam.', 'Gốm men Bát Tràng, Lụa Vạn Phúc, Chạm bạc Đồng Xâm, Đúc đồng Ngũ Xã', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80', TRUE, 18, 12, 1),
(2, 'Tây Bắc Đại Ngàn', 'tay-bac', 'tay-bac', 'Vùng rẻo cao hiểm trở giàu bản sắc của đồng bào H''Mông, Dao, Thái, Tày.', 'Dệt thổ cẩm nhuộm chàm, Rèn dao thủ công H''Mông, Đan quạt nan pơ-mu', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80', TRUE, 8, 5, 2),
(3, 'Đông Bắc Hùng Vĩ', 'dong-bac', 'dong-bac', 'Vùng non nước hữu tình với truyền thống luyện kim cổ truyền và gốm sành mộc.', 'Gốm sành Hương Canh, Đúc gang Tuyên Quang, Dệt nón lá Tày', 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1000&q=80', TRUE, 10, 6, 3),
(4, 'Bắc Trung Bộ Trầm Tích', 'bac-trung-bo', 'bac-trung-bo', 'Dải đất hẹp hội tụ tinh hoa cung đình Huế và các làng nghề xứ Thanh - Nghệ - Tĩnh.', 'Gốm tráng men hoàng cung Huế, Dệt đệm bàng Phò Trạch, Chiếu cói Nga Sơn', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80', TRUE, 14, 9, 4),
(5, 'Nam Trung Bộ & Tây Nguyên', 'nam-trung-bo-tay-nguyen', 'nam-trung-bo-tay-nguyen', 'Không gian giao thoa rực rỡ giữa văn hóa Chăm Pa cổ, tượng nhà mồ Ba Na và đá Non Nước.', 'Điêu khắc đá Non Nước, Dệt thổ cẩm Ikat làng Teng, Gốm Bàu Trúc nung lộ thiên', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80', TRUE, 16, 11, 5),
(6, 'Nam Bộ Phù Sa', 'nam-bo', 'nam-bo', 'Vùng đất phương Nam hào sảng với văn hóa sông nước miệt vườn trù phú.', 'Chiếu dệt Định Yên, Đan lục bình sông Tiền, Gốm Lái Thiêu men màu', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80', TRUE, 12, 7, 6);

SELECT setval('regions_id_seq', (SELECT MAX(id) FROM regions));

-- -----------------------------------------------------------------------------
-- 3. NẠP CRAFT_CATEGORIES (Danh mục phân loại nghề thủ công)
-- -----------------------------------------------------------------------------
INSERT INTO craft_categories (id, name, slug, description, icon_url) VALUES
(1, 'Gốm sứ truyền thống', 'gom-su-truyen-thong', 'Nghệ thuật nhào nặn đất sét cao lanh, tạo hình vuốt tay bàn xoay và lửa nung khử oxy lò bầu.', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80'),
(2, 'Đúc đồng & Kim hoàn', 'duc-dong-kim-hoan', 'Kỹ nghệ đúc chuông, tượng đồng nguyên khối, chạm bạc mỹ nghệ và thếp vàng lá cung đình.', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=200&q=80'),
(3, 'Dệt may & Thổ cẩm', 'det-may-tho-cam', 'Nghệ thuật ươm tơ dệt lụa sa, nhuộm chàm tự nhiên và dệt thổ cẩm kỹ pháp Ikat dân tộc.', 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=200&q=80'),
(4, 'Mây tre đan & Gỗ mỹ nghệ', 'may-tre-dan-go-thu-cong', 'Biến hóa tre nứa già ngâm vôi và mây rừng thành vật dụng thanh tao, thoáng gió và bền bỉ.', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=200&q=80'),
(5, 'Sơn mài & Khảm trai', 'son-mai-my-nghe-kham-trai', 'Sơn ta tự nhiên kết hợp xà cừ biển sâu và vỏ trứng vịt mài bóng nước kỳ công.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80'),
(6, 'Điêu khắc đá mỹ nghệ', 'dieu-khac-da-my-nghe', 'Đục đẽo chạm lộng trên đá cẩm thạch tự nhiên, tạo hình tượng tâm linh và tác phẩm nghệ thuật.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80');

SELECT setval('craft_categories_id_seq', (SELECT MAX(id) FROM craft_categories));

-- -----------------------------------------------------------------------------
-- 4. NẠP CRAFT_VILLAGES (Làng nghề truyền thống đã xác thực)
-- -----------------------------------------------------------------------------
INSERT INTO craft_villages (id, region_id, category_id, name, slug, district, province, century_label, summary) VALUES
(1, 1, 1, 'Làng Gốm Bát Tràng', 'bat-trang', 'Gia Lâm', 'Hà Nội', 'Thế kỷ XIV', 'Làng gốm lừng danh hơn 700 năm bên bờ sông Hồng, nổi tiếng với các dòng men lam, men rạn cổ hoàng cung và kỹ pháp lò bầu nung củi.'),
(2, 1, 3, 'Làng Lụa Vạn Phúc', 'van-phuc', 'Hà Đông', 'Hà Nội', 'Hơn 1.000 năm', 'Cái nôi tơ lụa trứ danh đất Hà Thành, vang danh với lụa sa, lụa vân mềm mịn, hoa văn chìm tinh xảo từng phục vụ hoàng tộc triều Nguyễn.'),
(3, 1, 2, 'Làng Chạm Bạc Đồng Xâm', 'dong-xam', 'Kiến Xương', 'Thái Bình', 'Thế kỷ XVII', 'Làng nghề kim hoàn nổi tiếng với kỹ thuật thúc nổi, chạm trổ hoa văn tinh vi trên các thỏi bạc và đồng trắng.'),
(4, 3, 1, 'Làng Gốm Sành Hương Canh', 'huong-canh', 'Bình Xuyên', 'Vĩnh Phúc', 'Hơn 300 năm', 'Đất sành sét xanh đặc hữu không tráng men mà tự lên màu trầm bóng ngọc, tiếng kêu đanh như chuông khánh, giữ nước không thối sấu rụng.'),
(5, 5, 6, 'Làng Đá Mỹ Nghệ Non Nước', 'non-nuoc', 'Ngũ Hành Sơn', 'Đà Nẵng', 'Thế kỷ XVII', 'Dưới chân năm ngọn Ngũ Hành Sơn, nơi các thợ đá chạm khắc tượng Phật, bách thú từ đá cẩm thạch nguyên khối tuyệt mỹ.'),
(6, 5, 3, 'Làng Dệt Thổ Cẩm Teng', 'lang-teng', 'Ba Tơ', 'Quảng Ngãi', 'Lâu đời cổ truyền', 'Di sản dệt thổ cẩm của người Hrê với kỹ thuật Ikat thắt sợi nhuộm vỏ cây rừng tạo đồ án hình thoi và chim muông huyền ảo.'),
(7, 1, 4, 'Làng Mây Tre Đan Phú Vinh', 'phu-vinh', 'Chương Mỹ', 'Hà Nội', 'Thế kỷ XVII', 'Xứ sở của nan tre mây uốn lượn, nổi danh với nghệ thuật đan tranh chân dung và quạt nan thoáng gió thanh mát.'),
(8, 1, 2, 'Làng Đúc Đồng Ngũ Xã', 'ngu-xa', 'Ba Đình', 'Hà Nội', 'Thế kỷ XVII', 'Kỹ nghệ đúc đồng nguyên khối liền mạch không giáp mối, tạo nên những pho tượng đồng ngàn năm lịch sử bên bờ hồ Trúc Bạch.');

SELECT setval('craft_villages_id_seq', (SELECT MAX(id) FROM craft_villages));

-- -----------------------------------------------------------------------------
-- 5. NẠP MATERIALS (Chất liệu chế tác bản địa)
-- -----------------------------------------------------------------------------
INSERT INTO materials (id, name, description) VALUES
(1, 'Đất sét cao lanh Bát Tràng', 'Loại đất sét trắng trầm tích dẻo mịn đặc hữu vùng đồng bằng châu thổ sông Hồng, chịu nhiệt trên 1.280°C.'),
(2, 'Men rạn tam thái cổ', 'Bài men hoàng cung pha chế từ tro vỏ sò sông, tro trấu và thạch anh, tạo vân nứt tự nhiên như đá rạn thời Lê - Mạc.'),
(3, 'Đất sét xanh Hương Canh', 'Đất sét trầm tích chứa oxit sắt tự nhiên nung sành kết tinh đanh chắc chống thấm tuyệt đối.'),
(4, 'Đá cẩm thạch Ngũ Hành Sơn', 'Đá hoa tự nhiên vân cẩm thạch trắng, xanh ngọc và hồng phớt từ núi non miền Trung.'),
(5, 'Bạc ta nguyên chất 99.9%', 'Kim loại bạc tinh khiết dẻo dai thích hợp cho kỹ thuật dát mỏng và chạm trổ hoa văn lộng kênh bong.'),
(6, 'Tơ tằm tự nhiên Vạn Phúc', 'Sợi tơ ươm từ kén sâu tằm ăn lá dâu tằm bãi bồi ven sông Đáy, bóng mượt tự nhiên.'),
(7, 'Sợi bông rừng nhuộm chàm', 'Sợi bông bản địa xe tay và ngâm nhuộm trong thùng chàm thảo mộc suốt nhiều tuần lễ.'),
(8, 'Tre gai già & Mây rừng ngâm vôi', 'Tre bánh tẻ ngâm bùn ao vôi chống mối mọt tự nhiên, chẻ nan chuốt mỏng như sợi chỉ.'),
(9, 'Đồng đỏ nguyên thỏi', 'Hợp kim đồng đỏ tinh luyện có độ dẻo và ánh sắc trầm mặc cổ kính khi đúc đại hồng chung.'),
(10, 'Sơn ta Phú Thọ & Vỏ trứng vịt', 'Mủ cây sơn ta bản địa kết hợp vỏ trứng vịt đồng cẩn tỉ mỉ mài bóng gương huyền bí.');

SELECT setval('materials_id_seq', (SELECT MAX(id) FROM materials));

-- -----------------------------------------------------------------------------
-- 6. NẠP TECHNIQUES (Kỹ pháp chế tác truyền thống)
-- -----------------------------------------------------------------------------
INSERT INTO techniques (id, name, description) VALUES
(1, 'Chuốt gốm bàn xoay thủ công', 'Định hình cốt gốm chuẩn xác bằng nhịp điệu của đôi bàn tay và bàn xoay gỗ truyền thống.'),
(2, 'Nung củi lò bầu khử oxy 72 giờ', 'Kỹ thuật giữ lửa củi gỗ nghiến liên tục suốt 3 ngày đêm tạo màu men rạn hỏa biến biến ảo kỳ diệu.'),
(3, 'Họa hoa văn men lam dưới men', 'Dùng bút lông thỏ vẽ nét thư họa trực tiếp lên cốt đất mộc trước khi nhúng men bóng.'),
(4, 'Chạm trổ bạc lộng kênh bong', 'Kỹ thuật dùng ve chạm thúc nổi từng lớp cánh hoa, vảy rồng tách biệt khỏi bề mặt kim khí.'),
(5, 'Dệt sa lụa hoa vân cung đình', 'Kỹ thuật dệt sợi tơ tơ đan cài tạo hoa văn vân mây chìm nổi tinh tế trên nền lụa trong suốt.'),
(6, 'Dệt thổ cẩm kỹ pháp Ikat', 'Buộc thắt từng lọn sợi trước khi nhuộm để khi dệt tạo ra những đường viền hoa văn răng cưa huyền ảo.'),
(7, 'Chế tác gốm sành nung lộ thiên', 'Nung đất sành ở nhiệt độ cao không cần men áo, để ngọn lửa củi tự tạo lớp da gốm ánh kim độc bản.'),
(8, 'Chạm khắc đá khối nguyên khối', 'Dùng búa đục tay định hình khối đá tự nhiên thành hình tượng sống động giàu cảm xúc.'),
(9, 'Đan mây nan xiên mắt cáo', 'Đan cài nan tre và mây ziczac tạo ô thoáng khí giải nhiệt tự nhiên cho ngày hè.'),
(10, 'Cẩn trứng và mài nước sơn mài', 'Ghép từng mảnh vỏ trứng vụn trên nền sơn ướt và mài phẳng dưới nước qua hàng chục lớp.');

SELECT setval('techniques_id_seq', (SELECT MAX(id) FROM techniques));

-- -----------------------------------------------------------------------------
-- 7. NẠP ARTISANS (6 Bậc Thầy Chế Tác theo Stitch designs & DESIGN.md)
-- -----------------------------------------------------------------------------
INSERT INTO artisans (
    id, name, slug, code, region_id, village_id, title, specialty, age, generation, years_of_experience,
    quote, biography, signature_work, technique_summary, technique_specs, verification_label, is_national_heritage,
    avatar_url, contact_info, visit_max_guests, visit_lead_time_hours, visit_open_days, visit_hours, visit_address, sort_order
) VALUES
(
    1, 'Nguyễn Văn Bình', 'nguyen-van-binh', 'ART-BT-001', 1, 1,
    'Nghệ nhân Nhân dân', 'Gốm Men Rạn Cổ', 67, 5, 42,
    'Lửa lò bầu không bao giờ nói dối; tâm người thợ đặt vào đất thế nào thì men rạn sẽ hiện ra sắc thái như thế ấy.',
    'Sinh ra trong gia tộc 5 đời gắn bó với nghề gốm Bát Tràng, Nghệ nhân Nguyễn Văn Bình đã dành hơn 4 thập kỷ để phục dựng thành công bài men rạn hoàng cung thất truyền từ thế kỷ XVI. Các tác phẩm của ông được lưu giữ tại Bảo tàng Lịch sử Quốc gia và là tặng phẩm ngoại giao cao cấp.',
    'Bình Gốm Men Rạn Cổ Dáng Tỳ Bà (CR-BT-2025-08MR)',
    'Phục hồi trọn vẹn kỹ thuật nung lò bầu nung củi gỗ nghiến liên tục suốt 72 giờ và phối men rạn tam thái độc bản.',
    '[
        {"label": "Kỹ pháp nung", "value": "Nung củi lò bầu khử oxy liên tục 72 giờ (1.300°C)"},
        {"label": "Bài men chủ đạo", "value": "Men rạn tam thái tro sò sông tự nhiên"},
        {"label": "Nguyên liệu cốt", "value": "Đất sét cao lanh lọc 4 bể trầm tích"},
        {"label": "Tạo hình", "value": "Vuốt tay bàn xoay 100%, không dùng khuôn ép"}
    ]'::jsonb,
    'XÁC THỰC: DI SẢN QUỐC GIA (Quyết định số 248/QĐ-BVHTTDL)', TRUE,
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    'Xưởng gốm Bình Minh, Xóm 2, Bát Tràng, Gia Lâm, Hà Nội',
    8, 24, '{2,3,4,5,6,7}', '08:30 - 17:00',
    'Xưởng Gốm Bình Minh, Xóm 2, Thôn Giang Cao, Xã Bát Tràng, Huyện Gia Lâm, Hà Nội', 1
),
(
    2, 'Trần Thị Mai', 'tran-thi-mai', 'ART-VP-002', 1, 2,
    'Nghệ nhân Ưu tú', 'Dệt Lụa Sa Nam Đàn', 62, 4, 38,
    'Từng sợi tơ tằm là giọt mồ hôi của đất trời; dệt nên tấm lụa sa là giữ lại linh hồn thanh nhã của cha ông.',
    'Nghệ nhân đời thứ 4 của làng lụa Vạn Phúc, người nắm giữ bí quyết dệt dòng lụa sa và lụa vân mỏng như cánh ve sầu, thoáng mát ngày hè và mềm mại ấm áp ngày đông.',
    'Khăn Sa Lụa Tơ Tằm Cung Đình (CR-VP-2026-LSA)',
    'Bí quyết gài go dệt hoa văn chìm trên khung cửi thủ công cổ truyền với sợi tơ tằm tuyển chọn kỹ lưỡng.',
    '[
        {"label": "Nguyên liệu", "value": "100% tơ tằm tự nhiên vùng bãi bồi sông Đáy"},
        {"label": "Kỹ thuật dệt", "value": "Dệt sa hoa vân chìm khung cửi gỗ 4 go"},
        {"label": "Nhuộm màu", "value": "Thảo mộc tự nhiên (lá bàng, củ nâu, hoa hòe)"}
    ]'::jsonb,
    'XÁC THỰC: DI SẢN QUỐC GIA', TRUE,
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    'HTX Lụa Tơ Tằm Mai Anh, Phố Lụa Vạn Phúc, Hà Đông, Hà Nội',
    10, 48, '{2,3,4,5,6,7}', '09:00 - 17:30',
    'Số 18, Phố Lụa Vạn Phúc, Phường Vạn Phúc, Quận Hà Đông, Hà Nội', 2
),
(
    3, 'Lê Bá Hưng', 'le-ba-hung', 'ART-DX-003', 1, 3,
    'Nghệ nhân Nhân dân', 'Chạm Bạc Mỹ Nghệ', 70, 6, 45,
    'Bạc mềm nhưng chạm nổi hoa văn phải có độ đanh thép, từng vảy rồng cánh phượng phải như bay lượn.',
    'Bậc thầy chạm bạc làng Đồng Xâm với 45 năm kinh nghiệm đục chạm lộng kênh bong, người chế tác các hòm sắc phong và bảo vật kim hoàn cho các di tích quốc gia.',
    'Hộp Bạc Chạm Trổ Bách Thú (CR-DX-2025-CB1)',
    'Kỹ thuật thúc nổi và chạm tỉa từng chi tiết micromet trên tấm bạc nguyên chất không cần khuôn đúc sẵn.',
    '[
        {"label": "Chất liệu", "value": "Bạc ta 99.9% tinh khiết dát mỏng"},
        {"label": "Kỹ thuật chạm", "value": "Chạm lộng kênh bong 3 tầng hoa văn"},
        {"label": "Độ chính xác", "value": "Gia công thủ công từng chi tiết vi mô"}
    ]'::jsonb,
    'XÁC THỰC: DI SẢN QUỐC GIA', TRUE,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    'Xưởng bạc Đồng Xâm Lê Hưng, Xã Hồng Thái, Kiến Xương, Thái Bình',
    6, 48, '{2,3,4,5,6}', '08:30 - 16:30',
    'Làng nghề Chạm Bạc Đồng Xâm, Xã Hồng Thái, Huyện Kiến Xương, Tỉnh Thái Bình', 3
),
(
    4, 'Phạm Đình Triệu', 'pham-dinh-trieu', 'ART-HC-004', 3, 4,
    'Nghệ nhân Ưu tú', 'Gốm Sành Hương Canh', 58, 3, 35,
    'Sành Hương Canh mộc mạc không men, sắc da gốm tự sinh từ ngọn lửa củi gộc và bùn xanh quê nhà.',
    'Người giữ lửa bền bỉ cho làng gốm sành Hương Canh, khôi phục thành công các dòng chum đựng rượu, bình hoa sành cổ giữ nhiệt và không rò rỉ một giọt nước.',
    'Chum Sành Đất Nung Giữ Nước (CR-HC-2026-SANH)',
    'Kỹ pháp nung đất sành nhiệt độ cao không men áo, tiếng kêu vang trong như đá quý.',
    '[
        {"label": "Chất liệu cốt", "value": "Đất sét xanh trầm tích đồi Hương Canh"},
        {"label": "Bài men", "value": "Không dùng men áo, men tự sinh từ tro củi"},
        {"label": "Đặc tính", "value": "Chống thấm tuyệt đối, giữ hương vị nguyên bản"}
    ]'::jsonb,
    'XÁC THỰC: DI SẢN CẤP QUỐC GIA', TRUE,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    'Xưởng gốm sành Đình Triệu, Thị trấn Hương Canh, Bình Xuyên, Vĩnh Phúc',
    12, 48, '{2,3,4,5,6,7}', '08:00 - 17:00',
    'Khu phố gốm Hương Canh, Thị trấn Hương Canh, Huyện Bình Xuyên, Tỉnh Vĩnh Phúc', 4
),
(
    5, 'Võ Văn Cường', 'vo-van-cuong', 'ART-CP-005', 5, 5,
    'Nghệ nhân Ưu tú', 'Điêu Khắc Đá Mỹ Nghệ', 52, 4, 28,
    'Khối đá vô tri chỉ thức giấc khi người thợ nghe thấu đường vân và nhát búa chạm đúng cái hồn ẩn sâu.',
    'Hậu duệ đời thứ 4 làng đá Non Nước, nổi danh với kỹ thuật tạc tượng Phật và tượng mỹ thuật từ đá cẩm thạch nguyên khối tự nhiên với đường nét uyển chuyển phi thường.',
    'Tượng Thiền Sư Chạm Đá Cẩm Thạch (CR-NN-2025-DA1)',
    'Kỹ thuật điêu khắc chạm lộng trên đá cẩm thạch nguyên khối không nứt vỡ.',
    '[
        {"label": "Chất liệu", "value": "Đá cẩm thạch tự nhiên núi Ngũ Hành Sơn"},
        {"label": "Kỹ thuật tạc", "value": "Đục tay thủ công và mài bóng mịn màng"},
        {"label": "Độ bền", "value": "Trường tồn hàng thế kỷ trước mưa nắng thiên nhiên"}
    ]'::jsonb,
    'XÁC THỰC: DI SẢN QUỐC GIA', TRUE,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    'Cơ sở điêu khắc đá Võ Cường, Làng Non Nước, Ngũ Hành Sơn, Đà Nẵng',
    15, 48, '{2,3,4,5,6,7}', '08:30 - 17:30',
    'Đường Huyền Trân Công Chúa, Phường Hòa Hải, Quận Ngũ Hành Sơn, TP. Đà Nẵng', 5
),
(
    6, 'Y Krang Ksor', 'y-krang-ksor', 'ART-TB-006', 5, 6,
    'Nghệ nhân Dân gian', 'Dệt Thổ Cẩm Ikat', 55, 3, 30,
    'Mỗi tấm thổ cẩm là bản hòa ca của rừng già, là sử thi của buôn làng dệt bằng sợi bông và màu lá cây.',
    'Nghệ nhân người Hrê gìn giữ phương thức dệt thổ cẩm Ikat truyền thống làng Teng, kết hợp hoa văn hình học cổ xưa biểu trưng cho thần sấm sét, chim chơ-rao và dòng suối nguồn.',
    'Tấm Thổ Cẩm Ikat Hoa Văn Sấm Sét (CR-TB-2026-IKAT)',
    'Kỹ thuật thắt sợi nhuộm Ikat phức tạp đòi hỏi tính toán chuẩn xác từng mili trước khi đưa lên khung dệt.',
    '[
        {"label": "Sợi dệt", "value": "Sợi bông rẫy xe tay thủ công"},
        {"label": "Màu nhuộm", "value": "Chàm đen, củ nâu rừng và vỏ cây râm bụt"},
        {"label": "Đồ án", "value": "Họa tiết Ikat hình thoi và thần Sấm Sét"}
    ]'::jsonb,
    'XÁC THỰC: DI SẢN VĂN HÓA PHI VẬT THỂ', TRUE,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    'Nhà văn hóa Làng Teng, Xã Ba Thành, Ba Tơ, Quảng Ngãi',
    10, 48, '{2,3,4,5,6,7}', '09:00 - 17:00',
    'Làng Teng, Xã Ba Thành, Huyện Ba Tơ, Tỉnh Quảng Ngãi', 6
);

SELECT setval('artisans_id_seq', (SELECT MAX(id) FROM artisans));

-- -----------------------------------------------------------------------------
-- 8. NẠP ARTISAN_MILESTONES (Niên biểu cống hiến của nghệ nhân)
-- -----------------------------------------------------------------------------
INSERT INTO artisan_milestones (artisan_id, year, event, sort_order) VALUES
(1, '1984', 'Chính thức tiếp quản lò gốm gia tộc và bắt đầu nghiên cứu phục chế bài men cổ triều Mạc.', 1),
(1, '1996', 'Phục chế thành công men rạn tam thái sau hơn 10 năm thất truyền, được giới khảo cổ ghi nhận.', 2),
(1, '2010', 'Nhà nước phong tặng danh hiệu Nghệ nhân Ưu tú ngành nghề thủ công truyền thống.', 3),
(1, '2018', 'Tác phẩm "Bình Gốm Tỳ Bà Men Rạn" được chọn làm tặng phẩm ngoại giao trong Hội nghị thượng đỉnh.', 4),
(1, '2024', 'Được Chủ tịch nước phong tặng danh hiệu cao quý Nghệ nhân Nhân dân.', 5),

(2, '1988', 'Khôi phục kỹ thuật dệt sa lụa hoa vân cung đình từng bị mai một trong thời kỳ bao cấp.', 1),
(2, '2005', 'Thành lập Hợp tác xã lụa tơ tằm gìn giữ phương pháp dệt sợi sa tự nhiên.', 2),
(2, '2015', 'Đạt giải Nhất Tinh hoa Lụa Việt Nam và được phong tặng danh hiệu Nghệ nhân Ưu tú.', 3),

(3, '1982', 'Học nghề chạm bạc từ thân phụ và đạt danh hiệu Bàn tay vàng thủ công mỹ nghệ tỉnh Thái Bình.', 1),
(3, '1998', 'Chủ trì chế tác bộ hòm bạc sắc phong cho Quần thể di tích Đền Trần.', 2),
(3, '2016', 'Được Nhà nước vinh danh Nghệ nhân Nhân dân.', 3),

(4, '1992', 'Sáng chế thành công công thức sành sét xanh chịu nhiệt cao không cần tráng men.', 1),
(4, '2012', 'Được phong tặng Nghệ nhân Ưu tú tỉnh Vĩnh Phúc.', 2),

(5, '1998', 'Hoàn thành pho tượng Phật Bà Quan Âm bằng đá cẩm thạch nguyên khối cao 3.2m tại chùa Linh Ứng.', 1),
(5, '2016', 'Phong tặng danh hiệu Nghệ nhân Ưu tú.', 2),

(6, '2002', 'Tập hợp các nghệ nhân cao niên phục dựng hoàn chỉnh khung cửi dệt Ikat làng Teng.', 1),
(6, '2019', 'Nghề dệt thổ cẩm làng Teng được công nhận là Di sản văn hóa phi vật thể Quốc gia.', 2);

SELECT setval('artisan_milestones_id_seq', (SELECT MAX(id) FROM artisan_milestones));

-- -----------------------------------------------------------------------------
-- 9. NẠP CRAFTS (Kiệt tác Thủ công & Spotlight CR-BT-2025-08MR)
-- -----------------------------------------------------------------------------
INSERT INTO crafts (
    id, name, slug, code, region_id, category_id, village_id, thumbnail_url,
    short_description, price_vnd, tag, origin_line, era, dimensions, specs, process_stages,
    cultural_context, tools, process, traditional_use, batch_note, is_featured, is_spotlight, handmade, view_count
) VALUES
(
    1, 'Bình Gốm Men Rạn Cổ Dáng Tỳ Bà', 'binh-gom-men-ran-co-dang-ty-ba', 'CR-BT-2025-08MR',
    1, 1, 1,
    'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80',
    'Tuyệt phẩm gốm men rạn tái hiện hình dáng đàn tỳ bà truyền thống thế kỷ XVI, hội tụ tinh hoa đất sét cao lanh và kỹ pháp lửa nung lò bầu 72 giờ.',
    18500000, 'KIỆT TÁC ĐỘC BẢN', 'Bát Tràng • Hà Nội', 'Thế kỷ XVI phục dựng',
    'Cao 48cm × ĐK thân 28cm × ĐK miệng 12cm',
    '[
        {"label": "Chất liệu", "value": "Đất sét cao lanh Bát Tràng, bài men rạn tro sò sông cổ"},
        {"label": "Nhiệt độ nung", "value": "1.300°C nung củi gỗ nghiến khử oxy"},
        {"label": "Thời gian chế tác", "value": "45 ngày (Luyện đất -> Chuốt -> Vẽ -> Nung 72h)"},
        {"label": "Trọng lượng", "value": "6.8 kg"},
        {"label": "Tình trạng", "value": "Độc bản duy nhất 01/01"}
    ]'::jsonb,
    '[
        {
            "step": 1,
            "title": "Tuyển chọn & Luyện đất trầm tích",
            "description": "Đất sét cao lanh tuyển từ mỏ trầm tích sông Đáy, ngâm lọc qua hệ thống 4 bể lắng để loại bỏ hoàn toàn tạp chất oxit sắt, giữ lại độ dẻo quánh tự nhiên."
        },
        {
            "step": 2,
            "title": "Chuốt dáng tỳ bà trên bàn xoay gỗ",
            "description": "Nghệ nhân dùng lực đôi bàn tay vuốt tạo hình thân bình thon thả theo dáng đàn tỳ bà cổ, miệng loe cân đối hoàn toàn bằng mắt và cảm giác cơ bắp không dùng khuôn ép."
        },
        {
            "step": 3,
            "title": "Họa hoa văn men lam & Phủ men rạn",
            "description": "Dùng bút lông thỏ vẽ họa tiết sơn thủy hữu tình bằng oxit coban, sau đó tráng lớp men rạn tro sò bí truyền tạo độ dày đồng đều trên toàn thân gốm."
        },
        {
            "step": 4,
            "title": "Nung củi lò bầu 72 giờ khử oxy",
            "description": "Xếp bình vào vị trí ngọn lửa tối ưu trong lò bầu, đốt liên tục bằng củi gỗ nghiến suốt 3 ngày đêm, duy trì nhiệt 1.300°C và làm nguội chậm để vân rạn tự nứt tiếng lách tách."
        }
    ]'::jsonb,
    'Dáng bình tỳ bà biểu trưng cho âm nhạc, sự thanh tao và tích tụ vượng khí tài lộc theo quan niệm phong thủy của giới quý tộc Việt thời Lê - Mạc.',
    'Bàn xoay gỗ thủ công, bút lông thỏ mềm, dao nạo tre chuốt cốt, lò bầu nung củi gỗ',
    'Quy trình 4 bước khép kín thủ công 100% kéo dài hơn 45 ngày.',
    'Trưng bày phòng khách phong thái quý tộc, sưu tầm di sản cổ vật, quà ngoại giao quốc gia.',
    'Lô chế tác đặc biệt kỷ niệm 700 năm làng gốm Bát Tràng, có khắc triện nổi của Nghệ nhân Bình.',
    TRUE, TRUE, TRUE, 3420
),
(
    2, 'Khăn Sa Lụa Tơ Tằm Cung Đình Vạn Phúc', 'khan-sa-lua-to-tam-cung-dinh-van-phuc', 'CR-VP-2026-LSA',
    1, 3, 2,
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
    'Khăn lụa sa dệt hoa vân mỏng tang, thoáng mát như làn gió mùa hạ, dệt từ 100% tơ tằm tự nhiên.',
    4200000, 'TUYỂN CHỌN MÙA HẠ', 'Vạn Phúc • Hà Nội', 'Cổ truyền Vạn Phúc',
    'Dài 180cm × Rộng 65cm',
    '[
        {"label": "Chất liệu", "value": "100% tơ tằm tơ vàng bãi bồi sông Đáy"},
        {"label": "Kỹ thuật", "value": "Dệt sa hoa vân chìm 4 go"},
        {"label": "Trọng lượng", "value": "85 gram (siêu nhẹ, thoáng khí)"}
    ]'::jsonb,
    '[
        {"step": 1, "title": "Ươm tơ kéo sợi", "description": "Kén tằm vàng nấu nước sôi se sợi tơ đơn."},
        {"step": 2, "title": "Mắc khung cửi dệt sa", "description": "Mắc sợi tơ trên khung cửi 4 go dệt hoa văn chìm."},
        {"step": 3, "title": "Nhuộm thảo mộc tự nhiên", "description": "Nhuộm màu vàng hoàng yến từ hoa hòe phơi khô."}
    ]'::jsonb,
    'Dòng lụa sa Nam Đàn từng được tiến cống vào cung đình triều Nguyễn để may long bào và khăn choàng mùa hè cho hoàng hậu.',
    'Khung cửi gỗ 4 go dệt tay, suốt tơ tre, thùng nhuộm thảo mộc',
    'Dệt thủ công tỉ mỉ từng sợi tơ mảnh.',
    'Khăn choàng thanh lịch mùa hạ, phối đồ áo dài truyền thống.',
    'Sản phẩm trong Bộ Sưu Tập Mùa Hạ 2026.',
    TRUE, FALSE, TRUE, 1890
),
(
    3, 'Hộp Bạc Chạm Trổ Bách Thú Đồng Xâm', 'hop-bac-cham-tro-bach-thu-dong-xam', 'CR-DX-2025-CB1',
    1, 2, 3,
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
    'Hộp trang sức bằng bạc ta 99.9% chạm nổi tích Bách Thú triều cống với kỹ thuật thúc nổi kênh bong đỉnh cao.',
    26000000, 'BÁU VẬT KIM HOÀN', 'Đồng Xâm • Thái Bình', 'Thế kỷ XVII phục dựng',
    'Dài 22cm × Rộng 14cm × Cao 10cm',
    '[
        {"label": "Chất liệu", "value": "Bạc ta 99.9% nguyên chất"},
        {"label": "Trọng lượng bạc", "value": "1.2 kg bạc"},
        {"label": "Kỹ thuật", "value": "Thúc nổi kênh bong 3 tầng hoa văn"}
    ]'::jsonb,
    '[
        {"step": 1, "title": "Nấu và dát mỏng bạc thỏi", "description": "Dát mỏng bạc thỏi thành tấm đồng đều 1.2mm."},
        {"step": 2, "title": "Chạm trổ hoa văn trên xi gắn", "description": "Đổ xi nhựa thông cố định tấm bạc và dùng búa ve chạm tỉ mỉ."},
        {"step": 3, "title": "Làm nguội và đánh bóng", "description": "Làm sạch xi và đánh bóng bằng cát mịn và lá chuối khô."}
    ]'::jsonb,
    'Hộp bạc chạm khắc tinh xảo tượng trưng cho sự quyền quý, trường thọ và sung túc của gia chủ.',
    'Ve chạm thép tôi cứng, đe gỗ, búa tay, xi nhựa thông cố định',
    'Chạm trổ tay hoàn toàn trong 60 ngày.',
    'Lưu giữ bảo vật, trang sức quý, trưng bày cổ điển quý phái.',
    'Có giấy chứng nhận chất lượng bạc ta 99.9% của Viện Đá Quý & Kim Hoàn.',
    TRUE, FALSE, TRUE, 2150
),
(
    4, 'Chum Sành Đất Nung Giữ Nước Hương Canh', 'chum-sanh-dat-nung-giu-nuoc-huong-canh', 'CR-HC-2026-SANH',
    3, 1, 4,
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
    'Chum gốm sành sét xanh nung nhiệt độ cao, đanh như chuông đồng, chuyên dùng lưu trữ rượu quý và nước giếng thanh tịnh.',
    3500000, 'DI SẢN ĐỜI SỐNG', 'Hương Canh • Vĩnh Phúc', 'Cổ truyền Hương Canh',
    'Cao 60cm × ĐK bụng 45cm',
    '[
        {"label": "Chất liệu", "value": "Đất sét xanh trầm tích Hương Canh"},
        {"label": "Dung tích", "value": "30 Lít"},
        {"label": "Kỹ thuật", "value": "Nung sành kết khối không men"}
    ]'::jsonb,
    '[]'::jsonb,
    'Câu tục ngữ "Gốm Hương Canh giữ nước không hôi, ủ rượu không thối" đã khẳng định chất sành độc nhất vô nhị.',
    'Bàn xoay chân đạp, nạo tre chuốt cốt, lò cóc đốt củi',
    'Ủ đất sét xanh 6 tháng, tạo hình và nung 48 giờ.',
    'Ủ rượu quê, chứa nước mưa thanh lọc, trang trí tiểu cảnh sân vườn.',
    NULL, FALSE, FALSE, TRUE, 920
),
(
    5, 'Tượng Thiền Sư Chạm Đá Cẩm Thạch Non Nước', 'tuong-thien-su-cham-da-cam-thach-non-nuoc', 'CR-NN-2025-DA1',
    5, 6, 5,
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    'Pho tượng điêu khắc từ khối đá cẩm thạch trắng tự nhiên nguyên khối, toát lên phong thái an nhiên giải thoát.',
    32000000, 'ĐÁ MỸ NGHỆ ĐỘC BẢN', 'Non Nước • Đà Nẵng', 'Đương đại Non Nước',
    'Cao 75cm × Rộng 42cm × Sâu 30cm',
    '[
        {"label": "Chất liệu", "value": "Đá cẩm thạch trắng tự nhiên Ngũ Hành Sơn"},
        {"label": "Trọng lượng", "value": "48 kg"},
        {"label": "Kỹ thuật", "value": "Đục chạm lộng thủ công"}
    ]'::jsonb,
    '[]'::jsonb,
    'Tác phẩm biểu đạt tinh thần hòa ái, tĩnh tại của thiền tông phương Đông giữa cuộc sống hiện đại.',
    'Búa tay, ve đục hợp kim, đá mài nước mịn',
    'Chọn khối đá không vân nứt, phác thảo và đục chạm trong 3 tháng.',
    'Không gian thiền trà, phòng khách trang nhã, khuôn viên thiền tịnh.',
    NULL, TRUE, FALSE, TRUE, 1640
),
(
    6, 'Tấm Thổ Cẩm Ikat Hoa Văn Sấm Sét Làng Teng', 'tam-tho-cam-ikat-hoa-van-sam-set-lang-teng', 'CR-TB-2026-IKAT',
    5, 3, 6,
    'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=1000&q=80',
    'Tấm vải thổ cẩm dệt tay kỹ thuật Ikat phức tạp của đồng bào Hrê, nhuộm bằng thảo mộc rừng tự nhiên.',
    6800000, 'DI SẢN TỘC NGƯỜI', 'Làng Teng • Quảng Ngãi', 'Cổ truyền Hrê',
    'Dài 210cm × Rộng 85cm',
    '[
        {"label": "Chất liệu", "value": "Sợi bông rẫy tự nhiên"},
        {"label": "Màu sắc", "value": "Nhuộm chàm đen và vỏ cây rừng"},
        {"label": "Kỹ thuật", "value": "Dệt thắt sợi Ikat thủ công"}
    ]'::jsonb,
    '[]'::jsonb,
    'Hoa văn hình thoi biểu trưng cho thần Sấm và thần Nước, mang lại mùa màng no ấm cho buôn làng.',
    'Khung dệt ngồi luồn chân, thoi tre dệt sợi',
    'Thắt sợi nhuộm Ikat và dệt tay ròng rã 2 tháng.',
    'Treo tường trang trí nghệ thuật, làm chăn ấm thổ cẩm mùa đông.',
    NULL, TRUE, FALSE, TRUE, 1480
),
(
    7, 'Đỉnh Đồng Song Long Chầu Nguyệt Ngũ Xã', 'dinh-dong-song-long-chau-nguyet-ngu-xa', 'CR-NX-2025-DONG',
    1, 2, 8,
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1000&q=80',
    'Đỉnh đồng đỏ đúc thủ công nguyên khối không chắp vá, đôi rồng chạm nổi uy nghi mang đậm khí chất văn hóa Thăng Long.',
    45000000, 'DI SẢN ĐÚC ĐỒNG', 'Ngũ Xã • Hà Nội', 'Thế kỷ XVII phục dựng',
    'Cao 85cm × Rộng 60cm',
    '[
        {"label": "Chất liệu", "value": "Đồng đỏ nguyên thỏi tinh luyện"},
        {"label": "Trọng lượng", "value": "38 kg"},
        {"label": "Kỹ thuật", "value": "Đúc đồng khuôn sáp đất thó"}
    ]'::jsonb,
    '[]'::jsonb,
    'Vật phẩm tối thượng trên bàn thờ tổ tiên dòng tộc, biểu trưng cho sự uy nghiêm và lòng hiếu thảo.',
    'Lò nấu đồng than đá, gầu múc đồng chịu nhiệt, đục chạm thép hoa cương',
    'Đắp mẫu sáp ong, nung khuôn đất và rót đồng nóng chảy 1.200°C.',
    'Thờ tự gia tiên từ đường, đình chùa, không gian tâm linh trang nghiêm.',
    NULL, TRUE, FALSE, TRUE, 2280
),
(
    8, 'Quạt Nan Tre & Khay Trà Phú Vinh', 'quat-nan-tre-khay-tra-phu-vinh', 'CR-PV-2026-MAY',
    1, 4, 7,
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
    'Bộ đôi quạt nan tre dẻo uốn lượn và khay trà mây nan xiên mắt cáo tạo ngọn gió tự nhiên thanh mát ngày hè.',
    1850000, 'GIẢI NHIỆT MÙA HẠ', 'Phú Vinh • Hà Nội', 'Cổ truyền Phú Vinh',
    'Khay: 35cm × 25cm | Quạt: 38cm × 28cm',
    '[
        {"label": "Chất liệu", "value": "Tre gai già ngâm bùn ao vôi & mây rừng"},
        {"label": "Kỹ thuật", "value": "Đan nan xiên mắt cáo truyền thống"},
        {"label": "Đặc tính", "value": "Chống mọt tự nhiên, thoáng mát nhẹ nhàng"}
    ]'::jsonb,
    '[]'::jsonb,
    'Vật phẩm mộc mạc gắn liền với thú uống trà thanh tịnh dưới mái hiên nhà cổ của người Tràng An.',
    'Dao chuốt nan rựa tre, kéo tỉa mây, khuôn gỗ định hình',
    'Chẻ nan tre mỏng đều 1mm, đan nan cài mắt cáo liên kết chặt chẽ.',
    'Thưởng trà ngày hè, quạt mát tự nhiên, trang trí không gian vintage.',
    'Nằm trong Bộ Sưu Tập Mùa Hạ 2026.',
    TRUE, FALSE, TRUE, 2760
);

SELECT setval('crafts_id_seq', (SELECT MAX(id) FROM crafts));

-- -----------------------------------------------------------------------------
-- 10. THIẾT LẬP QUAN HỆ N-N: NGHỆ NHÂN ↔ TÁC PHẨM (craft_artisans) ⭐
-- -----------------------------------------------------------------------------
INSERT INTO craft_artisans (craft_id, artisan_id, role_title, contribution_notes, is_lead, display_order) VALUES
-- Tác phẩm 1 (Bình Men Rạn Tỳ Bà): Nghệ nhân Nguyễn Văn Bình chủ trì
(1, 1, 'Chủ trì chế tác & Tạo hình cốt gốm', 'Trực tiếp vuốt cốt gốm dáng tỳ bà trên bàn xoay và bài phối men rạn tam thái hoàng cung.', TRUE, 1),

-- Tác phẩm 2 (Khăn Sa Lụa Vạn Phúc): Nghệ nhân Trần Thị Mai dệt sa
(2, 2, 'Chủ trì thiết kế & Dệt sa lụa', 'Tự tay mắc cửi gài go dệt hoa văn chìm và nhuộm thảo mộc tự nhiên.', TRUE, 1),

-- Tác phẩm 3 (Hộp Bạc Đồng Xâm): Nghệ nhân Lê Bá Hưng chạm bạc
(3, 3, 'Chủ trì chạm trổ kim hoàn', 'Thúc nổi Bách Thú và tỉa chạm từng chi tiết vi mô bằng ve thép tôi.', TRUE, 1),

-- Tác phẩm 4 (Chum Sành Hương Canh): Nghệ nhân Phạm Đình Triệu tạo tác
(4, 4, 'Nghệ nhân chủ trì nung sành', 'Luyện đất sét xanh đồi Hương Canh và căn lửa lò cóc 48 giờ.', TRUE, 1),

-- Tác phẩm 5 (Tượng Thiền Sư Non Nước): Nghệ nhân Võ Văn Cường đục đá
(5, 5, 'Chủ trì điêu khắc đá khối', 'Trực tiếp đục tỉa diện tướng tượng Phật từ khối cẩm thạch tự nhiên.', TRUE, 1),

-- Tác phẩm 6 (Thổ Cẩm Ikat Teng): Nghệ nhân Y Krang Ksor dệt
(6, 6, 'Chủ trì dệt thổ cẩm Ikat', 'Thắt sợi nhuộm vỏ cây rừng và luồn thoi dệt hoa văn Sấm Sét.', TRUE, 1),

-- Tác phẩm 7 (Đỉnh Đồng Ngũ Xã): Nghệ nhân Nguyễn Văn Bình cố vấn hoa văn gốm chuyển sang đồng
(7, 1, 'Cố vấn mỹ thuật hoa văn cổ', 'Tư vấn đồ án đôi rồng thời Lê sang mẫu sáp đúc đồng.', FALSE, 2),

-- Tác phẩm 8 (Quạt Nan Tre Phú Vinh): Nghệ nhân Mai Vạn Phúc phối lụa với nan tre
(8, 2, 'Nghệ nhân phối vải lụa tơ', 'Dệt tấm lụa tơ tằm dán lên nan tre Chàng Sơn của quạt mát.', FALSE, 2);

-- -----------------------------------------------------------------------------
-- 11. THIẾT LẬP QUAN HỆ N-N: SẢN PHẨM ↔ CHẤT LIỆU (craft_materials)
-- -----------------------------------------------------------------------------
INSERT INTO craft_materials (craft_id, material_id) VALUES
(1, 1), (1, 2),          -- Bình gốm: Đất sét cao lanh, Men rạn tam thái
(2, 6),                  -- Khăn sa: Tơ tằm tự nhiên
(3, 5),                  -- Hộp bạc: Bạc ta nguyên chất
(4, 3),                  -- Chum sành: Đất sét xanh
(5, 4),                  -- Tượng đá: Đá cẩm thạch
(6, 7),                  -- Thổ cẩm: Sợi bông nhuộm chàm
(7, 9),                  -- Đỉnh đồng: Đồng đỏ
(8, 8), (8, 6);          -- Quạt nan: Tre già, Tơ tằm

-- -----------------------------------------------------------------------------
-- 12. THIẾT LẬP QUAN HỆ N-N: SẢN PHẨM ↔ KỸ THUẬT (craft_techniques)
-- -----------------------------------------------------------------------------
INSERT INTO craft_techniques (craft_id, technique_id) VALUES
(1, 1), (1, 2), (1, 3),  -- Bình gốm: Chuốt xoay, Nung củi lò bầu, Họa men lam
(2, 5),                  -- Khăn sa: Dệt sa lụa
(3, 4),                  -- Hộp bạc: Chạm trổ bạc lộng kênh bong
(4, 7),                  -- Chum sành: Gốm sành nung lộ thiên
(5, 8),                  -- Tượng đá: Chạm khắc đá khối
(6, 6),                  -- Thổ cẩm: Dệt Ikat
(7, 2),                  -- Đỉnh đồng: Nung đồng nhiệt độ cao
(8, 9);                  -- Quạt mây tre: Đan nan mắt cáo

-- -----------------------------------------------------------------------------
-- 13. NẠP CRAFT_IMAGES (Thư viện ảnh chi tiết tương tác Lightbox)
-- -----------------------------------------------------------------------------
INSERT INTO craft_images (craft_id, url, alt_text, caption, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80', 'Toàn cảnh Bình Gốm Men Rạn Cổ Dáng Tỳ Bà', 'Góc nhìn chính diện thân bình dáng tỳ bà thanh thoát', 1),
(1, 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80', 'Cận cảnh vân rạn tam thái trên cổ bình', 'Đường vân rạn men tự nhiên hình mai rùa độc bản', 2),
(1, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80', 'Miệng bình loe tròn đều chuốt tay bàn xoay', 'Tỷ lệ vàng phong thủy thu hút vượng khí cát tường', 3),

(2, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80', 'Tấm Khăn Sa Lụa Cung Đình Vạn Phúc', 'Sợi tơ sa mỏng nhẹ bay bổng trong nắng hè', 1),
(3, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80', 'Hộp Bạc Chạm Trổ Bách Thú Đồng Xâm', 'Nét chạm lộng 3 tầng kênh bong sắc sảo', 1),
(8, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80', 'Quạt Nan Tre và Khay Trà Phú Vinh', 'Nan tre uốn lượn thoáng khí giải nhiệt mùa hạ', 1);

SELECT setval('craft_images_id_seq', (SELECT MAX(id) FROM craft_images));

-- -----------------------------------------------------------------------------
-- 14. NẠP COLLECTIONS & SEASONAL_COLLECTIONS (Bộ Sưu Tập Mùa Hạ 2026)
-- -----------------------------------------------------------------------------
INSERT INTO collections (id, title, slug, description, banner_url, is_featured) VALUES
(1, 'Bảo Vật Hoàng Cung Thăng Long', 'bao-vat-hoang-cung-thang-long', 'Tuyển chọn các tác phẩm phục dựng chuẩn mực triều đình Lý - Trần - Lê từ gốm sứ và kim hoàn.', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', TRUE),
(2, 'Sợi Nắng Bản Địa Tây Nguyên', 'soi-nang-ban-dia-tay-nguyen', 'Bộ sưu tập thổ cẩm và điêu khắc mang hơi thở đại ngàn hùng vĩ.', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80', FALSE);

SELECT setval('collections_id_seq', (SELECT MAX(id) FROM collections));

INSERT INTO collection_crafts (collection_id, craft_id, display_order) VALUES
(1, 1, 1), (1, 3), (1, 7),
(2, 6, 1), (2, 5, 2);

-- BỘ SƯU TẬP THEO MÙA: MÙA HẠ 2026 (CR-ARCH-SUMMER-26)
INSERT INTO seasonal_collections (
    id, title, slug, season_code, year, theme_concept, philosophy_quote, quote_source,
    metrics, process_steps, archive_code, banner_url, color_tone, start_date, end_date, is_active
) VALUES (
    1,
    'Bộ Sưu Tập Mùa Hạ 2026: Sợi Tự Nhiên & Đất Nung Giải Nhiệt',
    'mua-ha-2026-soi-tu-nhien-dat-nung',
    'summer', 2026,
    'Khám phá không gian văn hóa giải nhiệt truyền thống Việt Nam qua chất gốm men mát, lụa sa tơ tằm thanh thoát và mây tre đan đón gió tự nhiên.',
    'Đưa chất mộc của đất nung và sự nhẹ nhàng của sợi tre vào nhịp sống hiện đại chính là liệu pháp giải nhiệt tâm hồn hiệu quả nhất ngày hè.',
    'Giám tuyển Văn hóa Trần Đình Bảo',
    '[
        {"label": "Tác phẩm tuyển chọn", "value": "12 Kiệt tác"},
        {"label": "Chất liệu chủ đạo", "value": "Gốm men tro • Tơ tằm • Tre già"},
        {"label": "Làng nghề tham gia", "value": "4 Làng di sản"}
    ]'::jsonb,
    '[
        {"title": "Gốm men tro dịu mát", "desc": "Bài men tro sông xua tan sắc nóng thị giác"},
        {"title": "Lụa sa thoáng khí", "desc": "Thấm hút mồ hôi và lưu thông làn gió nhẹ"},
        {"title": "Mây tre đan mắt cáo", "desc": "Cấu trúc nan đan tạo khe lưu thông không khí"}
    ]'::jsonb,
    'CR-ARCH-SUMMER-26',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    '#0ea5e9',
    '2026-05-01', '2026-08-31', TRUE
);

SELECT setval('seasonal_collections_id_seq', (SELECT MAX(id) FROM seasonal_collections));

-- Gán tác phẩm vào Bộ Sưu Tập Mùa Hạ
INSERT INTO seasonal_collection_crafts (seasonal_collection_id, craft_id, curator_note, highlight_badge, is_hero, display_order) VALUES
(1, 1, 'Màu men rạn tro sò mát lạnh kết hợp dáng tỳ bà mang lại cảm giác dịu mát thanh tĩnh tuyệt đối cho phòng khách ngày hè.', 'KIỆT TÁC SPOTLIGHT', TRUE, 1),
(1, 2, 'Lụa sa Nam Đàn mỏng nhẹ như cánh ve, giải nhiệt cơ thể hoàn hảo trong những ngày hè oi ả.', 'THANH MÁT NGÀY HÈ', FALSE, 2),
(1, 8, 'Nan tre già dẻo dai đón gió mát tự nhiên, gợi nhớ trưa hè thanh bình nơi nếp nhà xưa.', 'GIẢI NHIỆT DÂN GIAN', FALSE, 3),
(1, 4, 'Chất sành Hương Canh giữ nước giếng khơi mát lạnh nguyên vị suốt ngày dài nắng gắt.', 'MỘC MẠC THANH KHIẾT', FALSE, 4);

-- -----------------------------------------------------------------------------
-- 15. NẠP FAVOURITES (Dữ liệu yêu thích mẫu của người dùng đã đăng nhập)
-- -----------------------------------------------------------------------------
INSERT INTO favourites (user_id, craft_id, created_at) VALUES
(2, 1, NOW() - INTERVAL '3 days'),
(2, 2, NOW() - INTERVAL '2 days'),
(2, 8, NOW() - INTERVAL '1 day'),
(4, 1, NOW() - INTERVAL '5 days'),
(4, 3, NOW() - INTERVAL '4 days'),
(4, 5, NOW() - INTERVAL '2 days');

-- -----------------------------------------------------------------------------
-- 16. NẠP CONTACT_MESSAGES (Tin nhắn liên hệ mẫu theo chuyên đề)
-- -----------------------------------------------------------------------------
INSERT INTO contact_messages (user_id, full_name, email, phone, topic, subject, message, status) VALUES
(4, 'Hoàng Minh Nam', 'nam.hoang@gmail.com', '0912345678', 'artisan_verification', 'Yêu cầu thẩm định hồ sơ nghệ nhân điêu khắc đá', 'Chào ban quản trị, văn phòng kiến trúc chúng tôi muốn đối soát hồ sơ di sản của nghệ nhân Võ Văn Cường để phối hợp dự án công viên văn hóa.', 'unread'),
(2, 'Nguyễn Văn An', 'user@craftroots.test', '0987654321', 'workshop_booking', 'Tư vấn đặt lịch trải nghiệm chuốt gốm tại Bát Tràng', 'Tôi muốn đăng ký đoàn 6 người đến trải nghiệm trực tiếp vuốt gốm tại xưởng Nghệ nhân Nguyễn Văn Bình vào cuối tuần sau.', 'read'),
(NULL, 'Lê Thị Thu Cúc', 'thucuc.le@baochi.vn', '0903112233', 'press_media', 'Đề nghị phỏng vấn nghệ nhân cho chuyên đề Di Sản Việt', 'Ban biên tập Tạp chí Văn hóa mong muốn thực hiện bài phỏng vấn chuyên sâu với Nghệ nhân Nhân dân Nguyễn Văn Bình.', 'unread');

-- -----------------------------------------------------------------------------
-- 17. NẠP VISIT_BOOKINGS (Phiếu đăng ký hẹn thăm xưởng thủ công)
-- -----------------------------------------------------------------------------
INSERT INTO visit_bookings (artisan_id, user_id, full_name, phone, email, visit_date, time_slot, purpose, note, status) VALUES
(1, 4, 'Hoàng Minh Nam', '0912345678', 'nam.hoang@gmail.com', CURRENT_DATE + INTERVAL '3 days', 'morning', 'Khảo sát chất liệu gốm men rạn cho công trình bảo tàng tư nhân', 'Đoàn 4 kiến trúc sư muốn trực tiếp xem quy trình nung củi lò bầu.', 'confirmed'),
(1, 2, 'Nguyễn Văn An', '0987654321', 'user@craftroots.test', CURRENT_DATE + INTERVAL '5 days', 'afternoon', 'Trải nghiệm văn hóa gia đình', 'Đoàn có 2 trẻ em muốn trải nghiệm vuốt đất trên bàn xoay.', 'pending'),
(2, 3, 'Trần Thu Hà', '0944556677', 'editor@craftroots.vn', CURRENT_DATE + INTERVAL '4 days', 'morning', 'Nghiên cứu kỹ thuật dệt sa lụa cổ phục', 'Mong muốn nghệ nhân chia sẻ về kỹ thuật gài go hoa văn chìm.', 'pending');

-- -----------------------------------------------------------------------------
-- 18. NẠP NEWSLETTER_SUBSCRIBERS (Bản tin di sản hàng tuần)
-- -----------------------------------------------------------------------------
INSERT INTO newsletter_subscribers (email) VALUES
('docgia.disan@craftroots.vn'),
('nam.hoang@gmail.com'),
('leminh.arch@studio.vn'),
('huongsen.heritage@gmail.com'),
('khachhang.mynghe@yahoo.com')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 19. NẠP FIELD_NOTES (Ký họa điền dã di sản làng nghề)
-- -----------------------------------------------------------------------------
INSERT INTO field_notes (title, body, image_url, caption, coordinates, metrics, sort_order, is_published) VALUES
(
    'Bí quyết giữ lửa lò bầu Bát Tràng suốt 72 giờ liên tục',
    'Đêm thứ hai bên vách lò bầu rực lửa, nhiệt độ ngoài trời mùa hạ hầm hập nhưng không sánh được với sức nóng 1.300°C từ ngọn lửa củi gỗ nghiến. Nghệ nhân Nguyễn Văn Bình chỉ cần nhìn qua lỗ dòm lửa đã đoán chính xác màu lửa đang chuyển từ đỏ cam sang trắng ngọc – dấu hiệu men rạn đang bắt đầu tan chảy và bám chắc vào cốt đất cao lanh.',
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    'Nghệ nhân Nguyễn Văn Bình kiểm tra màu lửa qua lỗ dòm thành lò',
    '20.9781° N, 105.9183° E (Bát Tràng, Gia Lâm, Hà Nội)',
    '[
        {"label": "Nhiệt độ đỉnh lò", "value": "1.300°C"},
        {"label": "Thời gian đốt liên tục", "value": "72 giờ"},
        {"label": "Lượng củi tiêu thụ", "value": "18 tấn gỗ nghiến"}
    ]'::jsonb,
    1, TRUE
),
(
    'Nghệ thuật nhuộm chàm và tiếng thoi reo Làng Teng',
    'Dưới bóng râm nhà sàn Ba Tơ, nghệ nhân Y Krang Ksor thoăn thoắt nhúng từng bó sợi bông rẫy vào thùng nước chàm sủi bọt tím ngắt. Khác với dệt công nghiệp, sợi thổ cẩm Ikat phải được thắt nút bằng dây chuối trước khi nhuộm để giữ lại những mảng màu trắng tinh nguyên sơ, tạo nên đồ án thần Sấm kỳ ảo khi dệt.',
    'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=1000&q=80',
    'Kỹ thuật nhuộm chàm thảo mộc tự nhiên tại buôn làng',
    '14.7562° N, 108.7189° E (Ba Tơ, Quảng Ngãi)',
    '[
        {"label": "Thời gian ngâm chàm", "value": "21 ngày"},
        {"label": "Số lần nhúng sợi", "value": "15 lần phơi"}
    ]'::jsonb,
    2, TRUE
),
(
    'Âm vang tiếng đục đá ngũ hành Non Nước',
    'Tiếng đục chan chát vang vọng vào vách núi Ngũ Hành Sơn từ tờ mờ sáng. Dưới bàn tay chai sần của nghệ nhân Võ Văn Cường, từng mảnh đá cẩm thạch trắng rơi rụng để lộ dần khuôn mặt từ bi của pho tượng Phật. Ở đây, đá không phải là vật chất vô tri, mà là sự kiên nhẫn tích tụ của đất trời qua hàng vạn năm.',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    'Chạm trổ diện tượng Phật từ đá cẩm thạch nguyên khối',
    '16.0042° N, 108.2631° E (Ngũ Hành Sơn, Đà Nẵng)',
    '[
        {"label": "Độ cứng đá", "value": "3.5 - 4 Mohs"},
        {"label": "Thời gian tạc tượng", "value": "90 ngày liên tục"}
    ]'::jsonb,
    3, TRUE
);

SELECT setval('field_notes_id_seq', (SELECT MAX(id) FROM field_notes));

-- =============================================================================
-- HOÀN TẤT NẠP DỮ LIỆU SEED CHO TOÀN BỘ 22 BẢNG CRAFTROOTS v1.1.0!
-- =============================================================================
