import { getTrainstations } from "@/services/pickupLocations/trainStations.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTrainStations = () => {
    return useQuery({
        queryKey: ["trainStations"],
        queryFn: () => getTrainstations(),
    })
}