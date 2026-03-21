import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PROTECTED = ["/dashboard", "/capture", "/query","/profile"];

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED.some(p => path.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/capture/:path*", "/query/:path*",  "/profile/:path*",],
};