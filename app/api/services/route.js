import { apiError, cachedJson } from "@/lib/public-api";
import { getPublicServices } from "@/lib/public-content";

export async function GET() {
  try {
    const data = await getPublicServices();
    return cachedJson({ data }, 600);
  } catch (error) {
    return apiError("Failed to fetch services:", error);
  }
}
