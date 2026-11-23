import { NextResponse } from "next/server";
import { query, tableColumns } from "@/lib/db";
import { apiError, cachedJson } from "@/lib/public-api";
import { products as coreProducts } from "@/data/products";
import { diversifiedProducts } from "@/data/diversifiedProducts";

const MAX_LIMIT = 100;
const slugify = (value) => String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get("group")?.trim().toLowerCase();
  const category = searchParams.get("category")?.trim().toLowerCase();
  const search = searchParams.get("search")?.trim();
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = Number.parseInt(searchParams.get("limit") || "20", 10);

  if (
    (group && !["core", "diversified"].includes(group)) ||
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > MAX_LIMIT
  ) {
    return NextResponse.json(
      { error: "Invalid filters. Use group=core|diversified, page >= 1, and limit between 1 and 100." },
      { status: 400 },
    );
  }

  const conditions = [];
  const values = [];
  let categoryJoin = "LEFT JOIN product_categories pc ON pc.name = p.category";
  let categoryGroupColumn = "navigation_group";

  try {
    const [productColumns, categoryColumns] = await Promise.all([
      tableColumns("products"),
      tableColumns("product_categories"),
    ]);
    if (productColumns.has("category_id")) {
        categoryJoin = "LEFT JOIN product_categories pc ON (pc.id = p.category_id OR (p.category_id IS NULL AND pc.name = p.category))";
    }
    if (categoryColumns.has("navigation_group")) {
      categoryGroupColumn = "navigation_group";
    } else if (categoryColumns.has("category_group")) {
      categoryGroupColumn = "category_group";
    } else {
      throw new Error("product_categories has no navigation or category group column");
    }
  } catch (error) {
    console.error("Failed to inspect product category schema:", error);
    const fallbackRows = group === "diversified" ? diversifiedProducts : group === "core" ? coreProducts : [...coreProducts, ...diversifiedProducts];
    const filteredRows = category
      ? fallbackRows.filter((product) => String(product.group || product.name).toLowerCase() === category)
      : fallbackRows;
    const start = (page - 1) * limit;
    const pagedRows = filteredRows.slice(start, start + limit);
    return cachedJson({
      data: pagedRows.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.id,
        summary: product.summary,
        offerings: product.offerings || [],
        materials: product.materials || product.fabrics || [],
        options: product.options || [],
        category: {
          slug: slugify(product.group || product.name),
          name: product.group || product.name,
          group: product.group ? "diversified" : "core",
        },
        image: product.image ? { url: product.image, alt: product.alt || product.name } : null,
      })),
      pagination: {
        page,
        limit,
        total: filteredRows.length,
        totalPages: Math.ceil(filteredRows.length / limit),
      },
    }, 60);
  }

  if (group) {
    conditions.push(`pc.${categoryGroupColumn} = ?`);
    values.push(group);
  }
  if (category) {
    conditions.push("(LOWER(pc.name) = ? OR LOWER(REPLACE(pc.slug, 'core-', '')) = ? OR pc.slug = ?)");
    values.push(category, category, `core-${category}`);
  }
  if (search) {
    conditions.push("(p.title LIKE ? OR p.description LIKE ? OR p.category LIKE ?)");
    const term = `%${search}%`;
    values.push(term, term, term);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  try {
    const countRows = await query(
      `SELECT COUNT(*) AS total
       FROM products p
       ${categoryJoin}
       ${where}`,
      values,
    );
    const rows = await query(
      `SELECT p.id, p.title AS name, p.description AS summary, p.image_url,
              p.category, pc.slug AS category_slug,
              COALESCE(pc.name, p.category) AS category_name,
              pc.${categoryGroupColumn} AS category_group,
              ${productColumns.has("offerings_json") ? "p.offerings_json AS offerings" : "NULL AS offerings"},
              ${productColumns.has("materials_json") ? "p.materials_json AS materials" : "NULL AS materials"},
              ${productColumns.has("options_json") ? "p.options_json AS options" : "NULL AS options"},
              ${productColumns.has("sort_order") ? "p.sort_order" : "0 AS sort_order"}
       FROM products p
       ${categoryJoin}
       ${where}
       ORDER BY p.id
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    );

    const total = Number(countRows[0]?.total || 0);
    const parseArray = (value) => {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return Array.isArray(parsed) ? parsed : [];
      } catch { return []; }
    };
    return cachedJson({
      data: rows.map((row) => ({
        ...row,
        slug: slugify(row.name),
        offerings: parseArray(row.offerings),
        materials: parseArray(row.materials),
        options: parseArray(row.options),
        category: {
          slug: row.category_slug || slugify(row.category_name),
          name: row.category_name,
          group: row.category_group || row.category_name,
        },
        image: row.image_url ? { url: row.image_url, alt: row.name } : null,
        image_url: undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    const fallbackRows = group === "diversified" ? diversifiedProducts : group === "core" ? coreProducts : [...coreProducts, ...diversifiedProducts];
    const filteredRows = category
      ? fallbackRows.filter((product) => {
          const categoryName = product.group || product.name;
          return String(categoryName).toLowerCase() === category;
        })
      : fallbackRows;
    const start = (page - 1) * limit;
    const pagedRows = filteredRows.slice(start, start + limit);
    return cachedJson({
      data: pagedRows.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.id,
        summary: product.summary,
        offerings: product.offerings || [],
        materials: product.materials || product.fabrics || [],
        options: product.options || [],
        category: {
          slug: slugify(product.group || product.name),
          name: product.group || product.name,
          group: product.group ? "diversified" : "core",
        },
        image: product.image ? { url: product.image, alt: product.alt || product.name } : null,
      })),
      pagination: {
        page,
        limit,
        total: filteredRows.length,
        totalPages: Math.ceil(filteredRows.length / limit),
      },
    }, 60);
  }
}