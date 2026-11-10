import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = req.cookies.get("admin_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const verifiedPayload = await verifyAdminToken(sessionCookie);
    if (!verifiedPayload) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role Guard: doctor_availability role can ONLY access /admin/doctors routes
    if (verifiedPayload.role === "doctor_availability") {
      if (!pathname.startsWith("/admin/doctors")) {
        const doctorsUrl = new URL("/admin/doctors", req.url);
        return NextResponse.redirect(doctorsUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
