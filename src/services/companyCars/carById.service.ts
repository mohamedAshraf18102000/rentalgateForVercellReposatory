import { CarDetailsResponse } from "@/types/companyCars/carDetails";
import { fetcher } from "../api";

export const getCompanyCarsByID = async (
  id: number,
): Promise<CarDetailsResponse> => {
  return fetcher<CarDetailsResponse>(`/company-car-branches/${id}`);
};
