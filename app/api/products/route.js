import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { apiError, cachedJson } from "@/lib/public-api";

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
  if (group) {
    conditions.push("pc.navigation_group = ?");
    values.push(group);
  }
  if (category) {
    conditions.push("LOWER(p.category) = ?");
    values.push(category);
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
       INNER JOIN product_categories pc ON pc.name = p.category
       ${where}`,
      values,
    );
    const rows = await query(
      `SELECT p.id, p.title AS name, p.description AS summary, p.image_url,
              p.category
       FROM products p
       INNER JOIN product_categories pc ON pc.name = p.category
       ${where}
       ORDER BY p.id
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    );

    const total = Number(countRows[0]?.total || 0);
    return cachedJson({
      data: rows.map((row) => ({
        ...row,
        slug: slugify(row.name),
        offerings: [],
        materials: [],
        options: [],
        category: {
          slug: slugify(row.category),
          name: row.category,
          group: row.category,
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
    return apiError("Failed to fetch products:", error);
  }
}