/**
 * Dữ liệu Địa chí Không gian Làng nghề Truyền thống Việt Nam (CraftRoots Cultural Atlas)
 * Tọa độ chuẩn hệ WGS84 [Kinh độ (Longitude), Vĩ độ (Latitude)]
 */

export const CRAFT_CATEGORIES = {
  ceramics: {
    id: 'ceramics',
    label: 'Gốm Sứ Sa Thạch & Men Cổ',
    color: '#B86B35',
    icon: 'local_fire_department'
  },
  textiles: {
    id: 'textiles',
    label: 'Dệt Lụa Cổ & Thổ Cẩm',
    color: '#2A7B68',
    icon: 'texture'
  },
  bamboo: {
    id: 'bamboo',
    label: 'Mây Tre Đan Mắt Cáo',
    color: '#D49B35',
    icon: 'grid_goldenratio'
  },
  lacquer: {
    id: 'lacquer',
    label: 'Sơn Mài Then & Cẩn Trứng',
    color: '#A82D2D',
    icon: 'palette'
  },
  metalsmith: {
    id: 'metalsmith',
    label: 'Kim Hoàn & Chạm Bạc Đồng Xâm',
    color: '#6B7280',
    icon: 'hardware'
  }
};

export const CRAFT_VILLAGES = [
  // --- ĐỒNG BẰNG BẮC BỘ ---
  {
    id: 'bat-trang',
    name: 'Gốm Sứ Bát Tràng',
    category: 'ceramics',
    categoryLabel: 'Gốm Sứ Sa Thạch',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Đồng Bằng Bắc Bộ',
    province: 'Gia Lâm, Hà Nội',
    coordinates: [105.9142, 20.9782],
    established: 'Thế kỷ XIV (~700 năm)',
    artisansCount: 45,
    craftsCount: 18,
    description: 'Cái nôi men rạn và gốm hoa lam cổ truyền. Nổi tiếng với kỹ thuật nung củi truyền thống tái hiện dáng vẻ vương giả thời Lý - Trần.',
    representativeArtisan: 'Nghệ nhân Trần Độ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 1,
    featured: true
  },
  {
    id: 'van-phuc',
    name: 'Lụa Tơ Tằm Vạn Phúc',
    category: 'textiles',
    categoryLabel: 'Dệt Lụa Cổ',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Đồng Bằng Bắc Bộ',
    province: 'Hà Đông, Hà Nội',
    coordinates: [105.7725, 20.9774],
    established: 'Hơn 1.000 năm (Thời Đinh - Tiền Lê)',
    artisansCount: 28,
    craftsCount: 12,
    description: 'Đệ nhất gấm vóc xứ Kinh Kỳ. Nổi danh với lụa Vân cổ truyền hoa chìm sắc nét, đông ấm hè mát, từng cung tiến hoàng tộc triều Nguyễn.',
    representativeArtisan: 'Nghệ nhân Đỗ Văn Hiển',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 2,
    featured: true
  },
  {
    id: 'dong-ho',
    name: 'Tranh Dân Gian Đông Hồ',
    category: 'lacquer',
    categoryLabel: 'Mộc Bản & Giấy Điệp',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Đồng Bằng Bắc Bộ',
    province: 'Thuận Thành, Bắc Ninh',
    coordinates: [106.0712, 21.0543],
    established: 'Thế kỷ XVI (~500 năm)',
    artisansCount: 14,
    craftsCount: 9,
    description: 'Bản sắc hồn nhiên của làng quê Kinh Bắc. Kỹ thuật in mộc bản thủ công trên giấy điệp giã từ vỏ sò tự nhiên, màu chế từ tro rơm, hoa hòe, sỏi son.',
    representativeArtisan: 'Nghệ nhân Nguyễn Đăng Chế',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
    craftId: 3,
    featured: true
  },
  {
    id: 'chu-dau',
    name: 'Gốm Chu Đậu',
    category: 'ceramics',
    categoryLabel: 'Gốm Men Tro Cổ',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Đồng Bằng Bắc Bộ',
    province: 'Nam Sách, Hải Dương',
    coordinates: [106.3312, 20.9856],
    established: 'Thế kỷ XIV - XV',
    artisansCount: 22,
    craftsCount: 15,
    description: 'Dòng gốm đạo học mang vẻ đẹp thuần khiết Á Đông, nước men tro trấu tự nhiên được gìn giữ trong 46 viện bảo tàng trên thế giới.',
    representativeArtisan: 'Nghệ nhân Hạ Thị Cúc',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 1,
    featured: false
  },
  {
    id: 'phu-vinh',
    name: 'Mây Tre Đan Phú Vinh',
    category: 'bamboo',
    categoryLabel: 'Mây Tre Đan Mắt Cáo',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Đồng Bằng Bắc Bộ',
    province: 'Chương Mỹ, Hà Nội',
    coordinates: [105.6987, 20.9234],
    established: 'Thế kỷ XVII (~400 năm)',
    artisansCount: 31,
    craftsCount: 14,
    description: 'Nổi tiếng thế giới với nan mây vót mỏng như sợi chỉ, đan khít không lộ mối nối, tạo nên những hộp trầm và khay trà thanh lịch.',
    representativeArtisan: 'Nghệ nhân Nguyễn Văn Trung',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 5,
    featured: true
  },
  {
    id: 'ha-thai',
    name: 'Sơn Mài Hạ Thái',
    category: 'lacquer',
    categoryLabel: 'Sơn Mài Then & Cẩn Trứng',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Đồng Bằng Bắc Bộ',
    province: 'Thường Tín, Hà Nội',
    coordinates: [105.8612, 20.8931],
    established: 'Thế kỷ XVII',
    artisansCount: 25,
    craftsCount: 11,
    description: 'Chuyên chế tác hoành phi câu đối và tranh sơn mài then cẩn ốc xà cừ, cẩn vỏ trứng cho các đình chùa và không gian nội thất trang trọng.',
    representativeArtisan: 'Nghệ nhân Đỗ Văn Trịnh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
    craftId: 6,
    featured: true
  },
  {
    id: 'dong-xam',
    name: 'Chạm Bạc Đồng Xâm',
    category: 'metalsmith',
    categoryLabel: 'Chạm Bạc & Kim Hoàn',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Đồng Bằng Bắc Bộ',
    province: 'Kiến Xương, Thái Bình',
    coordinates: [106.4215, 20.4321],
    established: 'Hơn 500 năm (Thế kỷ XV)',
    artisansCount: 19,
    craftsCount: 8,
    description: 'Nghệ thuật gò đồng và chạm trổ hoa văn trên lá bạc nguyên chất với đường nét mảnh mai, uyển chuyển đạt chuẩn mực kim hoàn.',
    representativeArtisan: 'Nghệ nhân Đinh Quang Thắng',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: true
  },

  // --- TÂY BẮC ---
  {
    id: 'mai-chau',
    name: 'Dệt Thổ Cẩm Mai Châu',
    category: 'textiles',
    categoryLabel: 'Thổ Cẩm Thái Trắng',
    regionId: 'tay-bac',
    regionName: 'Tây Bắc',
    province: 'Bản Lác, Hòa Bình',
    coordinates: [105.0212, 20.6654],
    established: 'Thế kỷ XVII (~400 năm)',
    artisansCount: 20,
    craftsCount: 10,
    description: 'Khung cửi cổ truyền dệt hoa văn hình quả trám, nhuộm lá chàm và rễ cây rừng nguyên bản của đồng bào dân tộc Thái Trắng.',
    representativeArtisan: 'Nghệ nhân Vì Thị Oanh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 2,
    featured: true
  },
  {
    id: 'bac-ha',
    name: 'Rèn Đúc Thủ Công Bắc Hà',
    category: 'metalsmith',
    categoryLabel: 'Rèn Sắt & Dao Mèo',
    regionId: 'tay-bac',
    regionName: 'Tây Bắc',
    province: 'Bắc Hà, Lào Cai',
    coordinates: [104.2856, 22.5342],
    established: 'Truyền đời người Mông',
    artisansCount: 12,
    craftsCount: 6,
    description: 'Rèn thủ công bằng búa tạ và than củi nghiến, phương pháp tôi nước lạnh độc đáo tạo nên lưỡi dao mèo bén ngọt và bền bỉ.',
    representativeArtisan: 'Thợ rèn Giàng A Páo',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: false
  },

  // --- ĐÔNG BẮC ---
  {
    id: 'quang-uyen',
    name: 'Giấy Bản Dân Tộc Nùng',
    category: 'textiles',
    categoryLabel: 'Giấy Bản Vỏ Dướng',
    regionId: 'dong-bac',
    regionName: 'Đông Bắc',
    province: 'Quảng Uyên, Cao Bằng',
    coordinates: [106.4523, 22.7123],
    established: 'Thế kỷ XVIII (~300 năm)',
    artisansCount: 16,
    craftsCount: 7,
    description: 'Làm hoàn toàn từ vỏ cây dướng tự nhiên ngâm vôi suối đá, giã nhuyễn và xeo thủ công từng tờ giấy dai mềm dùng viết sắc phong và thư pháp.',
    representativeArtisan: 'Nghệ nhân Nông Văn Lương',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
    craftId: 3,
    featured: true
  },

  // --- BẮC TRUNG BỘ ---
  {
    id: 'phu-cam',
    name: 'Nón Bài Thơ Phủ Cam',
    category: 'bamboo',
    categoryLabel: 'Nón Lá & Thêu Bài Thơ',
    regionId: 'bac-trung-bo',
    regionName: 'Bắc Trung Bộ',
    province: 'TP. Huế, Thừa Thiên Huế',
    coordinates: [107.5912, 16.4623],
    established: 'Thế kỷ XIX (Thời Nguyễn)',
    artisansCount: 22,
    craftsCount: 8,
    description: 'Biểu tượng thanh tao của đất Cố Đô. Giữa hai lớp lá nón là bài thơ và cảnh sắc chùa Thiên Mụ chỉ hiện rõ khi soi dưới ánh nắng.',
    representativeArtisan: 'Nghệ nhân Bùi Thị Nga',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 5,
    featured: true
  },
  {
    id: 'duc-dong-hue',
    name: 'Đúc Đồng Phường Đúc Huế',
    category: 'metalsmith',
    categoryLabel: 'Đúc Đồng Đại Hồng Chung',
    regionId: 'bac-trung-bo',
    regionName: 'Bắc Trung Bộ',
    province: 'Phường Đúc, TP. Huế',
    coordinates: [107.5712, 16.4521],
    established: 'Thế kỷ XVII (~400 năm)',
    artisansCount: 18,
    craftsCount: 9,
    description: 'Cái nôi tạo tác Cửu Đỉnh, vạc đồng và các đại hồng chung ngân vang trầm hùng khắp các chốn cổ tự linh thiêng đất Thần Kinh.',
    representativeArtisan: 'Nghệ nhân Nguyễn Văn Sính',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: false
  },

  // --- DUYÊN HẢI NAM TRUNG BỘ ---
  {
    id: 'kim-bong',
    name: 'Mộc Mỹ Nghệ Kim Bồng',
    category: 'bamboo',
    categoryLabel: 'Mộc Điêu Khắc Nhà Cổ',
    regionId: 'duyen-hai-nam-trung-bo',
    regionName: 'Duyên Hải Nam Trung Bộ',
    province: 'Cẩm Kim, Hội An, Quảng Nam',
    coordinates: [108.3245, 15.8712],
    established: 'Thế kỷ XVI (~500 năm)',
    artisansCount: 26,
    craftsCount: 14,
    description: 'Bàn tay tài hoa dựng nên kiến trúc Chùa Cầu, nhà cổ Hội An và những chiếc thuyền gỗ vượt đại dương buôn bán quốc tế sầm uất.',
    representativeArtisan: 'Nghệ nhân Huỳnh Ri',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 5,
    featured: true
  },
  {
    id: 'non-nuoc',
    name: 'Đá Mỹ Nghệ Non Nước',
    category: 'metalsmith',
    categoryLabel: 'Điêu Khắc Đá Sa Thạch',
    regionId: 'duyen-hai-nam-trung-bo',
    regionName: 'Duyên Hải Nam Trung Bộ',
    province: 'Ngũ Hành Sơn, Đà Nẵng',
    coordinates: [108.2612, 16.0023],
    established: 'Thế kỷ XVII (~400 năm)',
    artisansCount: 30,
    craftsCount: 12,
    description: 'Nghệ thuật đục đẽo từ khối đá cẩm thạch tự nhiên núi Ngũ Hành Sơn, thổi hồn sống động vào tượng Phật, linh vật và đồ gia dụng tinh mỹ.',
    representativeArtisan: 'Nghệ nhân Nguyễn Long Bửu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: true
  },
  {
    id: 'bau-truc',
    name: 'Gốm Chăm Bàu Trúc (UNESCO)',
    category: 'ceramics',
    categoryLabel: 'Gốm Nung Lộ Thiên Cổ Sơ',
    regionId: 'duyen-hai-nam-trung-bo',
    regionName: 'Duyên Hải Nam Trung Bộ',
    province: 'Ninh Phước, Ninh Thuận',
    coordinates: [108.9512, 11.5345],
    established: 'Hàng ngàn năm (Di sản UNESCO)',
    artisansCount: 35,
    craftsCount: 16,
    description: 'Một trong những làng gốm cổ nhất Đông Nam Á. Phụ nữ Chăm nắn gốm bằng tay đi giật lùi quanh trục đất, nung lộ thiên bằng củi và rơm rạ tự nhiên.',
    representativeArtisan: 'Nghệ nhân Đàng Thị Phan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 1,
    featured: true
  },

  // --- TÂY NGUYÊN ---
  {
    id: 'tho-cam-e-de',
    name: 'Dệt Thổ Cẩm Ê Đê Buôn Ma Thuột',
    category: 'textiles',
    categoryLabel: 'Thổ Cẩm Hoa Văn K’teh',
    regionId: 'tay-nguyen',
    regionName: 'Tây Nguyên',
    province: 'Buôn Ma Thuột, Đắk Lắk',
    coordinates: [108.0456, 12.6712],
    established: 'Văn hóa cổ truyền Tây Nguyên',
    artisansCount: 18,
    craftsCount: 11,
    description: 'Dệt khung cửi hông truyền thống với dải viền K’teh đỏ đen biểu tượng cho sức sống đại ngàn, thần sấm sét và mẫu hệ mẫu mực.',
    representativeArtisan: 'Nghệ nhân H’Nen Niê',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 2,
    featured: true
  },
  {
    id: 'cong-chieng-gia-lai',
    name: 'Không Gian Chế Tác Cồng Chiêng (UNESCO)',
    category: 'metalsmith',
    categoryLabel: 'Chỉnh Chiêng & Đồng Âm Vang',
    regionId: 'tay-nguyen',
    regionName: 'Tây Nguyên',
    province: 'Pleiku, Gia Lai',
    coordinates: [107.9912, 13.9823],
    established: 'Không gian văn hóa Cồng Chiêng UNESCO',
    artisansCount: 15,
    craftsCount: 6,
    description: 'Nghệ thuật chỉnh âm chiêng đỉnh cao, kết nối tâm linh con người với thần rừng Pơ-tao qua từng hồi ngân vang sâu thẳm giữa cao nguyên.',
    representativeArtisan: 'Nghệ nhân Rơ Châm Tih',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: false
  },

  // --- NAM BỘ ---
  {
    id: 'gom-vinh-long',
    name: 'Gốm Đỏ Mang Thít',
    category: 'ceramics',
    categoryLabel: 'Gốm Đất Sét Đỏ Nung Trấu',
    regionId: 'nam-bo',
    regionName: 'Nam Bộ',
    province: 'Mang Thít, Vĩnh Long',
    coordinates: [106.0512, 10.2212],
    established: 'Đầu thế kỷ XX (~100 năm)',
    artisansCount: 28,
    craftsCount: 13,
    description: '“Vương quốc lò gạch đỏ” ven sông Cổ Chiên. Đất sét mịn nung lửa rơm rạ tạo nên màu hồng đỏ tự nhiên phủ phấn trắng độc nhất vô nhị.',
    representativeArtisan: 'Nghệ nhân Nguyễn Văn Ba',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 1,
    featured: true
  },
  {
    id: 'chieu-dinh-yen',
    name: 'Chiếu Định Yên',
    category: 'bamboo',
    categoryLabel: 'Chiếu Lác Dệt Nổi',
    regionId: 'nam-bo',
    regionName: 'Nam Bộ',
    province: 'Lấp Vò, Đồng Tháp',
    coordinates: [105.5123, 10.3512],
    established: 'Hơn 100 năm',
    artisansCount: 20,
    craftsCount: 9,
    description: '“Chợ ma chiếu đêm” nức tiếng miền Tây. Sợi lác phơi giòn nhuộm sắc đỏ vàng xanh dệt nên hoa văn bướm lượn, chữ thọ bền chặt.',
    representativeArtisan: 'Nghệ nhân Lê Thị Cẩm',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 5,
    featured: true
  },
  {
    id: 'son-mai-tuong-binh-hiep',
    name: 'Sơn Mài Tương Bình Hiệp',
    category: 'lacquer',
    categoryLabel: 'Sơn Mài Nước Vỏ Trai',
    regionId: 'nam-bo',
    regionName: 'Nam Bộ',
    province: 'Thủ Dầu Một, Bình Dương',
    coordinates: [106.6345, 10.9856],
    established: 'Thế kỷ XVIII (~300 năm)',
    artisansCount: 22,
    craftsCount: 10,
    description: 'Kỹ nghệ mài nước tỉ mỉ qua 25 công đoạn phủ sơn ta tự nhiên, cẩn ốc xà cừ và rắc vàng bạc lấp lánh phản chiếu ánh sáng sang trọng.',
    representativeArtisan: 'Nghệ nhân Trương Quan Tịnh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
    craftId: 6,
    featured: true
  }
];

// Helper xuất dữ liệu làng nghề dạng GeoJSON FeatureCollection cho MapLibre
export const getVillagesGeoJSON = () => {
  return {
    type: 'FeatureCollection',
    features: CRAFT_VILLAGES.map(village => ({
      type: 'Feature',
      id: village.id,
      properties: {
        id: village.id,
        name: village.name,
        category: village.category,
        categoryLabel: village.categoryLabel,
        regionId: village.regionId,
        regionName: village.regionName,
        province: village.province,
        established: village.established,
        artisansCount: village.artisansCount,
        craftsCount: village.craftsCount,
        representativeArtisan: village.representativeArtisan,
        image: village.image,
        craftId: village.craftId,
        featured: village.featured
      },
      geometry: {
        type: 'Point',
        coordinates: village.coordinates
      }
    }))
  };
};
