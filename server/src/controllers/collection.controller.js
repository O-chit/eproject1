const db = require('../config/db');
const { success, error } = require('../utils/response');
const { craftSummarySelect, craftSummaryFrom } = require('../utils/craftHelper');

/**
 * Danh sách bộ sưu tập chuyên đề thông thường
 * GET /api/collections
 */
const getCollections = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        title,
        slug,
        description,
        banner_url AS "bannerUrl"
      FROM collections
      ORDER BY id ASC
    `);
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * Danh sách bộ sưu tập theo mùa (Xuân, Hạ, Thu, Đông)
 * GET /api/seasonal-collections
 */
const getSeasonalCollections = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        title,
        slug,
        season_code AS "seasonCode",
        year,
        color_tone AS "colorTone",
        banner_url AS "bannerUrl"
      FROM seasonal_collections
      WHERE is_active = true
      ORDER BY year DESC, id DESC
    `);
    return success(res, result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * Chi tiết bộ sưu tập mùa kèm tác phẩm Hero & Curated Crafts
 * GET /api/seasonal-collections/:id
 */
const getSeasonalCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const condition = isNumeric ? 'sc.id = $1' : 'sc.slug = $1';

    const colSql = `
      SELECT
        sc.id,
        sc.title,
        sc.slug,
        sc.season_code AS "seasonCode",
        sc.year,
        sc.color_tone AS "colorTone",
        sc.banner_url AS "bannerUrl",
        sc.theme_concept AS "themeConcept",
        to_char(sc.start_date, 'YYYY-MM-DD') AS "startDate",
        to_char(sc.end_date, 'YYYY-MM-DD') AS "endDate"
      FROM seasonal_collections sc
      WHERE ${condition}
    `;

    const colRes = await db.query(colSql, [id]);
    if (colRes.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', 'Không tìm thấy bộ sưu tập mùa');
    }

    const collection = colRes.rows[0];

    // Lấy các tác phẩm thuộc bộ sưu tập mùa kèm thông tin giám tuyển
    const craftsSql = `
      SELECT
        scc.curator_note AS "curatorNote",
        scc.highlight_badge AS "highlightBadge",
        scc.is_hero AS "isHero",
        scc.display_order,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'region', r.name,
          'category', cat.name,
          'thumbnailUrl', c.thumbnail_url,
          'shortDescription', c.short_description,
          'isFeatured', c.is_featured,
          'materials', COALESCE(
            (
              SELECT json_agg(m.name)
              FROM craft_materials cm
              JOIN materials m ON cm.material_id = m.id
              WHERE cm.craft_id = c.id
            ),
            '[]'::json
          )
        ) AS craft
      FROM seasonal_collection_crafts scc
      JOIN crafts c ON scc.craft_id = c.id
      JOIN regions r ON c.region_id = r.id
      JOIN craft_categories cat ON c.category_id = cat.id
      WHERE scc.seasonal_collection_id = $1
      ORDER BY scc.is_hero DESC, scc.display_order ASC
    `;

    const craftsRes = await db.query(craftsSql, [collection.id]);

    const curatedCrafts = craftsRes.rows.map((row) => ({
      craft: row.craft,
      curatorNote: row.curatorNote,
      highlightBadge: row.highlightBadge,
      isHero: row.isHero,
    }));

    // Hero craft là craft đầu tiên có is_hero = true (hoặc craft đầu tiên)
    const heroItem = curatedCrafts.find((item) => item.isHero) || curatedCrafts[0] || null;
    collection.heroCraft = heroItem ? heroItem.craft : null;
    collection.curatedCrafts = curatedCrafts;

    return success(res, collection);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCollections,
  getSeasonalCollections,
  getSeasonalCollectionById,
};
