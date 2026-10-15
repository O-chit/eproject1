-- =============================================================================
-- MIGRATION 001: EXPAND CRAFTROOTS SCHEMA
-- Idempotent schema expansion for CraftRoots Platform Upgrade
-- =============================================================================

BEGIN;

-- 1. Kích hoạt Extension Unaccent & pg_trgm (nếu có quyền trên server)
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS unaccent;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Không thể kích hoạt extension unaccent: %', SQLERRM;
END $$;

DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Không thể kích hoạt extension pg_trgm: %', SQLERRM;
END $$;

-- 2. Bảng REGIONS: Bổ sung các cột thông số và bản đồ văn hóa 6 vùng
ALTER TABLE regions ADD COLUMN IF NOT EXISTS map_key VARCHAR(50);
ALTER TABLE regions ADD COLUMN IF NOT EXISTS craft_summary TEXT;
ALTER TABLE regions ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE regions ADD COLUMN IF NOT EXISTS registered_village_count INT NOT NULL DEFAULT 0;
ALTER TABLE regions ADD COLUMN IF NOT EXISTS national_heritage_count INT NOT NULL DEFAULT 0;
ALTER TABLE regions ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;

-- 3. Tạo bảng Làng nghề truyền thống (CRAFT_VILLAGES)
CREATE TABLE IF NOT EXISTS craft_villages (
    id SERIAL PRIMARY KEY,
    region_id INT REFERENCES regions(id) ON DELETE SET NULL,
    category_id INT REFERENCES craft_categories(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    district VARCHAR(100),
    province VARCHAR(100),
    century_label VARCHAR(100),
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'craft_villages_slug_unique') THEN
        ALTER TABLE craft_villages ADD CONSTRAINT craft_villages_slug_unique UNIQUE (slug);
    END IF;
END $$;

-- 4. Bảng ARTISANS: Mở rộng các trường định danh, kỹ pháp và quy trình ghé thăm
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS slug VARCHAR(180);
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS village_id INT REFERENCES craft_villages(id) ON DELETE SET NULL;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS age INT;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS generation INT;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS quote TEXT;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS signature_work TEXT;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS technique_summary TEXT;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS technique_specs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS verification_label VARCHAR(255);
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS is_national_heritage BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS visit_max_guests INT NOT NULL DEFAULT 6;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS visit_lead_time_hours INT NOT NULL DEFAULT 48;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS visit_open_days INT[] DEFAULT '{2,3,4,5,6,7}';
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS visit_hours VARCHAR(100) DEFAULT '09:00 - 17:30';
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS visit_address TEXT;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS lat NUMERIC(10, 6);
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS lng NUMERIC(10, 6);
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'artisans_code_unique') THEN
        ALTER TABLE artisans ADD CONSTRAINT artisans_code_unique UNIQUE (code);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'artisans_slug_unique') THEN
        ALTER TABLE artisans ADD CONSTRAINT artisans_slug_unique UNIQUE (slug);
    END IF;
END $$;

-- 5. Bảng CRAFTS: Mở rộng các trường mã SKU, định giá, thông số kỹ thuật, quy trình
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS code VARCHAR(100);
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS price_vnd BIGINT;
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS tag VARCHAR(150);
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS origin_line VARCHAR(200);
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS era VARCHAR(100);
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS dimensions VARCHAR(150);
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS process_stages JSONB DEFAULT '[]'::jsonb;
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS batch_note TEXT;
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS village_id INT REFERENCES craft_villages(id) ON DELETE SET NULL;
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS is_spotlight BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE crafts ADD COLUMN IF NOT EXISTS handmade BOOLEAN NOT NULL DEFAULT TRUE;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'crafts_code_unique') THEN
        ALTER TABLE crafts ADD CONSTRAINT crafts_code_unique UNIQUE (code);
    END IF;
END $$;

-- 6. Tạo bảng Niên biểu mốc son nghệ nhân (ARTISAN_MILESTONES)
CREATE TABLE IF NOT EXISTS artisan_milestones (
    id SERIAL PRIMARY KEY,
    artisan_id INT NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
    year VARCHAR(50) NOT NULL,
    event TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tạo bảng Đăng ký ghé thăm xưởng chế tác (VISIT_BOOKINGS)
CREATE TABLE IF NOT EXISTS visit_bookings (
    id SERIAL PRIMARY KEY,
    artisan_id INT NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    visit_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL CHECK (time_slot IN ('morning', 'afternoon')),
    purpose VARCHAR(200) NOT NULL,
    note TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tạo bảng Đăng ký nhận bản tin di sản (NEWSLETTER_SUBSCRIBERS)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_email_lower ON newsletter_subscribers (LOWER(email));

-- 9. Tạo bảng Ký họa điền dã (FIELD_NOTES)
CREATE TABLE IF NOT EXISTS field_notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    image_url TEXT,
    caption VARCHAR(255),
    coordinates VARCHAR(100),
    metrics JSONB DEFAULT '[]'::jsonb,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Bảng SEASONAL_COLLECTIONS: Bổ sung triết lý mùa, quy chuẩn giám tuyển
ALTER TABLE seasonal_collections ADD COLUMN IF NOT EXISTS philosophy_quote TEXT;
ALTER TABLE seasonal_collections ADD COLUMN IF NOT EXISTS quote_source VARCHAR(200);
ALTER TABLE seasonal_collections ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE seasonal_collections ADD COLUMN IF NOT EXISTS process_steps JSONB DEFAULT '[]'::jsonb;
ALTER TABLE seasonal_collections ADD COLUMN IF NOT EXISTS archive_code VARCHAR(100);

-- 11. Bảng CONTACT_MESSAGES: Bổ sung chủ đề và gắn kết user
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS topic VARCHAR(100) DEFAULT 'other';

-- 12. Chỉ mục hiệu năng cao (INDEXES)
CREATE INDEX IF NOT EXISTS idx_crafts_code ON crafts(code);
CREATE INDEX IF NOT EXISTS idx_crafts_village ON crafts(village_id);
CREATE INDEX IF NOT EXISTS idx_artisans_slug ON artisans(slug);
CREATE INDEX IF NOT EXISTS idx_artisans_code ON artisans(code);
CREATE INDEX IF NOT EXISTS idx_artisans_village ON artisans(village_id);
CREATE INDEX IF NOT EXISTS idx_artisan_milestones_artisan ON artisan_milestones(artisan_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_visit_bookings_lookup ON visit_bookings(artisan_id, visit_date);
CREATE INDEX IF NOT EXISTS idx_craft_villages_region ON craft_villages(region_id);
CREATE INDEX IF NOT EXISTS idx_craft_villages_slug ON craft_villages(slug);

COMMIT;
