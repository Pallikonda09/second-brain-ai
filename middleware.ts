import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PROTECTED = ["/dashboard", "/capture", "/query"];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED.some(p => path.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("auth_token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/capture/:path*", "/query/:path*"],
};