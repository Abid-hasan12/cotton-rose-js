import { NextResponse } from "next/server";
import { cachedJson } from "@/lib/public-api";
import { getPublicProducts } from "@/lib/public-products";

const MAX_LIMIT = 100;

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

  const { cacheMaxAge, ...result } = await getPublicProducts({ group, category, search, page, limit });
  return cachedJson(result, cacheMaxAge);
}