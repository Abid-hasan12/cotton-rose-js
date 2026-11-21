import { query } from "@/lib/db";
import { apiError, cachedJson, parseJsonColumn } from "@/lib/public-api";

export async function GET() {
  try {
    const rows = await query(
      `SELECT s.slug, s.title, s.description, ma.public_url AS image_url, s.image_alt,
              s.points_json AS points, s.deliverable, s.sort_order
       FROM services s
       LEFT JOIN media_assets ma ON ma.id = s.image_id
       ORDER BY s.sort_order, s.title`,
    );
    return cachedJson({
      data: rows.map((row) => ({
        ...row,
        points: parseJsonColumn(row.points),
        image: row.image_url ? { url: row.image_url, alt: row.image_alt } : null,
        image_url: undefined,
        image_alt: undefined,
      })),
    }, 600);
  } catch (error) {
    return apiError("Failed to fetch services:", error);
  }
}
