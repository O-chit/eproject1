/**
 * CRAFTROOTS - CULTURAL GEOGRAPHIC ATLAS CONFIGURATION
 * 7 Vietnamese Cultural Craft Regions & Maritime Sovereignty
 */

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

// 7 VIETNAMESE CULTURAL CRAFT REGIONS
export const CULTURAL_REGIONS = {
  TAY_BAC_VIET_BAC: {
    id: 'TAY_BAC_VIET_BAC',
    code: 'TAY_BAC_VIET_BAC',
    name: 'Northern Midlands & Mountains',
    subName: 'Northwest – Northeast & Viet Bac',
    color: '#D49A24',
    badgeBg: 'rgba(212, 154, 36, 0.15)',
    borderColor: '#D49A24',
    description:
      'A magnificent realm of highlands and grand valleys, preserving traditional hemp weaving, hand-forged steel tools, engraved silver jewelry, and ancestral indigo dyeing of the Hmong, Thai, Dao, Nung, and Tay peoples.',
    provinces: [
      'Ha Giang',
      'Cao Bang',
      'Bac Kan',
      'Tuyen Quang',
      'Lao Cai',
      'Yen Bai',
      'Thai Nguyen',
      'Lang Son',
      'Bac Giang',
      'Phu Tho',
      'Dien Bien',
      'Lai Chau',
      'Son La',
      'Hoa Binh'
    ],
    crafts: [
      {
        id: 'lung-tam',
        craftId: 23,
        name: 'Lung Tam Brocade Hemp Weaving',
        province: 'Ha Giang',
        description: 'Hemp fiber stripping, spinning, hand-weaving, and ancient indigo beeswax drawing by the Flowered Hmong.'
      },
      {
        id: 'phuc-sen',
        craftId: 19,
        name: 'Phuc Sen Hand Forged Tools',
        province: 'Cao Bang',
        description: 'Traditional scrap leaf-spring blacksmithing using secret charcoal forge methods by the Nung An.'
      },
      {
        id: 'mai-chau',
        craftId: 18,
        name: 'Mai Chau Valley Brocade',
        province: 'Hoa Binh',
        description: 'Lotus and diamond handwoven patterns crafted on wooden looms by White Thai weavers.'
      },
      {
        id: 'cham-bac-dao',
        craftId: 27,
        name: 'Dao & Hmong Silver Carving',
        province: 'Lao Cai / Lai Chau',
        description: 'Master casting of pure white silver into torcs, waist chains, and hairpins to ward off misfortune.'
      }
    ]
  },

  DONG_BANG_SONG_HONG: {
    id: 'DONG_BANG_SONG_HONG',
    code: 'DONG_BANG_SONG_HONG',
    name: 'Red River Delta',
    subName: 'Red River Basin & Thousand-Year Imperial Heartland',
    color: '#A83827',
    badgeBg: 'rgba(168, 56, 39, 0.15)',
    borderColor: '#A83827',
    description:
      'The cradle of wet-rice civilization and the highest concentration of elite craftsmanship: Blue-and-white ceramics, Van silk, woodblock prints on scallop-shell paper, and master bronze casting.',
    provinces: [
      'Hanoi',
      'Vinh Phuc',
      'Bac Ninh',
      'Quang Ninh',
      'Hai Duong',
      'Hai Phong',
      'Hung Yen',
      'Thai Binh',
      'Ha Nam',
      'Nam Dinh',
      'Ninh Binh'
    ],
    crafts: [
      {
        id: 'bat-trang',
        craftId: 17,
        name: 'Bat Trang Ceramics',
        province: 'Hanoi',
        description: 'Cradle of traditional crackle and blue-and-white glazes, celebrated for hand-throwing and high-heat wood firing.'
      },
      {
        id: 'van-phuc',
        craftId: 6,
        name: 'Van Phuc Mulberry Silk',
        province: 'Hanoi',
        description: 'Premier silk of the ancient capital, woven with subtle sunken damask patterns once tribute to royal dynasties.'
      },
      {
        id: 'dong-ho',
        craftId: 16,
        name: 'Dong Ho Folk Woodblock Prints',
        province: 'Bac Ninh',
        description: 'Woodblock printing technique on natural scallop-shell diep paper using pigments derived from straw ash, pagoda tree flowers, and cinnabar.'
      },
      {
        id: 'y-yen',
        craftId: 1,
        name: 'Y Yen Bronze Casting',
        province: 'Nam Dinh',
        description: 'Centuries-old casting of temple bells, ceremonial censers, Buddha statues, and ritual artifacts.'
      },
      {
        id: 'chu-dau',
        craftId: 5,
        name: 'Chu Dau Celadon & Ash Glaze',
        province: 'Hai Duong',
        description: 'Noble spiritual pottery of the Ly-Tran dynasties featuring natural rice husk ash glaze and brushwork calligraphy.'
      }
    ]
  },

  BAC_TRUNG_BO: {
    id: 'BAC_TRUNG_BO',
    code: 'BAC_TRUNG_BO',
    name: 'North Central Coast',
    subName: 'Imperial City Heritage & Central Coastal Lands',
    color: '#5E4B7A',
    badgeBg: 'rgba(94, 75, 122, 0.15)',
    borderColor: '#5E4B7A',
    description:
      'Historic intersection of Nguyen royal court aesthetic and coastal folk craft: Devotional paper flowers, poetic conical hats, patterned sedge mats, and traditional wood carving.',
    provinces: [
      'Thanh Hoa',
      'Nghe An',
      'Ha Tinh',
      'Quang Binh',
      'Quang Tri',
      'Thua Thien Hue'
    ],
    crafts: [
      {
        id: 'thanh-tien',
        craftId: 26,
        name: 'Thanh Tien Paper Flowers',
        province: 'Thua Thien Hue',
        description: 'Five-color dyed paper folding art creating lotus and chrysanthemum blooms for ancestral reverence in Hue.'
      },
      {
        id: 'non-bai-tho',
        craftId: 8,
        name: 'Hue Poetic Conical Hat',
        province: 'Thua Thien Hue',
        description: 'Delicate palm and lotus leaf hat stitching, sandwiching poetic verses and scenic silhouettes visible under sunlight.'
      },
      {
        id: 'nga-son',
        craftId: 3,
        name: 'Nga Son Sedge Mats',
        province: 'Thanh Hoa',
        description: 'Pliable coastal sedge dyed in vivid hues, woven with longevity characters and auspicious motifs.'
      },
      {
        id: 'thai-yen',
        craftId: 11,
        name: 'Thai Yen Fine Woodworking',
        province: 'Ha Tinh',
        description: 'Traditional tenon-and-mortise joinery without metal nails, renowned for enduring durability across centuries.'
      }
    ]
  },

  NAM_TRUNG_BO: {
    id: 'NAM_TRUNG_BO',
    code: 'NAM_TRUNG_BO',
    name: 'South Central Coast',
    subName: 'Maritime Culture & Ancient Cham Heritage',
    color: '#266B88',
    badgeBg: 'rgba(38, 107, 136, 0.15)',
    borderColor: '#266B88',
    description:
      'White sands and bountiful coasts celebrating the synthesis of Vietnamese folk traditions and ancient Cham architectural art: Open-air fired pottery, marble sculpture, and phoenix brocade.',
    provinces: [
      'Da Nang',
      'Quang Nam',
      'Quang Ngai',
      'Binh Dinh',
      'Phu Yen',
      'Khanh Hoa',
      'Ninh Thuan',
      'Binh Thuan'
    ],
    crafts: [
      {
        id: 'thanh-ha',
        craftId: 4,
        name: 'Thanh Ha Terracotta Pottery',
        province: 'Quang Nam',
        description: 'Unglazed rustic earthenware shaped from Thu Bon river clay and wood-fired near ancient Hoi An.'
      },
      {
        id: 'non-nuoc',
        craftId: 11,
        name: 'Non Nuoc Marble Carving',
        province: 'Da Nang',
        description: 'Carving of natural Marble Mountain stone into lifelike Buddhist statues and relief sculptures.'
      },
      {
        id: 'bau-truc',
        craftId: 4,
        name: 'Bau Truc Cham Pottery (UNESCO)',
        province: 'Ninh Thuan',
        description: 'Ancient technique of walking backwards around stationary clay and firing outdoors with straw.'
      },
      {
        id: 'my-nghiep',
        craftId: 18,
        name: 'My Nghiep Cham Brocade',
        province: 'Ninh Thuan',
        description: 'Raised warp-weaving technique forming geometric diamonds, cloud scrolls, and phoenixes.'
      },
      {
        id: 'phu-gia',
        craftId: 10,
        name: 'Phu Gia Horse-Ribbon Hat',
        province: 'Binh Dinh',
        description: 'Resilient hat worn by historical Tay Son cavalry, crowned with chased silver or bronze finials.'
      }
    ]
  },

  TAY_NGUYEN: {
    id: 'TAY_NGUYEN',
    code: 'TAY_NGUYEN',
    name: 'Central Highlands',
    subName: 'Highland Gong Cultural Space',
    color: '#CE5C23',
    badgeBg: 'rgba(206, 92, 35, 0.15)',
    borderColor: '#CE5C23',
    description:
      'Legendary highlands celebrated for hand-loomed fiery brocades, resonant bamboo instruments, and raw funerary wood sculptures.',
    provinces: [
      'Kon Tum',
      'Gia Lai',
      'Dak Lak',
      'Dak Nong',
      'Lam Dong'
    ],
    crafts: [
      {
        id: 'tho-cam-e-de',
        craftId: 18,
        name: 'E-de & Ba-na Brocade Weaving',
        province: 'Dak Lak / Gia Lai',
        description: 'Fire dragon and geometric motifs woven on backstrap looms by indigenous communities.'
      },
      {
        id: 'nhac-cu-trung',
        craftId: 20,
        name: 'Bamboo Instruments & T\'rung Lute',
        province: 'Kon Tum',
        description: 'Transforming mountain bamboo into resonant instruments echoing streams and the spirit of gongs.'
      },
      {
        id: 'dan-gui-tay-nguyen',
        craftId: 2,
        name: 'Woven Bamboo & Rattan Backpack Basket',
        province: 'Dak Nong',
        description: 'Sturdy carrying baskets woven from split rattan and bamboo featuring geometric symbols.'
      },
      {
        id: 'tuong-go-nha-mo',
        craftId: 24,
        name: 'Folk Tomb Wood Sculpture',
        province: 'Gia Lai',
        description: 'Axe-carved forest timber sculpture expressing native metaphysics of life, death, and nature.'
      }
    ]
  },

  DONG_NAM_BO: {
    id: 'DONG_NAM_BO',
    code: 'DONG_NAM_BO',
    name: 'Southeast Region',
    subName: 'Southern Fine Arts & Craft Capital',
    color: '#8A5232',
    badgeBg: 'rgba(138, 82, 50, 0.15)',
    borderColor: '#8A5232',
    description:
      'Fertile ancient alluvium harboring large-scale southern handicraft traditions: Celadon and blue-and-white ceramics, luminous mother-of-pearl lacquerware, and sun-dried rice paper.',
    provinces: [
      'Binh Phuoc',
      'Tay Ninh',
      'Binh Duong',
      'Dong Nai',
      'Ba Ria - Vung Tau',
      'Ho Chi Minh City'
    ],
    crafts: [
      {
        id: 'lai-thieu',
        craftId: 15,
        name: 'Lai Thieu Earthenware & Stoneware',
        province: 'Binh Duong',
        description: 'Eel-glaze and blue-painted household ceramics serving southern daily life for over a century.'
      },
      {
        id: 'tuong-binh-hiep',
        craftId: 7,
        name: 'Tuong Binh Hiep Lacquerware',
        province: 'Binh Duong',
        description: 'Water-sanded lacquer inlaid with mother-of-pearl and gold leaf across 25 coating stages.'
      },
      {
        id: 'gom-bien-hoa',
        craftId: 17,
        name: 'Bien Hoa Ceramics & Buu Long Stone',
        province: 'Dong Nai',
        description: 'Harmonious blend of western ceramic glazes with eastern dragon and phoenix motifs.'
      },
      {
        id: 'banh-trang-trang-bang',
        craftId: 21,
        name: 'Trang Bang Dew-Wetted Rice Paper',
        province: 'Tay Ninh',
        description: 'National intangible heritage, double-layered rice paper baked and exposed to nocturnal dew.'
      }
    ]
  },

  TAY_NAM_BO: {
    id: 'TAY_NAM_BO',
    code: 'TAY_NAM_BO',
    name: 'Mekong Delta',
    subName: 'Waterways & Orchard Garden Civilization',
    color: '#327555',
    badgeBg: 'rgba(50, 117, 85, 0.15)',
    borderColor: '#327555',
    description:
      'Dense alluvial waterways giving birth to riverine and botanical craftsmanship: Red terracotta kiln kingdom, legendary ebony mac nua silk, sedge mat weaving, and coconut handicraft.',
    provinces: [
      'Long An',
      'Tien Giang',
      'Ben Tre',
      'Tra Vinh',
      'Vinh Long',
      'Dong Thap',
      'An Giang',
      'Kien Giang',
      'Can Tho',
      'Hau Giang',
      'Soc Trang',
      'Bac Lieu',
      'Ca Mau'
    ],
    crafts: [
      {
        id: 'dinh-yen',
        craftId: 3,
        name: 'Dinh Yen Patterned Sedge Mats',
        province: 'Dong Thap',
        description: 'Famous nighttime mat market of the Mekong, weaving five-color sedge into enduring tapestries.'
      },
      {
        id: 'mang-thit',
        craftId: 4,
        name: 'Mang Thit Red Ceramic Kilns',
        province: 'Vinh Long',
        description: 'Spectacular red-brick kiln kingdom along Co Chien River, unique alluvial architectural pottery.'
      },
      {
        id: 'lanh-my-a',
        craftId: 6,
        name: 'Tan Chau Lanh My A Ebony Silk',
        province: 'An Giang',
        description: 'Mulberry silk naturally dyed in mac nua berries, creating a glossy, cool-to-touch black fabric.'
      },
      {
        id: 'dua-ben-tre',
        craftId: 2,
        name: 'Ben Tre Coconut Handicrafts',
        province: 'Ben Tre',
        description: 'Crafting coconut timber, shells, and coir fibers into elegant functional and artistic wares.'
      }
    ]
  }
};

