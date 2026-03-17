import { CarModelsResponse } from "@/types/companyCars/carModel";
import { fetcher } from "../api";

export const getCarModelByBrands = async (
  brandId: number,
): Promise<CarModelsResponse> => {
  return fetcher<CarModelsResponse>(`/car-types/by-brand/${brandId}`);
};
