/**
 * Reservation For Other Selector Types
 * Types for the Reservation For Other Selector component
 */

export interface ReservationForOtherData {
  name: string;
  phone: string;
  nationalId: string;
  licenseImage: string; // filename after upload
}

export interface ReservationForOtherSelectorProps {
  locale: string;
  reservationForOther: ReservationForOtherData | null;
  onReservationForOtherChange: (data: ReservationForOtherData | null) => void;
}

