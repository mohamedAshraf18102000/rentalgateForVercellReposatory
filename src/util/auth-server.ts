/**
 * Server-side authentication utilities
 * Functions to check authentication on the server (proxy)
 */

import { NextRequest } from "next/server";
import { isProtectedPath } from "./protected-routes";

const AUTH_TOKEN_KEY = "authToken";

/**
 * Get the authentication token from cookies (server-side)
 */
export const getAuthTokenFromRequest = (request: NextRequest): string | null => {
  return request.cookies.get(AUTH_TOKEN_KEY)?.value || null;
};

/**
 * Check if user is authenticated (server-side)
 */
export const isAuthenticatedOnServer = (request: NextRequest): boolean => {
  const token = getAuthTokenFromRequest(request);
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    const exp = payload.exp;

    if (!exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return exp > currentTime;
  } catch {
    return false;
  }
};

/**
 * @deprecated Use isProtectedPath from ./protected-routes instead
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return isProtectedPath(pathname);
};
