import { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";

type LocationDialogTab = "airport" | "trainStation" | "branches" | "currentLocation";

export const inferLocationType = ({
  explicitType,
  airportId,
  trainId,
  branchId,
  lat,
  long,
}: {
  explicitType:
    | "BRANCH"
    | "MY_LOCATION"
    | "TRAIN_STATION"
    | "AIRPORT"
    | null
    | undefined;
  airportId?: number | null;
  trainId?: number | null;
  branchId?: string | null;
  lat?: number | null;
  long?: number | null;
}) => {
  if (explicitType) return explicitType;
  if (airportId != null) return "AIRPORT" as const;
  if (trainId != null) return "TRAIN_STATION" as const;
  if (branchId) return "BRANCH" as const;
  if (lat != null && long != null) return "MY_LOCATION" as const;
  return null;
};

export const getLocationDialogInitialTab = (
  shouldDisableCurrentLocationTab: boolean,
  locationType: ReservationFormData["pickupType"],
): LocationDialogTab => {
  if (shouldDisableCurrentLocationTab && locationType === "AIRPORT") {
    return "airport";
  }
  if (shouldDisableCurrentLocationTab && locationType === "TRAIN_STATION") {
    return "trainStation";
  }
  if (shouldDisableCurrentLocationTab) {
    return "branches";
  }
  return "currentLocation";
};
