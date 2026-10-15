/**
 * craftHelper.js
 * Câu truy vấn và tiện ích dùng chung để định dạng CraftSummary
 */

const craftSummarySelect = `
  c.id,
  c.name,
  c.slug,
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
  ) AS materials
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
