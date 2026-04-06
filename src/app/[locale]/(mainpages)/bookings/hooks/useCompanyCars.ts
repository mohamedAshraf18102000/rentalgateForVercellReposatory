import { useInfiniteQuery } from "@tanstack/react-query";
import { getCompanyCars } from "@/services/companyCars/cars.service";
import { CarApiResponse } from "@/types/companyCars/cars";

export interface CompanyCarsFilters {
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  searchType?: string;
  airportId?: string;
  trainStationId?: string;
  brandId?: string;
  typeId?: string;
  priceType?: string;
  sortBy?: string;
  latitude?: number;
  longitude?: number;
  page?: string | number;
  size?: string | number;
}


export const useCompanyCars = (filters: CompanyCarsFilters) => {
  return useInfiniteQuery<CarApiResponse>({
    queryKey: ["company-cars", filters],
    queryFn: ({ pageParam = 0 }) =>
      getCompanyCars(pageParam as number, filters),
    initialPageParam: 0,
    enabled: filters.latitude != null && filters.longitude != null,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });
};
