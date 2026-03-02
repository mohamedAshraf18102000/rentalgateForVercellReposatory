/**
 * Utility exports
 * Central export point for all utilities
 */

// Auth utilities
export {
  getAuthToken,
  getUserData,
  isAuthenticated,
  logout,
  getAuthHeader,
  isTokenValid,
} from "./auth";

// Route protection utilities
export {
  protectRoute,
  canAccessRoute,
  getRedirectPath,
} from "./route-protection";

// Visibility utilities
export {
  showIfAuthenticated,
  showIfNotAuthenticated,
  showIfHasRole,
  showIfHasProperty,
  conditionalRender,
} from "./visibility";

// Cookie utilities
export {
  setCookie,
  getCookie,
  deleteCookie,
  hasCookie,
  getAllCookies,
  clearAllCookies,
} from "./cookies";

// API utilities
export {
  API_BASE_URL,
  AUTH_BASE_URL,
  URL,
  AUTH_URL,
  getApiHeaders,
  authenticatedFetch,
} from "./api";

// Auth Guard Component
export { AuthGuard } from "./auth-guard";

// Image utilities
export {
  normalizeImageUrl,
  normalizeImageUrls,
} from "./image";
