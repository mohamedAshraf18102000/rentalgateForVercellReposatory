import type { BookingFilters } from "@/lib/stores/useUserPreferedFiltersStore";
import type { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";

function parseId(s: string | undefined): number | null {
  if (s == null || s === "") return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

/**
 * Maps **session** booking search filters (bookings page / drawer) into reservation store fields
 * so Zustand stays aligned with what the user selected before opening car / reservation.
 * Pairs with `normalizeReservationFormData` in the store.
 */
export function sessionFiltersToPickupReservationPatch(
  filters: BookingFilters,
): Partial<ReservationFormData> {
  const pt = filters.pickupType;
  if (!pt) return {};

  switch (pt) {
    case "airport":
      return {
        pickupType: "AIRPORT",
        pickupAirportId:
          filters.pickupAirportId ??
          parseId(filters.pickupId),
        pickupName: filters.pickupName ?? "",
        pickupTrainId: null,
        pickupId: null,
        pickupLat: null,
        pickupLong: null,
      };
    case "trainStation":
      return {
        pickupType: "TRAIN_STATION",
        pickupTrainId:
          filters.pickupTrainId ??
          parseId(filters.pickupId),
        pickupName: filters.pickupName ?? "",
        pickupAirportId: null,
        pickupId: null,
        pickupLat: null,
        pickupLong: null,
      };
    case "currentLocation":
      return {
        pickupType: "MY_LOCATION",
        pickupName: filters.pickupName ?? "",
        pickupId: filters.pickupId || null,
        pickupLat: filters.pickupLat ?? null,
        pickupLong: filters.pickupLng ?? null,
        pickupAirportId: null,
        pickupTrainId: null,
      };
    case "branches":
      return {
        pickupType: "BRANCH",
        pickupId: filters.pickupId || null,
        pickupName: filters.pickupName ?? "",
        pickupLat: filters.pickupLat ?? null,
        pickupLong: filters.pickupLng ?? null,
        pickupAirportId: null,
        pickupTrainId: null,
      };
    default:
      return {};
  }
}

export function sessionFiltersToReturnReservationPatch(
  filters: BookingFilters,
): Partial<ReservationFormData> {
  const rt = filters.carReturnLocationType;

  const mirrorPickupToReturnWhenUnset = (): Partial<ReservationFormData> | null => {
    if (rt) return null;
    switch (filters.pickupType) {
      case "airport": {
        const id =
          filters.pickupAirportId ?? parseId(filters.pickupId);
        if (id == null) return null;
        return {
          returnType: "AIRPORT",
          returnAirportId: id,
          carReturnLocation: filters.pickupName ?? "",
          returnTrainId: null,
          carReturnLocationId: null,
          returnLat: null,
          returnLong: null,
        };
      }
      case "trainStation": {
        const id =
          filters.pickupTrainId ?? parseId(filters.pickupId);
        if (id == null) return null;
        return {
          returnType: "TRAIN_STATION",
          returnTrainId: id,
          carReturnLocation: filters.pickupName ?? "",
          returnAirportId: null,
          carReturnLocationId: null,
          returnLat: null,
          returnLong: null,
        };
      }
      case "currentLocation":
        return {
          returnType: "MY_LOCATION",
          carReturnLocation: filters.pickupName ?? "",
          carReturnLocationId: filters.pickupId || null,
          returnLat: filters.pickupLat ?? null,
          returnLong: filters.pickupLng ?? null,
          returnAirportId: null,
          returnTrainId: null,
        };
      case "branches":
        return {
          returnType: "BRANCH",
          carReturnLocationId: filters.pickupId || null,
          carReturnLocation: filters.pickupName ?? "",
          returnLat: filters.pickupLat ?? null,
          returnLong: filters.pickupLng ?? null,
          returnAirportId: null,
          returnTrainId: null,
        };
      default:
        return null;
    }
  };

  if (!rt) {
    const mirrored = mirrorPickupToReturnWhenUnset();
    return mirrored ?? {};
  }

  switch (rt) {
    case "airport":
      return {
        returnType: "AIRPORT",
        returnAirportId:
          filters.carReturnAirportId ??
          parseId(filters.carReturnLocationId),
        carReturnLocation: filters.carReturnLocation ?? "",
        returnTrainId: null,
        carReturnLocationId: null,
        returnLat: null,
        returnLong: null,
      };
    case "trainStation":
      return {
        returnType: "TRAIN_STATION",
        returnTrainId:
          filters.carReturnTrainId ??
          parseId(filters.carReturnLocationId),
        carReturnLocation: filters.carReturnLocation ?? "",
        returnAirportId: null,
        carReturnLocationId: null,
        returnLat: null,
        returnLong: null,
      };
    case "currentLocation":
      return {
        returnType: "MY_LOCATION",
        carReturnLocation: filters.carReturnLocation ?? "",
        carReturnLocationId: filters.carReturnLocationId || null,
        returnLat: filters.carReturnLocationLat ?? null,
        returnLong: filters.carReturnLocationLng ?? null,
        returnAirportId: null,
        returnTrainId: null,
      };
    case "branches":
      return {
        returnType: "BRANCH",
        carReturnLocationId: filters.carReturnLocationId || null,
        carReturnLocation: filters.carReturnLocation ?? "",
        returnLat: filters.carReturnLocationLat ?? null,
        returnLong: filters.carReturnLocationLng ?? null,
        returnAirportId: null,
        returnTrainId: null,
      };
    default:
      return {};
  }
}
