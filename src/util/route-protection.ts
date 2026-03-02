/**
 * Route Protection utilities
 * Functions to protect routes and handle authentication redirects
 */

import { isAuthenticated, isTokenValid } from "./auth";

/**
 * Protect a route - redirect to login if not authenticated
 * @param redirectPath - Path to redirect to if not authenticated (default: '/login')
 * @returns true if authenticated, false otherwise
 */
export const protectRoute = (redirectPath: string = "/login"): boolean => {
  if (typeof window === "undefined") {
    return false; // Server-side, return false
  }

  if (!isAuthenticated() || !isTokenValid()) {
    // Redirect to login
    window.location.href = redirectPath;
    return false;
  }

  return true;
};

/**
 * Check if user can access a protected route
 * @returns true if user is authenticated and token is valid
 */
export const canAccessRoute = (): boolean => {
  return isAuthenticated() && isTokenValid();
};

/**
 * Get redirect path based on authentication status
 * @param protectedPath - Path to redirect to if authenticated
 * @param loginPath - Path to redirect to if not authenticated
 * @returns Path to redirect to
 */
export const getRedirectPath = (
  protectedPath: string = "/dashboard",
  loginPath: string = "/login"
): string => {
  if (canAccessRoute()) {
    return protectedPath;
  }
  return loginPath;
};

