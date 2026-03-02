/**
 * Reservation Details API
 * Fetches single reservation details by ID
 */

import { URL } from "@/util/api";

export interface ReservationDetails {
  reservationId: number;
  contractNumber: string | null;
  reservationStatus: number;
  paymentMethod: number | null;
  reservationType: number;
  startDate: string;
  endDate: string;
  days: number;
  paymentType: number;
  fromBranchId: number;
  fromBranchName: string;
  fromBranchArName: string;
  toBranchId: number;
  toBranchName: string;
  toBranchArName: string;
  clientId: number;
  clientName: string;
  clientMobile: string;
  carName: string;
  carImage: string;
  modelArabicName?: string;
  modelEnglishName?: string;
  brandArabicName?: string;
  brandName?: string;
  year?: number;
  pickupLongitude: number | null;
  pickupLatitude: number | null;
  pickupAddress: string | null;
  deliveryLongitude: number | null;
  deliveryLatitude: number | null;
  deliveryAddress: string | null;
  total: number;
  subtotal: number;
  tax: number;
  paidAmount: number;
  serviceIds: string | null;
  servicesCost: number;
  basePrice: number;
  extraHoursCostWithVat: number;
  anotherBranchCost: number;
  deliveryCost: number;
  pickupCost: number;
  insuranceValue: number;
  extraKmCost: number;
  extraKmPackage: number;
  extraKms: number ;
  pointsDiscount: number;
  promoDiscount: number;
  memberShipDiscount: number;
  totalDiscount: number;
  typeArabicName: string;
  typeEnglishName: string;
  cancellationReasonAr: string | null;
  cancellationReasonEn: string | null;
  cancellationReasonNotes: string | null;
  transactionReference: string | null;
  numberOfPassengers: number;
  reservationExtensions?: ReservationExtension[];
  reservationForOther?: {
    id: number;
    reservationId: number;
    fullName: string;
    phone: string;
    nationalId: string;
    licenseImage: string;
  } | null;
  // TODO: Backend should provide these fields:
  // dailyPriceAfterDiscount?: number; // السعر اليومي بعد الخصم
  // carOfferDiscount?: number; // خصم عرض السيارة
  // totalPoints?: number; // عدد النقاط المستخدمة (بدلاً من pointsDiscount فقط)
}

export interface ReservationExtension {
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
  cancellationReasonId: number | null;
  cancellationReasonNotes: string | null;
}

export interface GetReservationDetailsResponse {
  message: string;
  data: ReservationDetails;
}

/**
 * Get reservation details by ID
 */
export async function getReservationDetails(
  reservationId: number,
  token: string
): Promise<GetReservationDetailsResponse> {
  try {
    const res = await fetch(URL(`/reservations/show/${reservationId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reservation details: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching reservation details:', error);
    throw error;
  }
}

/**
 * Service interface for reservation services
 */
export interface ReservationService {
  serviceId: number;
  nameEnglish: string;
  nameArabic: string;
  serviceType: string;
  serviceAvailability: string;
  iconUrl: string | null;
  detailsEnglish: string | null;
  detailsArabic: string | null;
  price: number;
  notes: string | null;
}

export interface GetReservationServicesResponse {
  message: string;
  data: ReservationService[];
}

/**
 * Get reservation services by reservation ID
 */
export async function getReservationServices(
  reservationId: number,
  token: string
): Promise<GetReservationServicesResponse> {
  try {
    const res = await fetch(URL(`/reservations/${reservationId}/service`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reservation services: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching reservation services:', error);
    throw error;
  }
}

/**
 * Reservation Totals interface
 * Total costs after all extensions
 */
export interface ReservationTotals {
  totalBaseCost: number;
  totalExtraHoursCost: number;
  totalServicesCost: number;
  totalInsuranceCost: number;
  totalFinalAmount: number;
  totalDays: number;
  lastEndDate: string;
  lastEndTime: string;
}

export interface GetReservationTotalsResponse {
  message: string;
  data: ReservationTotals;
}

/**
 * Get reservation totals (including extensions) by reservation ID
 */
export async function getReservationTotals(
  reservationId: number,
  token: string
): Promise<GetReservationTotalsResponse> {
  try {
    const res = await fetch(URL(`/reservations/totals/${reservationId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reservation totals: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching reservation totals:', error);
    throw error;
  }
}

