import { CarCategoriesResponse } from "@/types/companyCars/carCategories";
import { fetcher } from "../api";

export const getCompanyCarsCategories =
  async (): Promise<CarCategoriesResponse> => {
    return fetcher<CarCategoriesResponse>(`/categories/by-status/ACTIVE`);
  };
