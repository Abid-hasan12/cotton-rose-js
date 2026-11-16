import { jwtVerify, SignJWT } from "jose";

export const ADMIN_COOKIE = "cottonrose_admin";

function getSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export async function createAdminToken(username) {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}
