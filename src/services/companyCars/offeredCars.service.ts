import { OfferCarsResponse } from "@/types/offeredCars/offeredCars";
import { fetcher } from "../api";

export const getOfferedCars = async (
  id: number,
  options?: Parameters<typeof fetcher>[1],
): Promise<OfferCarsResponse> => {
  return fetcher<OfferCarsResponse>(
    `/company-offers/${id}/cars`,
    options,
  );
};
