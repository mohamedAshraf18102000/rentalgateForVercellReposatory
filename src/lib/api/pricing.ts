/**
 * Pricing API Utility
 * Simple utility to fetch pricing and save to cookie
 */

import { fetchReservationPricing, type PricingRequestParams, type PricingApiResponse, type PricingData } from '@/constants/api';
import { setCookie, getCookie } from '@/util/cookies';

const PRICING_COOKIE_NAME = 'reservation-pricing';

/**
 * Get pricing for reservation and save to cookie
 * @param params - Pricing request parameters
 * @returns Pricing data
 */
export const getReservationPricing = async (
  params: PricingRequestParams
): Promise<PricingApiResponse> => {
  try {
    const response = await fetchReservationPricing(params);
    
    // Save to cookie
    if (response.data) {
      setCookie(PRICING_COOKIE_NAME, JSON.stringify(response.data), 1); // Save for 1 day
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching pricing:', error);
    throw error;
  }
};

/**
 * Get pricing data from cookie
 * @returns Pricing data or null if not found
 */
export const getPricingFromCookie = (): PricingData | null => {
  try {
    const cookieData = getCookie(PRICING_COOKIE_NAME);
    if (!cookieData) return null;
    
    return JSON.parse(cookieData) as PricingData;
  } catch (error) {
    console.error('Error reading pricing from cookie:', error);
    return null;
  }
};

/**
 * Clear pricing cookie
 */
export const clearPricingCookie = (): void => {
  setCookie(PRICING_COOKIE_NAME, '', -1);
};

