/**
 * craftHelper.js
 * Câu truy vấn và tiện ích dùng chung để định dạng CraftSummary
 */

const craftSummarySelect = `
  c.id,
  c.name,
  c.slug,
  c.code,
  c.tag,
  c.price_vnd AS "priceVnd",
  c.price_vnd,
  c.origin_line AS "originLine",
  r.name AS region,
  cat.name AS category,
  cat.slug AS "categorySlug",
  c.thumbnail_url AS "thumbnailUrl",
  c.thumbnail_url AS image,
  c.short_description AS "shortDescription",
  c.short_description AS description,
  c.is_featured AS "isFeatured",
  COALESCE(
    (
      SELECT json_agg(m.name)
      FROM craft_materials cm
      JOIN materials m ON cm.material_id = m.id
      WHERE cm.craft_id = c.id
    ),
    '[]'::json
  ) AS materials,
  COALESCE(
    (
      SELECT cv.name
      FROM craft_villages cv
      WHERE cv.id = c.village_id
    ),
    r.name
  ) AS village,
  COALESCE(
    (
      SELECT a.name
      FROM craft_artisans ca
      JOIN artisans a ON ca.artisan_id = a.id
      WHERE ca.craft_id = c.id
      ORDER BY ca.is_lead DESC
      LIMIT 1
    ),
    'Nghệ nhân truyền thống'
  ) AS artisan,
  COALESCE(
    (
      SELECT t.name
      FROM craft_techniques ct
      JOIN techniques t ON ct.technique_id = t.id
      WHERE ct.craft_id = c.id
      LIMIT 1
    ),
    'Thủ công bản địa'
  ) AS technique
`;

const craftSummaryFrom = `
  FROM crafts c
  JOIN regions r ON c.region_id = r.id
  JOIN craft_categories cat ON c.category_id = cat.id
`;

module.exports = {
  craftSummarySelect,
  craftSummaryFrom,
};
