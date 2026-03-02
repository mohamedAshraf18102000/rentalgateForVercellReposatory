import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/profile', 
  '/booking',
  // Add more protected routes here as needed
];

// Helper function to check if a path is protected
function isProtectedRoute(pathname: string): boolean {
  // Remove locale prefix (e.g., /ar/profile -> /profile, /en/profile -> /profile)
  // Handle both /locale/route and /route patterns
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)(\/|$)/, '/') || '/';
  
  return PROTECTED_ROUTES.some(route => {
    // Exact match or starts with the protected route
    const normalizedPath = pathWithoutLocale === '/' ? '/' : pathWithoutLocale;
    return normalizedPath === route || normalizedPath.startsWith(route + '/');
  });
}

// Helper function to check if user is authenticated
function isAuthenticated(request: NextRequest): boolean {
  const authToken = request.cookies.get('authToken');
  return !!authToken?.value;
}

// Helper function to get locale from pathname
function getLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  return routing.locales.includes(firstSegment as any) ? firstSegment : routing.defaultLocale;
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check if route is protected
  if (isProtectedRoute(pathname)) {
    // Check if user is authenticated
    if (!isAuthenticated(request)) {
      // Check if requireAuth query parameter already exists (to avoid infinite redirect)
      const url = request.nextUrl.clone();
      const hasRequireAuth = url.searchParams.has('requireAuth');
      
      if (!hasRequireAuth) {
        // Add requireAuth query parameter and redirect to the same page
        // Also store the intended destination for redirect after login
        url.searchParams.set('requireAuth', 'true');
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    } else {
      // User is authenticated, remove requireAuth parameter if it exists
      const url = request.nextUrl.clone();
      if (url.searchParams.has('requireAuth')) {
        url.searchParams.delete('requireAuth');
        const redirectPath = url.searchParams.get('redirect');
        url.searchParams.delete('redirect');
        
        // If there's a redirect parameter, use it; otherwise use current pathname
        const finalPath = redirectPath || pathname;
        const finalUrl = url.searchParams.toString()
          ? `${finalPath}?${url.searchParams.toString()}`
          : finalPath;
        return NextResponse.redirect(new URL(finalUrl, request.url));
      }
    }
  }

  // Continue with internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

