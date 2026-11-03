/**
 * Traditional Craft Villages Spatial Atlas Data (CraftRoots Cultural Atlas)
 * WGS84 Coordinates: [Longitude, Latitude]
 */

export const CRAFT_CATEGORIES = {
  ceramics: {
    id: 'ceramics',
    label: 'Ceramics & Antique Glaze',
    color: '#B86B35',
    icon: 'local_fire_department'
  },
  textiles: {
    id: 'textiles',
    label: 'Heritage Silk & Brocade',
    color: '#2A7B68',
    icon: 'texture'
  },
  bamboo: {
    id: 'bamboo',
    label: 'Bamboo & Rattan Weaving',
    color: '#D49B35',
    icon: 'grid_goldenratio'
  },
  lacquer: {
    id: 'lacquer',
    label: 'Lacquerware & Eggshell Inlay',
    color: '#A82D2D',
    icon: 'palette'
  },
  metalsmith: {
    id: 'metalsmith',
    label: 'Metalsmithing & Silverwork',
    color: '#6B7280',
    icon: 'hardware'
  }
};

export const CRAFT_VILLAGES = [
  // --- RED RIVER DELTA ---
  {
    id: 'bat-trang',
    name: 'Bat Trang Ceramics',
    category: 'ceramics',
    categoryLabel: 'Stoneware Ceramics',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Red River Delta',
    province: 'Gia Lam, Hanoi',
    coordinates: [105.9142, 20.9782],
    established: '14th Century (~700 years)',
    artisansCount: 45,
    craftsCount: 18,
    description: 'The cradle of antique crackle and blue-and-white ceramics, celebrated for traditional wood-firing kilns resurrecting royal Ly-Tran pottery.',
    representativeArtisan: 'Master Tran Do',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 1,
    featured: true
  },
  {
    id: 'van-phuc',
    name: 'Van Phuc Mulberry Silk',
    category: 'textiles',
    categoryLabel: 'Heritage Silk',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Red River Delta',
    province: 'Ha Dong, Hanoi',
    coordinates: [105.7725, 20.9774],
    established: 'Over 1,000 years (Dinh - Early Le)',
    artisansCount: 28,
    craftsCount: 12,
    description: 'Premier silk of the ancient capital. Famous for traditional sunken damask patterns, warm in winter and cool in summer, once presented to the royal court.',
    representativeArtisan: 'Master Do Van Hien',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 2,
    featured: true
  },
  {
    id: 'dong-ho',
    name: 'Dong Ho Folk Woodcut Prints',
    category: 'lacquer',
    categoryLabel: 'Woodblock & Diep Paper',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Red River Delta',
    province: 'Thuan Thanh, Bac Ninh',
    coordinates: [106.0712, 21.0543],
    established: '16th Century (~500 years)',
    artisansCount: 14,
    craftsCount: 9,
    description: 'Rustic essence of rural Kinh Bac. Hand-carved woodblocks printed on scallop-shell diep paper using natural pigments from straw ash, pagoda flowers, and vermilion.',
    representativeArtisan: 'Master Nguyen Dang Che',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
    craftId: 3,
    featured: true
  },
  {
    id: 'chu-dau',
    name: 'Chu Dau Pottery',
    category: 'ceramics',
    categoryLabel: 'Ancient Ash Glaze',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Red River Delta',
    province: 'Nam Sach, Hai Duong',
    coordinates: [106.3312, 20.9856],
    established: '14th - 15th Century',
    artisansCount: 22,
    craftsCount: 15,
    description: 'Spiritual pottery of pure East Asian beauty, with natural rice husk ash glaze exhibited across 46 major museums worldwide.',
    representativeArtisan: 'Master Ha Thi Cuc',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 1,
    featured: false
  },
  {
    id: 'phu-vinh',
    name: 'Phu Vinh Bamboo & Rattan',
    category: 'bamboo',
    categoryLabel: 'Hexagonal Weaving',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Red River Delta',
    province: 'Chuong My, Hanoi',
    coordinates: [105.6987, 20.9234],
    established: '17th Century (~400 years)',
    artisansCount: 31,
    craftsCount: 14,
    description: 'Celebrated for rattan strands scraped as fine as thread, woven tightly without visible joints into elegant tea caddies and incense trays.',
    representativeArtisan: 'Master Nguyen Van Trung',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 5,
    featured: true
  },
  {
    id: 'ha-thai',
    name: 'Ha Thai Lacquerware',
    category: 'lacquer',
    categoryLabel: 'Black Lacquer & Inlay',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Red River Delta',
    province: 'Thuong Tin, Hanoi',
    coordinates: [105.8612, 20.8931],
    established: '17th Century',
    artisansCount: 25,
    craftsCount: 11,
    description: 'Specializes in ceremonial panels and paintings inlaid with mother-of-pearl and eggshell for traditional pagodas and grand residences.',
    representativeArtisan: 'Master Do Van Trinh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
    craftId: 6,
    featured: true
  },
  {
    id: 'dong-xam',
    name: 'Dong Xam Silver Chasing',
    category: 'metalsmith',
    categoryLabel: 'Silver Chasing & Jewelry',
    regionId: 'dong-bang-bac-bo',
    regionName: 'Red River Delta',
    province: 'Kien Xuong, Thai Binh',
    coordinates: [106.4215, 20.4321],
    established: 'Over 500 years (15th Century)',
    artisansCount: 19,
    craftsCount: 8,
    description: 'Chasing delicate floral relief patterns on fine silver sheets with fluid lines meeting high jewelry benchmarks.',
    representativeArtisan: 'Master Dinh Quang Thang',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: true
  },

  // --- NORTHWEST ---
  {
    id: 'mai-chau',
    name: 'Mai Chau Brocade Weaving',
    category: 'textiles',
    categoryLabel: 'White Thai Brocade',
    regionId: 'tay-bac',
    regionName: 'Northwest',
    province: 'Lac Village, Hoa Binh',
    coordinates: [105.0212, 20.6654],
    established: '17th Century (~400 years)',
    artisansCount: 20,
    craftsCount: 10,
    description: 'Looms weaving diamond patterns naturally dyed with wild indigo and mountain root extracts by White Thai artisans.',
    representativeArtisan: 'Master Vi Thi Oanh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 2,
    featured: true
  },
  {
    id: 'bac-ha',
    name: 'Bac Ha Blacksmithing',
    category: 'metalsmith',
    categoryLabel: 'Forged Iron & Blades',
    regionId: 'tay-bac',
    regionName: 'Northwest',
    province: 'Bac Ha, Lao Cai',
    coordinates: [104.2856, 22.5342],
    established: 'Ancestral Hmong lineage',
    artisansCount: 12,
    craftsCount: 6,
    description: 'Hammer-forged over ironwood charcoal with cold water quenching, creating razor-sharp and resilient mountain blades.',
    representativeArtisan: 'Blacksmith Giang A Pao',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: false
  },

  // --- NORTHEAST ---
  {
    id: 'quang-uyen',
    name: 'Nung Handcrafted Mulberry Paper',
    category: 'textiles',
    categoryLabel: 'Paperbark Craft',
    regionId: 'dong-bac',
    regionName: 'Northeast',
    province: 'Quang Uyen, Cao Bang',
    coordinates: [106.4523, 22.7123],
    established: '18th Century (~300 years)',
    artisansCount: 16,
    craftsCount: 7,
    description: 'Handmade from natural paper mulberry soaked in stream limestone water, creating supple paper for imperial edicts and calligraphy.',
    representativeArtisan: 'Master Nong Van Luong',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
    craftId: 3,
    featured: true
  },

  // --- NORTH CENTRAL COAST ---
  {
    id: 'phu-cam',
    name: 'Phu Cam Poetic Conical Hat',
    category: 'bamboo',
    categoryLabel: 'Leaf Hat & Poem Inlay',
    regionId: 'bac-trung-bo',
    regionName: 'North Central Coast',
    province: 'Hue City, Thua Thien Hue',
    coordinates: [107.5912, 16.4623],
    established: '19th Century (Nguyen Dynasty)',
    artisansCount: 22,
    craftsCount: 8,
    description: 'Poetic symbol of the ancient capital. Verses and Thien Mu pagoda silhouettes are delicately sewn between leaf layers, visible against sunlight.',
    representativeArtisan: 'Master Bui Thi Nga',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 5,
    featured: true
  },
  {
    id: 'duc-dong-hue',
    name: 'Hue Royal Bronze Casting',
    category: 'metalsmith',
    categoryLabel: 'Temple Bells & Urns',
    regionId: 'bac-trung-bo',
    regionName: 'North Central Coast',
    province: 'Phuong Duc, Hue City',
    coordinates: [107.5712, 16.4521],
    established: '17th Century (~400 years)',
    artisansCount: 18,
    craftsCount: 9,
    description: 'Cradle of the Nine Dynastic Urns, massive bronze cauldrons, and sacred temple bells resonating throughout imperial shrines.',
    representativeArtisan: 'Master Nguyen Van Sinh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: false
  },

  // --- SOUTH CENTRAL COAST ---
  {
    id: 'kim-bong',
    name: 'Kim Bong Fine Woodworking',
    category: 'bamboo',
    categoryLabel: 'Historic Joinery & Carving',
    regionId: 'duyen-hai-nam-trung-bo',
    regionName: 'South Central Coast',
    province: 'Cam Kim, Hoi An, Quang Nam',
    coordinates: [108.3245, 15.8712],
    established: '16th Century (~500 years)',
    artisansCount: 26,
    craftsCount: 14,
    description: 'Master craftsmen behind the Japanese Covered Bridge, ancient Hoi An houses, and ocean-going merchant vessels.',
    representativeArtisan: 'Master Huynh Ri',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 5,
    featured: true
  },
  {
    id: 'non-nuoc',
    name: 'Non Nuoc Marble Sculpture',
    category: 'metalsmith',
    categoryLabel: 'Stone & Marble Carving',
    regionId: 'duyen-hai-nam-trung-bo',
    regionName: 'South Central Coast',
    province: 'Ngu Hanh Son, Da Nang',
    coordinates: [108.2612, 16.0023],
    established: '17th Century (~400 years)',
    artisansCount: 30,
    craftsCount: 12,
    description: 'Chiseled from natural Marble Mountain stone into lifelike Buddhist statues, relief sculptures, and fine decorative art.',
    representativeArtisan: 'Master Nguyen Long Buu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: true
  },
  {
    id: 'bau-truc',
    name: 'Bau Truc Cham Pottery (UNESCO)',
    category: 'ceramics',
    categoryLabel: 'Primitive Open-Air Firing',
    regionId: 'duyen-hai-nam-trung-bo',
    regionName: 'South Central Coast',
    province: 'Ninh Phuoc, Ninh Thuan',
    coordinates: [108.9512, 11.5345],
    established: 'Millennia-old (UNESCO Heritage)',
    artisansCount: 35,
    craftsCount: 16,
    description: 'One of the oldest pottery villages in Southeast Asia. Cham women shape clay while walking backwards around stationary pedestals, fired outdoors under dry straw.',
    representativeArtisan: 'Master Dang Thi Phan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 1,
    featured: true
  },

  // --- CENTRAL HIGHLANDS ---
  {
    id: 'tho-cam-e-de',
    name: 'E De Brocade Weaving',
    category: 'textiles',
    categoryLabel: 'K’teh Patterned Brocade',
    regionId: 'tay-nguyen',
    regionName: 'Central Highlands',
    province: 'Buon Ma Thuot, Dak Lak',
    coordinates: [108.0456, 12.6712],
    established: 'Ancestral Highland Heritage',
    artisansCount: 18,
    craftsCount: 11,
    description: 'Woven on backstrap looms with iconic red-and-black K’teh ribbons symbolizing the primordial energy of the mountains, lightning, and matriarchal lineage.',
    representativeArtisan: 'Master H’Nen Nie',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 2,
    featured: true
  },
  {
    id: 'cong-chieng-gia-lai',
    name: 'Gong Crafting Cultural Space (UNESCO)',
    category: 'metalsmith',
    categoryLabel: 'Gong Tuning & Resonant Bronze',
    regionId: 'tay-nguyen',
    regionName: 'Central Highlands',
    province: 'Pleiku, Gia Lai',
    coordinates: [107.9912, 13.9823],
    established: 'UNESCO Intangible Heritage',
    artisansCount: 15,
    craftsCount: 6,
    description: 'Tuning bronze gongs to deep resonant tones connecting the human spirit to forest deities across the high plateau.',
    representativeArtisan: 'Master Ro Cham Tih',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 7,
    featured: false
  },

  // --- SOUTHERN VIETNAM ---
  {
    id: 'gom-vinh-long',
    name: 'Mang Thit Red Ceramics',
    category: 'ceramics',
    categoryLabel: 'Red Terracotta & Rice Husk Firing',
    regionId: 'nam-bo',
    regionName: 'Southern Vietnam',
    province: 'Mang Thit, Vinh Long',
    coordinates: [106.0512, 10.2212],
    established: 'Early 20th Century (~100 years)',
    artisansCount: 28,
    craftsCount: 13,
    description: 'The famed "Kingdom of Red Brick Kilns" along Co Chien River. Fine alluvial clay fired with rice husks creates a natural pinkish-red hue with white powder frost.',
    representativeArtisan: 'Master Nguyen Van Ba',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPqVB29zrrSLvms7kX-UCaPWVzXrcxU9JI2GrFfhYZg-baDNQ8C-la0zcW-1ODkIm1ETZsvurxbm5nQdO9ZG-NP6llMvttfhS2uIL5ZuorEkqQWxYsH1rtofe6xSdVi1FDFHRlc97kJyJsLh1kT5Y5Il2M3KmIXxVVGHxOxBjAyQer8WuhvNjIAu1N4wsHP-eflzqiX47tx0cFeDbiAyRKR4KN2JSI43s0cbQcEjQ',
    craftId: 1,
    featured: true
  },
  {
    id: 'chieu-dinh-yen',
    name: 'Dinh Yen Patterned Sedge Mats',
    category: 'bamboo',
    categoryLabel: 'Patterned Sedge Weaving',
    regionId: 'nam-bo',
    regionName: 'Southern Vietnam',
    province: 'Lap Vo, Dong Thap',
    coordinates: [105.5123, 10.3512],
    established: 'Over 100 years',
    artisansCount: 20,
    craftsCount: 9,
    description: 'Renowned for the legendary Mekong "Night Mat Market". Sun-dried sedge dyed in rich red, yellow, and green is woven into enduring butterfly and longevity tapestries.',
    representativeArtisan: 'Master Le Thi Cam',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOrVNjf9f7IKbC_-qADYx1m001kSV0GrFDfeZPdadK-NxTvTr-AthaAaQJqOpg5czxAcjcbjKW1ffT2roUDqJyldZJ2EFa_2X_swADzeYS8FGDfvVSTFjJqfyNf32PGwoZwr36-lpRD6NmpROI9j2tpiHRisAmmEB2HmM-DMi63QyqP1yfVUK2nWJ-r14mk_vx5dnJKmRGJ03B2IEboUjQ0Q82mujGYiGdpbbI3s',
    craftId: 5,
    featured: true
  },
  {
    id: 'son-mai-tuong-binh-hiep',
    name: 'Tuong Binh Hiep Lacquerware',
    category: 'lacquer',
    categoryLabel: 'Water Sanding & Shell Inlay',
    regionId: 'nam-bo',
    regionName: 'Southern Vietnam',
    province: 'Thu Dau Mot, Binh Duong',
    coordinates: [106.6345, 10.9856],
    established: '18th Century (~300 years)',
    artisansCount: 22,
    craftsCount: 10,
    description: 'Meticulous water-sanding through 25 layers of natural lacquer, inlaid with mother-of-pearl and dusted with shimmering gold and silver leaf.',
    representativeArtisan: 'Master Truong Quan Tinh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8tshyqb1Q9ovtSBPMtfvBY2G7hTqNyfC-aXbp4ZNcRGumjyjIMYBxS0g3hLhjtkQBqMVcWC8jtFEUAHHq6DfZd_O6dzUNy9e7N9CwVNExnOTy4eonnwdpAbQ_TFmZFcZT_NoK7zX-d6IHTqXAl7sQJfMV-D64FYJtnBT-udMBnBGl5YQiBa5_ZZ8iGd5gqrcLMrfDshuBetswjs8IEaUx4xwIteeMrqQkgbYOxM',
    craftId: 6,
    featured: true
  }
];

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

