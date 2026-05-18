/** Placeholder labels for “use current location” across locales and legacy copy. */
export const CURRENT_LOCATION_PLACEHOLDERS = new Set([
  "الموقع الحالي",
  "موقعي الحالي",
  "Current Location",
  "Current location",
]);

export const isCurrentLocationPlaceholder = (value?: string | null) =>
  Boolean(value && CURRENT_LOCATION_PLACEHOLDERS.has(value));
