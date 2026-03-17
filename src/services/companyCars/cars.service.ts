import { fetcher } from "../api";
import { CarApiResponse } from "@/types/companyCars/cars";

interface CarFilters {
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  airportId?: string;
  trainStationId?: string;
  brandId?: string;
}

export const getCompanyCars = async (
  page: number = 0,
  filters?: CarFilters,
): Promise<CarApiResponse> => {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("size", "20");

  if (filters) {
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.airportId) params.set("airportId", filters.airportId);
    if (filters.trainStationId) params.set("trainStationId", filters.trainStationId);
    if (filters.brandId) params.set("brandId", filters.brandId);
  }

  return fetcher<CarApiResponse>(
    `/company-cars/filter-and-sort?${params.toString()}`,
  );
};
