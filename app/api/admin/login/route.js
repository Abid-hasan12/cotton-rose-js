import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { ADMIN_COOKIE, createAdminToken } from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid login data." }, { status: 400 });
  }

  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!username || !password) return NextResponse.json({ message: "Username and password are required." }, { status: 400 });

  try {
    const admins = await query("SELECT username, password_hash FROM admins WHERE username = ? LIMIT 1", [username]);
    const admin = admins[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return NextResponse.json({ message: "Invalid username or password." }, { status: 401 });
    }

    const token = await createAdminToken(admin.username);
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json({ message: "The admin service is temporarily unavailable." }, { status: 500 });
  }
}
