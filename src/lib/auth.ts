import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "mediqueue-secret-key-local-dev";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface AdminSessionPayload {
  adminId: string;
  username: string;
  role: string;
}

export async function signAdminToken(payload: AdminSessionPayload): Promise<string> {
  return await new SignJWT({
    adminId: payload.adminId,
    username: payload.username,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      adminId: String(payload.adminId || ""),
      username: String(payload.username || ""),
      role: String(payload.role || "SUPER_ADMIN"),
    };
  } catch {
    return null;
  }
}

export async function verifyAdminSession(req: NextRequest): Promise<AdminSessionPayload | null> {
  const cookieToken = req.cookies.get("admin_session")?.value;
  const authHeader = req.headers.get("authorization");

  let token = cookieToken;
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return null;
  }

  return await verifyAdminToken(token);
}
