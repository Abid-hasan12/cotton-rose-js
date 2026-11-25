import { cachedJson } from "@/lib/public-api";
import { getPublicCompany } from "@/lib/public-content";

export async function GET() {
  const data = await getPublicCompany();
  return cachedJson({ data }, 600);
}
