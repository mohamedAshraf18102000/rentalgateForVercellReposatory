import type { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";

export type ReservationLocationType = NonNullable<
  ReservationFormData["pickupType"]
>;

/** Immutable merge: keeps text fields where appropriate, nulls discriminator fields that do not apply to the active type. */
export function normalizeReservationFormData(
  fd: ReservationFormData,
): ReservationFormData {
  return {
    ...fd,
    ...normalizePickupSide(fd),
    ...normalizeReturnSide(fd),
  };
}

function normalizePickupSide(
  fd: ReservationFormData,
): Partial<ReservationFormData> {
  const t = fd.pickupType;

  if (t === null) {
    return {};
  }

  switch (t) {
    case "AIRPORT":
      return {
        pickupAirportId: fd.pickupAirportId ?? null,
        pickupTrainId: null,
        pickupId: null,
        pickupLat: null,
        pickupLong: null,
      };
    case "TRAIN_STATION":
      return {
        pickupTrainId: fd.pickupTrainId ?? null,
        pickupAirportId: null,
        pickupId: null,
        pickupLat: null,
        pickupLong: null,
      };
    case "MY_LOCATION":
      return {
        pickupAirportId: null,
        pickupTrainId: null,
      };
    case "BRANCH":
      return {
        pickupAirportId: null,
        pickupTrainId: null,
      };
    default:
      return {};
  }
}

function normalizeReturnSide(
  fd: ReservationFormData,
): Partial<ReservationFormData> {
  const t = fd.returnType;

  if (t === null) {
    return {};
  }

  switch (t) {
    case "AIRPORT":
      return {
        returnAirportId: fd.returnAirportId ?? null,
        returnTrainId: null,
        carReturnLocationId: null,
        returnLat: null,
        returnLong: null,
      };
    case "TRAIN_STATION":
      return {
        returnTrainId: fd.returnTrainId ?? null,
        returnAirportId: null,
        carReturnLocationId: null,
        returnLat: null,
        returnLong: null,
      };
    case "MY_LOCATION":
      return {
        returnAirportId: null,
        returnTrainId: null,
      };
    case "BRANCH":
      return {
        returnAirportId: null,
        returnTrainId: null,
      };
    default:
      return {};
  }
}

/** When loading a different car (`ccbId` change), reset only location slices so persisted booking leftovers cannot leak. */
export function initialLocationSlice(): Pick<
  ReservationFormData,
  | "pickupName"
  | "pickupLat"
  | "pickupLong"
  | "pickupId"
  | "pickupType"
  | "pickupTrainId"
  | "pickupAirportId"
  | "carReturnLocation"
  | "returnLat"
  | "returnLong"
  | "carReturnLocationId"
  | "returnType"
  | "returnTrainId"
  | "returnAirportId"
> {
  return {
    pickupName: "",
    pickupLat: null,
    pickupLong: null,
    pickupId: null,
    pickupType: null,
    pickupTrainId: null,
    pickupAirportId: null,
    carReturnLocation: "",
    returnLat: null,
    returnLong: null,
    carReturnLocationId: null,
    returnType: null,
    returnTrainId: null,
    returnAirportId: null,
  };
}
