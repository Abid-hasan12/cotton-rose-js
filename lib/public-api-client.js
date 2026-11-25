import { unstable_cache } from "next/cache";
import { getPublicProducts } from "@/lib/public-products";
import { getPublicCompany, getPublicServices } from "@/lib/public-content";

const getCachedProducts = unstable_cache(
  getPublicProducts,
  ["public-products"],
  { revalidate: 600, tags: ["products"] },
);
const getCachedCompany = unstable_cache(
  getPublicCompany,
  ["public-company"],
  { revalidate: 600, tags: ["company"] },
);
const getCachedServices = unstable_cache(
  getPublicServices,
  ["public-services"],
  { revalidate: 600, tags: ["services"] },
);

function getProductFilters(path) {
  const { searchParams } = new URL(path, "http://localhost");
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
    limit > 100
  ) {
    throw new Error("Invalid product filters.");
  }

  return { group, category, search, page, limit };
}

export async function fetchPublicApi(path, tag, fallback) {
  try {
    if (path === "/api/company") return await getCachedCompany();
    if (path === "/api/services") return await getCachedServices();
    if (path.startsWith("/api/products?")) {
      const { data } = await getCachedProducts(getProductFilters(path));
      return data;
    }
    throw new Error(`Unsupported public API path: ${path}`);
  } catch (error) {
    if (fallback !== undefined) {
      console.warn(`Public API fallback used for ${path}:`, error instanceof Error ? error.message : error);
      return fallback;
    }
    throw error;
  }
}
