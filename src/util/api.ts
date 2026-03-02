// API Configuration
import { getAuthHeader } from './auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elmakam.net/api';
export const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'https://elmakam.net/auth';

// Helper function to build full API URLs
export const URL = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to build full Auth URLs
export const AUTH_URL = (endpoint: string): string => {
  return `${AUTH_BASE_URL}${endpoint}`;
};

/**
 * Get default headers for API requests (includes auth token if available)
 * @param additionalHeaders - Additional headers to include
 * @returns Headers object
 */
export const getApiHeaders = (additionalHeaders: Record<string, string> = {}): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  // Add auth token if available (client-side only)
  if (typeof window !== 'undefined') {
    try {
      const authHeader = getAuthHeader();
      if (authHeader.Authorization) {
        headers['Authorization'] = authHeader.Authorization;
      }
    } catch {
      // Auth module not available
    }
  }

  return headers;
};

/**
 * Make authenticated API request
 * @param url - Full URL or endpoint
 * @param options - Fetch options
 * @returns Fetch response
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const headers = getApiHeaders(options.headers as Record<string, string>);

  return fetch(fullUrl, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });
};