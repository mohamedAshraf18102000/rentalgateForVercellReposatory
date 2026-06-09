import { BOOKING_TIME_SLOT_INTERVAL_MINUTES } from "@/lib/utils/minimumBookableDateTime";

export const DAY_CONFIG = [
  { key: "sun", dayOfWeek: "SUNDAY" },
  { key: "mon", dayOfWeek: "MONDAY" },
  { key: "tue", dayOfWeek: "TUESDAY" },
  { key: "wed", dayOfWeek: "WEDNESDAY" },
  { key: "thu", dayOfWeek: "THURSDAY" },
  { key: "fri", dayOfWeek: "FRIDAY" },
  { key: "sat", dayOfWeek: "SATURDAY" },
] as const;

export const TIME_SLOT_INTERVAL_MINUTES = BOOKING_TIME_SLOT_INTERVAL_MINUTES;

export const MIN_RENTAL_HOURS = 2;
export const MIN_RENTAL_MS = MIN_RENTAL_HOURS * 60 * 60 * 1000;
