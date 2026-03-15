// middleware.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export function middleware(req) {
  const token = req.cookies.get("sellerToken")?.value;
  const { pathname } = req.nextUrl;

  // Only protect seller dashboards
  if (!pathname.startsWith("/seller")) {
    return NextResponse.next();
  }

  // Allow public seller pages
  if (
    pathname === "/seller" ||
    pathname === "/seller/signin" ||
    pathname.includes("/signup")
  ) {
    return NextResponse.next();
  }

  // No token → signin
  if (!token) {
    return NextResponse.redirect(new URL("/seller/signin", req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Normal seller trying premium
    if (
      pathname.startsWith("/seller/premium") &&
      decoded.sellerType !== "premium_seller"
    ) {
      return NextResponse.redirect(
        new URL("/seller/normal/dashboard", req.url)
      );
    }

    // Premium seller trying normal
    if (
      pathname.startsWith("/seller/normal") &&
      decoded.sellerType !== "normal_seller"
    ) {
      return NextResponse.redirect(
        new URL("/seller/premium/dashboard", req.url)
      );
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/seller/signin", req.url));
  }
}

export const config = {
  matcher: ["/seller/:path*"],
};