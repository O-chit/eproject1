/**
 * CRAFTROOTS - CẤU HÌNH DỮ LIỆU ĐỊA CHÍ 7 VÙNG VĂN HÓA LÀNG NGHỀ VIỆT NAM
 * Hệ thống định danh, màu sắc tương phản cao, danh mục làng nghề và chủ quyền biển đảo
 */

// Hàm chuẩn hóa chuỗi tiếng Việt để so khớp tên tỉnh thành chính xác tuyệt đối
export function normalizeProvinceName(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b(tinh|thanh pho|tp|city)\b/g, '')
    .trim();
}

// 7 VÙNG VĂN HÓA LÀNG NGHỀ TRUYỀN THỐNG VIỆT NAM
export const CULTURAL_REGIONS = {
  TAY_BAC_VIET_BAC: {
    id: 'TAY_BAC_VIET_BAC',
    code: 'TAY_BAC_VIET_BAC',
    name: 'Trung du & Miền núi phía Bắc',
    subName: 'Tây Bắc – Đông Bắc & Việt Bắc',
    color: '#D49A24', // Vàng Hoa Hòe (Tranh dân gian & Dệt thổ cẩm)
    badgeBg: 'rgba(212, 154, 36, 0.15)',
    borderColor: '#D49A24',
    description:
      'Vùng rẻo cao và thung lũng đại ngàn hùng vĩ, cái nôi gìn giữ kỹ nghệ dệt lanh thổ cẩm, rèn đúc thép thủ công, chạm khắc trang sức bạc và nhuộm chàm cổ truyền của các đồng bào Mông, Thái, Dao, Nùng, Tày.',
    provinces: [
      'Hà Giang',
      'Cao Bằng',
      'Bắc Kạn',
      'Tuyên Quang',
      'Lào Cai',
      'Yên Bái',
      'Thái Nguyên',
      'Lạng Sơn',
      'Bắc Giang',
      'Phú Thọ',
      'Điện Biên',
      'Lai Châu',
      'Sơn La',
      'Hòa Bình'
    ],
    crafts: [
      {
        id: 'lung-tam',
        name: 'Dệt lanh thổ cẩm Lùng Tám',
        province: 'Hà Giang',
        description: 'Quy trình bẻ sợi lanh, se chỉ, dệt thủ công và vẽ sáp ong chàm cổ tích của người Mông hoa.'
      },
      {
        id: 'phuc-sen',
        name: 'Rèn đúc thủ công Phúc Sen',
        province: 'Cao Bằng',
        description: 'Nghề rèn thép nhíp ô tô bằng lò than củi bí truyền của người Nùng An, sắc bén ngàn năm.'
      },
      {
        id: 'mai-chau',
        name: 'Thổ cẩm thung lũng Mai Châu',
        province: 'Hòa Bình',
        description: 'Họa tiết hoa văn dệt tay hoa sen, quả trám đặc trưng trên khung cửi của người Thái trắng.'
      },
      {
        id: 'cham-bac-dao',
        name: 'Chạm khắc bạc người Dao & Mông',
        province: 'Lào Cai / Lai Châu',
        description: 'Kỹ nghệ đúc rèn bạc trắng thành vòng cổ, xà tích và trâm cài xua đuổi tà khí linh thiêng.'
      }
    ]
  },

  DONG_BANG_SONG_HONG: {
    id: 'DONG_BANG_SONG_HONG',
    code: 'DONG_BANG_SONG_HONG',
    name: 'Đồng bằng sông Hồng',
    subName: 'Châu thổ Sông Hồng & Kinh Kỳ Ngàn Năm',
    color: '#A83827', // Đỏ Vang Gỗ Vang (Son tranh Đông Hồ & Gốm Bát Tràng)
    badgeBg: 'rgba(168, 56, 39, 0.15)',
    borderColor: '#A83827',
    description:
      'Cái nôi văn minh lúa nước sông Hồng và trung tâm thủ công mỹ nghệ tinh hoa bậc nhất với mật độ làng nghề dày đặc: Gốm sứ men lam, lụa tơ tằm Vân, mộc bản giấy điệp và đúc đồng kim hoàn đỉnh cao.',
    provinces: [
      'Hà Nội',
      'Vĩnh Phúc',
      'Bắc Ninh',
      'Quảng Ninh',
      'Hải Dương',
      'Hải Phòng',
      'Hưng Yên',
      'Thái Bình',
      'Hà Nam',
      'Nam Định',
      'Ninh Bình'
    ],
    crafts: [
      {
        id: 'bat-trang',
        name: 'Gốm sứ Bát Tràng',
        province: 'Hà Nội',
        description: 'Cái nôi men rạn và men lam cổ truyền, nổi tiếng với kỹ thuật vuốt tay và nung củi nhiệt cao.'
      },
      {
        id: 'van-phuc',
        name: 'Lụa tơ tằm Vạn Phúc',
        province: 'Hà Nội',
        description: 'Đệ nhất gấm vóc xứ Kinh Kỳ, lụa Vân hoa chìm tinh xảo từng được cung tiến triều đình Nguyễn.'
      },
      {
        id: 'dong-ho',
        name: 'Tranh dân gian Đông Hồ',
        province: 'Bắc Ninh',
        description: 'Kỹ thuật in mộc bản thủ công trên giấy điệp giã từ vỏ sò tự nhiên, màu chế từ tro than và hoa hòe.'
      },
      {
        id: 'y-yen',
        name: 'Đúc đồng Ý Yên',
        province: 'Nam Định',
        description: 'Kỹ nghệ đúc chuông khánh, đỉnh đồng, tượng Phật và đồ tế khí đồ sộ lưu truyền ngàn năm.'
      },
      {
        id: 'chu-dau',
        name: 'Gốm men tro Chu Đậu',
        province: 'Hải Dương',
        description: 'Dòng gốm đạo cao quý thời Lý - Trần với men tro trấu tự nhiên và họa tiết thư họa tuyệt mỹ.'
      }
    ]
  },

  BAC_TRUNG_BO: {
    id: 'BAC_TRUNG_BO',
    code: 'BAC_TRUNG_BO',
    name: 'Bắc Trung Bộ',
    subName: 'Dải Đất Cố Đô & Di Sản Miền Trung',
    color: '#5E4B7A', // Tím Men Tro Lam Huế (Cố Đô & Men tro cổ)
    badgeBg: 'rgba(94, 75, 122, 0.15)',
    borderColor: '#5E4B7A',
    description:
      'Dải đất lịch sử giao thoa giữa văn hóa cung đình triều Nguyễn và làng nghề dân gian duyên hải: Hoa giấy thờ tự, nón lá bài thơ, chiếu cói dệt hoa và nghệ thuật chạm khắc mộc truyền đời.',
    provinces: [
      'Thanh Hóa',
      'Nghệ An',
      'Hà Tĩnh',
      'Quảng Bình',
      'Quảng Trị',
      'Thừa Thiên Huế'
    ],
    crafts: [
      {
        id: 'thanh-tien',
        name: 'Hoa giấy Thanh Tiên',
        province: 'Thừa Thiên Huế',
        description: 'Nghệ thuật nhuộm giấy ngũ sắc tạo hình hoa sen và hoa cúc phục vụ tín ngưỡng thờ tự xứ Huế.'
      },
      {
        id: 'non-bai-tho',
        name: 'Nón lá bài thơ xứ Huế',
        province: 'Thừa Thiên Huế',
        description: 'Kỹ thuật chằm nón lá sen lá cọ mỏng manh, chêm câu thơ và hình phong cảnh ẩn hiện dưới ánh nắng.'
      },
      {
        id: 'nga-son',
        name: 'Chiếu cói Nga Sơn',
        province: 'Thanh Hóa',
        description: 'Sợi cói mặn dẻo dai nhuộm màu tươi sáng, dệt hoa văn chữ Thọ và hoa văn tứ linh thanh mát lưng.'
      },
      {
        id: 'thai-yen',
        name: 'Mộc mỹ nghệ Thái Yên',
        province: 'Hà Tĩnh',
        description: 'Nghệ thuật đục mộng gỗ mộc tinh xảo không dùng đinh thép, nổi tiếng bền chắc hàng trăm năm.'
      }
    ]
  },

  NAM_TRUNG_BO: {
    id: 'NAM_TRUNG_BO',
    code: 'NAM_TRUNG_BO',
    name: 'Duyên hải Nam Trung Bộ',
    subName: 'Giao Thoa Văn Hóa Biển & Di Sản Chăm Pa',
    color: '#266B88', // Lam Chàm Men Chu Đậu (Hải dương & Men lam cổ)
    badgeBg: 'rgba(38, 107, 136, 0.15)',
    borderColor: '#266B88',
    description:
      'Miền cát trắng và biển đảo trù phú với sự giao thoa độc đáo giữa di sản văn hóa Việt và nghệ thuật tạo hình Chăm Pa cổ đại: Gốm nung lộ thiên, điêu khắc đá cẩm thạch và dệt thổ cẩm hình chim phượng.',
    provinces: [
      'Đà Nẵng',
      'Quảng Nam',
      'Quảng Ngãi',
      'Bình Định',
      'Phú Yên',
      'Khánh Hòa',
      'Ninh Thuận',
      'Bình Thuận'
    ],
    crafts: [
      {
        id: 'thanh-ha',
        name: 'Gốm đất nung Thanh Hà',
        province: 'Quảng Nam',
        description: 'Gốm mộc không tráng men tạo hình bằng đất sét sông Thu Bồn, nung củi cúc rực rỡ bên phố cổ Hội An.'
      },
      {
        id: 'non-nuoc',
        name: 'Đá mỹ nghệ Non Nước',
        province: 'Đà Nẵng',
        description: 'Nghệ thuật đục đẽo đá cẩm thạch Ngũ Hành Sơn thành tượng Phật, hoa văn phù điêu sống động.'
      },
      {
        id: 'bau-truc',
        name: 'Gốm Chăm Bàu Trúc (UNESCO)',
        province: 'Ninh Thuận',
        description: 'Kỹ thuật làm gốm bằng tay đi giật lùi quanh bàn xoay và nung lộ thiên bằng rơm rạ nguyên sơ.'
      },
      {
        id: 'my-nghiep',
        name: 'Dệt thổ cẩm Chăm Mỹ Nghiệp',
        province: 'Ninh Thuận',
        description: 'Kỹ thuật dệt sợi nổi hoa văn quả trám, văn mây và chim phượng cổ truyền của đồng bào Chăm.'
      },
      {
        id: 'phu-gia',
        name: 'Nón ngựa Phú Gia',
        province: 'Bình Định',
        description: 'Chiếc nón bền chắc của đội kỵ binh Tây Sơn xưa, chạm trổ bạc hoặc đồng ở đỉnh chóp tôn nghiêm.'
      }
    ]
  },

  TAY_NGUYEN: {
    id: 'TAY_NGUYEN',
    code: 'TAY_NGUYEN',
    name: 'Tây Nguyên',
    subName: 'Không Gian Văn Hóa Cồng Chiêng Đại Ngàn',
    color: '#CE5C23', // Cam Lửa Nung Củi (Bazan nung củi & Lửa cồng chiêng)
    badgeBg: 'rgba(206, 92, 35, 0.15)',
    borderColor: '#CE5C23',
    description:
      'Không gian huyền thoại của rẫy nương và cồng chiêng đại ngàn, nổi bật với nghệ thuật dệt thổ cẩm luồn tay rực sắc lửa, chế tác nhạc khí tre nứa vang vọng và điêu khắc tượng gỗ nhà mồ nguyên sơ.',
    provinces: [
      'Kon Tum',
      'Gia Lai',
      'Đắk Lắk',
      'Đắk Nông',
      'Lâm Đồng'
    ],
    crafts: [
      {
        id: 'tho-cam-e-de',
        name: 'Dệt thổ cẩm Ê-đê & Ba-na',
        province: 'Đắk Lắk / Gia Lai',
        description: 'Họa tiết rồng lửa, hoa văn hình học đa diện dệt trên khung cửi luồn tay nguyên sơ của đồng bào.'
      },
      {
        id: 'nhac-cu-trung',
        name: 'Chế tác nhạc cụ tre nứa & Đàn T\'rưng',
        province: 'Kon Tum',
        description: 'Biến thân tre nứa đại ngàn thành nhạc khí âm vang tiếng suối reo và linh hồn cồng chiêng.'
      },
      {
        id: 'dan-gui-tay-nguyen',
        name: 'Đan gùi hoa văn mây tre',
        province: 'Đắk Nông',
        description: 'Gùi vận chuyển nông sản đan cài nan tre nan mây chắc khỏe, hoa văn tượng hình dẻo dai qua năm tháng.'
      },
      {
        id: 'tuong-go-nha-mo',
        name: 'Điêu khắc tượng gỗ dân gian',
        province: 'Gia Lai',
        description: 'Nghệ thuật tạc tượng gỗ rừng bằng rìu mộc, biểu đạt triết lý sinh tử và vũ trụ quan bản địa kỳ bí.'
      }
    ]
  },

  DONG_NAM_BO: {
    id: 'DONG_NAM_BO',
    code: 'DONG_NAM_BO',
    name: 'Đông Nam Bộ',
    subName: 'Thủ Phủ Công Mỹ Nghệ Nam Bộ',
    color: '#8A5232', // Nâu Hổ Phách Nam Bộ (Gỗ mật, sơn mài & Gốm sành)
    badgeBg: 'rgba(138, 82, 50, 0.15)',
    borderColor: '#8A5232',
    description:
      'Vùng đất phù sa cổ trù phú hội tụ các dòng nghề thủ công mỹ nghệ quy mô lớn của phương Nam: Gốm men xanh Lái Thiêu - Biên Hòa, sơn mài cẩn xà cừ óng ánh và nghề bánh tráng phơi sương trứ danh.',
    provinces: [
      'Bình Phước',
      'Tây Ninh',
      'Bình Dương',
      'Đồng Nai',
      'Bà Rịa - Vũng Tàu',
      'TP. Hồ Chí Minh'
    ],
    crafts: [
      {
        id: 'lai-thieu',
        name: 'Gốm sứ Lái Thiêu',
        province: 'Bình Dương',
        description: 'Dòng gốm gia dụng tráng men da lươn, vẽ hoa lam mộc mạc phục vụ đời sống trăm năm người Nam Bộ.'
      },
      {
        id: 'tuong-binh-hiep',
        name: 'Sơn mài Tương Bình Hiệp',
        province: 'Bình Dương',
        description: 'Kỹ nghệ mài nước cẩn ốc xà cừ và rắc vàng bạc qua 25 công đoạn phủ sơn ta óng ánh như gương.'
      },
      {
        id: 'gom-bien-hoa',
        name: 'Gốm Biên Hòa & Đá Bửu Long',
        province: 'Đồng Nai',
        description: 'Sự giao thoa tinh diệu giữa kỹ thuật gốm men nung phương Tây và hoa văn rồng phượng Á Đông.'
      },
      {
        id: 'banh-trang-trang-bang',
        name: 'Bánh tráng phơi sương Trảng Bàng',
        province: 'Tây Ninh',
        description: 'Di sản phi vật thể quốc gia, bánh tráng 2 lớp nướng phồng rồi đem phơi hứng sương đêm dẻo dai.'
      }
    ]
  },

  TAY_NAM_BO: {
    id: 'TAY_NAM_BO',
    code: 'TAY_NAM_BO',
    name: 'Đồng bằng sông Cửu Long',
    subName: 'Văn Minh Miệt Vườn & Sông Nước Cửu Long',
    color: '#327555', // Xanh Gỉ Đồng Cổ Mộc (Phù sa miệt vườn Cửu Long)
    badgeBg: 'rgba(50, 117, 85, 0.15)',
    borderColor: '#327555',
    description:
      'Vùng đồng bằng châu thổ sông Cửu Long sông ngòi kênh rạch chằng chịt, sản sinh các làng nghề gắn liền với phù sa và thảo mộc: Vương quốc gạch gốm đỏ, lụa mặc nưa huyền thoại, dệt chiếu hoa và mỹ nghệ dừa.',
    provinces: [
      'Long An',
      'Tiền Giang',
      'Bến Tre',
      'Trà Vinh',
      'Vĩnh Long',
      'Đồng Tháp',
      'An Giang',
      'Kiên Giang',
      'Cần Thơ',
      'Hậu Giang',
      'Sóc Trăng',
      'Bạc Liêu',
      'Cà Mau'
    ],
    crafts: [
      {
        id: 'dinh-yen',
        name: 'Chiếu hoa Định Yên',
        province: 'Đồng Tháp',
        description: 'Chợ chiếu ma đêm độc nhất vô nhị miền Tây, sợi cói nhuộm ngũ sắc đan dệt hoa văn bền đẹp.'
      },
      {
        id: 'mang-thit',
        name: 'Gạch gốm đỏ Mang Thít',
        province: 'Vĩnh Long',
        description: 'Vương quốc lò gạch nung đỏ rực bên dòng sông Cổ Chiên, kiến trúc gốm phù sa độc bản Đông Nam Á.'
      },
      {
        id: 'lanh-my-a',
        name: 'Lụa lãnh Mỹ A Tân Châu',
        province: 'An Giang',
        description: 'Loại lụa tơ tằm nhuộm mủ trái mặc nưa đen huyền, mềm mát như da em bé, càng giặt càng bền bóng.'
      },
      {
        id: 'dua-ben-tre',
        name: 'Thủ công mỹ nghệ dừa Bến Tre',
        province: 'Bến Tre',
        description: 'Tận dụng thân dừa, gáo dừa và xơ dừa biến hóa thành các vật phẩm mỹ nghệ trang nhã.'
      }
    ]
  }
};

