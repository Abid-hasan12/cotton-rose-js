import { query } from "@/lib/db";
import { apiError, cachedJson } from "@/lib/public-api";

const slugify = (value) => String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function GET(_request, { params }) {
  const { slug } = await params;
  if (!slug?.trim()) {
    return Response.json({ error: "Product slug is required" }, { status: 400 });
  }

  try {
    const rows = await query(
      `SELECT p.id, p.title AS name, p.description AS summary,
              p.image_url, p.category
       FROM products p`,
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
    return cachedJson({
      data: {
        id: row.id,
        slug: slugify(row.name),
        name: row.name,
        summary: row.summary,
        offerings: [],
        materials: [],
        options: [],
        category: {
          slug: slugify(row.category),
          name: row.category,
          group: row.category,
        },
        image: row.image_url ? { url: row.image_url, alt: row.name } : null,
        images,
      },
    });
  } catch (error) {
    return apiError("Failed to fetch product:", error);
  }
}
