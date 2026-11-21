import { headers } from "next/headers";

function getApiBaseUrl(requestHeaders) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  const host = requestHeaders.get("host");
  if (!host) throw new Error("Unable to determine the public API host.");

  const protocol = requestHeaders.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

export async function fetchPublicApi(path, tag) {
  const requestHeaders = await headers();
  const response = await fetch(`${getApiBaseUrl(requestHeaders)}${path}`, {
    next: { revalidate: 600, tags: [tag] },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `Unable to load ${path}.`);
  }

  return result.data;
}
