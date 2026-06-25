import { fetcher } from "../api";

export type ChangeLocationPayload = {
  reservationId: number;
  receiveLatitude: number;
  receiveLongitude: number;
  deliverLatitude: number;
  deliverLongitude: number;
};

export type ChangeLocationResponse = {
  message: string;
};

export const changeReservationLocation = async (
  payload: ChangeLocationPayload,
): Promise<ChangeLocationResponse> => {
  return fetcher<ChangeLocationResponse>("/reservations/change-location", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};