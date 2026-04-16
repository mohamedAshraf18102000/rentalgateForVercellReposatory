import { OfferCarsResponse } from "@/types/offeredCars/offeredCars";
import { fetcher } from "../api";

export const getOfferedCars = async (
  id: number,
): Promise<OfferCarsResponse> => {
  return fetcher<OfferCarsResponse>(
    `/company-offers/${id}/cars`,
  );
};
