import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isAuthPage = pathname === "/login" || pathname.startsWith("/auth");
  const isPublicFile =
    pathname.includes(".") || pathname.startsWith("/_next");

  if (!token && !isAuthPage && !isPublicFile) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
