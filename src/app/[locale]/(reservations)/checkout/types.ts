/**
 * Reservation Data Types
 * Types for the reservation response data
 */

export interface ReservationData {
  reservationId: number;
  total: number;
  subTotal: number;
  paidAmount: number;
  totalDiscount: number;
  startDate: string;
  endDate: string;
  paymentType: string | null;
  fromBranchName: string;
  fromBranchArName: string;
  toBranchName: string;
  toBranchArName: string;
  deliveryLongitude: number | null;
  deliveryLatitude: number | null;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  deliveryAddress: string | null;
  pickupAddress: string | null;
  carName: string;
  defaultImage: string;
  images: string[];
  typeArabicName: string;
  typeEnglishName: string;
  year: number;
  modelEnglishName: string;
  modelArabicName: string;
  brandName: string;
  brandArabicName: string;
}

