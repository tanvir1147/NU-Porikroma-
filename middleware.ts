import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Log requests to logo.png for debugging (only in development)
  if (pathname === '/logo.png' && process.env.NODE_ENV === 'development') {
    console.log('Logo.png request:', {
      pathname,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    });
  }

  // Allow all static assets to pass through without any processing
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.ttf') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json'
  ) {
    // Explicitly set cache headers for static assets
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  // For all other requests, continue normally
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}