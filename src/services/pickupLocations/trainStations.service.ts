import { StationsResponse } from "@/types/PickupLocations/trainstations";
import { fetcher } from "../api";

export const getTrainstations = () => {
  return fetcher<StationsResponse>("/train-stations/active");
};
