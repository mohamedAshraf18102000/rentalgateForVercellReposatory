export const BOOKING_TIME_SLOT_INTERVAL_MINUTES = 30;
const MIN_BOOKING_ADVANCE_MS = 60 * 60 * 1000;

export const isSameCalendarDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfCalendarDay = (date: Date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

const roundToNearestTimeSlot = (date: Date) => {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);

  const totalMinutes = rounded.getHours() * 60 + rounded.getMinutes();
  const nearestSlotMinutes =
    Math.round(totalMinutes / BOOKING_TIME_SLOT_INTERVAL_MINUTES) *
    BOOKING_TIME_SLOT_INTERVAL_MINUTES;

  rounded.setHours(
    Math.floor(nearestSlotMinutes / 60),
    nearestSlotMinutes % 60,
    0,
    0,
  );

  return rounded;
};

/** Earliest bookable slot: nearest :00/:30 slot to now, then + 1 hour. */
export const getMinimumBookableDateTime = (now = new Date()) => {
  const nearestSlot = roundToNearestTimeSlot(now);
  return new Date(nearestSlot.getTime() + MIN_BOOKING_ADVANCE_MS);
};

export const isBeforeMinimumBookableTime = (
  date: Date,
  now = new Date(),
) => {
  if (startOfCalendarDay(date) < startOfCalendarDay(now)) {
    return true;
  }

  if (!isSameCalendarDay(date, now)) {
    return false;
  }

  return date < getMinimumBookableDateTime(now);
};
