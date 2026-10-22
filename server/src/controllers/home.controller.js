const db = require('../config/db');
const { success, error } = require('../utils/response');
const { craftSummarySelect, craftSummaryFrom } = require('../utils/craftHelper');

/**
 * Dữ liệu tổng hợp hiển thị trang chủ CraftRoots
 * GET /api/home
 */
const getHome = async (req, res, next) => {
  try {
    // 1. Tác phẩm Spotlight (CR-BT-2025-08MR hoặc is_spotlight = true)
    const spotlightSql = `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.code AS sku,
        c.price_vnd AS "priceVnd",
        c.tag,
        c.origin_line AS "originLine",
        c.thumbnail_url AS "thumbnailUrl",
        c.short_description AS "shortDescription",
        c.cultural_context AS "culturalContext",
        c.specs,
        c.process_stages AS "processStages",
        r.name AS region,
        cat.name AS category,
        cv.name AS village
      FROM crafts c
      JOIN regions r ON c.region_id = r.id
      JOIN craft_categories cat ON c.category_id = cat.id
      LEFT JOIN craft_villages cv ON c.village_id = cv.id
      WHERE c.is_spotlight = true OR c.code = 'CR-BT-2025-08MR'
      ORDER BY c.is_spotlight DESC, c.id ASC
      LIMIT 1
    `;
    const spotlightRes = await db.query(spotlightSql);

    // 2. Chỉ số thống kê toàn hệ thống
    const statsSql = `
      SELECT
        (SELECT COUNT(*)::int FROM crafts) AS "craftsCount",
        (SELECT COUNT(*)::int FROM artisans) AS "artisansCount",
        (SELECT COUNT(*)::int FROM craft_villages) AS "villagesCount",
        (SELECT COUNT(*)::int FROM regions) AS "regionsCount",
        (SELECT COUNT(*)::int FROM craft_categories) AS "categoriesCount",
        (SELECT COUNT(*)::int FROM artisans WHERE is_national_heritage = true) AS "nationalHeritageCount"
    `;
    const statsRes = await db.query(statsSql);

    // 3. Tác phẩm tiêu biểu (Featured Crafts)
    const featuredCraftsSql = `
      SELECT ${craftSummarySelect}
      ${craftSummaryFrom}
      WHERE c.is_featured = true
      ORDER BY c.created_at DESC
      LIMIT 6
    `;
    const featuredCraftsRes = await db.query(featuredCraftsSql);

    // 4. Nghệ nhân hàng đầu (Top Artisans)
    const topArtisansSql = `
      SELECT
        a.id,
        a.name AS "fullName",
        a.name,
        a.code AS "refCode",
        a.slug,
        a.title,
        a.specialty,
        a.years_of_experience AS "yearsOfExperience",
        r.name AS "regionName",
        cv.name AS "villageName",
        a.avatar_url AS "avatarUrl",
        a.avatar_url AS avatar,
        a.is_national_heritage AS "isNationalHeritage"
      FROM artisans a
      LEFT JOIN regions r ON a.region_id = r.id
      LEFT JOIN craft_villages cv ON a.village_id = cv.id
      ORDER BY a.sort_order ASC, a.years_of_experience DESC
      LIMIT 4
    `;
    const topArtisansRes = await db.query(topArtisansSql);

    // 5. Bộ sưu tập mùa mới nhất (Latest Seasonal Collection)
    const latestSeasonalSql = `
      SELECT
        sc.id,
        sc.title,
        sc.slug,
        sc.archive_code AS code,
        sc.season_code AS "seasonCode",
        sc.year,
        sc.color_tone AS "colorTone",
        sc.banner_url AS "bannerUrl",
        sc.theme_concept AS "themeConcept"
      FROM seasonal_collections sc
      WHERE sc.is_active = true
      ORDER BY sc.year DESC, sc.id DESC
      LIMIT 1
    `;
    const latestSeasonalRes = await db.query(latestSeasonalSql);

    // 6. Ký họa thực địa điền dã (Field Notes)
    const fieldNotesSql = `
      SELECT
        fn.id,
        fn.title,
        fn.body,
        fn.body AS excerpt,
        fn.image_url AS "coverImage",
        fn.image_url AS "imageUrl",
        fn.caption,
        fn.coordinates,
        fn.metrics,
        fn.created_at AS "createdAt"
      FROM field_notes fn
      WHERE fn.is_published = true
      ORDER BY fn.sort_order ASC, fn.created_at DESC
      LIMIT 3
    `;
    const fieldNotesRes = await db.query(fieldNotesSql);

    return res.status(200).json({
      success: true,
      data: {
        spotlightCraft: spotlightRes.rows[0] || null,
        stats: statsRes.rows[0],
        featuredCrafts: featuredCraftsRes.rows,
        topArtisans: topArtisansRes.rows,
        latestSeasonal: latestSeasonalRes.rows[0] || null,
        fieldNotes: fieldNotesRes.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Thống kê số lượng động toàn hệ thống
 * GET /api/stats
 */
const getStats = async (req, res, next) => {
  try {
    const statsSql = `
      SELECT
        (SELECT COUNT(*)::int FROM crafts) AS crafts,
        (SELECT COUNT(*)::int FROM artisans) AS artisans,
        (SELECT COUNT(*)::int FROM craft_villages) AS villages,
        (SELECT COUNT(*)::int FROM regions) AS regions,
        (SELECT COUNT(*)::int FROM craft_categories) AS categories,
        (SELECT COUNT(*)::int FROM artisans WHERE is_national_heritage = true) AS "nationalHeritages"
    `;
    const statsRes = await db.query(statsSql);
    return res.status(200).json({
      success: true,
      data: statsRes.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Tìm kiếm toàn diện đa thực thể
 * GET /api/search
 */
const search = async (req, res, next) => {
  try {
    const { q, type = 'all', limit = 6 } = req.query;

    if (!q || q.trim() === '') {
      return error(res, 400, 'BAD_REQUEST', 'Từ khóa tìm kiếm (q) không được để trống');
    }

    const keyword = `%${q.trim()}%`;
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 6));

    const result = {
      crafts: [],
      artisans: [],
      villages: [],
    };

    // Tìm kiếm Tác phẩm
    if (type === 'all' || type === 'crafts') {
      const craftsRes = await db.query(
        `SELECT
          c.id, c.name, c.slug, c.code AS sku, c.price_vnd AS "priceVnd",
          c.thumbnail_url AS "thumbnailUrl", c.short_description AS "shortDescription",
          r.name AS region, cat.name AS category
         FROM crafts c
         JOIN regions r ON c.region_id = r.id
         JOIN craft_categories cat ON c.category_id = cat.id
         WHERE c.name ILIKE $1 OR c.short_description ILIKE $1 OR c.cultural_context ILIKE $1
         LIMIT $2`,
        [keyword, limitNum]
      );
      result.crafts = craftsRes.rows;
    }

    // Tìm kiếm Nghệ nhân
    if (type === 'all' || type === 'artisans') {
      const artisansRes = await db.query(
        `SELECT
          a.id, a.name AS "fullName", a.code AS "refCode", a.slug,
          a.title, a.specialty, a.avatar_url AS "avatarUrl",
          r.name AS "regionName", cv.name AS "villageName"
         FROM artisans a
         LEFT JOIN regions r ON a.region_id = r.id
         LEFT JOIN craft_villages cv ON a.village_id = cv.id
         WHERE a.name ILIKE $1 OR a.specialty ILIKE $1 OR a.biography ILIKE $1
         LIMIT $2`,
        [keyword, limitNum]
      );
      result.artisans = artisansRes.rows;
    }

    // Tìm kiếm Làng nghề
    if (type === 'all' || type === 'villages') {
      const villagesRes = await db.query(
        `SELECT
          cv.id, cv.name, cv.slug, cv.district, cv.province,
          cv.century_label AS "centuryLabel", cv.summary,
          r.name AS "regionName", cat.name AS "categoryName"
         FROM craft_villages cv
         LEFT JOIN regions r ON cv.region_id = r.id
         LEFT JOIN craft_categories cat ON cv.category_id = cat.id
         WHERE cv.name ILIKE $1 OR cv.province ILIKE $1 OR cv.summary ILIKE $1
         LIMIT $2`,
        [keyword, limitNum]
      );
      result.villages = villagesRes.rows;
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHome,
  getStats,
  search,
};
