import { fetcher } from "../api";

export const cancelUserReservation = (reservationID: number, reasonId: number, notes: string) => {
  return fetcher(`/reservations/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ reservationId: reservationID, cancellationReasonId: reasonId, cancellationReasonNote: notes }),
  });
};
