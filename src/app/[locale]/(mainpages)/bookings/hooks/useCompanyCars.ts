import { useInfiniteQuery } from "@tanstack/react-query";
import { getCompanyCars } from "@/services/companyCars/cars.service";
import { CarApiResponse } from "@/types/companyCars/cars";

export const useCompanyCars = (filters: any) => {
  return useInfiniteQuery<CarApiResponse>({
    queryKey: ["company-cars", filters],
    queryFn: ({ pageParam = 0 }) =>
      getCompanyCars(pageParam as number, filters),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });
};
