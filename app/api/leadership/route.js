import { query } from "@/lib/db";
import { apiError, cachedJson, parseJsonColumn } from "@/lib/public-api";

export async function GET() {
  try {
    const rows = await query(
      `SELECT lp.slug, lp.name, lp.role_title AS role, lp.initials,
              ma.public_url AS image_url, lp.summary,
              lp.responsibilities_json AS responsibilities, lp.sort_order
       FROM leadership_profiles lp
       LEFT JOIN media_assets ma ON ma.id = lp.image_id
       ORDER BY lp.sort_order, lp.name`,
    );
    return cachedJson({
      data: rows.map((row) => ({
        ...row,
        responsibilities: parseJsonColumn(row.responsibilities),
        image: row.image_url ? { url: row.image_url, alt: row.name } : null,
        image_url: undefined,
      })),
    }, 600);
  } catch (error) {
    return apiError("Failed to fetch leadership:", error);
  }
}
