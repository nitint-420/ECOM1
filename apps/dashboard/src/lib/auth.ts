import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");
export interface JWTPayload { userId: string; phone: string; role: string; name: string; }

export async function createToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload as any).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try { const { payload } = await jwtVerify(token, SECRET); return payload as unknown as JWTPayload; }
  catch { return null; }
}

export async function getSession(): Promise<JWTPayload | null> {
  const token = cookies().get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setAuthCookie(token: string) {
  cookies().set("auth-token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
}

export function clearAuthCookie() { cookies().delete("auth-token"); }
