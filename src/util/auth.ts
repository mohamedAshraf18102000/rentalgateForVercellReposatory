/**
 * Authentication utilities
 * Functions to manage authentication state and tokens
 */

import { getCookie, deleteCookie } from "./cookies";

const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

/**
 * Get the authentication token from cookies
 * @returns Token string or null if not found
 */
export const getAuthToken = (): string | null => {
  return getCookie(AUTH_TOKEN_KEY);
};

/**
 * Get user data from cookies
 * @returns User data object or null if not found
 */
export const getUserData = (): any | null => {
  const userDataStr = getCookie(USER_DATA_KEY);
  if (!userDataStr) return null;

  try {
    const data = JSON.parse(userDataStr);
    // Normalize data to ensure clientName is always available
    if (data) {
      if (!data.clientName && data.firstName) {
        data.clientName = data.firstName;
      }
      if (!data.firstName && data.clientName) {
        data.firstName = data.clientName;
      }
    }
    return data;
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns true if token exists, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Logout user by clearing auth cookies
 */
export const logout = (): void => {
  deleteCookie(AUTH_TOKEN_KEY);
  deleteCookie(USER_DATA_KEY);
};

/**
 * Get authorization header for API requests
 * @returns Authorization header object or empty object
 */
export const getAuthHeader = (): { Authorization?: string } => {
  const token = getAuthToken();
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Check if token is valid (not expired)
 * Note: This is a basic check. For full validation, decode JWT and check expiration
 * @returns true if token exists, false otherwise
 */
export const isTokenValid = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // Basic JWT structure check
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;

    if (!exp) return true; // No expiration claim

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    return exp > currentTime;
  } catch {
    return false;
  }
};

