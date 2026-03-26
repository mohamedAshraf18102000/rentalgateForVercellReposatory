// ============================================================================
// Helper Functions
// ============================================================================

import type { ClientData } from "@/lib/api/types";

/**
 * Generate WhatsApp URL
 */
export const getWhatsAppUrl = (phone: string, message: string): string => {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/**
 * Check if current path is home page
 */
export const isHomePage = (pathname: string, locale: string): boolean => {
  return (
    pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`
  );
};

/**
 * Get user display name from ClientData
 */
export const getUserDisplayName = (
  userData: ClientData | null,
  fallback: string = "User",
): string => {
  if (!userData) return fallback;

  // Priority 1: clientName (if available in new API)
  if (userData.clientName) {
    return userData.clientName;
  }

  // Priority 2: full name (firstName + lastName)
  if (userData.clientName) {
    return `${userData.clientName}`;
  }

  // Fallback to firstName only
  if (userData.clientName) {
    return userData.clientName;
  }

  // Fallback to email
  if (userData.email) {
    return userData.email;
  }

  // Fallback to mobile
  if (userData.mobile) {
    return userData.mobile;
  }

  return fallback;
};
