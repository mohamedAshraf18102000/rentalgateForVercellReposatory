import { fetcher } from "../api";
import { CarApiResponse } from "@/types/companyCars/cars";

export const getCompanyCars = async (
  page: number = 0,
): Promise<CarApiResponse> => {
  return fetcher<CarApiResponse>(`/company-cars?page=${page}&size=20`);
};
