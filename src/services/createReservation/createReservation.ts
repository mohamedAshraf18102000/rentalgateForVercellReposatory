import { fetcher } from "../api";

export interface DataForReservation {
  promoId: number | null;
  days: number;
  pointsUsed: number;
  carHasOffer: boolean;
  clientId: number;
  temporaryPriceId: number | null;
  extraHours: number;
  driverDays: number;
  driverHours: number;
  driverExtraHours: number;
  receiveBranchId: number | null;
  deliveryBranchId: number | null;
  services: {
    serviceId: number;
    price: number;
  }[];
}

export interface CreateReservationResponse {
  reservationId: number;
  total: number;
}

export const createReservation = (payload: any) => {
  if (
    !payload.startDate ||
    !payload.endDate ||
    !payload.receive?.type ||
    !payload.deliver?.type
  ) {
    return Promise.reject(new Error("FE-STOP-TOAST"));
  }

  return fetcher<CreateReservationResponse>("/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
