import { fetcher } from "../api";
import { BrandsResponse } from "@/types/companyCars/brands";

export const getCarBrands = async (): Promise<BrandsResponse> => {
  return fetcher<BrandsResponse>(`/brands`);
};
