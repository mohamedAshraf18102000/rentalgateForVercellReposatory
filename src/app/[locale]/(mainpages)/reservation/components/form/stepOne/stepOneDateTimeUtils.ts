import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";
import { isBeforeMinimumBookableTime } from "@/lib/utils/minimumBookableDateTime";
import { OfferPackage, WorkingHours } from "@/types/companyCars/carDetails";
import {
  DAY_CONFIG,
  MIN_RENTAL_MS,
  TIME_SLOT_INTERVAL_MINUTES,
} from "./stepOneConstants";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const getMinToDate = (fromDate: Date): Date =>
  new Date(fromDate.getTime() + MS_PER_DAY);

export const getOfferRecommendedEndDate = (
  fromDate: Date | null | undefined,
  offer: OfferPackage,
): Date | null => {
  if (!fromDate) return null;

  return new Date(
    fromDate.getTime() + (offer.days + offer.extraDays) * MS_PER_DAY,
  );
};

export const formatOfferRecommendedEndDate = (
  fromDate: Date | null | undefined,
  offer: OfferPackage,
  locale: string,
): string => {
  const endDate = getOfferRecommendedEndDate(fromDate, offer);
  if (!endDate) return "";

  const dateLocale = locale === "ar" ? "ar-GB" : "en-GB";

  return `${endDate
    .toLocaleDateString(dateLocale)
    .replace(/\//g, "-")} ${endDate.toLocaleTimeString(dateLocale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
};

export const parseTimeToMinutes = (time?: string | null) => {
  if (!time) return null;

  const [hourString, minuteString] = time.split(":");
  const hours = Number.parseInt(hourString ?? "", 10);
  const minutes = Number.parseInt(minuteString ?? "", 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

export const isMinutesWithinRange = (value: number, start: number, end: number) => {
  if (start <= end) {
    return value >= start && value <= end;
  }

  return value >= start || value <= end;
};

export const isDateLessThanMinimumRental = (
  startDate: Date | null | undefined,
  endDate: Date | null | undefined,
) => {
  const formattedStartDate = formatLocalDateTime(startDate);
  const formattedEndDate = formatLocalDateTime(endDate);

  if (!formattedStartDate || !formattedEndDate) return false;

  const normalizedStartDate = new Date(formattedStartDate);
  const normalizedEndDate = new Date(formattedEndDate);

  if (
    Number.isNaN(normalizedStartDate.getTime()) ||
    Number.isNaN(normalizedEndDate.getTime())
  ) {
    return false;
  }

  return (
    normalizedEndDate.getTime() - normalizedStartDate.getTime() < MIN_RENTAL_MS
  );
};

export const createDateTimeAvailabilityHelpers = (
  workingHours: WorkingHours | null | undefined,
) => {
  const isDateTimeBlocked = (
    date: Date | null | undefined,
    minBoundary?: Date | null,
  ) => {
    if (!date || Number.isNaN(date.getTime())) {
      return false;
    }

    if (isBeforeMinimumBookableTime(date)) {
      return true;
    }

    if (minBoundary && date < minBoundary) {
      return true;
    }

    if (!workingHours) {
      return false;
    }

    const dayConfig = DAY_CONFIG[date.getDay()];
    const openTime = workingHours[
      `${dayConfig.key}OpenTime` as keyof WorkingHours
    ] as string | null | undefined;
    const closeTime = workingHours[
      `${dayConfig.key}CloseTime` as keyof WorkingHours
    ] as string | null | undefined;

    const openMinutes = parseTimeToMinutes(openTime);
    const closeMinutes = parseTimeToMinutes(closeTime);

    if (openMinutes === null || closeMinutes === null) {
      return true;
    }

    const currentMinutes = date.getHours() * 60 + date.getMinutes();
    if (!isMinutesWithinRange(currentMinutes, openMinutes, closeMinutes)) {
      return true;
    }

    return (
      workingHours.breaks?.some((breakTime) => {
        if (breakTime.dayOfWeek !== dayConfig.dayOfWeek) {
          return false;
        }

        const breakStart = parseTimeToMinutes(breakTime.startTime);
        const breakEnd = parseTimeToMinutes(breakTime.endTime);

        if (breakStart === null || breakEnd === null) {
          return false;
        }

        return isMinutesWithinRange(currentMinutes, breakStart, breakEnd);
      }) ?? false
    );
  };

  const findFirstAvailableDateTime = (
    date: Date | null | undefined,
    minBoundary?: Date | null,
  ) => {
    if (!date || Number.isNaN(date.getTime())) {
      return null;
    }

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += TIME_SLOT_INTERVAL_MINUTES) {
        const candidate = new Date(dayStart);
        candidate.setHours(hour, minute, 0, 0);

        if (!isDateTimeBlocked(candidate, minBoundary)) {
          return candidate;
        }
      }
    }

    return null;
  };

  const isDateBlocked = (date: Date, minBoundary?: Date | null) =>
    findFirstAvailableDateTime(date, minBoundary) === null;

  const normalizeDateTimeToAvailability = (
    date: Date | null,
    minBoundary?: Date | null,
  ) => {
    if (!date) {
      return null;
    }

    if (!isDateTimeBlocked(date, minBoundary)) {
      return date;
    }

    return findFirstAvailableDateTime(date, minBoundary);
  };

  return {
    isDateTimeBlocked,
    findFirstAvailableDateTime,
    isDateBlocked,
    normalizeDateTimeToAvailability,
  };
};
