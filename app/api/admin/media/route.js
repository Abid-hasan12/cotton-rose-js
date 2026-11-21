import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  try {
    return NextResponse.json(await query("SELECT id, original_filename AS name, public_url AS url, mime_type AS mimeType, file_size AS size, alt_text AS alt, created_at FROM media_assets ORDER BY created_at DESC"));
  } catch (error) {
    console.error("Could not load media library:", error);
    return NextResponse.json({ message: "Media library could not be loaded." }, { status: 500 });
  }
}