// Bản đồ tra cứu nhanh: Tên tỉnh đã chuẩn hóa -> Region ID
export const PROVINCE_TO_REGION_MAP = {};
for (const region of Object.values(CULTURAL_REGIONS)) {
  for (const province of region.provinces) {
    PROVINCE_TO_REGION_MAP[normalizeProvinceName(province)] = region.id;
  }
}

// Hàm tìm Region ID từ tên tỉnh bất kỳ (chấp nhận cả tiếng Việt có dấu, không dấu, viết hoa/thường)
export function getRegionIdByProvince(provinceName) {
  if (!provinceName) return null;
  const normalized = normalizeProvinceName(provinceName);
  if (PROVINCE_TO_REGION_MAP[normalized]) {
    return PROVINCE_TO_REGION_MAP[normalized];
  }
  // So khớp mờ
  for (const [key, regionId] of Object.entries(PROVINCE_TO_REGION_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return regionId;
    }
  }
  return null;
}

// BỘ DỮ LIỆU CHỦ QUYỀN BIỂN ĐẢO THIÊNG LIÊNG (HOÀNG SA, TRƯỜNG SA, PHÚ QUỐC, CÔN ĐẢO)
export const SOVEREIGNTY_DATA = {
  type: 'FeatureCollection',
  features: [
    // 1. Quần đảo Hoàng Sa (TP. Đà Nẵng)
    {
      type: 'Feature',
      id: 'hoang-sa-main',
      properties: {
        id: 'hoang-sa',
        name: 'QUẦN ĐẢO HOÀNG SA',
        admin: 'Thành phố Đà Nẵng, Việt Nam',
        type: 'archipelago',
        labelColor: '#B86B35',
        isSovereignty: true
      },
      geometry: {
        type: 'Point',
        coordinates: [112.0, 16.5]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Đảo Tri Tôn', archipelago: 'hoang-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [111.2, 15.78] }
    },
    {
      type: 'Feature',
      properties: { name: 'Đảo Phú Lâm', archipelago: 'hoang-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [112.33, 16.83] }
    },
    {
      type: 'Feature',
      properties: { name: 'Đảo Hoàng Sa', archipelago: 'hoang-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [111.61, 16.53] }
    },

    // 2. Quần đảo Trường Sa (Tỉnh Khánh Hòa)
    {
      type: 'Feature',
      id: 'truong-sa-main',
      properties: {
        id: 'truong-sa',
        name: 'QUẦN ĐẢO TRƯỜNG SA',
        admin: 'Tỉnh Khánh Hòa, Việt Nam',
        type: 'archipelago',
        labelColor: '#B86B35',
        isSovereignty: true
      },
      geometry: {
        type: 'Point',
        coordinates: [114.0, 10.0]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Đảo Song Tử Tây', archipelago: 'truong-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [114.33, 11.43] }
    },
    {
      type: 'Feature',
      properties: { name: 'Đảo Nam Yết', archipelago: 'truong-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [114.36, 10.18] }
    },
    {
      type: 'Feature',
      properties: { name: 'Đảo Sinh Tồn', archipelago: 'truong-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [114.31, 9.88] }
    },
    {
      type: 'Feature',
      properties: { name: 'Đảo Trường Sa Lớn', archipelago: 'truong-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [111.92, 8.64] }
    },

    // 3. Đảo Phú Quốc (Kiên Giang)
    {
      type: 'Feature',
      properties: { name: 'Đảo Phú Quốc', admin: 'Kiên Giang', type: 'island' },
      geometry: { type: 'Point', coordinates: [103.96, 10.23] }
    },
    // 4. Quần đảo Côn Đảo (Bà Rịa - Vũng Tàu)
    {
      type: 'Feature',
      properties: { name: 'Côn Đảo', admin: 'Bà Rịa - Vũng Tàu', type: 'island' },
      geometry: { type: 'Point', coordinates: [106.6, 8.68] }
    },
    // 5. Biển Đông (Việt Nam)
    {
      type: 'Feature',
      properties: {
        name: 'BIỂN ĐÔNG (VIỆT NAM)',
        subtext: 'HẢI PHẬN QUỐC GIA THIÊNG LIÊNG',
        type: 'sea-label'
      },
      geometry: {
        type: 'Point',
        coordinates: [111.5, 13.8]
      }
    }
  ]
};

// HÀM TÍNH TOÁN BOUNDING BOX THUẦN JAVASCRIPT (KHÔNG DÙNG THƯ VIỆN NGOÀI)
export function getRegionBoundingBox(features = [], regionId = null) {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  const targetFeatures = regionId
    ? features.filter((f) => f.properties?.regionId === regionId)
    : features;

  if (targetFeatures.length === 0) {
    // Khung nhìn mặc định toàn cảnh Việt Nam
    return [
      [102.1, 8.2],
      [114.5, 23.4]
    ];
  }

  function processCoords(coords) {
    if (
      Array.isArray(coords) &&
      coords.length >= 2 &&
      typeof coords[0] === 'number' &&
      typeof coords[1] === 'number'
    ) {
      const [lng, lat] = coords;
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
      return;
    }
    if (Array.isArray(coords)) {
      for (const item of coords) {
        processCoords(item);
      }
    }
  }

  for (const feature of targetFeatures) {
    if (feature.geometry?.coordinates) {
      processCoords(feature.geometry.coordinates);
    }
  }

  if (!isFinite(minLng) || !isFinite(minLat)) {
    return [
      [102.1, 8.2],
      [114.5, 23.4]
    ];
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat]
  ];
}
