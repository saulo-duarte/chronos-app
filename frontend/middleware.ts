import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define public and auth routes
  const isAuthRoute = pathname === '/login';
  const isPublicRoute = pathname.startsWith('/_next') || 
                       pathname.startsWith('/api') || 
                       pathname.startsWith('/favicon.ico') ||
                       pathname === '/auth/callback'; // adjust if you have other public routes

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If user has a token and tries to access login, redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user doesn't have a token and tries to access protected routes, redirect to login
  if (!token && !isAuthRoute) {
    // We can allow some public access if needed, but for now protect everything
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
