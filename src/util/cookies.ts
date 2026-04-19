/**
 * Cookie utility functions
 * Helper functions to set, get, and delete cookies
 */

/**
 * Set a cookie with permanent expiration (never expires)
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (deprecated, cookie will never expire)
 */
export const setCookie = (name: string, value: string, days?: number): void => {
  if (typeof document === 'undefined') {
    console.warn('Cookies can only be set in the browser');
    return;
  }

  // Set expiration date to far future (year 2099) so cookie never expires
  const date = new Date();
  date.setFullYear(2099, 11, 31); // December 31, 2099
  const expires = `expires=${date.toUTCString()};`;

  document.cookie = `${name}=${encodeURIComponent(value)};${expires}path=/;SameSite=Lax`;
};

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

/**
 * Delete a cookie by setting its expiration date to the past
 * @param name - Cookie name
 */
export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') {
    console.warn('Cookies can only be deleted in the browser');
    return;
  }

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
};

/**
 * Check if a cookie exists
 * @param name - Cookie name
 * @returns true if cookie exists, false otherwise
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Get all cookies as an object
 * @returns Object with all cookies as key-value pairs
 */
export const getAllCookies = (): Record<string, string> => {
  if (typeof document === 'undefined') {
    return {};
  }

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    const [name, value] = cookie.split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  }

  return cookies;
};

/**
 * Clear all application cookies and reset state management stores
 * Deletes all cookies used by the application and resets Zustand stores
 */
export const clearAllCookies = (): void => {
  if (typeof document === 'undefined') {
    console.warn('Cookies can only be cleared in the browser');
    return;
  }

  // List of all cookies used in the application
  const cookieNames = [ 
    'booking-validation-storage',
    'car-filter-storage',
    'reservation-pricing',
    'extension-data',
    'pickupTime',
    'dropoffTime',
    'company-quotation-form',
    'company-quotation-step',
  ];

  // Delete each cookie
  cookieNames.forEach((name) => {
    deleteCookie(name);
  });

  // Also delete any cookies that might exist but aren't in the list
  // Get all cookies and delete them
  const allCookies = getAllCookies();
  Object.keys(allCookies).forEach((name) => {
    if (!cookieNames.includes(name)) {
      // Only delete cookies that look like application cookies
      // Skip cookies that might be from other services (like analytics)
      if (
        name.includes('storage') ||
        name.includes('validation') ||
        name.includes('filter') ||
        name.includes('pricing') ||
        name.includes('extension') ||
        name.includes('quotation') ||
        name.includes('Time')  
      ) {
        deleteCookie(name);
      }
    }
  });

  // Reset Zustand stores (only in browser environment)
  // Use dynamic import to avoid circular dependency
  if (typeof window !== 'undefined') {
    try {
      // Dynamically import stores to avoid circular dependency
      import('@/lib/api/stores').then((stores) => {
        // Reset filter store
        const filterState = stores.useFilterStore.getState();
        if (filterState?.reset) {
          filterState.reset();
        }

        // Reset car data store
        const carDataState = stores.useCarDataStore.getState();
        if (carDataState?.reset) {
          carDataState.reset();
        }
      }).catch((error) => {
        console.warn('Error resetting stores:', error);
      });
    } catch (error) {
      console.warn('Error importing stores:', error);
    }
  }
};
