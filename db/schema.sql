-- =============================================================================
-- CRAFTROOTS DATABASE SCHEMA (PostgreSQL 14+)
-- Hệ thống Cổng Thông Tin Khám Phá Nghề Thủ Công Truyền Thống
-- Tuân thủ chuẩn kiến trúc dữ liệu data-design.md và tài liệu docs/data.md
-- =============================================================================

-- Thiết lập múi giờ UTC và bảng mã chuẩn
SET timezone = 'UTC';

-- Dọn dẹp bảng cũ nếu có (theo thứ tự phụ thuộc khóa ngoại)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS favourites CASCADE;
DROP TABLE IF EXISTS seasonal_collection_crafts CASCADE;
DROP TABLE IF EXISTS seasonal_collections CASCADE;
DROP TABLE IF EXISTS collection_crafts CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS craft_images CASCADE;
DROP TABLE IF EXISTS craft_techniques CASCADE;
DROP TABLE IF EXISTS craft_materials CASCADE;
DROP TABLE IF EXISTS craft_artisans CASCADE;
DROP TABLE IF EXISTS crafts CASCADE;
DROP TABLE IF EXISTS artisans CASCADE;
DROP TABLE IF EXISTS techniques CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS craft_categories CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Bảng USERS (Quản lý người dùng & phân quyền)
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
    avatar_url    TEXT,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 2. Bảng REGIONS (Vùng miền & Làng nghề địa phương)
CREATE TABLE regions (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    code        VARCHAR(50)  NOT NULL UNIQUE,
    description TEXT,
    image_url   TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 3. Bảng CRAFT_CATEGORIES (Danh mục phân loại nghề)
CREATE TABLE craft_categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url    TEXT
);

