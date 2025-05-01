import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname;

  // Check if it's a protected route
  const isProtectedRoute = ['/dashboard', '/settings', '/emails'].some(
    (route) => path.startsWith(route)
  );

  // Check for session cookie
  const sessionCookie = request.cookies.get('session')?.value;

  // Redirect logic
  if (isProtectedRoute && !sessionCookie) {
    // No session, redirect to login with the intended destination
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages
  if ((path === '/login' || path === '/signup') && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/emails/:path*',
    '/login',
    '/signup',
  ],
};
