import type { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";

/** Strictly typed deliver/receive segments with only keys valid for the active mode (no leaked fields). */
export function buildDeliverSegment(
  formData: ReservationFormData,
): Record<string, unknown> {
  const type = formData.pickupType ?? null;
  const base: Record<string, unknown> = { type };

  if (!type) return base;

  switch (type) {
    case "TRAIN_STATION":
      return { ...base, trainId: formData.pickupTrainId ?? null };
    case "AIRPORT":
      return { ...base, airportId: formData.pickupAirportId ?? null };
    case "MY_LOCATION":
      return {
        ...base,
        latitude: formData.pickupLat ?? null,
        longitude: formData.pickupLong ?? null,
        addressId: formData.pickupId ? Number(formData.pickupId) : null,
      };
    case "BRANCH":
      return {
        ...base,
        latitude: formData.pickupLat ?? null,
        longitude: formData.pickupLong ?? null,
      };
    default:
      return base;
  }
}

export function buildReceiveSegment(
  formData: ReservationFormData,
): Record<string, unknown> {
  const type = formData.returnType ?? null;
  const base: Record<string, unknown> = { type };

  if (!type) return base;

  switch (type) {
    case "TRAIN_STATION":
      return { ...base, trainId: formData.returnTrainId ?? null };
    case "AIRPORT":
      return { ...base, airportId: formData.returnAirportId ?? null };
    case "MY_LOCATION":
      return {
        ...base,
        latitude: formData.returnLat ?? null,
        longitude: formData.returnLong ?? null,
        addressId: formData.carReturnLocationId
          ? Number(formData.carReturnLocationId)
          : null,
      };
    case "BRANCH":
      return {
        ...base,
        latitude: formData.returnLat ?? null,
        longitude: formData.returnLong ?? null,
      };
    default:
      return base;
  }
}
