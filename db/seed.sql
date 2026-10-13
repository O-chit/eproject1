-- =============================================================================
-- CRAFTROOTS MOCK DATA SEED SCRIPT (PostgreSQL 14+)
-- Dữ liệu mẫu di sản làng nghề thủ công truyền thống Việt Nam
-- Thể hiện đầy đủ quan hệ N-N Nghệ nhân - Sản phẩm & Bộ sưu tập Mùa Hè
-- =============================================================================

SET timezone = 'UTC';

-- 1. NẠP USERS (Mật khẩu hash chuẩn bcrypt của 'Craft@1234')
INSERT INTO users (id, full_name, email, password_hash, role, avatar_url, is_active) VALUES
(1, 'Quản Trị Viên CraftRoots', 'admin@craftroots.vn', '$2b$10$37130hZp9U6.y8Q2.qO8y.7oT9dJ1n0o9R3t2Y8e4g6v7s8a9b0c1', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', TRUE),
(2, 'Nguyễn Văn An (Người Dùng)', 'user@craftroots.test', '$2b$10$37130hZp9U6.y8Q2.qO8y.7oT9dJ1n0o9R3t2Y8e4g6v7s8a9b0c1', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', TRUE),
(3, 'Trần Thu Hà (Biên Tập Viên)', 'editor@craftroots.vn', '$2b$10$37130hZp9U6.y8Q2.qO8y.7oT9dJ1n0o9R3t2Y8e4g6v7s8a9b0c1', 'editor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', TRUE);

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. NẠP REGIONS (Vùng miền & Làng nghề)
INSERT INTO regions (id, name, code, description, image_url) VALUES
(1, 'Đồng bằng Bắc Bộ', 'dong-bang-bac-bo', 'Cái nôi văn minh sông Hồng với bề dày nghìn năm lịch sử, nơi hội tụ các làng nghề trứ danh: Gốm Bát Tràng, Lụa Vạn Phúc, Đúc đồng Ngũ Xã, Mây tre đan Phú Vinh.', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'),
(2, 'Duyên hải miền Trung', 'duyen-hai-mien-trung', 'Vùng đất giao thoa văn hóa Đại Việt và Chăm Pa, nổi tiếng với Đá mỹ nghệ Non Nước, Gốm Thanh Hà, Dệt chiếu cói Nga Sơn và Đúc đồng Phước Kiều.', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'),
(3, 'Tây Nguyên & Nam Bộ', 'tay-nguyen-nam-bo', 'Không gian văn hóa cồng chiêng đại ngàn và miền sông nước trù phú với Dệt thổ cẩm Ê Đê, Gốm đất nung Khmer, Đan đát lục bình và Dệt chiếu Cà Mau.', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80');

SELECT setval('regions_id_seq', (SELECT MAX(id) FROM regions));

-- 3. NẠP CRAFT_CATEGORIES (Danh mục nghề)
INSERT INTO craft_categories (id, name, slug, description, icon_url) VALUES
(1, 'Gốm sứ truyền thống', 'gom-su-truyen-thong', 'Nghệ thuật nhào nặn đất sét, tạo hình vuốt tay và biến hóa diệu kỳ qua ngọn lửa men lò gốm.', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80'),
(2, 'Đúc đồng & Kim hoàn', 'duc-dong-kim-hoan', 'Kỹ nghệ đúc chuông, tượng đồng, chạm bạc và dát vàng lá tinh xảo lưu truyền từ thời phong kiến.', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=200&q=80'),
(3, 'Dệt may & Thổ cẩm', 'det-may-tho-cam', 'Nghệ thuật ươm tơ, dệt lụa, se chỉ tơ sen và dệt thổ cẩm dập nổi hoa văn rực rỡ.', 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=200&q=80'),
(4, 'Mây tre đan & Gỗ thủ công', 'may-tre-dan-go-thu-cong', 'Biến hóa vật liệu tre trúc, nứa, cói tự nhiên thành các vật dụng thanh tao, thoáng mát và bền bỉ.', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=200&q=80'),
(5, 'Sơn mài & Mỹ nghệ khảm trai', 'son-mai-my-nghe-kham-trai', 'Nghệ thuật sử dụng nhựa cây sơn ta kết hợp vỏ trai, vỏ ốc, trứng gà mài bóng kỳ công.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80');

SELECT setval('craft_categories_id_seq', (SELECT MAX(id) FROM craft_categories));

-- 4. NẠP MATERIALS (Chất liệu)
INSERT INTO materials (id, name, description) VALUES
(1, 'Đất sét trắng Bát Tràng', 'Loại đất sét cao lanh dẻo mịn, chịu nhiệt trên 1250 độ C đặc trưng vùng châu thổ sông Hồng.'),
(2, 'Men lam tro trấu cổ', 'Men truyền thống pha chế từ tro trấu tự nhiên và bột đá, cho màu xanh lam thủy mặc trầm ấm.'),
(3, 'Men rạn hoàng cung', 'Bài men đặc trưng thời Lê - Trịnh tạo ra các đường nứt tự nhiên như vân rạn đá cổ.'),
(4, 'Đồng đỏ nguyên chất', 'Kim loại đồng thỏi đỏ có độ dẻo và ánh sắc trầm mặc, ngân vang khi đúc thành chuông khánh.'),
(5, 'Vàng quỳ 24K Kiêu Kỵ', 'Vàng lá đập mỏng hàng vạn lần dùng để thếp lên tượng và sản phẩm gốm quý tộc.'),
(6, 'Sợi tơ tằm tự nhiên', 'Tơ tằm tơ vàng thượng hạng dệt từ kén sâu tằm ăn lá dâu vùng bãi bồi sông Đáy.'),
(7, 'Sợi tơ sen tự nhiên', 'Loại tơ quý hiếm rút thủ công từ cuống hoa sen mùa hạ, thơm thoang thoảng và cách nhiệt.'),
(8, 'Sợi cói Nga Sơn tự nhiên', 'Cói tươi phơi nắng tự nhiên có đặc tính dẻo dai, thấm mồ hôi và tản nhiệt lưng tuyệt hảo.'),
(9, 'Tre gai & Mây rừng già', 'Tre ngâm nước vôi chống mọt, nan tre dẻo uốn lượn phục vụ đan quạt và giỏ nan thanh mát.'),
(10, 'Sơn ta Phú Thọ & Vỏ trứng', 'Mủ cây sơn tự nhiên kết hợp vỏ trứng vịt tạo lớp bóng gương huyền ảo.');

SELECT setval('materials_id_seq', (SELECT MAX(id) FROM materials));

-- 5. NẠP TECHNIQUES (Kỹ thuật chế tác)
INSERT INTO techniques (id, name, description) VALUES
(1, 'Vuốt gốm thủ công bàn xoay', 'Nghệ thuật định hình dáng gốm bằng đôi bàn tay và sự nhịp nhàng của bàn xoay truyền thống.'),
(2, 'Vẽ men lam dưới men', 'Kỹ thuật dùng bút lông vẽ trực tiếp nét thư họa lên cốt gốm mộc trước khi tráng men bóng.'),
(3, 'Đúc đồng khuôn sáp thất truyền', 'Tạo mẫu bằng sáp ong, đắp đất nung chảy sáp để tạo khuôn rỗng đúc đồng chi tiết tinh xảo.'),
(4, 'Dát vàng quỳ thủ công', 'Kỹ thuật dán từng lá vàng siêu mỏng bằng keo sơn ta đòi hỏi sự tĩnh tâm tuyệt đối.'),
(5, 'Rút sợi tơ sen & dệt lụa', 'Quy trình bẻ cuống sen lấy sợi tơ dệt thủ công độc bản duy nhất tại Việt Nam.'),
(6, 'Đan mây nan xiên mắt cáo', 'Kỹ thuật đan nan tre mây đan cài ziczac tạo khe thoáng gió mát tự nhiên.'),
(7, 'Dệt chiếu cói hoa cài chữ', 'Kỹ thuật dệt sợi cói nhuộm màu kết hợp tra từng sợi cói tạo hình hoa văn.'),
(8, 'Mài sơn mài nhiều lớp', 'Mài dưới nước qua nhiều tầng sơn ta để lộ vân trứng và họa tiết lung linh.');

SELECT setval('techniques_id_seq', (SELECT MAX(id) FROM techniques));

-- 6. NẠP ARTISANS (Hồ sơ nghệ nhân)
INSERT INTO artisans (id, name, region_id, title, specialty, years_of_experience, biography, avatar_url, contact_info) VALUES
(1, 'Trần Độ', 1, 'Nghệ nhân Nhân dân', 'Phục chế men gốm hoàng cung', 48, 'Bậc thầy phục dựng thành công hơn 70 bài men gốm cổ thời Lý, Trần, Lê, Mạc tại làng gốm Bát Tràng. Tác phẩm của ông được chọn làm quốc bảo ngoại giao.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', 'Xưởng gốm Trần Độ, Xóm 1, Bát Tràng, Hà Nội'),
(2, 'Nguyễn Văn Trung', 1, 'Nghệ nhân Ưu tú', 'Thư họa & Vẽ men lam gốm sứ', 36, 'Được mệnh danh là "bút vẽ phù thủy" của Bát Tràng với tài năng họa hoa văn men lam thanh thoát, uyển chuyển như tranh thủy mặc trên gốm sứ cổ truyền.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', 'Hợp tác xã Gốm Mỹ Nghệ Bát Tràng, Gia Lâm, Hà Nội'),
(3, 'Nguyễn Bá Châu', 1, 'Nghệ nhân Nhân dân', 'Kỹ nghệ đúc đồng cổ truyền', 42, 'Hậu duệ đời thứ 5 làng đúc đồng Ngũ Xã, người tái sinh kỹ thuật đúc tượng đồng nguyên khối không hàn ghép và các dòng đỉnh đồng linh thiêng.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Xưởng đúc đồng Ngũ Xã, Ba Đình, Hà Nội'),
(4, 'Phan Thị Thuận', 1, 'Nghệ nhân Ưu tú', 'Sáng chế dệt lụa tơ sen', 40, 'Người phụ nữ đầu tiên tại Việt Nam thành công rút sợi từ cuống hoa sen dệt thành những tấm lụa tơ sen vô giá tại làng Phùng Xá, Mỹ Đức.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'Công ty Dâu Tằm Tơ Mỹ Đức, Phùng Xá, Hà Nội'),
(5, 'Nguyễn Văn Tĩnh', 1, 'Nghệ nhân Ưu tú', 'Mây tre đan tinh hoa Phú Vinh', 35, 'Nghệ nhân bậc thầy biến nan tre, sợi mây thành những tác phẩm quạt mát, tranh đan và đồ dùng thủ công thanh thoát đạt nhiều giải thưởng quốc tế.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 'Làng nghề mây tre đan Phú Vinh, Chương Mỹ, Hà Nội');

SELECT setval('artisans_id_seq', (SELECT MAX(id) FROM artisans));

-- 7. NẠP CRAFTS (Sản phẩm thủ công truyền thống)
INSERT INTO crafts (id, name, slug, region_id, category_id, thumbnail_url, short_description, cultural_context, tools, process, traditional_use, is_featured, view_count) VALUES
(1, 'Bình Hút Lộc Men Lam Cổ Dát Vàng', 'binh-hut-loc-men-lam-co-dat-vang', 1, 1, 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80', 'Tuyệt phẩm kết hợp dáng gốm phong thủy, nét vẽ men lam thủy mặc và ánh vàng quỳ 24K cung đình.', 'Biểu tượng phong thủy hút tài nạp lộc, lưu giữ sinh khí an lành trong quan niệm văn hóa Việt xưa.', 'Bàn xoay gỗ, bút lông thỏ, lò nung củi, dao gọt cốt tre', 'Vuốt cốt gốm trên bàn xoay -> Phơi sấy tự nhiên -> Vẽ men lam nét mảnh -> Nung lần 1 -> Tráng men bóng nung 1300 độ -> Thếp vàng quỳ nung lại 800 độ', 'Trưng bày không gian trang trọng, vật phẩm chúc phúc tân gia', TRUE, 1250),

(2, 'Đỉnh Đồng Song Long Chầu Nguyệt', 'dinh-dong-song-long-chau-nguyet', 1, 2, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', 'Đỉnh đồng đỏ đúc thủ công theo lối cổ truyền, chạm nổi đôi rồng uy nghi chầu mặt nguyệt.', 'Vật phẩm tối thượng trên bàn thờ gia tiên, đại diện cho lòng hiếu kính và thế cân bằng âm dương.', 'Khuôn đất sét sáp ong, gầu múc đồng, đục chạm thép hoa cương', 'Làm cốt đất -> Đắp mẫu sáp ong -> Bọc khuôn ngoài -> Đun đồng nóng chảy 1200 độ -> Rót khuôn -> Phá khuôn -> Làm nguội chạm tỉa chi tiết', 'Trang nghiêm không gian thờ tự từ đường, đình chùa', TRUE, 980),

(3, 'Thạp Gốm Hoa Nâu Thời Trần Phục Dựng', 'thap-gom-hoa-nau-thoi-tran-phuc-dung', 1, 1, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80', 'Tái hiện hào khí Đông A oai hùng qua dáng thạp gốm vững chãi và men hoa nâu mộc mạc.', 'Dòng gốm bác học thuần Việt đỉnh cao thời Trần thế kỷ 13, biểu tượng của tinh thần tự chủ văn hóa.', 'Bàn xoay thủ công, khuôn dập hoa văn sen, men hoa nâu oxit sắt', 'Tạo dáng thạp hình trụ miệng loe -> Cạo men tạo đồ án cánh sen -> Bôi men hoa nâu -> Nung lò củi rơm truyền thống', 'Vật phẩm sưu tầm nghệ thuật, trưng bày phòng khách phong thái thiền', FALSE, 640),

(4, 'Khăn Choàng Lụa Tơ Sen Độc Bản', 'khan-choang-lua-to-sen-doc-ban', 1, 3, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 'Tấm khăn choàng siêu nhẹ, thoáng mát dệt từ hàng vạn sợi tơ rút từ cuống sen tươi Hồ Tây.', 'Sản phẩm giao hòa giữa sự thanh tịnh của hoa sen Phật giáo và sự tài hoa kiên nhẫn của người dệt lụa.', 'Khung dệt gỗ thủ công, dao khía cuống sen, thau nước ngâm sợi', 'Hái cuống sen sớm mai -> Khía vỏ rút tơ trong nước -> Se sợi tơ sen -> Mắc khung cửi dệt tay -> Giặt nước lá thơm phơi bóng râm', 'Khăn choàng cao cấp ngày hè thoáng mát, quà tặng ngoại giao tầm cỡ', TRUE, 1890),

(5, 'Quạt Nan Tre Chàng Sơn Thanh Mát', 'quat-nan-tre-chang-son-thanh-mat', 1, 4, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80', 'Quạt nan làm từ tre già ngâm dẻo dai, phủ lụa mỏng tạo ngọn gió tự nhiên xua tan cái nóng hè oi ả.', 'Nghề làm quạt Chàng Sơn có từ hàng trăm năm, từng theo chân sứ thần mang ngọn gió mát lành đi bốn phương.', 'Dao rựa chuốt nan tre, kéo cắt lụa, kim chỉ khâu viền', 'Chọn tre già ngâm 6 tháng -> Chuốt nan tre mỏng đều -> Phơi khô -> Dán lụa mỏng -> Khâu viền chỉ tinh xảo', 'Quạt mát ngày hè, đạo cụ múa dân gian, trang trí tường mộc mạc', TRUE, 2100),

(6, 'Chiếu Cói Mỹ Nghệ Nga Sơn Giải Nhiệt', 'chieu-coi-my-nghe-nga-son-giai-nhiet', 2, 4, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', 'Chiếu dệt thủ công từ sợi cói tự nhiên vùng mặn lợ, mềm êm, thấm mồ hôi và mát lưng ngày hè.', 'Câu ca dao "Chiếu Nga Sơn, gạch Bát Tràng" khẳng định vị thế của vật phẩm nâng niu giấc ngủ thanh mát.', 'Khung dệt chiếu hai người, ngựa go, sợi đay xe chặt', 'Thu hoạch cói non -> Phơi nắng giòn -> Nhuộm màu thảo mộc -> Dệt thủ công hai thợ -> May viền vải lụa', 'Trải giường ngủ ngày hè không cần máy lạnh, làm chiếu ngồi thiền', TRUE, 1420),

(7, 'Hộp Sơn Mài Khảm Trứng Hoa Sen', 'hop-son-mai-kham-trung-hoa-sen', 1, 5, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', 'Hộp đựng trang sức sơn mài đen bóng loáng điểm xuyết cánh hoa sen ghép từ mảnh vỏ trứng tinh vi.', 'Biểu tượng tinh hoa sơn ta Hạ Thái kết hợp phong cách mỹ thuật Đông Dương thanh nhã.', 'Bay trét sơn, đá mài mịn, vải mịn đánh bóng tóc', 'Tạo cốt gỗ -> Bó vải quét sơn ta -> Cẩn từng mảnh vỏ trứng -> Phủ nhiều lớp sơn cánh gián -> Mài nước -> Đánh bóng bằng lòng bàn tay', 'Đựng trang sức quý, quà tặng nghệ thuật sang trọng', FALSE, 520);

SELECT setval('crafts_id_seq', (SELECT MAX(id) FROM crafts));

-- 8. THIẾT LẬP MỐI QUAN HỆ NHIỀU - NHIỀU: NGHỆ NHÂN ↔ SẢN PHẨM (craft_artisans) ⭐
-- Minh họa: 1 tác phẩm có nhiều nghệ nhân, và 1 nghệ nhân sáng tạo nhiều tác phẩm!
INSERT INTO craft_artisans (craft_id, artisan_id, role_title, contribution_notes, is_lead, display_order) VALUES
-- Sản phẩm 1 (Bình men lam dát vàng): 2 nghệ nhân bậc thầy cùng hợp tác
(1, 1, 'Chủ trì chế tác cốt gốm & bài men', 'Nghiên cứu bài men lam tro trấu cổ thời Lê và trực tiếp vuốt cốt gốm chuẩn tỷ lệ phong thủy.', TRUE, 1),
(1, 2, 'Nghệ nhân thư họa hoa văn', 'Dùng bút lông phác họa bức tranh sơn thủy Thuận Buồm Xuôi Gió dưới lớp men trong suốt.', FALSE, 2),

-- Sản phẩm 2 (Đỉnh đồng Ngũ Xã): Nghệ nhân Bá Châu chủ trì
(2, 3, 'Chủ trì đúc & chạm khắc đồng', 'Tạo mẫu sáp rồng chầu nguyệt và làm nguội chạm trổ vảy rồng sắc nét.', TRUE, 1),

-- Sản phẩm 3 (Thạp gốm hoa nâu): Nghệ nhân Trần Độ phục chế (1 nghệ nhân làm nhiều tác phẩm)
(3, 1, 'Nghệ nhân phục chế cổ vật', 'Nghiên cứu hiện vật khảo cổ Hoàng thành Thăng Long để tái sinh chính xác bài men hoa nâu.', TRUE, 1),

-- Sản phẩm 4 (Khăn lụa tơ sen): Nghệ nhân Phan Thị Thuận sáng tạo
(4, 4, 'Chủ trì sáng chế & dệt tơ sen', 'Trực tiếp chỉ đạo quy trình rút sợi cuống sen và dệt khăn lụa tơ sen độc bản.', TRUE, 1),

-- Sản phẩm 5 (Quạt nan tre Chàng Sơn): Nghệ nhân Nguyễn Văn Tĩnh đan mây tre
(5, 5, 'Nghệ nhân chuốt nan & tạo mẫu', 'Chuốt nan tre mỏng dẻo và thiết kế kiểu dáng nan quạt truyền thống.', TRUE, 1),

-- Sản phẩm 6 (Chiếu cói Nga Sơn): Nghệ nhân Văn Tĩnh cố vấn tạo mẫu phối hoa
(6, 5, 'Nghệ nhân cố vấn hoa văn dân gian', 'Hướng dẫn kỹ thuật tra sợi cói màu tạo hình chim hạc trên nền chiếu.', FALSE, 1),

-- Sản phẩm 7 (Hộp sơn mài hoa sen): 2 nghệ nhân phối hợp chất liệu
(7, 1, 'Cố vấn phối sắc men gốm và sơn', 'Đưa gam màu xanh ngọc lam của gốm vào tông nền sơn mài.', FALSE, 2),
(7, 2, 'Nghệ nhân phác thảo đồ án sen', 'Trực tiếp phác thảo nét vẽ hoa sen cho thợ cẩn trứng ghép cánh.', TRUE, 1);

-- 9. QUAN HỆ N-N: SẢN PHẨM ↔ CHẤT LIỆU (craft_materials)
INSERT INTO craft_materials (craft_id, material_id) VALUES
(1, 1), (1, 2), (1, 5), -- Bình gốm: Đất sét, Men lam, Vàng quỳ
(2, 4),                 -- Đỉnh đồng: Đồng đỏ
(3, 1), (3, 3),         -- Thạp gốm: Đất sét, Men rạn
(4, 7), (4, 6),         -- Khăn lụa: Tơ sen, Tơ tằm
(5, 9), (5, 6),         -- Quạt nan: Tre gai, Lụa tơ tằm
(6, 8),                 -- Chiếu cói: Cói Nga Sơn
(7, 10);                -- Hộp sơn mài: Sơn ta & vỏ trứng

-- 10. QUAN HỆ N-N: SẢN PHẨM ↔ KỸ THUẬT (craft_techniques)
INSERT INTO craft_techniques (craft_id, technique_id) VALUES
(1, 1), (1, 2), (1, 4), -- Bình gốm: Vuốt tay, Vẽ men lam, Dát vàng
(2, 3),                 -- Đỉnh đồng: Đúc khuôn sáp
(3, 1), (3, 3),         -- Thạp gốm: Vuốt tay, Men rạn
(4, 5),                 -- Khăn lụa: Rút tơ sen
(5, 6),                 -- Quạt nan: Nan xiên mây tre
(6, 7),                 -- Chiếu cói: Dệt chiếu cói
(7, 8);                 -- Hộp sơn mài: Mài sơn nhiều lớp

-- 11. THƯ VIỆN ẢNH CHI TIẾT SẢN PHẨM (craft_images)
INSERT INTO craft_images (craft_id, url, alt_text, caption, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80', 'Bình hút lộc men lam góc nhìn chính diện', 'Dáng bình phong thủy miệng loe hút vượng khí', 1),
(1, 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80', 'Cận cảnh nét vẽ men lam và lá vàng quỳ', 'Sự tương phản sang trọng giữa men lam trầm và vàng lá 24K', 2),
(2, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80', 'Chi tiết nắp đỉnh đồng nghê vờn cầu', 'Linh vật nghê phong thủy xua đuổi tà khí', 1),
(4, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80', 'Tấm lụa tơ sen nhẹ như làn gió', 'Chất liệu tơ sen tự nhiên siêu nhẹ và thoáng khí', 1),
(5, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80', 'Cận cảnh nan quạt tre uốn dẻo', 'Nan tre già được chuốt đều tăm tắp tạo luồng gió êm', 1),
(6, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80', 'Mặt chiếu cói Nga Sơn đan sợi mịn', 'Sợi cói thiên nhiên giữ mát lưng ngày nóng', 1);

-- 12. BỘ SƯU TẬP CHUYÊN ĐỀ THÔNG THƯỜNG (collections & collection_crafts)
INSERT INTO collections (id, title, slug, description, banner_url, is_featured) VALUES
(1, 'Tinh Hoa Di Sản Kinh Kỳ Thăng Long', 'tinh-hoa-di-san-kinh-ky-thang-long', 'Hành trình ngược dòng lịch sử khám phá các tác phẩm đại diện cho đỉnh cao mỹ nghệ đất kinh kỳ ngàn năm văn hiến.', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', TRUE);

SELECT setval('collections_id_seq', (SELECT MAX(id) FROM collections));

INSERT INTO collection_crafts (collection_id, craft_id, display_order) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 4, 3);

-- =============================================================================
-- 13. BỘ SƯU TẬP THEO MÙA: BỘ MÙA HÈ ⭐ (seasonal_collections & seasonal_collection_crafts)
-- =============================================================================
INSERT INTO seasonal_collections (id, title, slug, season_code, year, theme_concept, banner_url, color_tone, start_date, end_date, is_active) VALUES
(1, 'Sắc Lam Mát Lành – Bộ Sưu Tập Mùa Hè 2026', 'mua-he-2026-mat-lanh', 'summer', 2026, 'Tuyển tập các tuyệt phẩm thủ công từ chất liệu mát tự nhiên: Tre nứa tản nhiệt, chiếu cói thoáng khí, lụa tơ sen nhẹ tênh và gốm men lam làm dịu mát tâm hồn giữa những ngày hè oi ả.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', '#0284c7', '2026-05-01', '2026-08-31', TRUE),
(2, 'Ấm Áp Sắc Xuân – Bộ Sưu Tập Tết 2026', 'am-ap-sac-xuan-tet-2026', 'spring', 2026, 'Sắc vàng ánh đồng và men gốm rực rỡ nghênh đón tài lộc cho năm mới sum vầy.', 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80', '#dc2626', '2026-01-01', '2026-03-15', FALSE);

SELECT setval('seasonal_collections_id_seq', (SELECT MAX(id) FROM seasonal_collections));

-- Gán các sản phẩm làm mát đặc trưng ngày hè vào Bộ Mùa Hè:
INSERT INTO seasonal_collection_crafts (seasonal_collection_id, craft_id, curator_note, highlight_badge, is_hero, display_order) VALUES
-- Sản phẩm 5 (Quạt nan tre Chàng Sơn): Tác phẩm biểu tượng giải nhiệt
(1, 5, 'Nan tre uốn cong thanh thoát tạo làn gió mát lành tự nhiên giữa những buổi trưa hè oi ả, gợi nhớ nếp nhà thanh tịnh làng quê.', 'Giải nhiệt mùa hạ', TRUE, 1),

-- Sản phẩm 6 (Chiếu cói Nga Sơn): Nâng niu giấc ngủ thanh mát
(1, 6, 'Sợi cói thiên nhiên tản nhiệt và thấm hút mồ hôi cực nhanh, đem lại giấc ngủ thanh dịu không bí bách trong những đêm hè nóng ẩm.', 'Thanh mát tự nhiên', FALSE, 2),

-- Sản phẩm 4 (Khăn lụa tơ sen): Thoáng khí cao cấp
(1, 4, 'Chất lụa từ tơ sen siêu nhẹ, thoáng khí và lưu giữ hương sen dịu ngọt thanh lọc cái oi bức mùa hè.', 'Lụa tơ mát hè', FALSE, 3),

-- Sản phẩm 1 (Bình men lam): Thị giác xanh mát
(1, 1, 'Màu men lam tro trấu cổ mang sắc mát mẻ của dòng sông mát rượi, xua tan không khí nồng bức trong phòng khách.', 'Dịu mát thị giác', FALSE, 4);

-- 14. DANH SÁCH YÊU THÍCH MẪU (favourites)
INSERT INTO favourites (user_id, craft_id) VALUES
(2, 1),
(2, 4),
(2, 5);

-- 15. TIN NHẮN TỪ BIỂU MẪU LIÊN HỆ (contact_messages)
INSERT INTO contact_messages (id, full_name, email, phone, subject, message, status) VALUES
(1, 'Lê Hoàng Nam', 'nam.le@heritage.vn', '0912345678', 'Đặt hàng bình gốm men lam dát vàng làm quà đối ngoại', 'Xin chào CraftRoots, tôi muốn đặt 2 tác phẩm Bình Hút Lộc do chính tay Nghệ nhân Trần Độ chế tác để làm quà tặng đối tác nước ngoài. Xin tư vấn thêm về thời gian hoàn thiện.', 'unread'),
(2, 'Vũ Mai Linh', 'mailinh.vu@design.com', '0987654321', 'Đề xuất hợp tác truyền thông Bộ Sưu Tập Mùa Hè', 'Tôi đại diện tạp chí Kiến Trúc & Đời Sống rất ấn tượng với Bộ sưu tập Mùa Hè của CraftRoots. Chúng tôi muốn viết bài chuyên đề về sản phẩm quạt nan và chiếu cói Nga Sơn.', 'read');

SELECT setval('contact_messages_id_seq', (SELECT MAX(id) FROM contact_messages));
