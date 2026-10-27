-- =============================================================================
-- CRAFTROOTS MOCK DATA SEED SCRIPT (PostgreSQL 14+) - v2.0.0
-- Tích hợp dữ liệu chuẩn xác thực từ 28 Kiệt tác demo/craft & 10 Nghệ nhân demo/artisan
-- Phục vụ 22 bảng CSDL, 6 Vùng Di sản, 10 Bậc thầy & 4 Bộ sưu tập mùa Xuân - Hạ - Thu - Đông
-- =============================================================================

SET timezone = 'UTC';

-- Dọn dẹp dữ liệu cũ (theo thứ tự phụ thuộc khóa ngoại)
TRUNCATE TABLE favourites, visit_bookings, contact_messages, field_notes, newsletter_subscribers CASCADE;
TRUNCATE TABLE seasonal_collection_crafts, collection_crafts CASCADE;
TRUNCATE TABLE craft_images, craft_techniques, craft_materials, craft_artisans CASCADE;
TRUNCATE TABLE seasonal_collections, collections CASCADE;
TRUNCATE TABLE artisan_milestones, crafts, artisans, craft_villages CASCADE;
TRUNCATE TABLE techniques, materials, craft_categories, regions, users CASCADE;

-- -----------------------------------------------------------------------------
-- 1. NẠP USERS (Mật khẩu hash bcrypt salt 10 của 'Craft@1234')
-- -----------------------------------------------------------------------------
INSERT INTO users (id, full_name, email, password_hash, role, avatar_url, is_active) VALUES
(1, 'Ban Quản Trị CraftRoots', 'admin@craftroots.vn', '$2b$10$hEr123EcpgUdIobAJYYUSuzmDYfNYwiWCSScglY2xCngHqHrK71U2', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', TRUE),
(2, 'Nguyễn Văn An (Người Dùng)', 'user@craftroots.test', '$2b$10$hEr123EcpgUdIobAJYYUSuzmDYfNYwiWCSScglY2xCngHqHrK71U2', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', TRUE),
(3, 'Trần Thu Hà (Biên Tập Viên)', 'editor@craftroots.vn', '$2b$10$hEr123EcpgUdIobAJYYUSuzmDYfNYwiWCSScglY2xCngHqHrK71U2', 'editor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', TRUE),
(4, 'Hoàng Minh Nam (Kiến Trúc Sư)', 'nam.hoang@gmail.com', '$2b$10$hEr123EcpgUdIobAJYYUSuzmDYfNYwiWCSScglY2xCngHqHrK71U2', 'user', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', TRUE);

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- -----------------------------------------------------------------------------
-- 2. NẠP REGIONS (6 Vùng Di sản Văn hóa Việt Nam theo Stitch Map)
-- -----------------------------------------------------------------------------
INSERT INTO regions (id, name, code, map_key, description, craft_summary, image_url, is_verified, registered_village_count, national_heritage_count, sort_order) VALUES
(1, 'Đồng Bằng Bắc Bộ', 'dong-bang-bac-bo', 'dong-bang-bac-bo', 'Cái nôi nghìn năm văn hiến châu thổ sông Hồng với mật độ làng nghề dày đặc nhất Việt Nam.', 'Gốm men Bát Tràng, Lụa Vạn Phúc, Chạm bạc Đồng Xâm, Sơn mài Hạ Thái, Tranh Đông Hồ', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80', TRUE, 18, 12, 1),
(2, 'Tây Bắc Đại Ngàn', 'tay-bac', 'tay-bac', 'Vùng rẻo cao hiểm trở giàu bản sắc của đồng bào H''Mông, Dao, Thái, Tày.', 'Dệt thổ cẩm lanh nhuộm chàm Lùng Tám, Rèn dao thủ công H''Mông, Đan lát tre pơ-mu', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80', TRUE, 8, 5, 2),
(3, 'Đông Bắc Hùng Vĩ', 'dong-bac', 'dong-bac', 'Vùng non nước hữu tình với truyền thống luyện kim cổ truyền và gốm sành mộc.', 'Gốm sành Hương Canh, Đúc gang Tuyên Quang, Dệt nón lá Tày', 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1000&q=80', TRUE, 10, 6, 3),
(4, 'Bắc Trung Bộ Trầm Tích', 'bac-trung-bo', 'bac-trung-bo', 'Dải đất hẹp hội tụ tinh hoa cung đình Huế và các làng nghề xứ Thanh - Nghệ - Tĩnh.', 'Gốm tráng men hoàng cung Huế, Dệt đệm bàng Phò Trạch, Chiếu cói Nga Sơn', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80', TRUE, 14, 9, 4),
(5, 'Nam Trung Bộ & Tây Nguyên', 'nam-trung-bo-tay-nguyen', 'nam-trung-bo-tay-nguyen', 'Không gian giao thoa rực rỡ giữa văn hóa Chăm Pa cổ, tượng nhà mồ Tây Nguyên và đá Non Nước.', 'Gốm Chăm Bàu Trúc, Dệt thổ cẩm Mỹ Nghiệp, Đèn lồng Hội An, Điêu khắc đá Non Nước', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80', TRUE, 16, 11, 5),
(6, 'Nam Bộ Phù Sa', 'nam-bo', 'nam-bo', 'Vùng đất phương Nam hào sảng với văn hóa sông nước miệt vườn trù phú.', 'Chiếu dệt Định Yên, Đan lục bình sông Tiền, Gốm Lái Thiêu men màu', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80', TRUE, 12, 7, 6);

SELECT setval('regions_id_seq', (SELECT MAX(id) FROM regions));

-- -----------------------------------------------------------------------------
-- 3. NẠP CRAFT_CATEGORIES (Danh mục phân loại nghề thủ công)
-- -----------------------------------------------------------------------------
INSERT INTO craft_categories (id, name, slug, description, icon_url) VALUES
(1, 'Gốm sứ truyền thống', 'gom-su-truyen-thong', 'Nghệ thuật nhào nặn đất sét cao lanh, tạo hình vuốt tay bàn xoay và lửa nung khử oxy lò bầu.', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80'),
(2, 'Đúc đồng & Kim hoàn', 'duc-dong-kim-hoan', 'Kỹ nghệ đúc chuông, tượng đồng nguyên khối, chạm bạc mỹ nghệ, đậu bạc và thếp vàng lá cung đình.', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=200&q=80'),
(3, 'Dệt may & Thổ cẩm', 'det-may-tho-cam', 'Nghệ thuật ươm tơ dệt lụa sa, tơ sen tự nhiên, nhuộm chàm và dệt thổ cẩm hoa văn Chăm Pa, H''Mông.', 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=200&q=80'),
(4, 'Mây tre đan & Gỗ mỹ nghệ', 'may-tre-dan-go-thu-cong', 'Biến hóa nan tre già ngâm vôi, sợi cói, sừng trâu và gỗ lim thành vật dụng tinh xảo, thoáng mát và bền bỉ.', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=200&q=80'),
(5, 'Sơn mài & Khảm trai', 'son-mai-my-nghe-kham-trai', 'Nghệ thuật sơn mài truyền thống cẩn vỏ trứng, thếp vàng quỳ, khảm xà cừ ngũ sắc và tranh khắc gỗ dân gian.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80'),
(6, 'Điêu khắc đá mỹ nghệ', 'dieu-khac-da-my-nghe', 'Đục đẽo chạm lộng trên đá cẩm thạch tự nhiên, tạo hình tượng tâm linh và tác phẩm nghệ thuật.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80');

SELECT setval('craft_categories_id_seq', (SELECT MAX(id) FROM craft_categories));

-- -----------------------------------------------------------------------------
-- 4. NẠP CRAFT_VILLAGES (20 Làng nghề truyền thống di sản)
-- -----------------------------------------------------------------------------
INSERT INTO craft_villages (id, region_id, category_id, name, slug, district, province, century_label, summary) VALUES
(1, 1, 1, 'Làng Gốm Bát Tràng', 'bat-trang', 'Gia Lâm', 'Hà Nội', 'Thế kỷ XIV', 'Làng gốm lừng danh hơn 700 năm bên bờ sông Hồng, nổi tiếng với men rạn cổ, men lam và kỹ pháp lò nung củi.'),
(2, 1, 3, 'Làng Lụa Vạn Phúc', 'van-phuc', 'Hà Đông', 'Hà Nội', 'Hơn 1.000 năm', 'Cái nôi tơ lụa trứ danh đất Hà Thành, vang danh với lụa sa, lụa vân mềm mịn, hoa văn chìm tinh xảo.'),
(3, 1, 2, 'Làng Chạm Bạc Đồng Xâm', 'dong-xam', 'Kiến Xương', 'Thái Bình', 'Thế kỷ XVII', 'Làng nghề kim hoàn nổi tiếng với kỹ thuật gò thúc nổi, chạm trổ hoa văn tinh vi trên bạc ta nguyên chất.'),
(4, 3, 1, 'Làng Gốm Sành Hương Canh', 'huong-canh', 'Bình Xuyên', 'Vĩnh Phúc', 'Hơn 300 năm', 'Đất sành sét xanh đặc hữu không tráng men mà tự lên màu trầm bóng ngọc, tiếng kêu đanh như chuông khánh.'),
(5, 5, 6, 'Làng Đá Mỹ Nghệ Non Nước', 'non-nuoc', 'Ngũ Hành Sơn', 'Đà Nẵng', 'Thế kỷ XVII', 'Dưới chân năm ngọn Ngũ Hành Sơn, nơi các thợ đá chạm khắc tượng Phật từ đá cẩm thạch nguyên khối tuyệt mỹ.'),
(6, 5, 3, 'Làng Dệt Thổ Cẩm Mỹ Nghiệp', 'my-nghiep', 'Ninh Phước', 'Ninh Thuận', 'Thế kỷ XII', 'Di sản dệt thổ cẩm Chăm cổ xưa nhất Đông Nam Á, dệt hoa văn hình thoi và thần Siva huyền ảo.'),
(7, 1, 4, 'Làng Mây Tre Đan Phú Vinh', 'phu-vinh', 'Chương Mỹ', 'Hà Nội', 'Thế kỷ XVII', 'Xứ sở của nan tre mây uốn lượn, nổi danh với nghệ thuật đan nan xiên mắt cáo và giỏ hộp tinh xảo.'),
(8, 1, 2, 'Làng Đúc Đồng Đại Bái', 'dai-bai', 'Gia Bình', 'Bắc Ninh', 'Hơn 1.000 năm', 'Làng nghề đúc đồng danh tiếng vùng Kinh Bắc, chuyên đúc đại hồng chung, đỉnh trầm và chạm đồng mỹ nghệ.'),
(9, 1, 4, 'Làng Nón Chuông', 'lang-chuong', 'Thanh Oai', 'Hà Nội', 'Thế kỷ XIII', 'Làng nghề nón lá cổ truyền nổi tiếng với nón lá bài thơ thanh thoát và nón quai thao Kinh Bắc.'),
(10, 1, 5, 'Làng Tranh Dân Gian Đông Hồ', 'dong-ho', 'Thuận Thành', 'Bắc Ninh', 'Thế kỷ XVI', 'Di sản văn hóa phi vật thể quốc gia với tranh in mộc bản trên giấy điệp quét vỏ sò lấp lánh.'),
(11, 1, 4, 'Làng Mộc Điêu Khắc La Xuyên', 'la-xuyen', 'Ý Yên', 'Nam Định', 'Thế kỷ X', 'Cái nôi điêu khắc gỗ mỹ nghệ Bắc Bộ, trứ danh với kỹ thuật chạm lộng tứ linh kênh bong trên gỗ lim, gụ.'),
(12, 1, 5, 'Làng Sơn Mài Hạ Thái', 'ha-thai', 'Thường Tín', 'Hà Nội', 'Thế kỷ XVII', 'Làng sơn mài truyền thống bậc nhất, đỉnh cao với kỹ thuật cẩn vỏ trứng, thếp vàng quỳ và mài bóng nước.'),
(13, 1, 5, 'Làng Khảm Trai Chuyên Mỹ', 'chuyen-my', 'Phú Xuyên', 'Hà Nội', 'Thế kỷ XI', 'Đỉnh cao nghệ thuật cẩn ốc xà cừ ngũ sắc và trai ngọc trên gỗ trắc, gỗ gụ tinh xảo bậc nhất Việt Nam.'),
(14, 1, 4, 'Làng Cói Kim Sơn', 'kim-son', 'Kim Sơn', 'Ninh Bình', 'Gần 200 năm', 'Xứ sở cói mặn ven biển, nổi tiếng với các sản phẩm đan lát cói và cỏ biển tự nhiên bền đẹp.'),
(15, 5, 1, 'Làng Gốm Chăm Bàu Trúc', 'bau-truc', 'Ninh Phước', 'Ninh Thuận', 'Hơn 800 năm', 'Di sản văn hóa phi vật thể UNESCO, nghệ thuật tạo hình gốm người đi quanh bệ và nung lửa lộ thiên.'),
(16, 1, 2, 'Làng Rèn Đa Sỹ', 'da-sy', 'Hà Đông', 'Hà Nội', 'Thế kỷ XVI', 'Làng rèn trứ danh Thăng Long với kỹ thuật tôi thép carbon lửa than hoa và rèn dập thủ công sắc bén.'),
(17, 1, 2, 'Làng Kim Hoàn Định Công', 'dinh-cong', 'Hoàng Mai', 'Hà Nội', 'Thế kỷ VII', 'Cái nôi nghề kim hoàn Thăng Long, độc nhất vô nhị với kỹ thuật đậu bạc cuộn sợi tơ vi mô.'),
(18, 2, 3, 'Làng Dệt Lanh Lùng Tám', 'lung-tam', 'Quản Bạ', 'Hà Giang', 'Cổ truyền H''Mông', 'Nghệ thuật tước sợi lanh tự nhiên, vẽ hoa văn sáp ong và nhuộm chàm rừng trên vùng cao nguyên đá.'),
(19, 5, 3, 'Làng Đèn Lồng Hội An', 'den-long-hoi-an', 'Hội An', 'Quảng Nam', 'Thế kỷ XVI', 'Phố cổ hoa đăng với những chiếc đèn lồng khung tre bọc lụa tơ tằm thanh nhã rực rỡ sắc màu.'),
(20, 1, 4, 'Làng Lồng Chim Tre Canh Hoạch', 'canh-hoach', 'Thanh Oai', 'Hà Nội', 'Hơn 200 năm', 'Nổi tiếng khắp xứ Bắc với nghề làm lồng chim tre trúc đục chạm tinh xảo và chế tác sáo trúc.');

SELECT setval('craft_villages_id_seq', (SELECT MAX(id) FROM craft_villages));

-- -----------------------------------------------------------------------------
-- 5. NẠP MATERIALS (Chất liệu chế tác bản địa)
-- -----------------------------------------------------------------------------
INSERT INTO materials (id, name, description) VALUES
(1, 'Đất sét cao lanh Bát Tràng', 'Đất sét trắng trầm tích dẻo mịn đặc hữu phù sa sông Hồng, chịu nhiệt nung trên 1.280°C.'),
(2, 'Men rạn tam thái tro sò', 'Bài men hoàng cung pha chế từ tro vỏ sò sông, tro trấu và thạch anh, tạo vân rạn nứt tự nhiên độc bản.'),
(3, 'Đất sét xanh Hương Canh', 'Đất sét trầm tích chứa oxit sắt tự nhiên nung sành kết tinh đanh chắc chống thấm tuyệt đối.'),
(4, 'Đá cẩm thạch Ngũ Hành Sơn', 'Đá hoa tự nhiên vân cẩm thạch trắng, xanh ngọc và hồng phớt từ núi non miền Trung.'),
(5, 'Bạc ta nguyên chất 99.9%', 'Kim loại bạc tinh khiết dẻo dai thích hợp cho kỹ thuật dát mỏng, chạm trổ và đậu sợi tơ.'),
(6, 'Tơ tằm tự nhiên Vạn Phúc', 'Sợi tơ ươm từ kén sâu tằm bãi bồi sông Đáy, mềm mại, óng ả và thoáng mát.'),
(7, 'Sợi tơ sen tự nhiên Tây Hồ', 'Sợi tơ rút thủ công từ cuống sen hồ Tây, hương thơm thanh khiết, siêu nhẹ và quý hiếm.'),
(8, 'Tre gai già & Mây nếp ngâm vôi', 'Tre bánh tẻ ngâm bùn ao vôi chống mọt tự nhiên, chẻ nan chuốt mỏng như sợi tơ.'),
(9, 'Đồng đỏ nguyên thỏi', 'Hợp kim đồng đỏ tinh luyện có độ dẻo và ánh sắc trầm mặc cổ kính khi đúc chuông và đỉnh trầm.'),
(10, 'Sơn ta Phú Thọ & Vỏ trứng vịt', 'Mủ cây sơn ta bản địa kết hợp vỏ trứng vịt đồng và vàng quỳ mài bóng gương huyền bí.'),
(11, 'Gỗ lim & Gỗ trắc cổ thụ', 'Gỗ quý nguyên khối vân núi thớ mịn, chịu lực tốt và trường tồn hàng trăm năm.'),
(12, 'Sừng trâu nước tự nhiên', 'Sừng trâu già đen tuyền hoặc sừng bò tót hổ phách có độ dẻo cao khi xử lý nhiệt.'),
(13, 'Sợi cói mặn Kim Sơn', 'Sợi cói mọc vùng đầm lầy phù sa cửa biển, dai dẻo và hút ẩm tự nhiên.'),
(14, 'Đất sét sông Quao Bàu Trúc', 'Đất sét pha cát hạt mịn đặc thù vùng đồi cát Ninh Thuận nung lửa rơm lộ thiên.'),
(15, 'Thép carbon nhíp xe tôi nước', 'Thép đàn hồi có hàm lượng carbon cao, giữ độ sắc bén lâu dài khi rèn dập thủ công.'),
(16, 'Giấy điệp & Giấy dó thủ công', 'Giấy dó ngâm nước tro bồi bột vỏ sò điệp biển óng ánh ánh xà cừ tự nhiên.');

SELECT setval('materials_id_seq', (SELECT MAX(id) FROM materials));

-- -----------------------------------------------------------------------------
-- 6. NẠP TECHNIQUES (Kỹ pháp chế tác truyền thống)
-- -----------------------------------------------------------------------------
INSERT INTO techniques (id, name, description) VALUES
(1, 'Chuốt gốm vuốt tay bàn xoay', 'Định hình cốt gốm chuẩn xác bằng nhịp điệu của đôi bàn tay và bàn xoay gỗ truyền thống.'),
(2, 'Nung củi lò bầu khử oxy 72 giờ', 'Kỹ thuật giữ lửa củi gỗ nghiến liên tục suốt 3 ngày đêm tạo màu men rạn hỏa biến biến ảo.'),
(3, 'Vẽ thư họa men lam dưới men', 'Dùng bút lông thỏ vẽ họa tiết sơn thủy, hoa điểu trực tiếp lên cốt đất mộc trước khi phủ men.'),
(4, 'Chạm trổ gò thúc nổi kim hoàn', 'Dùng búa và ve chạm thúc nổi từng lớp cánh hoa, vảy rồng tách biệt khỏi bề mặt kim loại.'),
(5, 'Đậu bạc cuộn sợi tơ vi mô', 'Kéo bạc thành sợi mảnh như tóc rồi uốn lượn hàn ghép thành đồ án hoa văn tinh xảo.'),
(6, 'Dệt sa lụa hoa vân cung đình', 'Kỹ thuật dệt tơ đan cài tạo hoa văn vân mây chìm nổi tinh tế trên nền lụa trong suốt.'),
(7, 'Rút tơ cuống sen & Dệt thoi tay', 'Rút từng sợi tơ tơ từ cuống sen tươi trong ngày và dệt trên khung cửi thủ công mộc mạc.'),
(8, 'Đan nan xiên mắt cáo thoáng khí', 'Đan cài nan tre và mây ziczac tạo ô thoáng khí giải nhiệt tự nhiên cho ngày hè.'),
(9, 'Cẩn vỏ trứng & Sơn mài mài nước', 'Ghép từng mảnh vỏ trứng vụn trên nền sơn ta ướt và mài phẳng dưới nước qua hàng chục lớp.'),
(10, 'Thếp vàng quỳ lá 24K', 'Dát mỏng vàng thành quỳ lá siêu mỏng và thếp đều tay lên bề mặt cốt sơn bóng.'),
(11, 'Khảm xà cừ cưa lộng chi tiết', 'Cắt lộng vỏ ốc xà cừ cửu khổng ngũ sắc, đục gỗ cẩn chìm và mài phẳng bóng mượt.'),
(12, 'Khắc mộc bản & In tranh giấy điệp', 'Khắc nổi tranh trên ván gỗ thị và dập màu thiên nhiên nhiều lượt trên giấy điệp.'),
(13, 'Đúc đồng khuôn sáp đất thó', 'Nặn mẫu sáp ong, đắp khuôn bùn đất thó phơi khô rồi rót đồng nóng chảy 1.200°C.'),
(14, 'Điêu khắc chạm lộng gỗ lim', 'Đục tỉa kênh bong nhiều tầng lớp hình khối linh vật sống động uy nghi.'),
(15, 'Tạo hình gốm người đi quanh bệ', 'Nghệ nhân đi giật lùi quanh cột đất xoay mình để tạo hình gốm Bàu Trúc độc nhất vô nhị.'),
(16, 'Tôi thép than hoa lửa rèn bí truyền', 'Căn màu lửa thép đạt độ đỏ hồng rồi nhúng nước tôi lạnh định hình lưỡi sắc.');

SELECT setval('techniques_id_seq', (SELECT MAX(id) FROM techniques));

-- -----------------------------------------------------------------------------
-- 7. NẠP ARTISANS (10 Bậc Thầy Chế Tác theo 10 Folder demo/artisan)
-- -----------------------------------------------------------------------------
INSERT INTO artisans (
    id, name, slug, code, region_id, village_id, title, specialty, age, generation, years_of_experience,
    quote, biography, signature_work, technique_summary, technique_specs, verification_label, is_national_heritage,
    avatar_url, contact_info, visit_max_guests, visit_lead_time_hours, visit_open_days, visit_hours, visit_address, sort_order
) VALUES
(
    1, 'Nguyễn Văn Bình', 'nguyen-van-binh', 'ART-BT-001', 1, 1,
    'Nghệ nhân Nhân dân', 'Gốm Men Rạn Cổ & Men Lam Bát Tràng', 67, 5, 42,
    'Lửa lò bầu không bao giờ nói dối; tâm người thợ đặt vào đất thế nào thì men rạn sẽ hiện ra sắc thái như thế ấy.',
    'Sinh ra trong gia tộc 5 đời gắn bó với nghề gốm Bát Tràng, Nghệ nhân Nguyễn Văn Bình đã dành hơn 4 thập kỷ để phục dựng thành công bài men rạn hoàng cung thất truyền từ thế kỷ XVI và men lam thời Lê.',
    'Bộ Ấm Chén Gốm Men Rạn Cổ Hoàng Cung & Bình Tỳ Bà Men Lam',
    'Nung củi lò bầu khử oxy liên tục 72 giờ và phối men rạn tro sò sông tự nhiên.',
    '[{"label": "Kỹ pháp nung", "value": "Nung củi lò bầu khử oxy 72 giờ (1.300°C)"}, {"label": "Bài men", "value": "Men rạn tam thái tro sò sông cổ"}, {"label": "Tạo hình", "value": "Vuốt tay bàn xoay 100%"}]'::jsonb,
    'XÁC THỰC: DI SẢN QUỐC GIA (Quyết định số 248/QĐ-BVHTTDL)', TRUE,
    '/demo/artisan/authentic_documentary_photography_of_an_elderly_vietnamese_master_pottery/screen.png',
    'Xưởng gốm Bình Minh, Xóm 2, Bát Tràng, Gia Lâm, Hà Nội',
    8, 24, '{2,3,4,5,6,7}', '08:30 - 17:00',
    'Xưởng Gốm Bình Minh, Xóm 2, Thôn Giang Cao, Xã Bát Tràng, Huyện Gia Lâm, Hà Nội', 1
),
(
    2, 'Trần Thị Mai', 'tran-thi-mai', 'ART-VP-002', 1, 2,
    'Nghệ nhân Ưu tú', 'Dệt Lụa Sa Nam Đàn & Tơ Sen Cung Đình', 62, 4, 38,
    'Từng sợi tơ tằm là giọt ngọc của đất trời; dệt nên tấm lụa sa là giữ lại linh hồn thanh nhã của cha ông.',
    'Nghệ nhân đời thứ 4 làng lụa Vạn Phúc, người tiên phong khôi phục kỹ thuật dệt lụa sa cánh ve và phối sợi tơ sen tự nhiên siêu nhẹ phục vụ trang phục di sản.',
    'Khăn Sa Lụa Tơ Sen Cung Đình & Lụa Vân Vạn Phúc',
    'Gài go dệt hoa văn chìm khung cửi 4 go và rút tơ cuống sen hồ Tây thủ công.',
    '[{"label": "Chất liệu", "value": "100% tơ tằm tự nhiên và sợi tơ cuống sen"}, {"label": "Kỹ thuật", "value": "Dệt sa hoa vân chìm 4 go"}, {"label": "Nhuộm", "value": "Thảo mộc tự nhiên"}]'::jsonb,
    'XÁC THỰC: DI SẢN QUỐC GIA', TRUE,
    '/demo/artisan/portrait_of_an_elderly_vietnamese_female_artisan_weaving_traditional_silk_on_an/screen.png',
    'HTX Lụa Tơ Tằm Mai Anh, Phố Lụa Vạn Phúc, Hà Đông, Hà Nội',
    10, 48, '{2,3,4,5,6,7}', '09:00 - 17:30',
    'Số 18, Phố Lụa Vạn Phúc, Phường Vạn Phúc, Quận Hà Đông, Hà Nội', 2
),
(
    3, 'Lê Bá Hưng', 'le-ba-hung', 'ART-DX-003', 1, 3,
    'Nghệ nhân Nhân dân', 'Chạm Bạc Mỹ Nghệ & Kim Hoàn Đậu Bạc', 70, 6, 45,
    'Bạc mềm nhưng chạm nổi hoa văn phải có độ đanh thép, từng vảy rồng cánh phượng phải như bay lượn.',
    'Bậc thầy chạm bạc làng Đồng Xâm với 45 năm kinh nghiệm đục chạm gò thúc nổi kênh bong, người chế tác các hòm sắc phong và bảo vật kim hoàn cho di tích quốc gia.',
    'Hũ Đựng Trà Bạc Ta Bách Hoa & Hộp Bạc Bách Thú',
    'Kỹ thuật gò thúc nổi và chạm tỉa từng chi tiết micromet trên tấm bạc 99.9% nguyên chất.',
    '[{"label": "Chất liệu", "value": "Bạc ta 99.9% dát mỏng"}, {"label": "Kỹ thuật", "value": "Gò thúc nổi 3 tầng kênh bong"}, {"label": "Độ chuẩn", "value": "Gia công ve chạm tay thủ công"}]'::jsonb,
    'XÁC THỰC: DI SẢN QUỐC GIA', TRUE,
    '/demo/artisan/cinematic_close_up_portrait_of_a_veteran_vietnamese_silver_carving_master_in/screen.png',
    'Xưởng bạc Đồng Xâm Lê Hưng, Xã Hồng Thái, Kiến Xương, Thái Bình',
    6, 48, '{2,3,4,5,6}', '08:30 - 16:30',
    'Làng nghề Chạm Bạc Đồng Xâm, Xã Hồng Thái, Huyện Kiến Xương, Tỉnh Thái Bình', 3
),
(
    4, 'Tạ Thu Hương', 'ta-thu-huong', 'ART-LC-004', 1, 9,
    'Nghệ nhân Ưu tú', 'Nón Lá Bài Thơ & Nón Quai Thao Kinh Bắc', 54, 3, 32,
    'Từng đường kim mũi chỉ khâu trên vành nón không chỉ che nắng che mưa, mà còn gói trọn nét duyên dáng người con gái Việt.',
    'Nghệ nhân ưu tú làng nón Chuông, người lưu giữ bí quyết chèn thơ và họa tiết hoa sen ẩn hiện giữa hai lớp lá lụi non phơi sương, cùng kỹ thuật phục dựng nón quai thao cổ.',
    'Nón Lá Bài Thơ Làng Chuông & Nón Quai Thao Kinh Bắc',
    'Chuốt 16 vành tre tròn đều tăm tắp, khâu nón phẳng phiu bằng sợi cước tơ.',
    '[{"label": "Nguyên liệu", "value": "Lá lụi non phơi sương, tre cật già"}, {"label": "Kỹ thuật", "value": "Khâu nón 16 vành bài thơ soi sáng"}, {"label": "Đặc trưng", "value": "Nhẹ, thanh thoát và bền bỉ"}]'::jsonb,
    'XÁC THỰC: NGHỆ NHÂN ƯU TÚ TP HÀ NỘI', TRUE,
    '/demo/artisan/documentary_photography_of_a_gentle_vietnamese_female_artisan_in_chuong_village/screen.png',
    'Cơ sở nón lá Thu Hương, Làng Chuông, Thanh Oai, Hà Nội',
    12, 24, '{2,3,4,5,6,7}', '08:00 - 17:00',
    'Làng Chuông, Xã Phương Trung, Huyện Thanh Oai, Hà Nội', 4
),
(
    5, 'Thuận Thị Trụ', 'thuan-thi-tru', 'ART-MN-005', 5, 6,
    'Nghệ nhân Ưu tú', 'Dệt Thổ Cẩm Chăm Pa Cổ Truyền', 66, 4, 46,
    'Mỗi tấm thổ cẩm Chăm là tiếng lòng gửi đến thần linh, là nhịp đập của ngàn năm tháp cổ dệt vào sợi chỉ.',
    'Bậc thầy dệt thổ cẩm Chăm làng Mỹ Nghiệp, người gìn giữ trọn vẹn hơn 50 đồ án hoa văn cổ như hoa văn mắt gà, rồng Chăm, chim thần Garuda và phương thức nhuộm màu lá thảo mộc.',
    'Khăn Thổ Cẩm Hoa Văn Chăm Cổ Mỹ Nghiệp',
    'Dệt tay khung cửi nằm truyền thống kết hợp kỹ thuật luồn thoi gài hoa văn nổi.',
    '[{"label": "Chất liệu", "value": "Sợi bông tự nhiên xe tay"}, {"label": "Nhuộm màu", "value": "Thảo mộc vỏ cây rừng và chàm"}, {"label": "Hoa văn", "value": "Biểu tượng thần thoại Chăm Pa"}]'::jsonb,
    'XÁC THỰC: NGHỆ NHÂN ƯU TÚ DI SẢN PHI VẬT THỂ', TRUE,
    '/demo/artisan/documentary_portrait_of_a_cham_ethnic_female_master_weaver_in_my_nghiep_village/screen.png',
    'Hợp tác xã dệt thổ cẩm Mỹ Nghiệp, TT Phước Dân, Ninh Phước, Ninh Thuận',
    15, 48, '{2,3,4,5,6,7}', '08:30 - 17:30',
    'Làng Mỹ Nghiệp, Thị trấn Phước Dân, Huyện Ninh Phước, Tỉnh Ninh Thuận', 5
),
(
    6, 'Nguyễn Văn Trung', 'nguyen-van-trung', 'ART-PV-006', 1, 7,
    'Nghệ nhân Nhân dân', 'Mây Tre Đan Mỹ Nghệ & Nan Mắt Cáo', 68, 3, 48,
    'Nan tre uốn cong là ngọn gió mát lành; bàn tay người thợ đan là sự kiên định bền bỉ của người Việt.',
    'Nghệ nhân Nhân dân tiêu biểu của làng mây tre Phú Vinh, người đã nâng tầm nghệ thuật đan tranh phong cảnh, giỏ hộp nan xiên và khay trà thanh nhã xuất khẩu đi hơn 30 quốc gia.',
    'Giỏ Hoa Quả & Hộp Tre Đan Nan Xiên Phú Vinh',
    'Kỹ thuật chuốt nan tre mỏng 0.5mm, đan nan mắt cáo ziczac thoáng khí giải nhiệt.',
    '[{"label": "Nguyên liệu", "value": "Tre gai già ngâm ao vôi, mây nếp"}, {"label": "Kỹ thuật", "value": "Đan nan xiên mắt cáo ziczac"}, {"label": "Độ bền", "value": "Chống mọt tự nhiên không hóa chất"}]'::jsonb,
    'XÁC THỰC: NGHỆ NHÂN NHÂN DÂN QUỐC GIA', TRUE,
    '/demo/artisan/documentary_portrait_of_a_senior_vietnamese_bamboo_and_rattan_weaving_craftsman/screen.png',
    'Trung tâm Mây tre đan Phú Vinh, Xã Phú Nghĩa, Chương Mỹ, Hà Nội',
    20, 24, '{2,3,4,5,6,7}', '08:00 - 17:30',
    'Thôn Phú Vinh, Xã Phú Nghĩa, Huyện Chương Mỹ, Hà Nội', 6
),
(
    7, 'Nguyễn Đăng Chế', 'nguyen-dang-che', 'ART-DH-007', 1, 10,
    'Nghệ nhân Nhân dân', 'Tranh Khắc Gỗ Dân Gian Đông Hồ', 78, 5, 55,
    'Tranh Đông Hồ là hồn dân tộc; màu tranh là màu của rơm rạ quê hương, lấp lánh như vảy sò sông biển.',
    'Trưởng tộc dòng họ Nguyễn Đăng 5 đời giữ nghề tranh Đông Hồ, người đã lưu giữ và phục dựng hơn 200 bản khắc gỗ cổ có tuổi đời hàng thế kỷ, gìn giữ tinh hoa tranh dân gian Việt Nam.',
    'Tranh Khắc Gỗ Đàn Gà Mẹ Con & Tranh Bát Tiên Quá Hải',
    'Khắc mộc bản trên gỗ thị, in dập màu khoáng tự nhiên từng bản trên giấy điệp.',
    '[{"label": "Chất liệu nền", "value": "Giấy dó quét bột sò điệp óng ánh"}, {"label": "Màu sắc", "value": "Than lá tre, hoa hòe, gỉ đồng, đá son"}, {"label": "Ván khắc", "value": "Gỗ thị già không cong vênh"}]'::jsonb,
    'XÁC THỰC: DI SẢN VĂN HÓA PHI VẬT THỂ QUỐC GIA', TRUE,
    '/demo/artisan/portrait_of_an_elderly_master_artisan_of_dong_ho_folk_woodblock_printmaking/screen.png',
    'Trung tâm Bảo tồn Tranh Đông Hồ Nguyễn Đăng Chế, Thuận Thành, Bắc Ninh',
    25, 24, '{2,3,4,5,6,7}', '08:00 - 17:00',
    'Làng Đông Hồ, Xã Song Hồ, Thị xã Thuận Thành, Tỉnh Bắc Ninh', 7
),
(
    8, 'Nguyễn Văn Sính', 'nguyen-van-sinh', 'ART-DB-008', 1, 8,
    'Nghệ nhân Nhân dân', 'Đúc Đồng & Kim Khí Mỹ Nghệ Đại Bái', 72, 4, 50,
    'Tiếng chuông đồng ngân nga là tiếng vọng của ngàn năm dựng nước; đồng đỏ nóng chảy là nhiệt huyết của người thợ.',
    'Bậc thầy đúc đồng làng Đại Bái với hơn nửa thế kỷ tôi luyện bên lò lửa, người chủ trì đúc hàng trăm đại hồng chung và đỉnh trầm khổng lồ cho các di tích quốc gia linh thiêng.',
    'Đỉnh Đồng Cổ Quai Rồng & Chuông Đồng Mặt Trời Đông Sơn',
    'Đúc đồng khuôn sáp đất thó nguyên khối liền mạch không chắp vá, âm thanh ngân vang thanh thoát.',
    '[{"label": "Chất liệu", "value": "Đồng đỏ nguyên thỏi pha thiếc âm sắc"}, {"label": "Nhiệt độ nung", "value": "1.200°C lò than đá"}, {"label": "Kỹ thuật", "value": "Đúc khuôn sáp liền khối"}]'::jsonb,
    'XÁC THỰC: NGHỆ NHÂN NHÂN DÂN QUỐC GIA', TRUE,
    '/demo/artisan/portrait_of_an_elderly_vietnamese_bronze_casting_craftsman_in_dai_bai_village/screen.png',
    'Xưởng đúc đồng mỹ nghệ Đại Bái Văn Sính, Gia Bình, Bắc Ninh',
    10, 48, '{2,3,4,5,6}', '08:00 - 17:00',
    'Làng Đại Bái, Xã Đại Bái, Huyện Gia Bình, Tỉnh Bắc Ninh', 8
),
(
    9, 'Dương Văn Đạt', 'duong-van-dat', 'ART-LX-009', 1, 11,
    'Nghệ nhân Ưu tú', 'Điêu Khắc Gỗ Mỹ Nghệ & Tượng Tứ Linh', 64, 4, 40,
    'Khối gỗ lim thô ráp chỉ thực sự sống khi từng đường đục chạm lộng chạm tới cái thần thái uy nghiêm của linh vật.',
    'Nghệ nhân ưu tú làng mộc La Xuyên danh tiếng, bậc thầy đục tỉa kênh bong tứ linh, rồng quy, hoa sen trên các loại gỗ quý như lim, trắc, gụ với đường nét phóng khoáng đầy nội lực.',
    'Tượng Long Quy Gỗ Lim Chạm Khắc La Xuyên',
    'Đục tay chạm lộng 3 tầng kênh bong trên khối gỗ lim già không ghép nối.',
    '[{"label": "Chất liệu", "value": "Gỗ lim xanh nguyên khối vân núi"}, {"label": "Kỹ thuật", "value": "Đục chạm lộng kênh bong thủ công"}, {"label": "Xử lý", "value": "Đánh bóng sáp ong tự nhiên"}]'::jsonb,
    'XÁC THỰC: NGHỆ NHÂN ƯU TÚ TỈNH NAM ĐỊNH', TRUE,
    '/demo/artisan/portrait_of_a_senior_vietnamese_woodcarver_artisan_in_la_xuyen_village_nam_dinh/screen.png',
    'Cơ sở điêu khắc gỗ La Xuyên Dương Đạt, Xã Yên Ninh, Ý Yên, Nam Định',
    8, 48, '{2,3,4,5,6,7}', '08:30 - 17:00',
    'Làng La Xuyên, Xã Yên Ninh, Huyện Ý Yên, Tỉnh Nam Định', 9
),
(
    10, 'Đỗ Văn Thái', 'do-van-thai', 'ART-HT-010', 1, 12,
    'Nghệ nhân Nhân dân', 'Sơn Mài Truyền Thống, Cẩn Trứng & Thếp Vàng', 60, 3, 36,
    'Sơn mài là nghệ thuật của sự kiên nhẫn; mài bóng trong nước để tìm thấy ánh vàng lấp lánh sâu thẳm dưới lớp then.',
    'Nghệ nhân Nhân dân làng sơn mài Hạ Thái, người gìn giữ kỹ thuật sơn then cổ truyền, cẩn vỏ trứng vịt đồng và thếp vàng lá quỳ tạo nên những khay trà, bình hoa và bát sơn mài lộng lẫy.',
    'Khay Trà Sơn Mài Cổ Truyền, Bình Cẩn Vỏ Trứng & Bát Thếp Vàng',
    'Quy trình sơn then ta phủ hàng chục lớp, cẩn vỏ trứng vụn và mài nước đánh bóng gương.',
    '[{"label": "Nguyên liệu", "value": "Mủ sơn ta Phú Thọ, vàng quỳ 24K, vỏ trứng"}, {"label": "Kỹ thuật", "value": "Cẩn trứng, thếp vàng và mài nước"}, {"label": "Thời gian", "value": "45 - 60 ngày hoàn thiện một tác phẩm"}]'::jsonb,
    'XÁC THỰC: DI SẢN QUỐC GIA', TRUE,
    '/demo/artisan/portrait_of_a_vietnamese_lacquerware_master_artisan_in_ha_thai_village_applying/screen.png',
    'Xưởng sơn mài Hạ Thái Đỗ Thái, Xã Duyên Thái, Thường Tín, Hà Nội',
    12, 48, '{2,3,4,5,6,7}', '08:30 - 17:30',
    'Làng Hạ Thái, Xã Duyên Thái, Huyện Thường Tín, Hà Nội', 10
);

SELECT setval('artisans_id_seq', (SELECT MAX(id) FROM artisans));

-- -----------------------------------------------------------------------------
-- 8. NẠP ARTISAN_MILESTONES (Niên biểu cống hiến của 10 nghệ nhân)
-- -----------------------------------------------------------------------------
INSERT INTO artisan_milestones (artisan_id, year, event, sort_order) VALUES
(1, '1984', 'Chính thức tiếp quản lò gốm gia tộc và bắt đầu nghiên cứu phục chế bài men cổ triều Mạc.', 1),
(1, '1996', 'Phục chế thành công men rạn tam thái sau hơn 10 năm thất truyền, được giới khảo cổ ghi nhận.', 2),
(1, '2024', 'Được Chủ tịch nước phong tặng danh hiệu cao quý Nghệ nhân Nhân dân.', 3),
(2, '1988', 'Khôi phục kỹ thuật dệt sa lụa hoa vân cung đình từng bị mai một trong thời kỳ bao cấp.', 1),
(2, '2015', 'Phong tặng danh hiệu Nghệ nhân Ưu tú ngành nghề thủ công dệt lụa tơ tằm.', 2),
(3, '1982', 'Học nghề chạm bạc từ thân phụ và đạt danh hiệu Bàn tay vàng thủ công mỹ nghệ tỉnh Thái Bình.', 1),
(3, '2016', 'Được Nhà nước vinh danh Nghệ nhân Nhân dân ngành kim hoàn truyền thống.', 2),
(4, '1995', 'Sáng tạo phương pháp lồng họa tiết hoa sen và bài thơ vào giữa hai lớp lá nón Chuông.', 1),
(4, '2020', 'Được phong tặng danh hiệu Nghệ nhân Ưu tú TP Hà Nội.', 2),
(5, '1990', 'Phục dựng các đồ án hoa văn Chăm Pa cổ thất truyền trên khung cửi dệt thủ công Mỹ Nghiệp.', 1),
(5, '2017', 'Được Nhà nước phong tặng danh hiệu Nghệ nhân Ưu tú di sản dệt thổ cẩm.', 2),
(6, '1986', 'Phát triển kỹ thuật đan nan xiên mắt cáo xuất khẩu sang thị trường Châu Âu.', 1),
(6, '2020', 'Được phong tặng danh hiệu Nghệ nhân Nhân dân ngành mây tre đan.', 2),
(7, '1980', 'Sưu tầm và bảo tồn thành công hơn 200 bản khắc gỗ tranh Đông Hồ cổ qua các thời kỳ.', 1),
(7, '2019', 'Nghề làm tranh Đông Hồ được lập hồ sơ đề nghị UNESCO ghi danh là Di sản văn hóa phi vật thể.', 2),
(8, '1985', 'Đúc thành công quả đại hồng chung nặng 2 tấn nguyên khối cho ngôi chùa cổ danh tiếng Bắc Ninh.', 1),
(8, '2016', 'Được Chủ tịch nước phong tặng danh hiệu Nghệ nhân Nhân dân.', 2),
(9, '1992', 'Hoàn thành tác phẩm chạm khắc rồng quy nguyên khối gỗ lim cho quần thể di tích cố đô Hoa Lư.', 1),
(9, '2018', 'Được phong tặng danh hiệu Nghệ nhân Ưu tú ngành điêu khắc gỗ.', 2),
(10, '1998', 'Hoàn thiện kỹ thuật cẩn vỏ trứng trên cốt gốm phủ sơn mài đánh bóng gương độc bản.', 1),
(10, '2022', 'Được phong tặng danh hiệu Nghệ nhân Nhân dân ngành sơn mài truyền thống.', 2);

SELECT setval('artisan_milestones_id_seq', (SELECT MAX(id) FROM artisan_milestones));

-- -----------------------------------------------------------------------------
-- 9. NẠP CRAFTS (28 Kiệt Tác Thủ Công ứng với 28 Folder demo/craft)
-- -----------------------------------------------------------------------------
INSERT INTO crafts (
    id, name, slug, code, region_id, category_id, village_id, thumbnail_url,
    short_description, price_vnd, tag, origin_line, era, dimensions, specs, process_stages,
    cultural_context, tools, process, traditional_use, batch_note, is_featured, is_spotlight, handmade, view_count
) VALUES
-- 1. Đỉnh Đồng Cổ Quai Rồng
(
    1, 'Đỉnh Đồng Đốt Trầm Cổ Quai Rồng Nghê Vờn', 'dinh-dong-dot-tram-co-quai-rong-nghe-von', 'CR-DB-2026-D01',
    1, 2, 8,
    '/demo/craft/antique_vietnamese_bronze_incense_burner_with_dragon_handles_and_foo_dog_finial/screen.png',
    'Đỉnh đồng đỏ đúc thủ công nguyên khối với quai rồng uy nghi và nắp nghê vờn ngậm ngọc, chuyên dùng đốt trầm sưởi ấm và tích tụ vượng khí ngày đông.',
    38500000, 'HERO MÙA ĐÔNG', 'Đại Bái • Bắc Ninh', 'Thế kỷ XVII phục dựng',
    'Cao 65cm × ĐK bụng 40cm × Nặng 22kg',
    '[{"label": "Chất liệu", "value": "Đồng đỏ nguyên thỏi pha thiếc tinh luyện"}, {"label": "Kỹ thuật", "value": "Đúc đồng khuôn sáp đất thó liền khối"}, {"label": "Trọng lượng", "value": "22 kg"}]'::jsonb,
    '[{"step": 1, "title": "Đắp mẫu sáp ong", "description": "Tạo hình đôi rồng uốn lượn và con nghê vờn ngọc trên sáp ong."}, {"step": 2, "title": "Bọc khuôn đất thó", "description": "Bọc nhiều lớp đất sét rơm phơi khô."}, {"step": 3, "title": "Rót đồng 1.200°C", "description": "Nấu đồng đỏ nguyên thỏi và rót liền mạch vào khuôn nóng."}]'::jsonb,
    'Đỉnh đồng đốt trầm biểu trưng cho sự uy nghiêm, lòng hiếu thảo và ngọn lửa sưởi ấm gia đình trong tiết trời đông lạnh giá.',
    'Lò nung đồng, gầu rót chịu nhiệt, búa đục chạm kim khí',
    'Quy trình đúc khuôn sáp khép kín 30 ngày.',
    'Đốt hương trầm ấm cúng, thờ tự gia tiên, trang trí phòng khách cổ điển.',
    'Tuyệt phẩm Spotlight Mùa Đông 2026.',
    TRUE, TRUE, TRUE, 3850
),

-- 2. Giỏ Hoa Quả & Hộp Tre Đan Phú Vinh
(
    2, 'Giỏ Hoa Quả & Hộp Tre Đan Thủ Công Phú Vinh', 'gio-hoa-qua-hop-tre-dan-thu-cong-phu-vinh', 'CR-PV-2026-M02',
    1, 4, 7,
    '/demo/craft/artisan_handwoven_bamboo_fruit_basket_and_lidded_box_from_phu_vinh_craft/screen.png',
    'Bộ đôi giỏ hoa quả và hộp đựng đồ có nắp đan từ nan tre gai ngâm vôi mỏng mịn, đón gió thoáng mát tự nhiên ngày hè.',
    1650000, 'GIẢI NHIỆT MÙA HẠ', 'Phú Vinh • Hà Nội', 'Cổ truyền Phú Vinh',
    'Giỏ: ĐK 32cm × Cao 18cm | Hộp: ĐK 22cm × Cao 14cm',
    '[{"label": "Chất liệu", "value": "Tre gai già ngâm vôi ao bùn & mây nếp"}, {"label": "Kỹ thuật", "value": "Đan nan xiên mắt cáo ziczac"}, {"label": "Đặc tính", "value": "Thoáng khí, chống mọt tự nhiên"}]'::jsonb,
    '[{"step": 1, "title": "Chẻ chuốt nan", "description": "Chẻ nan tre mỏng 0.5mm đều tăm tắp."}, {"step": 2, "title": "Đan nan xiên", "description": "Tạo hình giỏ hoa quả thoáng gió đón khí mát ngày hè."}]'::jsonb,
    'Vật dụng đan tre mộc mạc gắn liền với bữa cơm trưa hè thanh bình và nếp sống chan hòa với thiên nhiên của người Việt.',
    'Dao chuốt nan tre, cào mây, kéo tỉa nan',
    'Đan thủ công tỉ mỉ từng mắt đan trong 7 ngày.',
    'Đựng hoa quả thanh mát, lưu trữ trà mộc, trang trí bàn ăn vintage.',
    'Nằm trong Tuyển tập Mùa Hạ 2026.',
    TRUE, FALSE, TRUE, 2410
),

-- 3. Giỏ Cói & Cỏ Biển Kim Sơn
(
    3, 'Giỏ Lưu Trữ Cói & Cỏ Biển Tự Nhiên Kim Sơn', 'gio-luu-tru-coi-co-bien-tu-nhien-kim-son', 'CR-KS-2026-C03',
    1, 4, 14,
    '/demo/craft/artisan_handwoven_natural_sedge_and_seagrass_storage_basket_from_kim_son/screen.png',
    'Giỏ lưu trữ đan tay từ sợi cói mặn và cỏ biển sấy khô vùng duyên hải Kim Sơn, dẻo dai, hút ẩm và mang lại cảm giác dịu mát tự nhiên.',
    1250000, 'MÁT LÀNH DUYÊN HẢI', 'Kim Sơn • Ninh Bình', 'Cổ truyền Kim Sơn',
    'ĐK miệng 35cm × ĐK đáy 28cm × Cao 30cm',
    '[{"label": "Chất liệu", "value": "Sợi cói mặn tự nhiên & Cỏ biển khô"}, {"label": "Kỹ thuật", "value": "Bện thừng xoắn và đan cuốn tay"}, {"label": "Màu sắc", "value": "Màu mộc tự nhiên của cỏ biển"}]'::jsonb,
    '[]'::jsonb,
    'Sợi cói mặn vươn lên từ bùn lầy ven biển mang hương vị biển cả, xua đi cảm giác oi nồng những trưa hè nắng gắt.',
    'Khung định hình mây, kim bện cói, kéo cắt cọng',
    'Thu hoạch cói, phơi nắng kiệt và bện cuốn thủ công.',
    'Đựng khăn bông hè, chứa đồ dùng phòng khách, trang trí không gian xanh.',
    NULL, TRUE, FALSE, TRUE, 1720
),

-- 4. Lu Nước & Chén Trà Bàu Trúc Chăm
(
    4, 'Lu Nước & Chén Trà Gốm Đất Nung Bàu Trúc Chăm', 'lu-nuoc-chen-tra-gom-dat-nung-bau-truc-cham', 'CR-BT-2026-G04',
    5, 1, 15,
    '/demo/craft/artisan_hand_turned_rustic_terracotta_water_jar_and_tea_bowl_from_bau_truc_cham/screen.png',
    'Bộ lu nước và chén trà đất nung đỏ mộc mạc chế tác theo kỹ pháp người đi quanh bệ xoay của phụ nữ Chăm, làm mát nước uống tự nhiên.',
    2800000, 'ĐẤT NUNG GIẢI NHIỆT', 'Bàu Trúc • Ninh Thuận', 'Di sản UNESCO',
    'Lu: Cao 42cm × ĐK 28cm | Chén: ĐK 9cm × Cao 6cm',
    '[{"label": "Chất liệu", "value": "Đất sét sông Quao pha cát hạt mịn"}, {"label": "Kỹ thuật", "value": "Tạo hình người đi quanh bệ, nung lộ thiên rơm củi"}, {"label": "Đặc tính", "value": "Thành gốm xốp thoáng làm mát nước cực nhanh"}]'::jsonb,
    '[]'::jsonb,
    'Gốm Bàu Trúc là bảo tàng sống của văn hóa Chăm Pa cổ, nơi bàn tay người phụ nữ biến đất và lửa thành nguồn nước mát lành giữa miền gió cát.',
    'Vỏ ốc chuốt gốm, thanh tre nạo, đống củi rơm nung ngoài trời',
    'Tạo hình hoàn toàn bằng đôi chân và đôi bàn tay quanh cột đất.',
    'Lưu trữ nước giải nhiệt mùa hè, thưởng trà mộc, trưng bày di sản.',
    'Tuyển chọn Bộ Sưu Tập Mùa Hạ 2026.',
    TRUE, FALSE, TRUE, 2890
),

-- 5. Chén Trà Men Ngọc Celadon
(
    5, 'Chén Trà Gốm Sành Men Ngọc Celadon Mộc Mạc', 'chen-tra-gom-sanh-men-ngoc-celadon-moc-mac', 'CR-HC-2026-G05',
    3, 1, 4,
    '/demo/craft/artisan_hand_turned_rustic_vietnamese_stoneware_celadon_tea_bowl_with_natural/screen.png',
    'Chén trà gốm sành vuốt tay với lớp men ngọc celadon tro trấu tự nhiên, giữ trọn độ ấm nồng và phong vị thanh tao ngày thu se lạnh.',
    950000, 'TRÀ THIỀN MÙA THU', 'Hương Canh • Vĩnh Phúc', 'Cổ truyền phục dựng',
    'Đường kính 11.5cm × Cao 7.2cm',
    '[{"label": "Chất liệu", "value": "Đất sét sành khoáng tự nhiên, men celadon tro trấu"}, {"label": "Kỹ thuật", "value": "Chuốt vuốt tay bàn xoay, nung khử oxy 1.280°C"}, {"label": "Âm sắc", "value": "Gõ đanh vang như chuông khánh"}]'::jsonb,
    '[]'::jsonb,
    'Sắc men ngọc trầm lắng như làn nước hồ mùa thu, đưa tâm hồn người thưởng trà về trạng thái tĩnh tại an nhiên.',
    'Bàn xoay gỗ, dao nạo tre chuốt thành gốm, lò củi nung nhiệt cao',
    'Ủ đất sét sành 6 tháng, tạo hình và nung khử liên tục 48 giờ.',
    'Thưởng trà đạo thiền tịnh, sưu tầm gốm mộc, quà tặng tinh tế.',
    NULL, TRUE, FALSE, TRUE, 1980
),

-- 6. Khăn Lụa Tơ Sen Phan Lương
(
    6, 'Khăn Lụa Tơ Sen Tự Nhiên Phan Lương', 'khan-lua-to-sen-tu-nhien-phan-luong', 'CR-TS-2026-L06',
    1, 3, 2,
    '/demo/craft/authentic_vietnamese_lotus_silk_scarf_woven_from_natural_lotus_stem_fibers_in/screen.png',
    'Khăn lụa dệt từ hàng vạn sợi tơ cuống sen Tây Hồ tự nhiên, nhẹ bẫng như mây, thoang thoảng hương sen dịu ngọt giải nhiệt tâm hồn ngày hè.',
    8500000, 'HERO MÙA HẠ', 'Phan Lương • Hà Nội', 'Độc bản quý hiếm',
    'Dài 190cm × Rộng 70cm',
    '[{"label": "Chất liệu", "value": "100% tơ cuống sen tự nhiên Tây Hồ"}, {"label": "Độ dài sợi", "value": "Cần 4.800 cuống sen cho 01 chiếc khăn"}, {"label": "Trọng lượng", "value": "Chỉ 65 gram (siêu nhẹ, bay bổng)"}]'::jsonb,
    '[{"step": 1, "title": "Thu hái cuống sen", "description": "Hái cuống sen bánh tẻ từ đầm sen Tây Hồ lúc sáng sớm."}, {"step": 2, "title": "Rút sợi tơ sen", "description": "Khía nhẹ thân cuống và dùng ngón tay kéo các sợi tơ mảnh mịn."}, {"step": 3, "title": "Dệt thoi thủ công", "description": "Mắc sợi tơ sen dệt chậm rãi trên khung cửi gỗ cổ truyền."}]'::jsonb,
    'Tơ sen là đỉnh cao của sự thanh khiết trong văn hóa Việt Nam, hấp thụ linh khí đất trời mùa hạ mang lại cảm giác mát lạnh khoan khoái vô song.',
    'Dao khía cuống sen, bàn se tơ gỗ, khung cửi thoi tay',
    'Quy trình kỳ công mất 60 ngày hoàn thiện một chiếc khăn tơ sen.',
    'Choàng mát mùa hạ, phối áo dài truyền thống, sưu tập lụa quý.',
    'Kiệt tác Spotlight Mùa Hạ 2026.',
    TRUE, TRUE, TRUE, 4200
),

-- 7. Khay Trà Sơn Mài Hạ Thái
(
    7, 'Khay Trà Sơn Mài Truyền Thống Làng Hạ Thái', 'khay-tra-son-mai-truyen-thong-lang-ha-thai', 'CR-HT-2026-S07',
    1, 5, 12,
    '/demo/craft/exquisite_traditional_vietnamese_lacquer_tea_tray_from_ha_thai_village_deep/screen.png',
    'Khay trà sơn mài cổ truyền phủ lớp sơn then sâu thẳm lòng son thắm đượm, giữ hương ấm nồng cho chén trà sen trong tiết heo may mùa thu.',
    3400000, 'HERO MÙA THU', 'Hạ Thái • Hà Nội', 'Cổ truyền Hạ Thái',
    'Dài 42cm × Rộng 28cm × Cao 4.5cm',
    '[{"label": "Chất liệu", "value": "Cốt gỗ mít ta khô, mủ sơn ta Phú Thọ tự nhiên"}, {"label": "Kỹ thuật", "value": "Sơn then 12 nước, mài phẳng dưới nước đánh bóng gương"}, {"label": "Sắc thái", "value": "Đỏ son thắm quyện đen huyền bí"}]'::jsonb,
    '[{"step": 1, "title": "Làm mộc & Đắp vóc", "description": "Bo viền gỗ mít và quét nhựa sơn ta bọc vải màn chống nứt."}, {"step": 2, "title": "Phủ lớp sơn then", "description": "Quét sơn ta nhiều lớp, ủ phòng ẩm kín gió."}, {"step": 3, "title": "Mài nước đánh bóng", "description": "Mài than củi dưới nước chảy và dùng lòng bàn tay xoa bóng."}]'::jsonb,
    'Màu đỏ son trầm của khay trà sơn mài Hạ Thái gợi nhắc nét hoài niệm về mùa thu Hà Nội xưa, nơi chén trà ấm gắn kết những tâm hồn tri kỷ.',
    'Bút quét sơn ta, than củi mài nước, bột chu sa, dầu hỏa đánh bóng',
    'Kéo dài hơn 45 ngày qua hàng chục công đoạn mài nước khắt khe.',
    'Bày biện bộ trà thiền, thưởng trà mùa thu, trang trí nội thất cổ kính.',
    'Kiệt tác Spotlight Mùa Thu 2026.',
    TRUE, TRUE, TRUE, 3650
),

-- 8. Nón Lá Bài Thơ Làng Chuông
(
    8, 'Nón Lá Bài Thơ Truyền Thống Làng Chuông', 'non-la-bai-tho-truyen-thong-lang-chuong', 'CR-LC-2026-N08',
    1, 4, 9,
    '/demo/craft/exquisite_traditional_vietnamese_non_la_conical_hat_with_subtle_poem/screen.png',
    'Nón lá bài thơ 16 vành khâu từ lá lụi non phơi sương, soi lên ánh nắng mùa xuân hiện rõ vần thơ và hình ảnh chùa Một Cột thanh thoát.',
    650000, 'DU XUÂN KINH KỲ', 'Làng Chuông • Hà Nội', 'Cổ truyền Làng Chuông',
    'Đường kính vành 41cm × Cao 20cm',
    '[{"label": "Chất liệu", "value": "Lá lụi non phơi sương, vành tre cật chuốt tròn"}, {"label": "Kỹ thuật", "value": "Khâu nón 16 vành thủ công bằng sợi cước tơ"}, {"label": "Bí quyết", "value": "Họa tiết bài thơ chèn giữa hai lớp lá"}]'::jsonb,
    '[]'::jsonb,
    'Chiếc nón lá làng Chuông là biểu tượng bất hủ của người thiếu nữ đất Tràng An trẩy hội du xuân, e ấp duyên dáng dưới nắng ấm đầu năm.',
    'Khuôn nón gỗ, vành tre chuốt tròn, kim khâu nón dài, giẻ là phẳng lá',
    'Là phẳng từng phiến lá trên bếp than đỏ và khâu tay từng mũi kim đều đặn.',
    'Đội đầu du xuân, biểu diễn nghệ thuật dân tộc, quà tặng văn hóa Việt.',
    'Nằm trong Tuyển tập Mùa Xuân 2026.',
    TRUE, FALSE, TRUE, 2180
),

-- 9. Bình Gốm Sơn Mài Cẩn Vỏ Trứng
(
    9, 'Bình Gốm Sơn Mài Cẩn Vỏ Trứng & Bạc Phủ', 'binh-gom-son-mai-can-vo-trung-bac-phu', 'CR-HT-2026-S09',
    1, 5, 12,
    '/demo/craft/exquisite_vietnamese_traditional_lacquer_vase_with_inlaid_natural_eggshell_and/screen.png',
    'Bình dáng cao thanh mảnh kết hợp cốt gốm Bát Tràng và kỹ thuật cẩn vỏ trứng vịt li ti trên nền sơn mài bạc quỳ, bừng sáng sắc xuân rực rỡ.',
    4800000, 'KHỞI SẮC ĐẦU NĂM', 'Hạ Thái • Hà Nội', 'Đương đại di sản',
    'Cao 52cm × ĐK thân 18cm × ĐK miệng 10cm',
    '[{"label": "Chất liệu", "value": "Cốt gốm đất cao lanh, mủ sơn ta, vỏ trứng vịt đồng, bạc quỳ"}, {"label": "Kỹ thuật", "value": "Cẩn mảnh trứng vụn ghép tranh, toát mài nước bóng ngọc"}, {"label": "Tạo hình", "value": "Dáng bình giọt nước thanh lịch"}]'::jsonb,
    '[]'::jsonb,
    'Sắc trắng ngà của vỏ trứng tượng trưng cho mầm sống sinh sôi nảy nở, mang lại sinh khí và tài lộc dồi dào cho gia chủ dịp đầu xuân năm mới.',
    'Nhíp gắp vỏ trứng, bút lông tỉa nét, dao mài nước mịn',
    'Cẩn ghép hàng ngàn mảnh vỏ trứng nhỏ li ti và mài nước 30 ngày.',
    'Cắm cành đào xuân, trưng bày tiền sảnh, sưu tầm mỹ nghệ cao cấp.',
    'Nằm trong Tuyển tập Mùa Xuân 2026.',
    TRUE, FALSE, TRUE, 3120
),

-- 10. Đèn Lồng Lụa Hội An
(
    10, 'Đèn Lồng Lụa Hội An Dáng Giọt Nước Cung Đình', 'den-long-lua-hoi-an-dang-giot-nuoc-cung-dinh', 'CR-HA-2026-D10',
    5, 3, 19,
    '/demo/craft/exquisite_vietnamese_traditional_silk_lantern_from_hoi_an_teardrop_shape_with/screen.png',
    'Đèn lồng khung tre uốn dáng giọt nước bọc vải lụa tơ tằm thêu hoa sen, thắp sáng lung linh đêm hội hoa đăng đầu xuân bên dòng sông Hoài.',
    890000, 'ĐÊM HỘI HOA ĐĂNG', 'Hội An • Quảng Nam', 'Cổ truyền Hội An',
    'Dài 55cm (kể cả tua rua) × ĐK 30cm',
    '[{"label": "Chất liệu", "value": "Nan tre già ngâm muối chống mọt, lụa tơ tằm Hà Đông"}, {"label": "Kỹ thuật", "value": "Uốn nan tre nan cong tạo dáng, bọc căng lụa tơ bóng"}, {"label": "Họa tiết", "value": "Thêu hoa sen và cành mai vàng đón Tết"}]'::jsonb,
    '[]'::jsonb,
    'Ánh sáng dịu dàng của đèn lồng lụa Hội An thắp lên niềm tin, hy vọng và sự an lành cho năm mới sum vầy hạnh phúc.',
    'Dao uốn nan tre, khuôn định hình đèn lồng, kéo cắt lụa, hồ dán tự nhiên',
    'Lắp ráp khung nan tre thủ công và dán căng lụa tơ tằm.',
    'Thắp sáng đêm rằm Tết, trang trí hiên nhà cổ, tạo không gian ấm cúng.',
    NULL, TRUE, FALSE, TRUE, 2540
),

-- 11. Tượng Long Quy Gỗ Lim La Xuyên
(
    11, 'Tượng Long Quy Gỗ Lim Chạm Khắc La Xuyên', 'tuong-long-quy-go-lim-cham-khac-la-xuyen', 'CR-LX-2026-G11',
    1, 4, 11,
    '/demo/craft/hand_carved_vietnamese_ironwood_sculpture_of_mythical_dragon_turtle_from_la/screen.png',
    'Pho tượng thần thú Long Quy chạm khắc lộng kênh bong từ khối gỗ lim xanh già nguyên khối, uy phong vững chãi xua tan giá rét mùa đông.',
    28500000, 'TRẤN TRẠCH VƯỢNG KHÍ', 'La Xuyên • Nam Định', 'Thế kỷ X phục dựng',
    'Dài 48cm × Rộng 32cm × Cao 28cm × Nặng 18kg',
    '[{"label": "Chất liệu", "value": "Gỗ lim xanh nguyên khối vân núi thớ đanh chắc"}, {"label": "Kỹ thuật", "value": "Đục chạm lộng 3 tầng kênh bong tứ linh"}, {"label": "Xử lý bề mặt", "value": "Đánh bóng sáp ong tự nhiên giữ màu gỗ nguyên bản"}]'::jsonb,
    '[]'::jsonb,
    'Long Quy là linh vật huyền thoại mang đầu rồng mình rùa, biểu trưng cho sự trường thọ vô biên, vững chãi và bảo trợ gia trạch trước gió rét ngày đông.',
    'Bộ đục chạm khắc tay hơn 30 món thép tôi cứng, búa gỗ, giẻ xoa sáp ong',
    'Chọn khối gỗ lim không vân nứt, phác thảo và đục chạm trong 40 ngày.',
    'Đặt bàn trà phòng khách, trấn trạch phòng làm việc, quà tặng phong thủy.',
    'Tuyển chọn Bộ Sưu Tập Mùa Đông 2026.',
    TRUE, FALSE, TRUE, 2740
),

-- 12. Hộp Trà Gỗ Gụ Khảm Xà Cừ Chuyên Mỹ
(
    12, 'Hộp Trà Gỗ Gụ Khảm Xà Cừ Bách Điểu Chuyên Mỹ', 'hop-tra-go-gu-kham-xa-cu-bach-dieu-chuyen-my', 'CR-CM-2026-K12',
    1, 5, 13,
    '/demo/craft/masterpiece_vietnamese_hand_carved_mahogany_wood_tea_box_with_mother_of_pearl/screen.png',
    'Hộp đựng trà gỗ gụ khảm xà cừ cửu khổng đỏ lửa ngũ sắc tích Bách Điểu Triều Phụng, lấp lánh ánh trăng rằm trong tiết trà thu.',
    12500000, 'NGŨ SẮC TRĂNG THU', 'Chuyên Mỹ • Hà Nội', 'Thế kỷ XI phục dựng',
    'Dài 26cm × Rộng 16cm × Cao 12cm',
    '[{"label": "Chất liệu", "value": "Gỗ gụ mật lâu năm, vỏ ốc xà cừ đỏ lửa tự nhiên"}, {"label": "Kỹ thuật", "value": "Cưa lộng xà cừ chi tiết vi mô, đục gỗ cẩn chìm"}, {"label": "Đặc tính", "value": "Lớp xà cừ đổi màu theo góc nhìn ánh sáng"}]'::jsonb,
    '[]'::jsonb,
    'Ánh xà cừ lung linh biến chuyển như ánh trăng mùa thu phản chiếu mặt nước, nâng tầm thú thưởng trà tao nhã của bậc quân tử.',
    'Cưa lộng cánh cung, dùi đục gỗ tí hon, bột đá mài xà cừ',
    'Cắt tỉa từng sợi lông chim bằng xà cừ và cẩn phẳng mượt vào cốt gỗ.',
    'Bảo quản trà quý ngày thu, trưng bày án thư, quà tặng di sản.',
    NULL, TRUE, FALSE, TRUE, 2390
),

-- 13. Hũ Trà Bạc Ta Đồng Xâm
(
    13, 'Hũ Đựng Trà Bạc Ta Chạm Thúc Bách Hoa Đồng Xâm', 'hu-dung-tra-bac-ta-cham-thuc-bach-hoa-dong-xam', 'CR-DX-2026-B13',
    1, 2, 3,
    '/demo/craft/masterpiece_vietnamese_hand_chased_solid_silver_tea_canister_from_dong_xam/screen.png',
    'Hũ đựng trà chế tác từ bạc ta 99.9% chạm thúc nổi hoa văn Bách Hoa Triều Cúc, nắp đậy khít khao giữ trọn hơi ấm và hương trà mùa đông giá buốt.',
    22000000, 'BÁU VẬT KIM HOÀN', 'Đồng Xâm • Thái Bình', 'Thế kỷ XVII phục dựng',
    'Cao 20cm × ĐK thân 14cm × Nặng 850 gram bạc',
    '[{"label": "Chất liệu", "value": "Bạc ta 99.9% nguyên chất tinh khiết"}, {"label": "Kỹ thuật", "value": "Gò tấm bạc, thúc nổi hoa văn 3D và chạm tỉa từng cánh hoa"}, {"label": "Độ kín", "value": "Nắp gài kép kín tuyệt đối ngăn ẩm mốc"}]'::jsonb,
    '[]'::jsonb,
    'Bạc ta có khả năng kỵ gió độc và giữ nhiệt lưu hương tuyệt hảo, là báu vật không thể thiếu trong gian trà ấm cúng ngày đông của quý tộc xưa.',
    'Ve chạm thép tôi cứng, đe gỗ gắn xi nhựa thông, búa tay gò bạc',
    'Gò thúc nổi tay hoàn toàn trong 45 ngày tỉ mỉ.',
    'Lưu giữ trà Shan Tuyết cổ thụ, trang trí không gian sang trọng.',
    'Nằm trong Tuyển tập Mùa Đông 2026.',
    TRUE, FALSE, TRUE, 3310
),

-- 14. Bát Sơn Mài Thếp Vàng Hạ Thái
(
    14, 'Bát Sơn Mài Thếp Vàng Lá & Lòng Son Hạ Thái', 'bat-son-mai-thep-vang-la-long-son-ha-thai', 'CR-HT-2026-S14',
    1, 5, 12,
    '/demo/craft/masterpiece_vietnamese_lacquer_bowl_coated_in_multi_layered_gold_leaf_and_deep/screen.png',
    'Bát sơn mài tiện thủ công thếp vàng lá quỳ 24K rực rỡ bên ngoài và tráng lớp son thắm bên trong, biểu trưng cho phú quý đại cát mùa xuân.',
    5200000, 'HERO MÙA XUÂN', 'Hạ Thái • Hà Nội', 'Kiệt tác cung đình',
    'Đường kính 22cm × Cao 11cm',
    '[{"label": "Chất liệu", "value": "Cốt gỗ tiện tròn, sơn ta tự nhiên, vàng lá quỳ 24K Kiêu Kỵ"}, {"label": "Kỹ thuật", "value": "Thếp vàng quỳ nhiều lớp phủ quang dầu bóng gương"}, {"label": "Sắc son", "value": "Màu đỏ chu sa thắm đượm truyền thống"}]'::jsonb,
    '[{"step": 1, "title": "Tiện cốt gỗ tròn", "description": "Tiện cốt gỗ mộc cân đối chuẩn xác từng milimet."}, {"step": 2, "title": "Quét sơn bắt vàng", "description": "Quét lớp sơn then mỏng để keo sơn đạt độ bám dính vàng tối ưu."}, {"step": 3, "title": "Thếp vàng quỳ 24K", "description": "Dùng chổi lông thỏ nhẹ nhàng dán từng lá vàng quỳ kín khít và phủ dầu bóng."}]'::jsonb,
    'Sắc đỏ son và ánh vàng kim lộng lẫy là sự hòa quyện tuyệt đỉnh của âm dương ngũ hành, rước vượng khí may mắn ngập tràn vào nhà đầu xuân mới.',
    'Bàn tiện gỗ, chổi quét vàng lông thỏ siêu mềm, dao mài quang dầu',
    'Sơn then ủ ẩm và thếp vàng 24K thủ công 35 ngày.',
    'Bày ngũ quả ngày Tết, đựng bánh mứt mùa xuân, trưng bày vượng lộc.',
    'Kiệt tác Spotlight Mùa Xuân 2026.',
    TRUE, TRUE, TRUE, 4520
),

-- 15. Bình Gốm Hoa Lam Bát Tràng
(
    15, 'Bình Gốm Hoa Lam Vẽ Thiên Nga Bát Tràng', 'binh-gom-hoa-lam-ve-thien-nga-bat-trang', 'CR-BT-2026-G15',
    1, 1, 1,
    '/demo/craft/museum_quality_product_photography_of_an_authentic_vietnamese_blue_and_white/screen.png',
    'Bình gốm hoa lam vẽ họa tiết thiên nga bơi lội giữa hồ sen mùa thu bằng oxit coban lam trầm dưới men, nung lửa lò bầu 1.300°C trong trẻo.',
    6800000, 'LAM TRẦM SẮC THU', 'Bát Tràng • Hà Nội', 'Thế kỷ XV phục dựng',
    'Cao 46cm × ĐK thân 26cm × ĐK miệng 12cm',
    '[{"label": "Chất liệu", "value": "Đất sét cao lanh trắng tinh, oxit coban tự nhiên"}, {"label": "Kỹ thuật", "value": "Vẽ thư họa dưới men bóng, nung lò 1.300°C"}, {"label": "Men áo", "value": "Men tro trấu bóng ngọc trong vắt"}]'::jsonb,
    '[]'::jsonb,
    'Dòng gốm hoa lam thời Lê sơ từng vượt biển đến các bảo tàng thế giới, là niềm kiêu hãnh của nghệ thuật gốm sứ Việt Nam mỗi độ thu sang.',
    'Bàn xoay chuốt cốt, bút lông thỏ vẽ men lam, lò nung nhiệt độ cao',
    'Vuốt gốm thủ công, vẽ nét thư họa tỉ mỉ và nung 72 giờ.',
    'Cắm hoa sen thu, trưng bày phòng khách thanh lịch, sưu tầm di sản.',
    'Nằm trong Tuyển tập Mùa Thu 2026.',
    TRUE, FALSE, TRUE, 2980
),

-- 16. Tranh Khắc Gỗ Đông Hồ Đàn Gà
(
    16, 'Tranh Khắc Gỗ Dân Gian Đông Hồ Đàn Gà Mẹ Con', 'tranh-khac-go-dan-gian-dong-ho-dan-ga-me-con', 'CR-DH-2026-T16',
    1, 5, 10,
    '/demo/craft/original_dong_ho_vietnamese_folk_woodcut_print_of_a_rooster_and_hen_on_textured/screen.png',
    'Bức tranh Tết kinh điển in dập từ ván gỗ thị cổ trên nền giấy điệp lấp lánh ánh xà cừ, gửi gắm ước nguyện sum vầy sinh sôi nảy nở đầu xuân.',
    850000, 'TRANH TẾT SUM VẦY', 'Đông Hồ • Bắc Ninh', 'Di sản văn hóa',
    'Khổ tranh 42cm × 30cm (đóng khung gỗ mộc)',
    '[{"label": "Chất liệu nền", "value": "Giấy dó quét bột sò điệp biển óng ánh"}, {"label": "Màu sắc", "value": "Màu thiên nhiên: vàng hoa hòe, đen than lá tre, đỏ sỏi son"}, {"label": "Ván khắc", "value": "Khắc nổi trên gỗ thị cổ tuổi đời hơn 100 năm"}]'::jsonb,
    '[]'::jsonb,
    '"Tranh Đông Hồ gà lợn nét tươi trong / Hồn dân tộc sáng bừng trên giấy điệp" – bức tranh gắn liền với ký ức Tết cổ truyền của bao thế hệ người Việt.',
    'Ván khắc gỗ thị, chổi thông quét điệp, xơ mướp dập màu',
    'In dập từng bản màu mộc bản riêng biệt và phơi sương se khô.',
    'Treo tường đón Tết, chúc phúc gia đình đông con nhiều cháu thuận hòa.',
    'Nằm trong Tuyển tập Mùa Xuân 2026.',
    TRUE, FALSE, TRUE, 3150
),

-- 17. Bộ Ấm Chén Gốm Men Rạn Cổ Bát Tràng
(
    17, 'Bộ Ấm Chén Gốm Men Rạn Cổ Hoàng Cung Bát Tràng', 'bo-am-chen-gom-men-ran-co-hoang-cung-bat-trang', 'CR-BT-2026-G17',
    1, 1, 1,
    '/demo/craft/product_photography_of_an_authentic_vietnamese_crackle_glaze_ceramic_teapot_set/screen.png',
    'Bộ ấm trà 6 chén men rạn tam thái họa tiết rồng phượng nung củi gỗ nghiến, giữ nhiệt tuyệt hảo sưởi ấm chén trà Shan Tuyết đêm đông giá lạnh.',
    7500000, 'HƠI ẤM MEN RẠN', 'Bát Tràng • Hà Nội', 'Hoàng cung triều Lê',
    'Ấm dung tích 450ml | 6 Chén ĐK 6cm | Khay gốm ĐK 28cm',
    '[{"label": "Chất liệu", "value": "Đất sét cao lanh ngâm lọc 4 bể, bài men rạn tro vỏ sò"}, {"label": "Nung", "value": "Lò bầu nung củi 72 giờ khử oxy liên tục"}, {"label": "Vân rạn", "value": "Đường rạn nứt tự nhiên hình mai rùa cổ kính"}]'::jsonb,
    '[]'::jsonb,
    'Vân men rạn nứt tự nhiên theo nhịp thở của lửa và đất, là dấu tích của thời gian giữ trọn hơi ấm đoàn tụ gia đình ngày đông.',
    'Bàn xoay vuốt tay, bút lông vẽ lam, củi gỗ nghiến nung lò bầu',
    'Quy trình nung củi và hãm nhiệt làm nguội chậm suốt 45 ngày.',
    'Thưởng trà ấm ngày đông, bàn trà tiếp khách trang trọng ngày Tết.',
    'Nằm trong Tuyển tập Mùa Đông 2026.',
    TRUE, FALSE, TRUE, 3720
),

-- 18. Khăn Thổ Cẩm Dệt Tay Mỹ Nghiệp
(
    18, 'Khăn Thổ Cẩm Dệt Tay Hoa Văn Chăm Cổ Mỹ Nghiệp', 'khan-tho-cam-det-tay-hoa-van-cham-co-my-nghiep', 'CR-MN-2026-L18',
    5, 3, 6,
    '/demo/craft/traditional_cham_ethnic_handwoven_brocade_textile_scarf_with_intricate/screen.png',
    'Khăn thổ cẩm dệt tay từ sợi bông rẫy nhuộm vỏ cây rừng với họa tiết hình học cổ truyền Chăm Pa, ấm áp và trầm lắng trong nắng thu vàng.',
    1850000, 'SẮC MÀU THÁP CỔ', 'Mỹ Nghiệp • Ninh Thuận', 'Cổ truyền Chăm',
    'Dài 185cm × Rộng 55cm',
    '[{"label": "Chất liệu", "value": "Sợi bông tự nhiên xe tay, màu nhuộm vỏ cây rừng"}, {"label": "Kỹ thuật", "value": "Dệt thoi luồn hoa văn mắt gà và chim thần"}, {"label": "Tông màu", "value": "Đỏ đất bazan, đen chàm và vàng nghệ ấm áp"}]'::jsonb,
    '[]'::jsonb,
    'Mỗi đường viền thổ cẩm là câu chuyện huyền sử về nền văn minh Chăm Pa rực rỡ, hòa cùng làn gió thu mang đến sự ấm áp bình an.',
    'Khung cửi gỗ ngồi luồn chân, thoi tre dệt sợi, lược gài hoa văn',
    'Dệt tay ròng rã suốt 15 ngày trên khung cửi cổ truyền.',
    'Quàng ấm mùa thu, phối đồ phong cách bohemian, trang trí nghệ thuật.',
    'Nằm trong Tuyển tập Mùa Thu 2026.',
    TRUE, FALSE, TRUE, 2240
),

-- 19. Dao Bếp Thép & Kéo Sắt Đa Sỹ
(
    19, 'Dao Bếp Thép Carbon & Kéo Sắt Rèn Thủ Công Đa Sỹ', 'dao-bep-thep-carbon-keo-sat-ren-thu-cong-da-sy', 'CR-DS-2026-R19',
    1, 2, 16,
    '/demo/craft/traditional_hand_forged_vietnamese_carbon_steel_kitchen_knife_and_iron_scissors/screen.png',
    'Bộ đôi dao bếp thép carbon nhíp xe và kéo sắt rèn búa tay tôi nước bí truyền, biểu trưng cho ngọn lửa bếp ấm cúng chuẩn bị mâm cỗ Tết ngày đông.',
    850000, 'LỬA LÒ RÈN ẤM', 'Đa Sỹ • Hà Nội', 'Cổ truyền Đa Sỹ',
    'Dao dài 32cm (lưỡi 20cm) | Kéo dài 21cm',
    '[{"label": "Chất liệu", "value": "Thép nhíp ô tô hàm lượng carbon cao, cán gỗ xoan rừng"}, {"label": "Kỹ thuật", "value": "Rèn đập búa tay trên đe thép, tôi nước lạnh theo màu lửa"}, {"label": "Độ sắc", "value": "Sắc bén vượt trội, bền bỉ mài bén dễ dàng"}]'::jsonb,
    '[]'::jsonb,
    'Ánh lửa than hoa rực đỏ trong đêm đông giá lạnh làng Đa Sỹ tạo nên những dụng cụ làm bếp gắn liền với tình cảm gia đình sum họp bên nồi bánh chưng.',
    'Búa tay rèn đập, lò bễ thổi than hoa, máng nước tôi thép, đá mài bùn',
    'Rèn đỏ lửa, dập định hình và tôi thép bí truyền.',
    'Chế biến thực phẩm mùa đông, làm cỗ Tết sum vầy, quà gia dụng truyền thống.',
    NULL, TRUE, FALSE, TRUE, 1650
),

-- 20. Sáo Trúc & Lồng Chim Tre Canh Hoạch
(
    20, 'Sáo Trúc & Lồng Chim Tre Thủ Công Canh Hoạch', 'sao-truc-long-chim-tre-thu-cong-canh-hoach', 'CR-CH-2026-M20',
    1, 4, 20,
    '/demo/craft/traditional_vietnamese_bamboo_transverse_flute_sao_truc_and_bamboo_birdcage/screen.png',
    'Cặp tác phẩm sáo trúc âm vang thanh thoát và lồng chim tre cật đục chạm tinh xảo, mang âm hưởng thiên nhiên thư thái giải nhiệt trưa hè.',
    2400000, 'THANH ÂM NGÀY HÈ', 'Canh Hoạch • Hà Nội', 'Cổ truyền Hà Thành',
    'Sáo trúc dài 52cm (Tone Đô C5) | Lồng chim ĐK 28cm × Cao 42cm',
    '[{"label": "Chất liệu", "value": "Trúc già vùng cao Lâm Đồng, tre cật ngâm vôi gác bếp"}, {"label": "Kỹ thuật", "value": "Khoét lỗ âm tần số 440Hz, đục mộng tre tỉ mỉ"}, {"label": "Đặc tính", "value": "Âm thanh trong trẻo, tre trúc lên màu cánh gián tự nhiên"}]'::jsonb,
    '[]'::jsonb,
    'Tiếng sáo diều vi vu và tiếng chim ca ríu rít dưới bóng đa giếng nước đưa con người thoát khỏi ồn ào oi bức của mùa hè phố thị.',
    'Dao khoét lỗ sáo, máy đo tần số âm thanh, dùi đục mộng tre',
    'Chọn ống trúc tròn đều và chế tác thủ công trong 12 ngày.',
    'Thưởng âm tao nhã trưa hè, nuôi chim cảnh, trang trí nhà vườn sinh thái.',
    'Nằm trong Tuyển tập Mùa Hạ 2026.',
    TRUE, FALSE, TRUE, 2680
),

-- 21. Lược & Muỗng Sừng Trâu Thụy Ứng
(
    21, 'Lược & Muỗng Sừng Trâu Điêu Khắc Thụy Ứng', 'luoc-muong-sung-trau-dieu-khac-thuy-ung', 'CR-TU-2026-H21',
    1, 4, 12,
    '/demo/craft/traditional_vietnamese_carved_horn_comb_and_spoon_crafted_from_natural_water/screen.png',
    'Bộ lược chải tóc và muỗng ăn từ sừng trâu nước tự nhiên đen bóng và sừng bò tót hổ phách, giải nhiệt phong hàn mát lạnh ngày nắng gắt.',
    750000, 'MÁT LẠNH TỰ NHIÊN', 'Thụy Ứng • Hà Nội', 'Cổ truyền Thụy Ứng',
    'Lược dài 18cm × Rộng 5cm | Muỗng dài 16cm',
    '[{"label": "Chất liệu", "value": "Sừng trâu nước tự nhiên 100% không tích điện"}, {"label": "Kỹ thuật", "value": "Hơ lửa ép nhiệt nắn phẳng, cưa răng lược và đánh bóng lá mít"}, {"label": "Lợi ích", "value": "Mát da đầu, kích thích tuần hoàn máu ngày hè"}]'::jsonb,
    '[]'::jsonb,
    'Sừng trâu tính hàn, từ ngàn đời nay đã là vị thuốc quý trong dân gian giúp hạ nhiệt cơ thể, chống say nắng và dưỡng tóc mượt mà.',
    'Lò ép nhiệt sừng, cưa tay răng lược, lá mít khô đánh bóng',
    'Cắt tỉa ép nhiệt định hình sừng tự nhiên tỉ mỉ.',
    'Chải tóc dưỡng sinh ngày hè, thưởng thức món tráng miệng thanh mát.',
    NULL, TRUE, FALSE, TRUE, 1890
),

-- 22. Nón Quai Thao Kinh Bắc
(
    22, 'Nón Quai Thao Dệt Lá Cọ Lụa Tơ Kinh Bắc', 'non-quai-thao-det-la-co-lua-to-kinh-bac', 'CR-LC-2026-N22',
    1, 4, 9,
    '/demo/craft/traditional_vietnamese_conical_hat_non_quai_thao_kinh_bac_flat_hat_with/screen.png',
    'Nón quai thao dẹt ba tầm đan từ lá cọ non kết hợp dây quai thao tơ tằm tím buông lơi, phục dựng nét duyên liền chị trẩy hội Lim mùa xuân.',
    1450000, 'DUYÊN HỘI LIM', 'Làng Chuông • Hà Nội', 'Kinh Bắc phục dựng',
    'Đường kính 75cm × Độ dày vành 8cm',
    '[{"label": "Chất liệu", "value": "Lá cọ non Bạch Hạc, khung tre cật, sợi quai thao tơ tằm"}, {"label": "Kỹ thuật", "value": "Khâu nón dẹt ba tầm, bện tua ruột quai thao thủ công"}, {"label": "Màu sắc", "value": "Vàng óng lá cọ cùng quai tơ tím huế duyên dáng"}]'::jsonb,
    '[]'::jsonb,
    'Nón quai thao là hiện thân của vẻ đẹp đoan trang, dịu dàng của người phụ nữ vùng Kinh Bắc trong những canh hát giao duyên đầu xuân.',
    'Khuôn nón ba tầm, dao chuốt vành tre uốn tròn, kim khâu nón cổ',
    'Khâu tay từng vành lá cọ phẳng phiu trong 10 ngày.',
    'Trẩy hội xuân Quan Họ, trình diễn cổ phục, đạo cụ nhiếp ảnh di sản.',
    'Nằm trong Tuyển tập Mùa Xuân 2026.',
    TRUE, FALSE, TRUE, 2810
),

-- 23. Khăn Trải Bàn Vải Lanh H'Mông
(
    23, 'Khăn Trải Bàn Vải Lanh Dệt Tay Nhuộm Chàm H''Mông', 'khan-trai-ban-vai-lanh-det-tay-nhuom-cham-hmong', 'CR-HM-2026-L23',
    2, 3, 18,
    '/demo/craft/traditional_vietnamese_handwoven_natural_hemp_fabric_runner_from_hmong_ethnic/screen.png',
    'Khăn trải bàn dệt từ sợi lanh tước tay vẽ sáp ong hoa văn xoắn ốc và ngâm chàm rừng nhiều tuần, mang hơi thở mây mù mùa thu Tây Bắc.',
    1950000, 'CHÀM SÂU TÂY BẮC', 'Lùng Tám • Hà Giang', 'Cổ truyền H''Mông',
    'Dài 180cm × Rộng 45cm',
    '[{"label": "Chất liệu", "value": "Vỏ cây lanh bản địa tước sợi, chàm rừng lên men"}, {"label": "Kỹ thuật", "value": "Lăn đá nghiền sợi mềm, vẽ sáp ong nóng chảy, nhuộm chàm 15 lượt"}, {"label": "Họa tiết", "value": "Biểu tượng xoắn ốc mặt trời và ruộng bậc thang"}]'::jsonb,
    '[]'::jsonb,
    'Vải lanh là biểu tượng cho sự kiên trì bất khuất của phụ nữ H''Mông, màu chàm trầm mặc lưu giữ hơi ấm tình người giữa mùa thu cao nguyên đá.',
    'Bút vẽ sáp ong bằng đồng, cọc tước sợi lanh, thùng gỗ ngâm chàm',
    'Quy trình tước lanh, vẽ sáp và nhuộm kéo dài 2 tháng.',
    'Trải bàn trà thu se lạnh, trang trí không gian mộc mạc, làm khăn ấm.',
    'Nằm trong Tuyển tập Mùa Thu 2026.',
    TRUE, FALSE, TRUE, 2460
),

-- 24. Hộp Trang Sức Gỗ Trắc Chuyên Mỹ
(
    24, 'Hộp Trang Sức Gỗ Trắc Khảm Trai Tam Đa Chuyên Mỹ', 'hop-trang-suc-go-trac-kham-trai-tam-da-chuyen-my', 'CR-CM-2026-K24',
    1, 5, 13,
    '/demo/craft/traditional_vietnamese_mother_of_pearl_inlaid_rosewood_jewelry_box_from_chuyen/screen.png',
    'Hộp trang sức chế tác từ gỗ trắc đỏ đen quý hiếm cẩn chìm vỏ trai ngọc môi vàng tích Phúc Lộc Thọ, rước hỷ khí và tài lộc đầu xuân.',
    15500000, 'HỶ KHÍ TÂN XUÂN', 'Chuyên Mỹ • Hà Nội', 'Thế kỷ XI phục dựng',
    'Dài 28cm × Rộng 18cm × Cao 14cm',
    '[{"label": "Chất liệu", "value": "Gỗ trắc đỏ đen tự nhiên, vỏ trai ngọc môi vàng quý hiếm"}, {"label": "Kỹ thuật", "value": "Đục cẩn chìm xà cừ khít khao, tỉa tách nét mực nho"}, {"label": "Nội thất", "value": "Lót nhung đỏ gấm cung đình 2 tầng ngăn"}]'::jsonb,
    '[]'::jsonb,
    'Hộp gấm bảo vật khảm trai là tặng phẩm đính ước và chúc tụng phúc thọ truyền đời, đón xuân sang với phú quý và hưng thịnh gia tộc.',
    'Cưa lộng xà cừ, đục ngà tỉa nét, đá mài nước bóng',
    'Gia công thủ công khắt khe suốt 50 ngày tỉ mỉ.',
    'Lưu giữ vàng ngọc trang sức, bảo vật gia đình, trưng bày phòng khách.',
    'Nằm trong Tuyển tập Mùa Xuân 2026.',
    TRUE, FALSE, TRUE, 3380
),

-- 25. Tranh Khắc Gỗ Bát Tiên Đông Hồ
(
    25, 'Tranh Khắc Gỗ Bát Tiên Quá Hải Giấy Điệp Đông Hồ', 'tranh-khac-go-bat-tien-qua-hai-giay-diep-dong-ho', 'CR-DH-2026-T25',
    1, 5, 10,
    '/demo/craft/traditional_vietnamese_woodblock_print_of_bat_tien_eight_immortals_on_handmade/screen.png',
    'Bức tranh mộc bản Bát Tiên cưỡi sóng vượt biển trên giấy điệp lấp lánh than tre, chúc phúc trường thọ và xua tan hàn khí mùa đông giá rét.',
    1200000, 'BÁT TIÊN CHÚC THỌ', 'Đông Hồ • Bắc Ninh', 'Mộc bản cổ',
    'Khổ tranh 60cm × 40cm (đóng khung gỗ hương)',
    '[{"label": "Chất liệu nền", "value": "Giấy điệp truyền thống quét vỏ sò tự nhiên"}, {"label": "Màu mực", "value": "Mực tàu than lá tre nấu keo nếp bóng đen tuyền"}, {"label": "Ván in", "value": "Bản khắc mộc mạc cổ kính truyền thừa nhiều thế hệ"}]'::jsonb,
    '[]'::jsonb,
    'Hình tượng Bát Tiên đem lại sự che chở thần kỳ và năng lượng cát tường vượt qua mọi giông gió mùa đông đón mùa xuân an lành.',
    'Ván khắc mộc bản gỗ thị, xơ mướp dập mực, chổi thông quét điệp',
    'In dập mộc bản từng nét đen sắc sảo trên nền điệp lấp lánh.',
    'Treo phòng khách mùa đông, mừng thọ ông bà cha mẹ, quà biếu Tết.',
    'Nằm trong Tuyển tập Mùa Đông 2026.',
    TRUE, FALSE, TRUE, 2250
),

-- 26. Bộ Tranh Tố Nữ Bốn Mùa
(
    26, 'Bộ Tranh Tố Nữ Bốn Mùa Gảy Đàn Tranh Dân Gian', 'bo-tranh-to-nu-bon-mua-gay-dan-tranh-dan-gian', 'CR-DH-2026-T26',
    1, 5, 10,
    '/demo/craft/vietnamese_folk_art_woodblock_print_of_to_nu_four_beauties_playing_instruments/screen.png',
    'Bộ tứ bình Tố Nữ gồm 4 giai nhân thổi sáo, kéo nhị, gảy tỳ bà và gõ phách trên nền giấy dó cổ, thanh âm réo rắt ru êm tiết trời thu dịu ngọt.',
    3200000, 'TỨ THỜI GIAI ĐIỆU', 'Đông Hồ • Bắc Ninh', 'Kinh điển dân gian',
    'Bộ 4 bức: Mỗi bức 85cm × 32cm',
    '[{"label": "Chất liệu", "value": "Giấy dó cổ truyền bồi 3 lớp, màu khoáng tự nhiên"}, {"label": "Kỹ thuật", "value": "In nét đen ván khắc và vờn màu bút lông mềm"}, {"label": "Ý nghĩa", "value": "Bốn mùa Xuân - Hạ - Thu - Đông hòa tấu bản nhạc bình yên"}]'::jsonb,
    '[]'::jsonb,
    'Bức tranh Tố Nữ ca ngợi vẻ đẹp đoan trang và tài hoa nghệ thuật của người phụ nữ Việt, mang lại sự thư thái tuyệt đối cho không gian mùa thu.',
    'Bản khắc nét mộc bản, bút lông vờn màu nước, bàn bồi giấy dó',
    'In khắc nét mộc và tô vẽ tay từng nếp áo uyển chuyển.',
    'Treo phòng khách, phòng trà thiền, thưởng lãm nghệ thuật cổ điển.',
    'Nằm trong Tuyển tập Mùa Thu 2026.',
    TRUE, FALSE, TRUE, 3890
),

-- 27. Trâm Cài Tóc & Hoa Cài Bạc Đậu Định Công
(
    27, 'Trâm Cài Tóc & Hoa Cài Bạc Đậu Tinh Xảo Định Công', 'tram-cai-toc-hoa-cai-bac-dau-tinh-xao-dinh-cong', 'CR-DC-2026-B27',
    1, 2, 17,
    '/demo/craft/vietnamese_hand_chased_solid_silver_hairpin_and_filigree_flower_brooch_from/screen.png',
    'Trâm cài tóc và hoa cài áo chế tác bằng kỹ thuật đậu bạc kéo sợi vi mô cuộn cánh hoa sen thanh thoát, cài suối tóc mây giải nhiệt thanh mát ngày hè.',
    3800000, 'TƠ BẠC MÁT LÀNH', 'Định Công • Hà Nội', 'Thế kỷ VII phục dựng',
    'Trâm dài 16cm | Hoa cài ĐK 5.5cm',
    '[{"label": "Chất liệu", "value": "Bạc ta 99.9% kéo thành sợi tơ mỏng như sợi tóc"}, {"label": "Kỹ thuật", "value": "Đậu bạc cuộn sợi hoa văn vi mô, hàn vảy bạc truyền thống"}, {"label": "Đặc tính", "value": "Nhẹ, sáng bóng lấp lánh và không rỉ sét"}]'::jsonb,
    '[]'::jsonb,
    'Nghề đậu bạc Định Công từng là đỉnh cao trang sức tiến cung cho các hoàng hậu triều đình, mang lại nét thanh cao quý phái giữa ngày hè rực nắng.',
    'Bàn kéo sợi bạc, nhíp uốn cánh hoa tí hon, đèn khò hàn vảy bạc',
    'Uốn ghép hàng ngàn sợi tơ bạc siêu nhỏ trong 20 ngày.',
    'Cài tóc áo dài truyền thống, trang sức dạ yến, bảo vật làm duyên.',
    'Nằm trong Tuyển tập Mùa Hạ 2026.',
    TRUE, FALSE, TRUE, 2910
),

-- 28. Chuông Đồng Mặt Trời Đông Sơn
(
    28, 'Chuông Đồng Đúc Thủ Công Mặt Trời Đông Sơn', 'chuong-dong-duc-thu-cong-mat-troi-dong-son', 'CR-DB-2026-D28',
    1, 2, 8,
    '/demo/craft/vietnamese_traditional_hand_cast_bronze_bell_with_archaic_dong_son_bird_and_sun/screen.png',
    'Chuông đồng đúc thủ công khắc chìm hoa văn chim Lạc và mặt trời Đông Sơn 14 tia, ngân vang âm thanh thanh tịnh xua tan đêm đông đón giao thừa.',
    16800000, 'THANH ÂM ĐỒNG SƠN', 'Đại Bái • Bắc Ninh', 'Hào khí Đông Sơn',
    'Cao 58cm × ĐK miệng 35cm × Nặng 16kg',
    '[{"label": "Chất liệu", "value": "Đồng đỏ nguyên chất pha thiếc theo tỷ lệ âm khánh"}, {"label": "Kỹ thuật", "value": "Đúc đồng khuôn đất sét rơm, tiện bóng viền chuông"}, {"label": "Họa tiết", "value": "Chim Lạc bay, mặt trời Đông Sơn và hoa văn răng cưa"}]'::jsonb,
    '[]'::jsonb,
    'Tiếng chuông đồng ngân vang trong đêm trừ tịch đông tàn báo hiệu thời khắc đất trời chuyển mình sang xuân, xua đi tà khí và đón điều lành tới.',
    'Lò nấu đồng than đá, khuôn đúc đất thó, dùi gõ thử âm sắc',
    'Đúc nguyên khối và mài bóng họa tiết chim Lạc trong 25 ngày.',
    'Thỉnh chuông cầu an ngày Tết, trang trí không gian thiền định, sưu tầm di sản.',
    'Nằm trong Tuyển tập Mùa Đông 2026.',
    TRUE, FALSE, TRUE, 3410
);

SELECT setval('crafts_id_seq', (SELECT MAX(id) FROM crafts));

-- -----------------------------------------------------------------------------
-- 10. THIẾT LẬP QUAN HỆ N-N: NGHỆ NHÂN ↔ TÁC PHẨM (craft_artisans)
-- -----------------------------------------------------------------------------
INSERT INTO craft_artisans (craft_id, artisan_id, role_title, contribution_notes, is_lead, display_order) VALUES
(1, 8, 'Chủ trì đúc đồng & Tạo hình nghê vờn', 'Trực tiếp đắp mẫu sáp rồng nghê và căn nhiệt lò đúc 1.200°C.', TRUE, 1),
(2, 6, 'Chủ trì đan nan xiên mắt cáo', 'Chẻ nan tre mỏng 0.5mm và tạo dáng giỏ hoa quả thoáng khí.', TRUE, 1),
(3, 6, 'Cố vấn kỹ thuật bện sợi thực vật', 'Hướng dẫn kỹ thuật bện cạp mây và liên kết nan cói Kim Sơn.', TRUE, 1),
(4, 5, 'Chủ trì chế tác gốm đất nung Chăm', 'Tạo hình gốm người đi quanh bệ và nung củi rơm lộ thiên.', TRUE, 1),
(5, 1, 'Chủ trì chế tác gốm celadon', 'Phối bài men celadon tro trấu và vuốt chén trà trên bàn xoay.', TRUE, 1),
(6, 2, 'Chủ trì rút tơ sen & Dệt thoi tay', 'Rút từng sợi tơ cuống sen Tây Hồ và dệt lụa sa thoáng mát.', TRUE, 1),
(7, 10, 'Chủ trì sơn mài & Mài nước then son', 'Quét sơn ta nhiều nước và mài phẳng dưới nước đánh bóng gương.', TRUE, 1),
(8, 4, 'Chủ trì khâu nón bài thơ 16 vành', 'Chèn họa tiết bài thơ và khâu từng mũi cước phẳng phiu.', TRUE, 1),
(9, 10, 'Chủ trì cẩn vỏ trứng & Sơn phủ bạc', 'Cẩn vỏ trứng vụn trên cốt gốm và toát mài nước bóng ngọc.', TRUE, 1),
(10, 2, 'Cố vấn dệt lụa bọc đèn lồng', 'Dệt tấm lụa tơ tằm thêu hoa sen bọc khung tre Hội An.', TRUE, 1),
(11, 9, 'Chủ trì điêu khắc gỗ lim La Xuyên', 'Trực tiếp đục chạm lộng 3 tầng kênh bong hình tượng Long Quy.', TRUE, 1),
(12, 10, 'Cố vấn mỹ thuật cẩn xà cừ', 'Tư vấn bố cục Bách Điểu và hoàn thiện bề mặt sơn bóng.', TRUE, 1),
(13, 3, 'Chủ trì chạm trổ kim hoàn bạc ta', 'Gò thúc nổi Bách Hoa và tỉa chạm từng chi tiết cánh hoa mai cúc.', TRUE, 1),
(14, 10, 'Chủ trì thếp vàng quỳ 24K lòng son', 'Thếp vàng quỳ Kiêu Kỵ và quét men son lòng bát rực rỡ.', TRUE, 1),
(15, 1, 'Chủ trì vẽ thư họa men lam', 'Dùng bút lông thỏ vẽ họa tiết thiên nga và nung lò bầu 1.300°C.', TRUE, 1),
(16, 7, 'Chủ trì khắc ván & In tranh Đông Hồ', 'Lưu giữ ván khắc cổ và dập tranh trên giấy điệp tự nhiên.', TRUE, 1),
(17, 1, 'Chủ trì phục dựng men rạn hoàng cung', 'Vuốt bộ ấm chén và căn lửa lò bầu nung củi khử oxy 72 giờ.', TRUE, 1),
(18, 5, 'Chủ trì dệt thổ cẩm Chăm Pa', 'Dệt sợi bông nhuộm chàm rừng với đồ án hoa văn mắt gà.', TRUE, 1),
(19, 8, 'Cố vấn kỹ thuật tôi thép rèn kim khí', 'Tư vấn nhiệt độ tôi thép và kỹ thuật rèn búa đập thủ công.', TRUE, 1),
(20, 6, 'Chủ trì đan lồng chim & Chế tác sáo', 'Khoét lỗ âm chuẩn tần số và đục mộng tre tỉ mỉ.', TRUE, 1),
(21, 6, 'Cố vấn kỹ thuật uốn nhiệt sừng tre', 'Hướng dẫn kỹ thuật ép nhiệt sừng trâu và mài bóng lá mít.', TRUE, 1),
(22, 4, 'Chủ trì khâu nón quai thao Kinh Bắc', 'Khâu nón dẹt ba tầm và thắt dải quai thao tơ tằm tím.', TRUE, 1),
(23, 5, 'Cố vấn hoa văn dệt thổ cẩm', 'Hỗ trợ kỹ thuật nhuộm chàm và dệt sợi lanh truyền thống.', TRUE, 1),
(24, 9, 'Chủ trì tạo tác cốt gỗ trắc', 'Đục mộng ghép gỗ trắc đỏ đen tinh xảo trước khi cẩn trai.', TRUE, 1),
(25, 7, 'Chủ trì in tranh Bát Tiên mộc bản', 'In dập mộc bản đen trên nền giấy điệp than tre cổ kính.', TRUE, 1),
(26, 7, 'Chủ trì phục dựng bộ tranh Tố Nữ', 'Phục hồi ván khắc 4 giai nhân gảy đàn trên giấy dó truyền thống.', TRUE, 1),
(27, 3, 'Chủ trì đậu bạc cuộn sợi tơ vi mô', 'Kéo sợi bạc mảnh như tóc và uốn hàn hoa sen tinh tế.', TRUE, 1),
(28, 8, 'Chủ trì đúc chuông đồng Đông Sơn', 'Đúc khuôn liền khối và khắc họa tiết chim Lạc mặt trời 14 tia.', TRUE, 1);

-- -----------------------------------------------------------------------------
-- 11. THIẾT LẬP QUAN HỆ N-N: SẢN PHẨM ↔ CHẤT LIỆU (craft_materials)
-- -----------------------------------------------------------------------------
INSERT INTO craft_materials (craft_id, material_id) VALUES
(1, 9),                  -- Đỉnh đồng: Đồng đỏ
(2, 8),                  -- Giỏ tre: Tre gai già
(3, 13),                 -- Giỏ cói: Sợi cói mặn
(4, 14),                 -- Gốm Bàu Trúc: Đất sét sông Quao
(5, 3), (5, 2),          -- Chén celadon: Đất sét sành, Men tro
(6, 7), (6, 6),          -- Khăn tơ sen: Tơ sen, Tơ tằm
(7, 10),                 -- Khay trà: Sơn ta
(8, 8),                  -- Nón bài thơ: Tre, Lá lụi
(9, 1), (9, 10),         -- Bình cẩn trứng: Đất cao lanh, Sơn ta vỏ trứng
(10, 6), (10, 8),        -- Đèn lồng: Tơ tằm, Tre gai
(11, 11),                -- Tượng Long Quy: Gỗ lim
(12, 11), (12, 10),      -- Hộp trà gụ: Gỗ gụ, Xà cừ
(13, 5),                 -- Hũ trà bạc: Bạc ta
(14, 10),                -- Bát sơn mài: Sơn ta, Vàng quỳ
(15, 1),                 -- Bình hoa lam: Đất cao lanh
(16, 16),                -- Tranh gà: Giấy điệp
(17, 1), (17, 2),        -- Ấm men rạn: Đất cao lanh, Men rạn
(18, 6),                 -- Thổ cẩm Chăm: Sợi bông, Tơ tằm
(19, 15),                -- Dao Đa Sỹ: Thép carbon
(20, 8),                 -- Sáo trúc lồng chim: Tre già
(21, 12),                -- Lược sừng: Sừng trâu
(22, 8), (22, 6),        -- Nón quai thao: Tre, Tơ tằm
(23, 6),                 -- Khăn lanh: Sợi lanh, Chàm
(24, 11),                -- Hộp trang sức: Gỗ trắc, Vỏ trai
(25, 16),                -- Tranh Bát Tiên: Giấy điệp
(26, 16),                -- Tranh Tố Nữ: Giấy dó
(27, 5),                 -- Trâm bạc đậu: Bạc ta
(28, 9);                 -- Chuông đồng: Đồng đỏ

-- -----------------------------------------------------------------------------
-- 12. THIẾT LẬP QUAN HỆ N-N: SẢN PHẨM ↔ KỸ THUẬT (craft_techniques)
-- -----------------------------------------------------------------------------
INSERT INTO craft_techniques (craft_id, technique_id) VALUES
(1, 13),                 -- Đỉnh đồng: Đúc khuôn sáp
(2, 8),                  -- Giỏ tre: Đan nan xiên mắt cáo
(3, 8),                  -- Giỏ cói: Bện thừng cuốn
(4, 15),                 -- Gốm Bàu Trúc: Người đi quanh bệ
(5, 1), (5, 2),          -- Chén celadon: Chuốt vuốt tay, nung khử
(6, 7),                  -- Khăn tơ sen: Rút tơ sen dệt thoi
(7, 9),                  -- Khay trà: Sơn mài mài nước
(8, 8),                  -- Nón bài thơ: Khâu nón lá
(9, 9),                  -- Bình cẩn trứng: Cẩn vỏ trứng mài nước
(10, 6),                 -- Đèn lồng: Dệt sa bọc khung
(11, 14),                -- Tượng Long Quy: Chạm lộng gỗ lim
(12, 11),                -- Hộp trà gụ: Khảm xà cừ cưa lộng
(13, 4),                 -- Hũ trà bạc: Gò thúc nổi kim hoàn
(14, 10),                -- Bát sơn mài: Thếp vàng quỳ
(15, 3),                 -- Bình hoa lam: Vẽ thư họa men lam
(16, 12),                -- Tranh gà: Khắc mộc bản in giấy điệp
(17, 1), (17, 2),        -- Ấm men rạn: Chuốt xoay, Nung củi 72h
(18, 6),                 -- Thổ cẩm Chăm: Dệt gài hoa văn
(19, 16),                -- Dao Đa Sỹ: Tôi thép rèn bí truyền
(20, 8),                 -- Sáo trúc lồng chim: Đan nan khoét âm
(21, 14),                -- Lược sừng: Cưa mài sừng trâu
(22, 6), (22, 8),        -- Nón quai thao: Khâu nón dẹt ba tầm
(23, 6),                 -- Khăn lanh: Vẽ sáp ong nhuộm chàm
(24, 11),                -- Hộp trang sức: Cẩn trai xà cừ
(25, 12),                -- Tranh Bát Tiên: Khắc in mộc bản
(26, 12),                -- Tranh Tố Nữ: Khắc in ván gỗ vờn màu
(27, 5),                 -- Trâm bạc: Đậu bạc cuộn sợi tơ
(28, 13);                -- Chuông đồng: Đúc đồng liền khối

-- -----------------------------------------------------------------------------
-- 13. NẠP CRAFT_IMAGES (Thư viện ảnh chi tiết Lightbox cho 28 tác phẩm)
-- -----------------------------------------------------------------------------
INSERT INTO craft_images (craft_id, url, alt_text, caption, display_order) VALUES
(1, '/demo/craft/antique_vietnamese_bronze_incense_burner_with_dragon_handles_and_foo_dog_finial/screen.png', 'Đỉnh Đồng Đốt Trầm Cổ Quai Rồng Nghê Vờn', 'Góc nhìn chính diện đỉnh đồng đỏ đúc liền khối', 1),
(2, '/demo/craft/artisan_handwoven_bamboo_fruit_basket_and_lidded_box_from_phu_vinh_craft/screen.png', 'Giỏ Hoa Quả & Hộp Tre Đan Thủ Công Phú Vinh', 'Nan tre uốn lượn thoáng khí thanh mát ngày hè', 1),
(3, '/demo/craft/artisan_handwoven_natural_sedge_and_seagrass_storage_basket_from_kim_son/screen.png', 'Giỏ Lưu Trữ Cói & Cỏ Biển Tự Nhiên Kim Sơn', 'Sợi cói mặn Kim Sơn bện xoắn dẻo dai hút ẩm', 1),
(4, '/demo/craft/artisan_hand_turned_rustic_terracotta_water_jar_and_tea_bowl_from_bau_truc_cham/screen.png', 'Lu Nước & Chén Trà Gốm Đất Nung Bàu Trúc Chăm', 'Gốm đất nung mộc mạc giải nhiệt tự nhiên', 1),
(5, '/demo/craft/artisan_hand_turned_rustic_vietnamese_stoneware_celadon_tea_bowl_with_natural/screen.png', 'Chén Trà Gốm Sành Men Ngọc Celadon Mộc Mạc', 'Sắc men ngọc celadon sâu lắng trong tiết trời thu', 1),
(6, '/demo/craft/authentic_vietnamese_lotus_silk_scarf_woven_from_natural_lotus_stem_fibers_in/screen.png', 'Khăn Lụa Tơ Sen Tự Nhiên Phan Lương', 'Sợi tơ sen Tây Hồ thanh khiết siêu nhẹ bay bổng', 1),
(7, '/demo/craft/exquisite_traditional_vietnamese_lacquer_tea_tray_from_ha_thai_village_deep/screen.png', 'Khay Trà Sơn Mài Truyền Thống Làng Hạ Thái', 'Sắc son thắm quyện đen huyền bí của sơn mài Hạ Thái', 1),
(8, '/demo/craft/exquisite_traditional_vietnamese_non_la_conical_hat_with_subtle_poem/screen.png', 'Nón Lá Bài Thơ Truyền Thống Làng Chuông', 'Nón lá 16 vành khâu tay phẳng phiu đón nắng xuân', 1),
(9, '/demo/craft/exquisite_vietnamese_traditional_lacquer_vase_with_inlaid_natural_eggshell_and/screen.png', 'Bình Gốm Sơn Mài Cẩn Vỏ Trứng & Bạc Phủ', 'Mảnh vỏ trứng li ti cẩn ghép nở rộ như hoa xuân', 1),
(10, '/demo/craft/exquisite_vietnamese_traditional_silk_lantern_from_hoi_an_teardrop_shape_with/screen.png', 'Đèn Lồng Lụa Hội An Dáng Giọt Nước Cung Đình', 'Đèn lồng thắp sáng đêm hoa đăng rực rỡ đầu năm', 1),
(11, '/demo/craft/hand_carved_vietnamese_ironwood_sculpture_of_mythical_dragon_turtle_from_la/screen.png', 'Tượng Long Quy Gỗ Lim Chạm Khắc La Xuyên', 'Đường nét chạm lộng kênh bong uy nghi trấn trạch', 1),
(12, '/demo/craft/masterpiece_vietnamese_hand_carved_mahogany_wood_tea_box_with_mother_of_pearl/screen.png', 'Hộp Trà Gỗ Gụ Khảm Xà Cừ Bách Điểu Chuyên Mỹ', 'Ánh xà cừ ngũ sắc lấp lánh phản chiếu trăng thu', 1),
(13, '/demo/craft/masterpiece_vietnamese_hand_chased_solid_silver_tea_canister_from_dong_xam/screen.png', 'Hũ Đựng Trà Bạc Ta Chạm Thúc Bách Hoa Đồng Xâm', 'Bạc ta 99.9% lưu giữ trọn vẹn hương ấm ngày đông', 1),
(14, '/demo/craft/masterpiece_vietnamese_lacquer_bowl_coated_in_multi_layered_gold_leaf_and_deep/screen.png', 'Bát Sơn Mài Thếp Vàng Lá & Lòng Son Hạ Thái', 'Sắc vàng quỳ 24K và lòng son đón vượng khí mùa xuân', 1),
(15, '/demo/craft/museum_quality_product_photography_of_an_authentic_vietnamese_blue_and_white/screen.png', 'Bình Gốm Hoa Lam Vẽ Thiên Nga Bát Tràng', 'Họa tiết thư họa men lam thiên nga bơi lội hồ thu', 1),
(16, '/demo/craft/original_dong_ho_vietnamese_folk_woodcut_print_of_a_rooster_and_hen_on_textured/screen.png', 'Tranh Khắc Gỗ Dân Gian Đông Hồ Đàn Gà Mẹ Con', 'Tranh in mộc bản giấy điệp chúc phúc sum vầy đầu năm', 1),
(17, '/demo/craft/product_photography_of_an_authentic_vietnamese_crackle_glaze_ceramic_teapot_set/screen.png', 'Bộ Ấm Chén Gốm Men Rạn Cổ Hoàng Cung Bát Tràng', 'Men rạn tam thái nung củi gỗ nghiến sưởi ấm chén trà đông', 1),
(18, '/demo/craft/traditional_cham_ethnic_handwoven_brocade_textile_scarf_with_intricate/screen.png', 'Khăn Thổ Cẩm Dệt Tay Hoa Văn Chăm Cổ Mỹ Nghiệp', 'Họa tiết chim thần Garuda và hoa văn Chăm huyền bí', 1),
(19, '/demo/craft/traditional_hand_forged_vietnamese_carbon_steel_kitchen_knife_and_iron_scissors/screen.png', 'Dao Bếp Thép Carbon & Kéo Sắt Rèn Thủ Công Đa Sỹ', 'Lửa rèn tôi nước bí truyền tạo độ sắc bén bền bỉ', 1),
(20, '/demo/craft/traditional_vietnamese_bamboo_transverse_flute_sao_truc_and_bamboo_birdcage/screen.png', 'Sáo Trúc & Lồng Chim Tre Thủ Công Canh Hoạch', 'Âm sắc thanh thoát giải nhiệt trưa hè thanh bình', 1),
(21, '/demo/craft/traditional_vietnamese_carved_horn_comb_and_spoon_crafted_from_natural_water/screen.png', 'Lược & Muỗng Sừng Trâu Điêu Khắc Thụy Ứng', 'Sừng trâu tự nhiên giải nhiệt phong hàn mát lạnh', 1),
(22, '/demo/craft/traditional_vietnamese_conical_hat_non_quai_thao_kinh_bac_flat_hat_with/screen.png', 'Nón Quai Thao Dệt Lá Cọ Lụa Tơ Kinh Bắc', 'Nét duyên dáng liền chị quan họ trẩy hội Lim mùa xuân', 1),
(23, '/demo/craft/traditional_vietnamese_handwoven_natural_hemp_fabric_runner_from_hmong_ethnic/screen.png', 'Khăn Trải Bàn Vải Lanh Dệt Tay Nhuộm Chàm H''Mông', 'Sắc chàm rừng Tây Bắc trầm lắng hòa quyện trời thu', 1),
(24, '/demo/craft/traditional_vietnamese_mother_of_pearl_inlaid_rosewood_jewelry_box_from_chuyen/screen.png', 'Hộp Trang Sức Gỗ Trắc Khảm Trai Tam Đa Chuyên Mỹ', 'Hộp gấm bảo vật cẩn xà cừ rước hỷ khí đầu xuân', 1),
(25, '/demo/craft/traditional_vietnamese_woodblock_print_of_bat_tien_eight_immortals_on_handmade/screen.png', 'Tranh Khắc Gỗ Bát Tiên Quá Hải Giấy Điệp Đông Hồ', 'Hình tượng Bát Tiên chúc thọ xua tan giá lạnh mùa đông', 1),
(26, '/demo/craft/vietnamese_folk_art_woodblock_print_of_to_nu_four_beauties_playing_instruments/screen.png', 'Bộ Tranh Tố Nữ Bốn Mùa Gảy Đàn Tranh Dân Gian', 'Bốn giai nhân hòa tấu khúc nhạc bình yên ngày thu', 1),
(27, '/demo/craft/vietnamese_hand_chased_solid_silver_hairpin_and_filigree_flower_brooch_from/screen.png', 'Trâm Cài Tóc & Hoa Cài Bạc Đậu Tinh Xảo Định Công', 'Tơ bạc cuộn hoa sen thanh thoát suối tóc mây ngày hè', 1),
(28, '/demo/craft/vietnamese_traditional_hand_cast_bronze_bell_with_archaic_dong_son_bird_and_sun/screen.png', 'Chuông Đồng Đúc Thủ Công Mặt Trời Đông Sơn', 'Tiếng chuông ngân vang thanh tịnh đêm trừ tịch đông tàn', 1);

SELECT setval('craft_images_id_seq', (SELECT MAX(id) FROM craft_images));

-- -----------------------------------------------------------------------------
-- 14. NẠP COLLECTIONS & BỘ SƯU TẬP 4 MÙA (XUÂN - HẠ - THU - ĐÔNG)
-- -----------------------------------------------------------------------------
INSERT INTO collections (id, title, slug, description, banner_url, is_featured) VALUES
(1, 'Bảo Vật Hoàng Cung Thăng Long', 'bao-vat-hoang-cung-thang-long', 'Tuyển chọn các tác phẩm phục dựng chuẩn mực triều đình Lý - Trần - Lê từ gốm men rạn, đỉnh đồng và kim hoàn.', '/demo/craft/antique_vietnamese_bronze_incense_burner_with_dragon_handles_and_foo_dog_finial/screen.png', TRUE),
(2, 'Sợi Nắng Bản Địa Tây Bắc & Duyên Hải', 'soi-nang-ban-dia-tay-bac-duyen-hai', 'Bộ sưu tập thổ cẩm lanh H''Mông, lụa tơ sen và mây tre đan mang hơi thở thiên nhiên mộc mạc.', '/demo/craft/authentic_vietnamese_lotus_silk_scarf_woven_from_natural_lotus_stem_fibers_in/screen.png', FALSE);

SELECT setval('collections_id_seq', (SELECT MAX(id) FROM collections));

INSERT INTO collection_crafts (collection_id, craft_id, display_order) VALUES
(1, 1, 1), (1, 13, 2), (1, 14, 3), (1, 17, 4), (1, 28, 5),
(2, 6, 1), (2, 2, 2), (2, 18, 3), (2, 23, 4);

-- 4 BỘ SƯU TẬP THEO MÙA: XUÂN - HẠ - THU - ĐÔNG (2026)
INSERT INTO seasonal_collections (
    id, title, slug, season_code, year, theme_concept, philosophy_quote, quote_source,
    metrics, process_steps, archive_code, banner_url, color_tone, start_date, end_date, is_active
) VALUES
-- 1. MÙA HẠ (Summer 2026)
(
    1,
    'Bộ Sưu Tập Mùa Hạ 2026: Sợi Tự Nhiên & Đất Nung Giải Nhiệt',
    'mua-ha-2026-soi-tu-nhien-dat-nung',
    'summer', 2026,
    'Khám phá không gian văn hóa giải nhiệt truyền thống Việt Nam qua chất gốm đất nung mộc mạc, lụa tơ sen thanh thoát, nan tre thoáng khí và lược sừng mát lành.',
    'Đưa chất mộc của đất nung và sự nhẹ nhàng của sợi tre vào nhịp sống hiện đại chính là liệu pháp giải nhiệt tâm hồn hiệu quả nhất ngày hè.',
    'Giám tuyển Văn hóa Trần Đình Bảo',
    '[{"label": "Tác phẩm tuyển chọn", "value": "7 Kiệt tác"}, {"label": "Chất liệu chủ đạo", "value": "Tơ sen • Đất nung • Tre già • Sừng trâu"}, {"label": "Làng nghề tham gia", "value": "6 Làng di sản"}]'::jsonb,
    '[{"title": "Tơ sen thanh khiết", "desc": "Sợi tơ cuống sen Tây Hồ siêu nhẹ thoáng khí"}, {"title": "Đất nung Bàu Trúc", "desc": "Cốt gốm xốp thoáng làm mát nước giếng khơi tự nhiên"}, {"title": "Mây tre đan mắt cáo", "desc": "Cấu trúc nan đan tạo khe lưu thông luồng gió mát"}]'::jsonb,
    'CR-ARCH-SUMMER-26',
    '/demo/craft/authentic_vietnamese_lotus_silk_scarf_woven_from_natural_lotus_stem_fibers_in/screen.png',
    '#0284c7',
    '2026-05-01', '2026-08-31', TRUE
),

-- 2. MÙA XUÂN (Spring 2026)
(
    2,
    'Bộ Sưu Tập Mùa Xuân 2026: Khởi Sắc Đất Trời & Lễ Hội Cổ Truyền',
    'mua-xuan-2026-khoi-sac-dat-troi',
    'spring', 2026,
    'Đón sinh khí mùa xuân cùng sắc vàng son rực rỡ của bát sơn mài thếp vàng, nón lá bài thơ duyên dáng, đèn lồng hoa đăng và tranh Tết Đông Hồ sum vầy.',
    'Mùa xuân là mùa của sự hồi sinh; mỗi nhát đục khảm trai hay nét in giấy điệp đều mang theo ước vọng bình an, tài lộc và hạnh phúc của dân tộc.',
    'Nghệ nhân Nhân dân Nguyễn Đăng Chế',
    '[{"label": "Tác phẩm tuyển chọn", "value": "7 Kiệt tác"}, {"label": "Chất liệu chủ đạo", "value": "Vàng quỳ 24K • Giấy điệp • Vỏ trứng • Gỗ trắc"}, {"label": "Làng nghề tham gia", "value": "5 Làng di sản"}]'::jsonb,
    '[{"title": "Sơn mài thếp vàng", "desc": "Ánh vàng lá quỳ 24K đón vượng khí may mắn đầu năm"}, {"title": "Tranh Tết Đông Hồ", "desc": "Nét tươi trong trên giấy điệp chúc phúc sum vầy"}, {"title": "Nón lá bài thơ", "desc": "Nét duyên thiếu nữ Tràng An trẩy hội du xuân"}]'::jsonb,
    'CR-ARCH-SPRING-26',
    '/demo/craft/masterpiece_vietnamese_lacquer_bowl_coated_in_multi_layered_gold_leaf_and_deep/screen.png',
    '#059669',
    '2026-01-01', '2026-04-30', TRUE
),

-- 3. MÙA THU (Autumn 2026)
(
    3,
    'Bộ Sưu Tập Mùa Thu 2026: Thu Trầm & Trà Thiền Gốm Mộc',
    'mua-thu-2026-thu-tram-gom-moc',
    'autumn', 2026,
    'Khi gió heo may về trên phố cũ, khay trà sơn mài thắm đượm, chén trà men ngọc celadon và bình gốm hoa lam đưa con người trở về với nhịp thở nguyên sơ tao nhã.',
    'Hương sen Tây Hồ quyện trong làn khói ấm, gốm mộc giữ nhiệt ngày se lạnh như lắng đọng mọi giá trị ngàn năm của xứ sở.',
    'Giám tuyển Văn hóa Lê Hoài Nam',
    '[{"label": "Tác phẩm tuyển chọn", "value": "7 Kiệt tác"}, {"label": "Chất liệu chủ đạo", "value": "Sơn mài then • Men ngọc Celadon • Gỗ gụ • Vải lanh"}, {"label": "Làng nghề tham gia", "value": "6 Làng di sản"}]'::jsonb,
    '[{"title": "Sơn mài lòng son", "desc": "Khay trà men then thắm đượm giữ trọn hương ấm ngày thu"}, {"title": "Men ngọc Celadon", "desc": "Sắc men tro thanh tịnh hòa quyện chén trà sen"}, {"title": "Thổ cẩm chàm", "desc": "Sợi lanh thảo mộc sưởi ấm trong tiết trời heo may"}]'::jsonb,
    'CR-ARCH-AUTUMN-26',
    '/demo/craft/exquisite_traditional_vietnamese_lacquer_tea_tray_from_ha_thai_village_deep/screen.png',
    '#d97706',
    '2026-09-01', '2026-11-30', TRUE
),

-- 4. MÙA ĐÔNG (Winter 2026)
(
    4,
    'Bộ Sưu Tập Mùa Đông 2026: Hơi Ấm Điêu Khắc & Đỉnh Đồng Men Hỏa',
    'mua-dong-2026-hoi-am-dieu-khac-men-hoa',
    'winter', 2026,
    'Hơi ấm tỏa ra từ đỉnh đồng đốt trầm Đại Bái, hũ trà bạc ta Đồng Xâm, bộ ấm chén men rạn Bát Tràng và tượng gỗ lim xua tan giá rét mùa đông.',
    'Trong giá buốt mùa đông, ánh lửa lò đúc đồng và sự ấm áp của chén trà men rạn thể hiện ý chí quật cường và sự trường tồn của văn hóa Việt.',
    'Nghệ nhân Nhân dân Nguyễn Văn Sính',
    '[{"label": "Tác phẩm tuyển chọn", "value": "7 Kiệt tác"}, {"label": "Chất liệu chủ đạo", "value": "Đồng đỏ • Bạc ta • Men rạn tro sò • Gỗ lim"}, {"label": "Làng nghề tham gia", "value": "5 Làng di sản"}]'::jsonb,
    '[{"title": "Đỉnh đồng tỏa trầm", "desc": "Khói trầm hương thơm ngát sưởi ấm gian nhà ngày đông"}, {"title": "Bạc ta giữ nhiệt", "desc": "Hũ bạc 99.9% lưu giữ trọn vẹn hương vị trà cổ"}, {"title": "Men rạn hoàng cung", "desc": "Ấm gốm nung củi 72h giữ độ nóng bỏng cho chén trà"}]'::jsonb,
    'CR-ARCH-WINTER-26',
    '/demo/craft/antique_vietnamese_bronze_incense_burner_with_dragon_handles_and_foo_dog_finial/screen.png',
    '#6366f1',
    '2026-12-01', '2026-12-31', TRUE
);

SELECT setval('seasonal_collections_id_seq', (SELECT MAX(id) FROM seasonal_collections));

-- -----------------------------------------------------------------------------
-- 15. GÁN 28 TÁC PHẨM VÀO 4 BỘ SƯU TẬP MÙA (seasonal_collection_crafts)
-- Mỗi mùa 7 tác phẩm, có Hero item và thứ tự trưng bày chuẩn mực
-- -----------------------------------------------------------------------------
INSERT INTO seasonal_collection_crafts (seasonal_collection_id, craft_id, curator_note, highlight_badge, is_hero, display_order) VALUES
-- === BỘ SƯU TẬP MÙA HẠ (id: 1) ===
(1, 6, 'Khăn lụa tơ sen Tây Hồ siêu nhẹ thoáng khí, hương thơm dịu ngọt xua tan oi ả ngày hè.', 'HERO MÙA HẠ', TRUE, 1),
(1, 2, 'Nan tre gai ngâm vôi uốn lượn đón gió tự nhiên thanh mát nơi nếp nhà xưa.', 'GIẢI NHIỆT MÙA HẠ', FALSE, 2),
(1, 4, 'Chất đất nung gốm Chăm xốp thoáng làm mát nước giếng khơi tự nhiên suốt trưa hè.', 'ĐẤT NUNG MỘC MẠC', FALSE, 3),
(1, 3, 'Sợi cói mặn Kim Sơn bện xoắn hút ẩm tự nhiên mang hơi thở biển cả trong lành.', 'MÁT LÀNH DUYÊN HẢI', FALSE, 4),
(1, 20, 'Tiếng sáo trúc vi vu và lồng chim tre mộc mạc ru êm trưa hè bình yên.', 'THANH ÂM NGÀY HÈ', FALSE, 5),
(1, 21, 'Lược sừng trâu nước mát lạnh tự nhiên chải suối tóc mây giải nhiệt phong hàn.', 'DƯỠNG SINH NGÀY HÈ', FALSE, 6),
(1, 27, 'Trâm cài tóc bạc đậu cuộn sợi tơ bạc lấp lánh nhẹ nhàng làm duyên suối tóc hè.', 'TƠ BẠC MÁT LÀNH', FALSE, 7),

-- === BỘ SƯU TẬP MÙA XUÂN (id: 2) ===
(2, 14, 'Bát sơn mài thếp vàng lá 24K lòng đỏ son rực rỡ đón vượng khí tài lộc đầu xuân.', 'HERO MÙA XUÂN', TRUE, 1),
(2, 8, 'Nón lá bài thơ 16 vành phẳng phiu cùng người thiếu nữ Tràng An trẩy hội du xuân.', 'DU XUÂN KINH KỲ', FALSE, 2),
(2, 9, 'Mảnh vỏ trứng trắng tinh khôi nở rộ trên nền sơn mài bạc quỳ bừng sáng sắc xuân.', 'KHỞI SẮC ĐẦU NĂM', FALSE, 3),
(2, 10, 'Đèn lồng lụa Hội An thắp sáng đêm hoa đăng rực rỡ cầu may mắn bình an Tết về.', 'ĐÊM HỘI HOA ĐĂNG', FALSE, 4),
(2, 16, 'Tranh khắc gỗ đàn gà mẹ con in giấy điệp chúc gia đình sum vầy no ấm đầu năm.', 'TRANH TẾT SUM VẦY', FALSE, 5),
(2, 22, 'Nón quai thao dệt lá cọ lụa tơ tím tái hiện nét duyên liền chị trẩy hội Lim mùa xuân.', 'DUYÊN HỘI LIM', FALSE, 6),
(2, 24, 'Hộp trang sức gỗ trắc cẩn xà cừ Tam Đa chúc tụng Phúc Lộc Thọ hỷ khí tân xuân.', 'HỶ KHÍ TÂN XUÂN', FALSE, 7),

-- === BỘ SƯU TẬP MÙA THU (id: 3) ===
(3, 7, 'Khay trà sơn mài đen then lòng son thắm đượm giữ ấm nồng chén trà sen ngày se lạnh.', 'HERO MÙA THU', TRUE, 1),
(3, 5, 'Chén trà sành men ngọc celadon sâu lắng đưa tâm hồn về cõi thiền tịnh an nhiên.', 'TRÀ THIỀN MÙA THU', FALSE, 2),
(3, 12, 'Hộp trà gỗ gụ khảm xà cừ ngũ sắc lấp lánh như ánh trăng rằm trong đêm hội thu.', 'NGŨ SẮC TRĂNG THU', FALSE, 3),
(3, 15, 'Bình gốm men lam hoa văn thiên nga bơi lội trong trẻo như sắc trời thu Hà Nội.', 'LAM TRẦM SẮC THU', FALSE, 4),
(3, 18, 'Khăn thổ cẩm dệt tay hoa văn Chăm ấm áp trong nắng thu vàng miền tháp cổ.', 'SẮC MÀU THÁP CỔ', FALSE, 5),
(3, 23, 'Sắc chàm vải lanh H''Mông trầm mặc lưu giữ hơi ấm tình người giữa mùa thu rẻo cao.', 'CHÀM SÂU TÂY BẮC', FALSE, 6),
(3, 26, 'Bộ tranh Tố Nữ bốn mùa hòa tấu giai điệu êm đềm ru dịu tiết trời thu mát lành.', 'TỨ THỜI GIAI ĐIỆU', FALSE, 7),

-- === BỘ SƯU TẬP MÙA ĐÔNG (id: 4) ===
(4, 1, 'Đỉnh đồng đỏ đúc liền khối tỏa ngát khói trầm hương sưởi ấm gia đình ngày đông lạnh.', 'HERO MÙA ĐÔNG', TRUE, 1),
(4, 11, 'Tượng Long Quy gỗ lim già uy phong vững chãi trấn trạch xua tan hàn khí mùa đông.', 'TRẤN TRẠCH VƯỢNG KHÍ', FALSE, 2),
(4, 13, 'Hũ trà bạc ta 99.9% lưu giữ trọn vẹn độ ấm và hương trà Shan Tuyết trong gió rét.', 'BÁU VẬT KIM HOÀN', FALSE, 3),
(4, 17, 'Bộ ấm chén men rạn tam thái hoàng cung giữ trọn độ nóng bỏng của chén trà đông.', 'HƠI ẤM MEN RẠN', FALSE, 4),
(4, 19, 'Lửa than hoa làng rèn Đa Sỹ ấm áp cùng bộ dao thép chuẩn bị mâm cỗ Tết sum vầy.', 'LỬA LÒ RÈN ẤM', FALSE, 5),
(4, 25, 'Tranh khắc gỗ Bát Tiên cưỡi sóng trên giấy điệp chúc phúc trường thọ xua tan đông tàn.', 'BÁT TIÊN CHÚC THỌ', FALSE, 6),
(4, 28, 'Tiếng chuông đồng mặt trời Đông Sơn ngân vang thanh tịnh đêm trừ tịch đón xuân sang.', 'THANH ÂM ĐỒNG SƠN', FALSE, 7);

-- -----------------------------------------------------------------------------
-- 16. NẠP FAVOURITES (Dữ liệu yêu thích mẫu của người dùng)
-- -----------------------------------------------------------------------------
INSERT INTO favourites (user_id, craft_id, created_at) VALUES
(2, 1, NOW() - INTERVAL '3 days'),
(2, 6, NOW() - INTERVAL '2 days'),
(2, 7, NOW() - INTERVAL '1 day'),
(2, 14, NOW() - INTERVAL '6 hours'),
(4, 1, NOW() - INTERVAL '5 days'),
(4, 11, NOW() - INTERVAL '4 days'),
(4, 13, NOW() - INTERVAL '2 days'),
(4, 17, NOW() - INTERVAL '1 day');

-- -----------------------------------------------------------------------------
-- 17. NẠP CONTACT_MESSAGES (Tin nhắn liên hệ mẫu theo chuyên đề)
-- -----------------------------------------------------------------------------
INSERT INTO contact_messages (user_id, full_name, email, phone, topic, subject, message, status) VALUES
(4, 'Hoàng Minh Nam', 'nam.hoang@gmail.com', '0912345678', 'artisan_verification', 'Yêu cầu phối hợp dự án điêu khắc gỗ La Xuyên', 'Chào ban quản trị, văn phòng kiến trúc chúng tôi muốn đối soát hồ sơ di sản của nghệ nhân Dương Văn Đạt để phối hợp dự án bảo tàng văn hóa.', 'unread'),
(2, 'Nguyễn Văn An', 'user@craftroots.test', '0987654321', 'workshop_booking', 'Tư vấn đặt lịch thăm xưởng gốm Bát Tràng', 'Tôi muốn đăng ký đoàn 6 người đến trải nghiệm trực tiếp vuốt gốm tại xưởng Nghệ nhân Nhân dân Nguyễn Văn Bình vào cuối tuần tới.', 'read'),
(NULL, 'Lê Thị Thu Cúc', 'thucuc.le@baochi.vn', '0903112233', 'press_media', 'Đề nghị phỏng vấn nghệ nhân lụa tơ sen', 'Ban biên tập Tạp chí Văn hóa mong muốn thực hiện bài phỏng vấn chuyên sâu với Nghệ nhân Ưu tú Trần Thị Mai về quy trình dệt lụa tơ sen Phan Lương.', 'unread');

-- -----------------------------------------------------------------------------
-- 18. NẠP VISIT_BOOKINGS (Phiếu đăng ký hẹn thăm xưởng thủ công)
-- -----------------------------------------------------------------------------
INSERT INTO visit_bookings (artisan_id, user_id, full_name, phone, email, visit_date, time_slot, purpose, note, status) VALUES
(1, 4, 'Hoàng Minh Nam', '0912345678', 'nam.hoang@gmail.com', CURRENT_DATE + INTERVAL '3 days', 'morning', 'Khảo sát chất liệu gốm men rạn cho công trình bảo tàng tư nhân', 'Đoàn 4 kiến trúc sư muốn trực tiếp xem quy trình nung củi lò bầu 72 giờ.', 'confirmed'),
(1, 2, 'Nguyễn Văn An', '0987654321', 'user@craftroots.test', CURRENT_DATE + INTERVAL '5 days', 'afternoon', 'Trải nghiệm văn hóa gia đình', 'Đoàn có 2 trẻ em muốn trải nghiệm vuốt đất sét trên bàn xoay.', 'pending'),
(2, 3, 'Trần Thu Hà', '0944556677', 'editor@craftroots.vn', CURRENT_DATE + INTERVAL '4 days', 'morning', 'Nghiên cứu kỹ thuật dệt lụa tơ sen cổ phục', 'Mong muốn nghệ nhân chia sẻ về kỹ thuật rút sợi cuống sen thủ công.', 'pending');

-- -----------------------------------------------------------------------------
-- 19. NẠP NEWSLETTER_SUBSCRIBERS (Bản tin di sản hàng tuần)
-- -----------------------------------------------------------------------------
INSERT INTO newsletter_subscribers (email) VALUES
('docgia.disan@craftroots.vn'),
('nam.hoang@gmail.com'),
('leminh.arch@studio.vn'),
('huongsen.heritage@gmail.com'),
('khachhang.mynghe@yahoo.com')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 20. NẠP FIELD_NOTES (Ký họa điền dã di sản làng nghề)
-- -----------------------------------------------------------------------------
INSERT INTO field_notes (title, body, image_url, caption, coordinates, metrics, sort_order, is_published) VALUES
(
    'Bí quyết giữ lửa lò bầu Bát Tràng suốt 72 giờ liên tục',
    'Đêm thứ hai bên vách lò bầu rực lửa, nhiệt độ ngoài trời mùa hạ hầm hập nhưng không sánh được với sức nóng 1.300°C từ ngọn lửa củi gỗ nghiến. Nghệ nhân Nguyễn Văn Bình chỉ cần nhìn qua lỗ dòm lửa đã đoán chính xác màu lửa đang chuyển từ đỏ cam sang trắng ngọc – dấu hiệu men rạn đang bắt đầu tan chảy và bám chắc vào cốt đất cao lanh.',
    '/demo/craft/product_photography_of_an_authentic_vietnamese_crackle_glaze_ceramic_teapot_set/screen.png',
    'Nghệ nhân Nguyễn Văn Bình kiểm tra màu lửa qua lỗ dòm thành lò bầu',
    '20.9781° N, 105.9183° E (Bát Tràng, Gia Lâm, Hà Nội)',
    '[{"label": "Nhiệt độ đỉnh lò", "value": "1.300°C"}, {"label": "Thời gian đốt liên tục", "value": "72 giờ"}, {"label": "Lượng củi tiêu thụ", "value": "18 tấn gỗ nghiến"}]'::jsonb,
    1, TRUE
),
(
    'Nghệ thuật rút sợi tơ sen ngát hương Phan Lương',
    'Dưới bóng râm đầm sen hồ Tây ban mai, nghệ nhân Trần Thị Mai thoăn thoắt khía nhẹ quanh cuống sen xanh non rồi dùng ngón tay kéo nhẹ những sợi tơ mảnh như sương mai. Hàng ngàn cuống sen tươi gom về trong ngày mới kết tinh thành một tấm lụa tơ sen mềm mại giải nhiệt ngày hè.',
    '/demo/craft/authentic_vietnamese_lotus_silk_scarf_woven_from_natural_lotus_stem_fibers_in/screen.png',
    'Kỹ thuật rút sợi tơ từ cuống sen tươi tự nhiên',
    '21.0612° N, 105.8219° E (Tây Hồ, Hà Nội)',
    '[{"label": "Số cuống sen", "value": "4.800 cuống/khăn"}, {"label": "Thời gian hoàn thiện", "value": "60 ngày"}]'::jsonb,
    2, TRUE
),
(
    'Âm vang tiếng đúc đồng và chạm bạc bên dòng sông Trà',
    'Tiếng đục chạm bạc chan chát hòa cùng tiếng lò nấu đồng rực lửa tại làng cổ Đồng Xâm. Dưới đôi bàn tay tài hoa của nghệ nhân Lê Bá Hưng, từng miếng bạc ta dát mỏng dần nổi lên những vảy rồng cánh phượng sống động lạ kỳ, sưởi ấm tâm hồn những ngày đông giá lạnh.',
    '/demo/craft/masterpiece_vietnamese_hand_chased_solid_silver_tea_canister_from_dong_xam/screen.png',
    'Chạm trổ gò thúc nổi hoa văn kim hoàn trên bạc ta 99.9%',
    '20.4502° N, 106.4182° E (Kiến Xương, Thái Bình)',
    '[{"label": "Độ tinh khiết bạc", "value": "99.9%"}, {"label": "Thời gian chạm", "value": "45 ngày liên tục"}]'::jsonb,
    3, TRUE
);

SELECT setval('field_notes_id_seq', (SELECT MAX(id) FROM field_notes));

-- =============================================================================
-- HOÀN TẤT NẠP DỮ LIỆU SEED CHO TOÀN BỘ 22 BẢNG CRAFTROOTS v2.0.0!
-- =============================================================================
