import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { readJson, requireAdmin, text } from "@/lib/admin-api";

export async function POST(request, { params }) {
  const denied = await requireAdmin(); if (denied) return denied;
  const parsed = await readJson(request, "Invalid note data."); if (parsed.response) return parsed.response;
  const id = Number((await params).id);
  const note = text(parsed.data?.note);
  if (!Number.isInteger(id) || id < 1 || !note) return NextResponse.json({ message: "A valid inquiry and note are required." }, { status: 400 });
  try {
    const rows = await query("SELECT notes FROM inquiries WHERE id = ?", [id]);
    if (!rows.length) return NextResponse.json({ message: "Inquiry not found." }, { status: 404 });
    const notes = rows[0].notes ? `${rows[0].notes}\n${note}` : note;
    await query("UPDATE inquiries SET notes = ? WHERE id = ?", [notes, id]);
    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Could not add inquiry note:", error);
    return NextResponse.json({ message: "The inquiry note could not be saved." }, { status: 500 });
  }
}
