import { useLocationStore } from "@/lib/stores/useLocationStore";

/** Minimum movement (km) before treating the user as having relocated. */
export const LOCATION_MOVEMENT_THRESHOLD_KM = 0.2;

export type GeolocationFailureReason =
  | "unsupported"
  | "permission_denied"
  | "position_unavailable"
  | "timeout"
  | "unknown";

export class GeolocationError extends Error {
  readonly reason: GeolocationFailureReason;

  constructor(reason: GeolocationFailureReason, message?: string) {
    super(message ?? reason);
    this.name = "GeolocationError";
    this.reason = reason;
  }
}

const toRadians = (value: number) => (value * Math.PI) / 180;

export const getDistanceInKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const hasLocationMoved = (
  previousLat: number,
  previousLng: number,
  nextLat: number,
  nextLng: number,
  thresholdKm = LOCATION_MOVEMENT_THRESHOLD_KM,
) =>
  getDistanceInKm(previousLat, previousLng, nextLat, nextLng) > thresholdKm;

const mapGeolocationErrorCode = (
  code: number,
): GeolocationFailureReason => {
  switch (code) {
    case 1:
      return "permission_denied";
    case 2:
      return "position_unavailable";
    case 3:
      return "timeout";
    default:
      return "unknown";
  }
};

const DEFAULT_POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15_000,
  maximumAge: 60_000,
};

/**
 * Resolves the user's current coordinates via the browser Geolocation API.
 */
export const getBrowserPosition = (
  options?: PositionOptions,
): Promise<GeolocationCoordinates> => {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.reject(new GeolocationError("unsupported"));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        reject(
          new GeolocationError(
            mapGeolocationErrorCode(error.code),
            error.message,
          ),
        );
      },
      { ...DEFAULT_POSITION_OPTIONS, ...options },
    );
  });
};

export const waitForLocationStoreHydration = (): Promise<void> => {
  if (useLocationStore.persist.hasHydrated()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const unsubscribe = useLocationStore.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
};
