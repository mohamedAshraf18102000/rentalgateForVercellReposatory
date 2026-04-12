import { fetcher } from "../api";

export const cancelUserReservation = (reservationID: number) => {
  return fetcher<void>(`/reservations/${reservationID}`, {
    method: "DELETE",
  });
};
