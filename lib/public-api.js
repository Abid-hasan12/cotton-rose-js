import { NextResponse } from "next/server";

export function parseJsonColumn(value, fallback = []) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function cachedJson(data, maxAge = 300) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    },
  });
}

export function apiError(message, error) {
  console.error(message, error);
  return NextResponse.json(
    { error: "Unable to load public content" },
    { status: 500 },
  );
}
