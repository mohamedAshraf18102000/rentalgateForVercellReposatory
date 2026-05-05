import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getCompanyCars,
  CarFilters,
} from "@/services/companyCars/cars.service";
import { CarApiResponse } from "@/types/companyCars/cars";

export const useCompanyCars = (filters: CarFilters) => {
  const hasAnyFilter = Object.values(filters).some(
    (value) =>
      value != null &&
      (typeof value !== "string" || value.trim() !== "") &&
      (!Array.isArray(value) || value.length > 0),
  );

  return useInfiniteQuery<CarApiResponse>({
    queryKey: ["company-cars", filters],
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: ({ pageParam = 0 }) =>
      getCompanyCars(pageParam as number, filters),
    initialPageParam: 0,
    enabled: hasAnyFilter,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });
};
