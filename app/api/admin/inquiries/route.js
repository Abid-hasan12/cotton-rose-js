import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { idFromRequest, readJson, requireAdmin, text } from "@/lib/admin-api";

const statuses = new Set(["new", "in_progress", "replied", "closed"]);

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  try {
    const columns = await query(
      "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries'",
    );
    const hasInquiryType = columns.some((column) => column.COLUMN_NAME === "inquiry_type");
    const inquiryTypeSelect = hasInquiryType ? "inquiry_type" : "NULL AS inquiry_type";
    const rows = await query(
      `SELECT id,name,email,phone,product_id,product,quantity,destination,delivery_date,
              message,privacy_consent,COALESCE(status,'new') AS status,
              ${inquiryTypeSelect},notes,created_at,updated_at
       FROM inquiries ORDER BY created_at DESC`,
    );
    return NextResponse.json(rows.map((row) => {
      const value = String(row.status || "new").trim().toLower();
      const status = value === "pending" ? "new"
        : value === "contacted" ? "in_progress"
        : ["new", "in_progress", "replied", "closed"].includes(value) ? value
        : "new";
      return { ...row, status };
    }));
  } catch (error) { console.error("Could not load inquiries:", error); return NextResponse.json({ message: "Inquiries could not be loaded." }, { status: 500 }); }
}

export async function PATCH(request) {
  const denied = await requireAdmin(); if (denied) return denied;
  const parsed = await readJson(request, "Invalid inquiry update data."); if (parsed.response) return parsed.response;
  const body = parsed.data || {};
  const id = Number(body.id);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ message: "A valid inquiry is required." }, { status: 400 });
  const updates = [];
  const values = [];
  if (body.status !== undefined) {
    if (!statuses.has(body.status)) return NextResponse.json({ message: "A valid inquiry status is required." }, { status: 400 });
    updates.push("status = ?"); values.push(body.status);
  }
  if (body.notes !== undefined) { updates.push("notes = ?"); values.push(text(body.notes, 10000)); }
  if (!updates.length) return NextResponse.json({ message: "Status or notes are required." }, { status: 400 });
  try {
    const result = await query(`UPDATE inquiries SET ${updates.join(", ")} WHERE id = ?`, [...values, id]);
    if (!result.affectedRows) return NextResponse.json({ message: "Inquiry not found." }, { status: 404 });
    return NextResponse.json({ updated: true });
  } catch (error) { console.error("Could not update inquiry:", error); return NextResponse.json({ message: "The inquiry could not be updated." }, { status: 500 }); }
}

export async function DELETE(request) {
  const denied = await requireAdmin(); if (denied) return denied;
  const id = idFromRequest(request); if (!id) return NextResponse.json({ message: "A valid inquiry is required." }, { status: 400 });
  try {
    const result = await query("DELETE FROM inquiries WHERE id = ?", [id]);
    if (!result.affectedRows) return NextResponse.json({ message: "Inquiry not found." }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) { console.error("Could not delete inquiry:", error); return NextResponse.json({ message: "The inquiry could not be deleted." }, { status: 500 }); }
}