-- 4. Bảng MATERIALS (Chất liệu chế tác)
CREATE TABLE materials (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 5. Bảng TECHNIQUES (Kỹ thuật chế tác thủ công)
CREATE TABLE techniques (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 6. Bảng ARTISANS (Hồ sơ nghệ nhân & danh hiệu)
CREATE TABLE artisans (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    region_id           INT REFERENCES regions(id) ON DELETE SET NULL,
    title               VARCHAR(100), -- Ví dụ: Nghệ nhân Nhân dân, Nghệ nhân Ưu tú
    specialty           VARCHAR(150),
    years_of_experience INT CHECK (years_of_experience >= 0),
    biography           TEXT,
    avatar_url          TEXT,
    contact_info        VARCHAR(255),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 7. Bảng CRAFTS (Tác phẩm / Sản phẩm thủ công truyền thống)
CREATE TABLE crafts (
    id                SERIAL PRIMARY KEY,
    name              VARCHAR(150) NOT NULL,
    slug              VARCHAR(180) NOT NULL UNIQUE,
    region_id         INT NOT NULL REFERENCES regions(id) ON DELETE RESTRICT,
    category_id       INT NOT NULL REFERENCES craft_categories(id) ON DELETE RESTRICT,
    thumbnail_url     TEXT,
    short_description VARCHAR(500),
    cultural_context  TEXT,
    tools             TEXT,
    process           TEXT,
    traditional_use   TEXT,
    is_featured       BOOLEAN     NOT NULL DEFAULT FALSE,
    view_count        INT         NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Bảng CRAFT_ARTISANS (Quan hệ N-N: Nghệ nhân ↔ Sản phẩm) ⭐
CREATE TABLE craft_artisans (
    craft_id           INT NOT NULL REFERENCES crafts(id) ON DELETE CASCADE,
    artisan_id         INT NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
    role_title         VARCHAR(100) DEFAULT 'Chủ trì chế tác',
    contribution_notes TEXT,
    is_lead            BOOLEAN NOT NULL DEFAULT FALSE,
    display_order      INT NOT NULL DEFAULT 1,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (craft_id, artisan_id)
);

-- 9. Bảng CRAFT_MATERIALS (Quan hệ N-N: Sản phẩm ↔ Chất liệu)
CREATE TABLE craft_materials (
    craft_id    INT NOT NULL REFERENCES crafts(id) ON DELETE CASCADE,
    material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    PRIMARY KEY (craft_id, material_id)
);

-- 10. Bảng CRAFT_TECHNIQUES (Quan hệ N-N: Sản phẩm ↔ Kỹ thuật)
CREATE TABLE craft_techniques (
    craft_id     INT NOT NULL REFERENCES crafts(id) ON DELETE CASCADE,
    technique_id INT NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    PRIMARY KEY (craft_id, technique_id)
);

-- 11. Bảng CRAFT_IMAGES (Thư viện ảnh tương tác Lightbox)
CREATE TABLE craft_images (
    id            SERIAL PRIMARY KEY,
    craft_id      INT NOT NULL REFERENCES crafts(id) ON DELETE CASCADE,
    url           TEXT NOT NULL,
    alt_text      VARCHAR(255) NOT NULL,
    caption       VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Bảng COLLECTIONS (Bộ sưu tập chuyên đề thông thường)
CREATE TABLE collections (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(150) NOT NULL,
    slug        VARCHAR(180) NOT NULL UNIQUE,
    description TEXT,
    banner_url  TEXT,
    is_featured BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Bảng COLLECTION_CRAFTS (Quan hệ N-N: Bộ sưu tập ↔ Sản phẩm)
CREATE TABLE collection_crafts (
    collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    craft_id      INT NOT NULL REFERENCES crafts(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, craft_id)
);

-- 14. Bảng SEASONAL_COLLECTIONS (Bộ sưu tập theo mùa: Xuân, Hạ, Thu, Đông) ⭐
CREATE TABLE seasonal_collections (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(150) NOT NULL,
    slug          VARCHAR(180) NOT NULL UNIQUE,
    season_code   VARCHAR(20)  NOT NULL CHECK (season_code IN ('summer', 'spring', 'autumn', 'winter')),
    year          INT          NOT NULL CHECK (year >= 2000),
    theme_concept TEXT,
    banner_url    TEXT,
    color_tone    VARCHAR(30)  DEFAULT '#0ea5e9',
    start_date    DATE         NOT NULL,
    end_date      DATE         NOT NULL CHECK (end_date >= start_date),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 15. Bảng SEASONAL_COLLECTION_CRAFTS (Quan hệ N-N: Sản phẩm thuộc Bộ sưu tập mùa) ⭐
CREATE TABLE seasonal_collection_crafts (
    seasonal_collection_id INT NOT NULL REFERENCES seasonal_collections(id) ON DELETE CASCADE,
    craft_id               INT NOT NULL REFERENCES crafts(id) ON DELETE CASCADE,
    curator_note           TEXT,
    highlight_badge        VARCHAR(50),
    is_hero                BOOLEAN NOT NULL DEFAULT FALSE,
    display_order          INT     NOT NULL DEFAULT 1,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (seasonal_collection_id, craft_id)
);

-- 16. Bảng FAVOURITES (Danh sách yêu thích của người dùng)
CREATE TABLE favourites (
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    craft_id   INT NOT NULL REFERENCES crafts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, craft_id)
);

-- 17. Bảng CONTACT_MESSAGES (Tin nhắn từ form liên hệ)
CREATE TABLE contact_messages (
    id         SERIAL PRIMARY KEY,
    full_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(30),
    subject    VARCHAR(200),
    message    TEXT NOT NULL,
    status     VARCHAR(30) NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- HỆ THỐNG CHỈ MỤC TỐI ƯU HIỆU NĂNG (INDEXES)
-- =============================================================================

-- Chỉ mục lọc và sắp xếp sản phẩm
CREATE INDEX idx_crafts_region ON crafts(region_id);
CREATE INDEX idx_crafts_category ON crafts(category_id);
CREATE INDEX idx_crafts_featured ON crafts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_crafts_created_at ON crafts(created_at DESC);

-- Chỉ mục bảng nối N-N nghệ nhân - sản phẩm
CREATE INDEX idx_craft_artisans_artisan ON craft_artisans(artisan_id);
CREATE INDEX idx_craft_artisans_lead ON craft_artisans(craft_id, is_lead);

-- Chỉ mục bảng nối N-N chất liệu và kỹ thuật
CREATE INDEX idx_craft_materials_mat ON craft_materials(material_id);
CREATE INDEX idx_craft_techniques_tech ON craft_techniques(technique_id);
CREATE INDEX idx_collection_crafts_craft ON collection_crafts(craft_id);

-- Chỉ mục bộ sưu tập theo mùa
CREATE INDEX idx_seasonal_collections_active ON seasonal_collections(is_active, season_code, year);
CREATE INDEX idx_seasonal_collections_dates ON seasonal_collections(start_date, end_date);
CREATE INDEX idx_sc_crafts_craft ON seasonal_collection_crafts(craft_id);
CREATE INDEX idx_sc_crafts_hero ON seasonal_collection_crafts(seasonal_collection_id, is_hero);

-- Chỉ mục gallery ảnh
CREATE INDEX idx_craft_images_craft_order ON craft_images(craft_id, display_order);

-- Chỉ mục Full-Text Search PostgreSQL (GIN Index)
CREATE INDEX idx_crafts_fts ON crafts USING gin (
    to_tsvector('simple', name || ' ' || COALESCE(cultural_context, '') || ' ' || COALESCE(short_description, ''))
);
