import { CarDetailsResponse } from "@/types/companyCars/carDetails";
import { fetcher } from "../api";

export const getCompanyCarsByID = async (
  id: number,
  options?: Parameters<typeof fetcher>[1],
): Promise<CarDetailsResponse> => {
  return fetcher<CarDetailsResponse>(`/company-car-branches/${id}`, options);
};
