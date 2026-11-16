import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

const statuses = new Set(["Pending", "Contacted", "Closed"]);

async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  try {
    const inquiries = await query("SELECT id, name, email, phone, product, message, COALESCE(status, 'Pending') AS status, created_at FROM inquiries ORDER BY created_at DESC");
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Could not load inquiries:", error);
    return NextResponse.json({ message: "Inquiries could not be loaded." }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid update data." }, { status: 400 });
  }

  const id = Number(body.id);
  const status = String(body.status || "");
  if (!Number.isInteger(id) || id < 1 || !statuses.has(status)) {
    return NextResponse.json({ message: "A valid inquiry and status are required." }, { status: 400 });
  }

  try {
    const result = await query("UPDATE inquiries SET status = ? WHERE id = ?", [status, id]);
    if (!result.affectedRows) return NextResponse.json({ message: "Inquiry not found." }, { status: 404 });
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("Could not update inquiry:", error);
    return NextResponse.json({ message: "The inquiry could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ message: "A valid inquiry is required." }, { status: 400 });

  try {
    const result = await query("DELETE FROM inquiries WHERE id = ?", [id]);
    if (!result.affectedRows) return NextResponse.json({ message: "Inquiry not found." }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Could not delete inquiry:", error);
    return NextResponse.json({ message: "The inquiry could not be deleted." }, { status: 500 });
  }
}
