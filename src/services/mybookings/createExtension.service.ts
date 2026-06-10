import { fetcher } from "../api";
import type { ExtendReservationPayload } from "./extendReservation.service";

export interface CreateExtensionResponse {
  extendId: number;
  reservationId: number;
  reservationNumber: string;
  extendDate: string;
  endDate: string;
  days: number;
  daysCost: number;
  servicesCost: number;
  driverCost: number;
  total: number;
  status: string;
}

export const createExtension = (payload: ExtendReservationPayload) => {
  return fetcher<CreateExtensionResponse>("/reservation-extends", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
