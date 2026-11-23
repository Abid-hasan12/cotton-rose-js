import { query, tableColumns } from "@/lib/db";
import { apiError, cachedJson } from "@/lib/public-api";

export async function GET() {
  try {
    const columns = await tableColumns("product_categories");
    const groupColumn = columns.has("navigation_group")
      ? "navigation_group"
      : columns.has("category_group")
        ? "category_group"
        : null;
    if (!groupColumn) {
      throw new Error("product_categories has no navigation or category group column");
    }
    const rows = await query(
      `SELECT slug, name, ${groupColumn} AS \`group\`, sort_order
       FROM product_categories
       ORDER BY ${groupColumn}, sort_order, name`,
    );
    return cachedJson({
      data: {
        core: rows.filter((row) => row.group === "core"),
        diversified: rows.filter((row) => row.group === "diversified"),
      },
    });
  } catch (error) {
    console.error("Failed to fetch navigation:", error);
    return cachedJson({
      data: {
        core: [
          { slug: "core-knitwear", name: "Knitwear", group: "core", sort_order: 1 },
          { slug: "core-woven-wear", name: "Woven Wear", group: "core", sort_order: 2 },
          { slug: "core-sweaters", name: "Sweaters", group: "core", sort_order: 3 },
          { slug: "core-activewear", name: "Activewear", group: "core", sort_order: 4 },
        ],
        diversified: [
          { slug: "diversified-woven", name: "Woven", group: "diversified", sort_order: 1 },
          { slug: "diversified-knit", name: "Knit", group: "diversified", sort_order: 2 },
          { slug: "diversified-outerwear", name: "Outerwear", group: "diversified", sort_order: 3 },
          { slug: "diversified-denim", name: "Denim", group: "diversified", sort_order: 4 },
        ],
      },
    }, 60);
  }
}
