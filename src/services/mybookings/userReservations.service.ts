import { fetcher } from "../api";
import {
  UserReservationsResponse,
  UserReservationsPaylod,
} from "@/types/myBookings/myBookings";

export const getUserReservations = (payload: UserReservationsPaylod) => {
  return fetcher<UserReservationsResponse>(
    `/reservations/${payload.localStatus}`,
  );
};
