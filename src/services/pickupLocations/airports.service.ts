import { fetcher } from "../api";
import { AirportsResponse } from "@/types/PickupLocations/airports";

export const getAirports = () => {
  return fetcher<AirportsResponse>("/airports");
};
