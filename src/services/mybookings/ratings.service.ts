import { fetcher } from "../api";

export type CreateRatingPayload = {
  reservationId: number;
  companyRate?: number;
  rate?: number;
  deliveryDriverRate?: number;
  pickupDriverRate?: number;
  deliveryDriverComments?: string;
  pickupDriverComments?: string;
  comments: string;
  serviceDriverRate?: number;
  serviceDriverComments?: string;
};

export const createRating = (payload: CreateRatingPayload) => {
  return fetcher("/client/ratings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
