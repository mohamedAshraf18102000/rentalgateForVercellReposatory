import { fetcher } from "../api";
import { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";

export const getUserReservations = (reservationID: number) => {
  return fetcher<ReservationDetailsResponse>(
    `/reservations/${reservationID}/details`,
  );
};