export const CRAFT_REGIONS = [
  {
    id: 1,
    code: 'dong-bang-bac-bo',
    name: 'Red River Delta',
    description: 'Cradle of wet-rice civilization, home to celebrated craft villages: Bat Trang Ceramics, Van Phuc Silk, Dong Ho Prints, Chu Dau Pottery.',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    code: 'tay-bac',
    name: 'Northwest',
    description: 'Magnificent Northwest highlands, birthplace of Hmong, Thai, and Dao brocade, along with blacksmithing and ancestral silverwork.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    code: 'dong-bac',
    name: 'Northeast',
    description: 'Northeastern karst landscape known for indigenous conical hats, Phuc Sen blacksmithing, bamboo weaving, and traditional indigo dyeing.',
    imageUrl: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    code: 'bac-trung-bo',
    name: 'North Central Coast',
    description: 'Heritage corridor of central Vietnam known for Ke Mon goldsmithing, Thanh Tien paper flowers, My Xuyen fine woodworking, and Phuoc Tich pottery.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    code: 'duyen-hai-nam-trung-bo',
    name: 'South Central Coast',
    description: 'Realm of white sands and open sea, famed for Bau Truc Cham pottery (UNESCO Heritage), My Nghiep brocade, and Non Nuoc marble carving.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    code: 'tay-nguyen',
    name: 'Central Highlands',
    description: 'Central Highlands gong cultural space, renowned for folk funerary wood sculpture, highland brocade weaving, and patterned backpack baskets.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 7,
    code: 'nam-bo',
    name: 'Southern Vietnam',
    description: 'Bountiful southern waterways with Lai Thieu - Bien Hoa blue-glazed pottery, Tan Chau Lanh My A ebony silk, water hyacinth weaving, and Dinh Yen mats.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  }
];
