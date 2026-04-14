import { fetcher } from "../api";

export type ChangeLocationPayload = {
  reservationId: number;
  receiveLatitude: number;
  receiveLongitude: number;
  deliverLatitude: number;
  deliverLongitude: number;
};

export const changeReservationLocation = async (
  payload: ChangeLocationPayload
): Promise<void> => {
  return fetcher<void>("/reservations/change-location", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};