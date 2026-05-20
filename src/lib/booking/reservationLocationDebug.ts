import type { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";

export type LocationInvariantIssue = {
  path: string;
  message: string;
};

/**
 * Development-time checks: location discriminators match stored type.
 * Call before createReservation / quote APIs in dev if needed.
 */
export function collectReservationLocationIssues(
  fd: ReservationFormData,
): LocationInvariantIssue[] {
  const issues: LocationInvariantIssue[] = [];

  const checkSide = (
    kind: "pickup" | "return",
    type: ReservationFormData["pickupType"] | ReservationFormData["returnType"],
    fields: {
      airport?: number | null;
      train?: number | null;
    },
  ) => {
    if (type === "AIRPORT" && (fields.airport === null || fields.airport === undefined)) {
      issues.push({
        path: kind,
        message: `${kind} type is AIRPORT but airport id is missing`,
      });
    }
    if (type === "TRAIN_STATION" && (fields.train === null || fields.train === undefined)) {
      issues.push({
        path: kind,
        message: `${kind} type is TRAIN_STATION but train id is missing`,
      });
    }
  };

  checkSide("pickup", fd.pickupType, {
    airport: fd.pickupAirportId,
    train: fd.pickupTrainId,
  });

  checkSide("return", fd.returnType, {
    airport: fd.returnAirportId,
    train: fd.returnTrainId,
  });

  return issues;
}

export function warnIfLocationInvariantViolations(
  fd: ReservationFormData,
  context: string,
): void {
  if (process.env.NODE_ENV === "production") return;
  const issues = collectReservationLocationIssues(fd);
  if (issues.length === 0) return;
  // eslint-disable-next-line no-console
  console.warn(`[reservation-location] ${context}`, issues, {
    pickupType: fd.pickupType,
    returnType: fd.returnType,
    pickupAirportId: fd.pickupAirportId,
    pickupTrainId: fd.pickupTrainId,
    returnAirportId: fd.returnAirportId,
    returnTrainId: fd.returnTrainId,
  });
}
