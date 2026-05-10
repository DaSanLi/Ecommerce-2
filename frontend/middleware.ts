import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenMiddleware } from '@/src/lib/auth/middleware-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const publicRoutes = ['/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const isValid = await verifyTokenMiddleware(request);

  if (isPublicRoute) {
    if (isValid) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!isValid) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/auth/:path*',
    '/options',
  ],
};
