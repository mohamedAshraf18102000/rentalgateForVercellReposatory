// ============================================================================
// Helper Functions
// ============================================================================

import type { ClientData } from '@/lib/api/types';

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
  return pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/`;
};

/**
 * Get user display name from ClientData
 */
export const getUserDisplayName = (userData: ClientData | null, fallback: string = 'User'): string => {
  if (!userData) return fallback;
  
  // Try to get full name (firstName + lastName)
  if (userData.firstName && userData.lastName) {
    return `${userData.firstName} ${userData.lastName}`;
  }
  
  // Fallback to firstName only
  if (userData.firstName) {
    return userData.firstName;
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

