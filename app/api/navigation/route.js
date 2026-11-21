import { query } from "@/lib/db";
import { apiError, cachedJson } from "@/lib/public-api";

export async function GET() {
  try {
    const rows = await query(
      `SELECT slug, name, navigation_group AS \`group\`, sort_order
       FROM product_categories
       ORDER BY navigation_group, sort_order, name`,
    );
    return cachedJson({
      data: {
        core: rows.filter((row) => row.group === "core"),
        diversified: rows.filter((row) => row.group === "diversified"),
      },
    });
  } catch (error) {
    return apiError("Failed to fetch navigation:", error);
  }
}
