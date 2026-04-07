import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getCompanyCars,
  CarFilters,
} from "@/services/companyCars/cars.service";
import { CarApiResponse } from "@/types/companyCars/cars";

export const useCompanyCars = (filters: CarFilters) => {
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
