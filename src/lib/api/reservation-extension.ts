/**
 * Reservation Extension API
 * Functions to handle reservation extensions (تمديد الحجز)
 */

import { URL } from '@/constants/api';
import { getAuthToken } from '@/util/auth';

// Extension pricing request parameters
export interface ExtensionPricingParams {
  reservationId: number;
  reservationEndDate: string; // ISO format: YYYY-MM-DDTHH:mm:ss.SSS
  insurance?: number; // 0 or 1
  points?: number;
  promoCode?: string;
  os: number; // 1 for web
}

// Extension pricing response data
export interface ExtensionPricingData {
  datingType: number;
  numOfDays: number;
  extraHoursCostWithVat: number;
  originalDailyPrice: number;
  originalDailyPriceWithoutVat: number;
  dailyPriceAfterDiscount: number;
  dailyPriceAfterDiscountWithoutVat: number;
  basePrice: number;
  insurance: number;
  anotherBranchPrice: number;
  pickupFee: number;
  deliveryFee: number;
  totalDeliveryFee: number;
  membershipDiscount: number;
  membershipLuxuryCarDiscount: number;
  carOfferDiscount: number;
  finalPriceWithExtraHoursCost: number;
  finalPriceBeforeDiscount: number;
  finalTotalPrice: number;
  totalPoints: number;
  totalPromoValue: number;
  tax: number;
  extraServicesCost: number;
  extraKmCost: number;
  extraNewDayHours: number;
}

export interface ExtensionPricingApiResponse {
  message: string;
  data: ExtensionPricingData;
}

/**
 * Get pricing for reservation extension
 */
export const getExtensionPricing = async (
  params: ExtensionPricingParams
): Promise<ExtensionPricingApiResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('AUTH_TOKEN_MISSING');
    }

    const payload = {
      reservationId: params.reservationId,
      reservationEndDate: params.reservationEndDate,
      os: params.os || 1,
      ...(params.insurance !== undefined && { insurance: params.insurance }),
      ...(params.points !== undefined && { points: params.points }),
      ...(params.promoCode && { promoCode: params.promoCode }),
    };

    console.log('📤 Fetching extension pricing:', payload);

    const res = await fetch(URL('/reservations-extensions/pricing'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let json: ExtensionPricingApiResponse;

    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      const error = new Error('Failed to parse API response');
      (error as any).apiMessage = 'INVALID_RESPONSE';
      throw error;
    }

    if (!res.ok || json.message !== 'SUCCESS') {
      const error = new Error(json.message || 'Failed to fetch extension pricing');
      (error as any).apiMessage = json.message;
      throw error;
    }

    // Ensure basePrice is set - use from API if available, otherwise calculate from dailyPriceAfterDiscount * numOfDays
    if (json.data) {
      const apiBasePrice = (json.data as any).basePrice;
      if (apiBasePrice !== undefined && apiBasePrice !== null && apiBasePrice > 0) {
        json.data.basePrice = apiBasePrice;
      } else {
        // Calculate basePrice from dailyPriceAfterDiscount * numOfDays
        json.data.basePrice = json.data.dailyPriceAfterDiscount * json.data.numOfDays;
      }
    }

    console.log('✅ Extension pricing fetched:', json.data);
    return json;
  } catch (error) {
    console.error('❌ Error fetching extension pricing:', error);
    throw error;
  }
};

// Create extension request parameters
export interface CreateExtensionParams {
  reservationId: number;
  reservationEndDate: string; // ISO format: YYYY-MM-DDTHH:mm:ss.SSS
  insurance?: number; // 0 or 1
  points?: number;
  promoCode?: string;
  os: number; // 1 for web
  paymentMethod?: 'card' | 'cash';
}

// Extension response
export interface ExtensionApiResponse {
  message: string;
  status: boolean;
  data: {
    reservationExtensionId: number;
    extensionDate: string;
    basePrice: number;
    endDate: string;
    endTime: string;
    reservationStatus: number;
    days: number;
    insurance: number;
    insuranceValue: number;
    servicesCost: number;
    paymentType: number | null;
    points: number;
    pointsValue: number;
    promoCode: string | null;
    promoValue: number;
    extraHours: number;
    extraHoursValue: number;
    os: number;
    amount: number;
    discount: number;
    tax: number;
    finalAmount: number;
    [key: string]: any;
  };
}

/**
 * Create a reservation extension
 */
export const createExtension = async (
  params: CreateExtensionParams
): Promise<ExtensionApiResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('AUTH_TOKEN_MISSING');
    }

    const payload = {
      reservationId: params.reservationId,
      reservationEndDate: params.reservationEndDate,
      os: params.os || 1,
      ...(params.insurance !== undefined && { insurance: params.insurance }),
      ...(params.points !== undefined && { points: params.points }),
      ...(params.promoCode && { promoCode: params.promoCode }),
      ...(params.paymentMethod && { paymentMethod: params.paymentMethod }),
    };

    console.log('📤 Creating extension:', payload);

    const res = await fetch(URL('/reservations-extensions'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let json: ExtensionApiResponse;

    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      const error = new Error('Failed to parse API response');
      (error as any).apiMessage = 'INVALID_RESPONSE';
      throw error;
    }

    if (!res.ok || json.message !== 'SUCCESS' || !json.data) {
      const error = new Error(json.message || 'Failed to create extension');
      (error as any).apiMessage = json.message;
      throw error;
    }

    console.log('✅ Extension created:', json.data);
    return json;
  } catch (error) {
    console.error('❌ Error creating extension:', error);
    throw error;
  }
};

// Complete extension payment parameters
export interface CompleteExtensionPaymentParams {
  reservationId: number;
  transactionReference: string;
  paidAmount: number;
  paid: boolean;
  pointsUsed: number;
  paymentResult: {
    responseCode: string;
    responseMessage: string;
    responseStatus: string;
    transactionTime: string;
  };
}

export interface CompleteExtensionPaymentResponse {
  message: string;
  status: boolean;
  data: any;
}

/**
 * Complete extension payment
 */
export const completeExtensionPayment = async (
  params: CompleteExtensionPaymentParams
): Promise<CompleteExtensionPaymentResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('AUTH_TOKEN_MISSING');
    }

    console.log('📤 Completing extension payment:', params);

    const res = await fetch(URL('/reservations-extensions/complete-payment'), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    const text = await res.text();
    let json: CompleteExtensionPaymentResponse;

    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      const error = new Error('Failed to parse API response');
      (error as any).apiMessage = 'INVALID_RESPONSE';
      throw error;
    }

    if (!res.ok || json.message !== 'SUCCESS') {
      const error = new Error(json.message || 'Failed to complete extension payment');
      (error as any).apiMessage = json.message;
      throw error;
    }

    console.log('✅ Extension payment completed:', json.data);
    return json;
  } catch (error) {
    console.error('❌ Error completing extension payment:', error);
    throw error;
  }
};

