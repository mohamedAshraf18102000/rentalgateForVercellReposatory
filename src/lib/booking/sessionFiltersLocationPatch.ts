import type { BookingFilters } from "@/lib/stores/useUserPreferedFiltersStore";
import type { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";
import type { CarDetailsResponse } from "@/types/companyCars/carDetails";

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
    case "currentLocation": {
      const patch: Partial<ReservationFormData> = {
        pickupType: "MY_LOCATION",
        pickupName: filters.pickupName ?? "",
        pickupId: filters.pickupId || null,
        pickupAirportId: null,
        pickupTrainId: null,
      };
      if (filters.pickupLat != null) patch.pickupLat = filters.pickupLat;
      if (filters.pickupLng != null) patch.pickupLong = filters.pickupLng;
      return patch;
    }
    case "branches": {
      const patch: Partial<ReservationFormData> = {
        pickupType: "BRANCH",
        pickupId: filters.pickupId || null,
        pickupName: filters.pickupName ?? "",
        pickupAirportId: null,
        pickupTrainId: null,
      };
      if (filters.pickupLat != null) patch.pickupLat = filters.pickupLat;
      if (filters.pickupLng != null) patch.pickupLong = filters.pickupLng;
      return patch;
    }
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
      case "currentLocation": {
        const patch: Partial<ReservationFormData> = {
          returnType: "MY_LOCATION",
          carReturnLocation: filters.pickupName ?? "",
          carReturnLocationId: filters.pickupId || null,
          returnAirportId: null,
          returnTrainId: null,
        };
        if (filters.pickupLat != null) patch.returnLat = filters.pickupLat;
        if (filters.pickupLng != null) patch.returnLong = filters.pickupLng;
        return patch;
      }
      case "branches": {
        const patch: Partial<ReservationFormData> = {
          returnType: "BRANCH",
          carReturnLocationId: filters.pickupId || null,
          carReturnLocation: filters.pickupName ?? "",
          returnAirportId: null,
          returnTrainId: null,
        };
        if (filters.pickupLat != null) patch.returnLat = filters.pickupLat;
        if (filters.pickupLng != null) patch.returnLong = filters.pickupLng;
        return patch;
      }
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
    case "currentLocation": {
      const patch: Partial<ReservationFormData> = {
        returnType: "MY_LOCATION",
        carReturnLocation: filters.carReturnLocation ?? "",
        carReturnLocationId: filters.carReturnLocationId || null,
        returnAirportId: null,
        returnTrainId: null,
      };
      if (filters.carReturnLocationLat != null)
        patch.returnLat = filters.carReturnLocationLat;
      if (filters.carReturnLocationLng != null)
        patch.returnLong = filters.carReturnLocationLng;
      return patch;
    }
    case "branches": {
      const patch: Partial<ReservationFormData> = {
        returnType: "BRANCH",
        carReturnLocationId: filters.carReturnLocationId || null,
        carReturnLocation: filters.carReturnLocation ?? "",
        returnAirportId: null,
        returnTrainId: null,
      };
      if (filters.carReturnLocationLat != null)
        patch.returnLat = filters.carReturnLocationLat;
      if (filters.carReturnLocationLng != null)
        patch.returnLong = filters.carReturnLocationLng;
      return patch;
    }
    default:
      return {};
  }
}

/** Fills BRANCH lat/lng from the booked car when filters/form sync omitted them. */
export function enrichBranchCoordinatesFromCar(
  patch: Partial<ReservationFormData>,
  carDetails: CarDetailsResponse | null,
  currentFormData: ReservationFormData,
): Partial<ReservationFormData> {
  const lat = carDetails?.latitude;
  const lng = carDetails?.longitude;
  if (lat == null || lng == null) return patch;

  const enriched = { ...patch };
  const pickupType = patch.pickupType ?? currentFormData.pickupType;
  const returnType = patch.returnType ?? currentFormData.returnType;

  if (pickupType === "BRANCH") {
    const nextLat = patch.pickupLat ?? currentFormData.pickupLat;
    const nextLong = patch.pickupLong ?? currentFormData.pickupLong;
    if (nextLat == null || nextLong == null) {
      enriched.pickupLat = lat;
      enriched.pickupLong = lng;
    }
  }

  if (returnType === "BRANCH") {
    const nextLat = patch.returnLat ?? currentFormData.returnLat;
    const nextLong = patch.returnLong ?? currentFormData.returnLong;
    if (nextLat == null || nextLong == null) {
      enriched.returnLat = lat;
      enriched.returnLong = lng;
    }
  }

  return enriched;
}
