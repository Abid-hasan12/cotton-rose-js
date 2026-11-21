import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

export async function getAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const admin = await getAdmin();
  return admin
    ? null
    : NextResponse.json({ message: "Authentication required." }, { status: 401 });
}

export async function readJson(request, message = "Invalid request data.") {
  try {
    return { data: await request.json() };
  } catch {
    return { response: NextResponse.json({ message }, { status: 400 }) };
  }
}

export function idFromRequest(request, field = "id") {
  const value = new URL(request.url).searchParams.get(field);
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function jsonValue(value, fallback = []) {
  if (value === undefined || value === null) return JSON.stringify(fallback);
  if (typeof value === "string") {
    try {
      JSON.parse(value);
      return value;
    } catch {
      return null;
    }
  }
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export function text(value, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
