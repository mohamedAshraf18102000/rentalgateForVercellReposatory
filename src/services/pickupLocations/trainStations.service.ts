import { fetcher } from "../api";
import { StationsResponse } from "@/types/PickupLocations/trainStations";

export const getTrainstations = () => {
  return fetcher<StationsResponse>("/train-stations");
};
