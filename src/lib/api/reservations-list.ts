/**
 * Reservations List API
 * Handles fetching current and finished reservations
 */

import { URL } from "@/util/api";

export enum ReservationStatus {
  PAYMENT_PENDING = 0,
  TEMPORARY = 1,
  APPROVED = 2,
  ACTIVE = 3,
  FINISHED = 4,
  CANCELLED = 5,
  CANCELED = 6,
  CLAIMED = 7,
}

export interface ReservationForOther {
  id: number;
  reservationId: number;
  fullName: string;
  phone: string;
  nationalId: string;
  licenseImage: string;
}

export interface Reservation {
  reservationId: number;
  finalAmount: number;
  startTime?: string;
  endTime?: string;
  startDate: string;
  endDate: string;
  reservationStatus: ReservationStatus;
  fromBranchName: string;
  fromBranchArName: string;
  toBranchName: string;
  toBranchArName: string;
  deliveryLongitude: number | null;
  deliveryLatitude: number | null;
  pickupLongitude: number | null;
  pickupLatitude: number | null;
  deliveryAddress: string | null;
  pickupAddress: string | null;
  carId: number;
  carName: string;
  carImage?: string;
  defaultImage?: string;
  carDescription?: string;
  carDescriptionAr?: string;
  reservationForOther?: ReservationForOther | null;
  modelEnglishName: string;
  modelArabicName: string;
  brandName: string;
  brandArabicName: string;
  year: number; 
}

export interface GetReservationsResponse {
  message: string;
  data: Reservation[];
}

/**
 * Get current reservations
 */
export async function getCurrentReservations(
  token: string | null | undefined
): Promise<GetReservationsResponse> {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  try {
    const res = await fetch(URL('/reservations/get-current-reservations'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch current reservations: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching current reservations:', error);
    throw error;
  }
}

/**
 * Get finished reservations
 */
export async function getFinishedReservations(
  token: string | null | undefined
): Promise<GetReservationsResponse> {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  try {
    const res = await fetch(URL('/reservations/get-finished-reservations'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch finished reservations: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching finished reservations:', error);
    throw error;
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: ReservationStatus, locale: string): string {
  const labels: Record<ReservationStatus, { ar: string; en: string }> = {
    [ReservationStatus.PAYMENT_PENDING]: { ar: 'بانتظار الدفع', en: 'Payment Pending' },
    [ReservationStatus.TEMPORARY]: { ar: ' غير مدفوع ', en: 'Cash Payment' },
    [ReservationStatus.APPROVED]: { ar: 'مدفوع', en: 'Confirmed' },
    [ReservationStatus.ACTIVE]: { ar: 'نشط الآن', en: 'Active  ' },
    [ReservationStatus.FINISHED]: { ar: 'انتهت', en: 'Finished' },
    [ReservationStatus.CANCELLED]: { ar: 'تم الإلغاء', en: 'Cancelled' },
    [ReservationStatus.CANCELED]: { ar: 'تم الإلغاء', en: 'Cancelled' },
    [ReservationStatus.CLAIMED]: { ar: 'مطالب به', en: 'Claimed' },
  };

  return locale === 'ar' ? labels[status].ar : labels[status].en;
}

/**
 * Get status color
 */
export function getStatusColor(status: ReservationStatus): string {
  const colors: Record<ReservationStatus, string> = {
    [ReservationStatus.PAYMENT_PENDING]: 'bg-orange-100 text-orange-600',
    [ReservationStatus.TEMPORARY]: 'bg-orange-100 text-orange-600',
    [ReservationStatus.APPROVED]: 'bg-blue-100 text-blue-600',
    [ReservationStatus.ACTIVE]: 'bg-green-100 text-green-600',
    [ReservationStatus.FINISHED]: 'bg-gray-100 text-gray-600',
    [ReservationStatus.CANCELLED]: 'bg-red-100 text-red-600',
    [ReservationStatus.CANCELED]: 'bg-red-100 text-red-600',
    [ReservationStatus.CLAIMED]: 'bg-red-100 text-red-600',
  };

  return colors[status];
}

