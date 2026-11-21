import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { idFromRequest, jsonValue, readJson, requireAdmin, text } from "@/lib/admin-api";

const fields = (body) => [text(body.slug, 255), text(body.name, 255), text(body.role, 255), text(body.initials, 20),
  text(body.summary, 5000), jsonValue(body.responsibilities), Number(body.sort_order || body.sortOrder || 0)];
const select = `SELECT lp.id, lp.slug, lp.name, lp.role_title AS role, lp.initials,
  ma.public_url AS image_url, lp.summary, lp.responsibilities_json AS responsibilities, lp.sort_order
  FROM leadership_profiles lp LEFT JOIN media_assets ma ON ma.id = lp.image_id`;

async function imageId(url, alt) {
  if (!url) return null;
  const existing = await query("SELECT id FROM media_assets WHERE public_url = ? LIMIT 1", [url]);
  if (existing.length) return existing[0].id;
  const filename = url.split("/").pop() || "image";
  const result = await query(
    "INSERT INTO media_assets (storage_key, public_url, original_filename, mime_type, file_size, alt_text) VALUES (?, ?, ?, 'image/jpeg', 0, ?)",
    [url, url, filename, alt || null],
  );
  return result.insertId;
}

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  try { return NextResponse.json(await query(`${select} ORDER BY sort_order, name`)); }
  catch (error) { console.error("Could not load leadership:", error); return NextResponse.json({ message: "Leadership could not be loaded." }, { status: 500 }); }
}
export async function POST(request) {
  const denied = await requireAdmin(); if (denied) return denied;
  const parsed = await readJson(request); if (parsed.response) return parsed.response;
  const values = fields(parsed.data || {}); if (!values[0] || !values[1] || !values[2]) return NextResponse.json({ message: "Slug, name, and role are required." }, { status: 400 });
  try { const image_id = await imageId(parsed.data?.image_url || parsed.data?.imageUrl, values[1]); const result = await query("INSERT INTO leadership_profiles (slug,name,role_title,initials,image_id,summary,responsibilities_json,sort_order) VALUES (?,?,?,?,?,?,?,?)", [values[0], values[1], values[2], values[3], image_id, values[4], values[5], values[6]]); return NextResponse.json({ id: result.insertId, ...parsed.data }, { status: 201 }); }
  catch (error) { console.error("Could not create leadership profile:", error); return NextResponse.json({ message: "Leadership profile could not be created." }, { status: 500 }); }
}
export async function PUT(request) {
  const denied = await requireAdmin(); if (denied) return denied;
  const parsed = await readJson(request); if (parsed.response) return parsed.response;
  const id = Number(parsed.data?.id); const values = fields(parsed.data || {});
  if (!Number.isInteger(id) || id < 1 || !values[0] || !values[1] || !values[2]) return NextResponse.json({ message: "A valid profile and required fields are needed." }, { status: 400 });
  try { const image_id = await imageId(parsed.data?.image_url || parsed.data?.imageUrl, values[1]); const result = await query("UPDATE leadership_profiles SET slug=?,name=?,role_title=?,initials=?,image_id=?,summary=?,responsibilities_json=?,sort_order=? WHERE id=?", [values[0], values[1], values[2], values[3], image_id, values[4], values[5], values[6], id]); if (!result.affectedRows) return NextResponse.json({ message: "Profile not found." }, { status: 404 }); return NextResponse.json({ id, ...parsed.data }); }
  catch (error) { console.error("Could not update leadership profile:", error); return NextResponse.json({ message: "Leadership profile could not be updated." }, { status: 500 }); }
}
export async function DELETE(request) {
  const denied = await requireAdmin(); if (denied) return denied; const id = idFromRequest(request); if (!id) return NextResponse.json({ message: "A valid profile is required." }, { status: 400 });
  try { const result = await query("DELETE FROM leadership_profiles WHERE id=?", [id]); if (!result.affectedRows) return NextResponse.json({ message: "Profile not found." }, { status: 404 }); return NextResponse.json({ deleted: true }); }
  catch (error) { console.error("Could not delete leadership profile:", error); return NextResponse.json({ message: "Leadership profile could not be deleted." }, { status: 500 }); }
}
