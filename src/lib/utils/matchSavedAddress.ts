import type { UserAddress } from "@/types/userProfile/userAddress";
import {
  getDistanceInKm,
  LOCATION_MOVEMENT_THRESHOLD_KM,
} from "@/lib/utils/geolocation";

/** Max distance (km) to treat GPS position as a saved address. */
export const SAVED_ADDRESS_MATCH_THRESHOLD_KM = LOCATION_MOVEMENT_THRESHOLD_KM;

/**
 * Returns the nearest saved address within the match threshold, if any.
 */
export const findNearestSavedAddress = (
  lat: number,
  lng: number,
  userAddresses: UserAddress[],
  thresholdKm = SAVED_ADDRESS_MATCH_THRESHOLD_KM,
): UserAddress | null => {
  if (!userAddresses.length) {
    return null;
  }

  let nearest: { address: UserAddress; distance: number } | null = null;

  for (const address of userAddresses) {
    const distance = getDistanceInKm(
      lat,
      lng,
      address.latitude,
      address.longitude,
    );

    if (!nearest || distance < nearest.distance) {
      nearest = { address, distance };
    }
  }

  if (!nearest || nearest.distance > thresholdKm) {
    return null;
  }

  return nearest.address;
};