export const PROVINCE_TO_REGION_MAP = {};
for (const region of Object.values(CULTURAL_REGIONS)) {
  for (const province of region.provinces) {
    PROVINCE_TO_REGION_MAP[normalizeProvinceName(province)] = region.id;
  }
}

export function getRegionIdByProvince(provinceName) {
  if (!provinceName) return null;
  const normalized = normalizeProvinceName(provinceName);
  if (PROVINCE_TO_REGION_MAP[normalized]) {
    return PROVINCE_TO_REGION_MAP[normalized];
  }
  for (const [key, regionId] of Object.entries(PROVINCE_TO_REGION_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return regionId;
    }
  }
  return null;
}

export const SOVEREIGNTY_DATA = {
  type: 'FeatureCollection',
  features: [
    // 1. Paracel Islands (Da Nang City)
    {
      type: 'Feature',
      id: 'hoang-sa-main',
      properties: {
        id: 'hoang-sa',
        name: 'PARACEL ISLANDS',
        admin: 'Da Nang City, Vietnam',
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
      properties: { name: 'Triton Island', archipelago: 'hoang-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [111.2, 15.78] }
    },
    {
      type: 'Feature',
      properties: { name: 'Woody Island', archipelago: 'hoang-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [112.33, 16.83] }
    },
    {
      type: 'Feature',
      properties: { name: 'Pattle Island', archipelago: 'hoang-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [111.61, 16.53] }
    },

    // 2. Spratly Islands (Khanh Hoa Province)
    {
      type: 'Feature',
      id: 'truong-sa-main',
      properties: {
        id: 'truong-sa',
        name: 'SPRATLY ISLANDS',
        admin: 'Khanh Hoa Province, Vietnam',
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
      properties: { name: 'Southwest Cay', archipelago: 'truong-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [114.33, 11.43] }
    },
    {
      type: 'Feature',
      properties: { name: 'Namyit Island', archipelago: 'truong-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [114.36, 10.18] }
    },
    {
      type: 'Feature',
      properties: { name: 'Sin Cowe Island', archipelago: 'truong-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [114.31, 9.88] }
    },
    {
      type: 'Feature',
      properties: { name: 'Spratly Island', archipelago: 'truong-sa', type: 'island' },
      geometry: { type: 'Point', coordinates: [111.92, 8.64] }
    },

    // 3. Phu Quoc
    {
      type: 'Feature',
      properties: { name: 'Phu Quoc Island', admin: 'Kien Giang', type: 'island' },
      geometry: { type: 'Point', coordinates: [103.96, 10.23] }
    },
    // 4. Con Dao
    {
      type: 'Feature',
      properties: { name: 'Con Dao Archipelago', admin: 'Ba Ria - Vung Tau', type: 'island' },
      geometry: { type: 'Point', coordinates: [106.6, 8.68] }
    },
    // 5. East Sea
    {
      type: 'Feature',
      properties: {
        name: 'EAST SEA (VIETNAM)',
        subtext: 'SACRED NATIONAL MARITIME TERRITORY',
        type: 'sea-label'
      },
      geometry: {
        type: 'Point',
        coordinates: [111.5, 13.8]
      }
    }
  ]
};

export function getRegionBoundingBox(features = [], regionId = null) {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  const targetFeatures = regionId
    ? features.filter((f) => f.properties?.regionId === regionId)
    : features;

  if (targetFeatures.length === 0) {
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
