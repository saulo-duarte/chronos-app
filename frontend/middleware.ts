import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Se o usuário estiver logado e tentar acessar o /login, redireciona para a home
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Se o usuário NÃO estiver logado e tentar acessar rotas protegidas
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
