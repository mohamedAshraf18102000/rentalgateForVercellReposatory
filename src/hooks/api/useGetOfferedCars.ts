import { useQuery } from "@tanstack/react-query";
import { getOfferedCars } from "@/services/companyCars/offeredCars.service";

export const useGetOfferedCars = (id: number) => {
    return useQuery({
        queryKey: ["offeredCars", id],
        queryFn: () => getOfferedCars(id),
        enabled: !!id,
    });
};
