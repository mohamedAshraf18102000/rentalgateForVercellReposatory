/**
 * Visibility utilities
 * Functions to control showing/hiding elements based on authentication state
 */

import { isAuthenticated, isTokenValid, getUserData } from "./auth";

/**
 * Show element only if user is authenticated
 * @returns true if authenticated, false otherwise
 */
export const showIfAuthenticated = (): boolean => {
  return isAuthenticated() && isTokenValid();
};

/**
 * Show element only if user is NOT authenticated
 * @returns true if not authenticated, false otherwise
 */
export const showIfNotAuthenticated = (): boolean => {
  return !isAuthenticated() || !isTokenValid();
};

/**
 * Show element only if user has specific role/permission
 * @param requiredRole - Role or permission to check
 * @returns true if user has the role, false otherwise
 */
export const showIfHasRole = (requiredRole: string): boolean => {
  if (!isAuthenticated()) return false;

  const userData = getUserData();
  if (!userData) return false;

  // Check if user has the required role
  // Adjust this based on your user data structure
  return userData.role === requiredRole || userData.permissions?.includes(requiredRole);
};

/**
 * Show element only if user has specific property
 * @param property - Property name to check
 * @param value - Value to check (optional)
 * @returns true if property exists (and matches value if provided)
 */
export const showIfHasProperty = (property: string, value?: any): boolean => {
  if (!isAuthenticated()) return false;

  const userData = getUserData();
  if (!userData) return false;

  if (value !== undefined) {
    return userData[property] === value;
  }

  return userData[property] !== undefined && userData[property] !== null;
};

/**
 * Conditional render helper
 * @param condition - Condition to check
 * @param authenticatedComponent - Component to show if authenticated
 * @param unauthenticatedComponent - Component to show if not authenticated
 * @returns Component based on condition
 */
export const conditionalRender = <T,>(
  condition: boolean,
  authenticatedComponent: T,
  unauthenticatedComponent: T
): T => {
  return condition ? authenticatedComponent : unauthenticatedComponent;
};

