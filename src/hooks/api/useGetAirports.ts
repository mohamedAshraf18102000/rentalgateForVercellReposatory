import { getAirports } from "@/services/pickupLocations/airports.service";
import { useQuery } from "@tanstack/react-query";

export const useGetAirports = () => {
    return useQuery({
        queryKey: ["airports"],
        queryFn: () => getAirports(),
    })
}