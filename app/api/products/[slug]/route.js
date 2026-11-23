import { query, tableColumns } from "@/lib/db";
import { apiError, cachedJson } from "@/lib/public-api";

const slugify = (value) => String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function GET(_request, { params }) {
  const { slug } = await params;
  if (!slug?.trim()) {
    return Response.json({ error: "Product slug is required" }, { status: 400 });
  }

  try {
    const [productColumns, categoryColumns] = await Promise.all([
      tableColumns("products"),
      tableColumns("product_categories"),
    ]);
    const categoryGroupColumn = categoryColumns.has("navigation_group")
      ? "navigation_group"
      : categoryColumns.has("category_group")
        ? "category_group"
        : null;
    if (!categoryGroupColumn) {
      throw new Error("product_categories has no navigation or category group column");
    }
    const categoryJoin = productColumns.has("category_id")
      ? "LEFT JOIN product_categories pc ON (pc.id = p.category_id OR (p.category_id IS NULL AND pc.name = p.category))"
      : "LEFT JOIN product_categories pc ON pc.name = p.category";
    const rows = await query(
      `SELECT p.id, p.title AS name, p.description AS summary,
              p.image_url, p.category, pc.slug AS category_slug,
              COALESCE(pc.name, p.category) AS category_name,
              pc.${categoryGroupColumn} AS category_group,
              ${productColumns.has("offerings_json") ? "p.offerings_json AS offerings" : "NULL AS offerings"},
              ${productColumns.has("materials_json") ? "p.materials_json AS materials" : "NULL AS materials"},
              ${productColumns.has("options_json") ? "p.options_json AS options" : "NULL AS options"},
              ${productColumns.has("sort_order") ? "p.sort_order" : "0 AS sort_order"}
       FROM products p
       ${categoryJoin}`,
    );
    const row = rows.find((item) => slugify(item.name) === slug.trim().toLowerCase());
    if (!row) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const images = await query(
      `SELECT pi.id, ma.public_url AS url, pi.alt_text AS alt, pi.sort_order
       FROM product_images pi
       INNER JOIN media_assets ma ON ma.id = pi.media_id
       WHERE pi.product_id = ?
       ORDER BY pi.sort_order, pi.id`,
      [row.id],
    );
    const parseArray = (value) => {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return Array.isArray(parsed) ? parsed : [];
      } catch { return []; }
    };
    return cachedJson({
      data: {
        id: row.id,
        slug: slugify(row.name),
        name: row.name,
        summary: row.summary,
        offerings: parseArray(row.offerings),
        materials: parseArray(row.materials),
        options: parseArray(row.options),
        category: {
          slug: row.category_slug || slugify(row.category_name),
          name: row.category_name,
          group: row.category_group || row.category_name,
        },
        image: row.image_url ? { url: row.image_url, alt: row.name } : null,
        images,
      },
    });
  } catch (error) {
    return apiError("Failed to fetch product:", error);
  }
}
