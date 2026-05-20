/**
 * Booking location state helpers (normalization, payload segments, debug).
 * Import from `@/lib/booking/*` modules directly.
 */

export {
  normalizeReservationFormData,
  initialLocationSlice,
} from "./normalizeReservationFormData";
export { buildDeliverSegment, buildReceiveSegment } from "./buildBookingLocationPayload";
export {
  collectReservationLocationIssues,
  warnIfLocationInvariantViolations,
} from "./reservationLocationDebug";
export {
  sessionFiltersToPickupReservationPatch,
  sessionFiltersToReturnReservationPatch,
} from "./sessionFiltersLocationPatch";
