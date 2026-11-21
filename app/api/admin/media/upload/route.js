import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, text } from "@/lib/admin-api";

const MIME_TYPES = new Map([
  ["image/jpeg", ".jpg"], ["image/png", ".png"], ["image/webp", ".webp"],
  ["image/gif", ".gif"], ["application/pdf", ".pdf"],
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request) {
  const denied = await requireAdmin(); if (denied) return denied;
  let form;
  try { form = await request.formData(); } catch { return NextResponse.json({ message: "Invalid multipart upload." }, { status: 400 }); }
  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") return NextResponse.json({ message: "A file is required." }, { status: 400 });
  const extension = MIME_TYPES.get(file.type);
  if (!extension) return NextResponse.json({ message: "This file type is not allowed." }, { status: 415 });
  if (file.size < 1 || file.size > MAX_FILE_SIZE) return NextResponse.json({ message: "Files must be smaller than 10 MB." }, { status: 413 });
  const storedName = `${crypto.randomUUID()}${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(path.join(directory, storedName), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
    const url = `/uploads/${storedName}`;
    const result = await query(
      "INSERT INTO media_assets (storage_key, public_url, original_filename, mime_type, file_size, alt_text) VALUES (?, ?, ?, ?, ?, ?)",
      [storedName, url, text(file.name, 255), file.type, file.size, text(form.get("alt"), 255)],
    );
    return NextResponse.json({ id: result.insertId, url, name: file.name, mimeType: file.type, size: file.size }, { status: 201 });
  } catch (error) {
    try { await fs.unlink(path.join(directory, storedName)); } catch (cleanupError) { console.error("Could not clean failed upload:", cleanupError); }
    console.error("Could not save media upload:", error);
    return NextResponse.json({ message: "The file could not be uploaded." }, { status: 500 });
  }
}
