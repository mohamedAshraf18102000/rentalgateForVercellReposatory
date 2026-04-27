import { ReservationFormValues } from "@/lib/validations/reservationSchema";

export interface StepContentProps {
  activeStep: number;
  isForOtherReservation?: boolean;
}

export interface StepContentRef {
  validateStep: () => Promise<boolean>;
  getValues: () => ReservationFormValues;
  resetForm: () => void;
  setPickupLocationFromSavedAddress: (payload: {
    pickupId: string;
    pickupName: string;
    pickupLat: number;
    pickupLong: number;
  }) => void;
  setReturnLocationFromSavedAddress: (payload: {
    carReturnLocationId: string;
    carReturnLocation: string;
    returnLat: number;
    returnLong: number;
  }) => void;
}
