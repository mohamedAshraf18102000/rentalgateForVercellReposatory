import { fetcher } from "../api";

export type CreateRatingPayload = {
  reservationId: number;
  rate: number;
  companyRate: number;
  comments: string;
};

export const createRating = (payload: CreateRatingPayload) => {
  return fetcher("/client/ratings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
