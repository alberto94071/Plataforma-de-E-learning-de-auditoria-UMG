import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string })?.role;

  // 1. Allow all static files and public assets
  if (pathname.includes(".") || pathname.startsWith("/logo-umg.png") || pathname.startsWith("/opengraph-image.png") || pathname.startsWith("/robots.txt")) {
    return NextResponse.next();
  }

  // 2. Public routes
  if (pathname === "/" || pathname.startsWith("/api/auth") || pathname.startsWith("/api/register")) {
    return NextResponse.next();
  }

  // Protected routes — redirect to login if not authenticated
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo-umg.png|.*\\.png$).*)"],
};
