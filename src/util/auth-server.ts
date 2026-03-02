/**
 * Server-side authentication utilities
 * Functions to check authentication on the server (middleware)
 */

import { NextRequest } from 'next/server';

const AUTH_TOKEN_KEY = 'authToken';

/**
 * Get the authentication token from cookies (server-side)
 * @param request - NextRequest object
 * @returns Token string or null if not found
 */
export const getAuthTokenFromRequest = (request: NextRequest): string | null => {
  return request.cookies.get(AUTH_TOKEN_KEY)?.value || null;
};

/**
 * Check if user is authenticated (server-side)
 * @param request - NextRequest object
 * @returns true if token exists, false otherwise
 */
export const isAuthenticatedOnServer = (request: NextRequest): boolean => {
  const token = getAuthTokenFromRequest(request);
  if (!token) return false;

  try {
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Decode payload to check expiration
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const exp = payload.exp;

    if (!exp) return true; // No expiration claim

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    return exp > currentTime;
  } catch {
    return false;
  }
};

/**
 * List of protected routes that require authentication
 */
export const protectedRoutes = [
  '/profile', 
  '/booking',
  // Add more protected routes here
];

/**
 * Check if a path is a protected route
 * @param pathname - Path to check
 * @returns true if route is protected, false otherwise
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return protectedRoutes.some((route) => pathname.startsWith(route));
};

