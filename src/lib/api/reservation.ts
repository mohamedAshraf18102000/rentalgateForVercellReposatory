/**
 * Reservation API Types and Functions
 * Functions to create and manage car reservations
 */

import { URL } from '@/constants/api';
import { getAuthToken } from '@/util/auth';

// Reservation request payload interface
export interface CreateReservationParams {
  carId: number;
  reservationStartDate: string; // ISO format: YYYY-MM-DDTHH:mm:ss.SSS
  reservationEndDate: string; // ISO format: YYYY-MM-DDTHH:mm:ss.SSS
  reservationType: number; // 1 for regular rental
  fromBranch: number;
  toBranch: number;
  carExtraKmQuota?: number | null;
  extraServices?: number[];
  points?: number;
  promoCode?: string;
  insurance?: number; // 0 or 1
  extraKm?: number;
  os: number; // 1 for web
  paymentMethod?: 'card' | 'cash';
  reservationForOther?: {
    name: string;
    phone: string;
    nationalId: string;
    licenseImage: string;
    identityExpiryDate?: string;
    licenseExpirationDate?: string;
  };
}

// Reservation response interface
export interface ReservationApiResponse {
  message: string;
  status: boolean;
  data: {
    reservationId: number;
    total: number;
    paymentUrl?: string;
    [key: string]: any;
  };
}

/**
 * Create a new car reservation
 * @param params - Reservation parameters
 * @returns Reservation response with ID and payment details
 */
export const createReservation = async (
  params: CreateReservationParams
): Promise<ReservationApiResponse> => {
  try {
    // Get auth token
    const token = getAuthToken();
    if (!token) {
      throw new Error('AUTH_TOKEN_MISSING');
    }

    // Prepare payload
    const payload = {
      carId: params.carId,
      reservationStartDate: params.reservationStartDate,
      reservationEndDate: params.reservationEndDate,
      reservationType: params.reservationType || 1,
      fromBranch: params.fromBranch,
      toBranch: params.toBranch,
      os: params.os || 1,
      ...(params.carExtraKmQuota !== undefined && params.carExtraKmQuota !== null && { carExtraKmQuota: params.carExtraKmQuota }),
      ...(params.extraServices && params.extraServices.length > 0 && { extraServices: params.extraServices }),
      ...(params.points !== undefined && { points: params.points }),
      ...(params.promoCode && { promoCode: params.promoCode }),
      ...(params.insurance !== undefined && { insurance: params.insurance }),
      ...(params.extraKm !== undefined && { extraKm: params.extraKm }),
      ...(params.paymentMethod && { paymentMethod: params.paymentMethod }),
      ...(params.reservationForOther && { reservationForOther: params.reservationForOther }),
    };

    console.log('📤 Sending reservation:', payload);

    // Determine API endpoint based on payment method
    const apiEndpoint = params.paymentMethod === 'cash' 
      ? '/reservations/cash' 
      : '/reservations';

    console.log(`📡 Using endpoint: ${apiEndpoint} (paymentMethod: ${params.paymentMethod})`);

    // Make API request
    const res = await fetch(URL(apiEndpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Parse response
    const text = await res.text();
    let json: ReservationApiResponse;

    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      const error = new Error('Failed to parse API response');
      (error as any).apiMessage = 'INVALID_RESPONSE';
      (error as any).status = res.status;
      throw error;
    }

    console.log('📥 API Response:', json);

    // Check if response is successful
    // API returns message: "SUCCESS" with data object
    if (!res.ok || json.message !== 'SUCCESS' || !json.data) {
      const errorMessage = json.message || 'Failed to create reservation';
      const error = new Error(errorMessage);
      (error as any).apiMessage = json.message;
      (error as any).status = res.status;
      throw error;
    }

    console.log('✅ Reservation created:', json.data);
    return json;
  } catch (error) {
    console.error('❌ Error creating reservation:', error);
    
    // Re-throw with API message if available
    if (error instanceof Error && (error as any).apiMessage) {
      throw error;
    }
    
    // Wrap in new error
    if (error instanceof Error) {
      const wrappedError = new Error(`API Error in createReservation: ${error.message}`);
      (wrappedError as any).apiMessage = error.message;
      throw wrappedError;
    }
    
    throw error;
  }
};

