// utils/date.ts
export const formatLocalDateTime = (
  value: Date | string | null | undefined,
): string | null => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};



export const formatDateAsLocalDay = (value?: Date | string): string => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/** Local calendar date at midnight, e.g. `2026-05-26T00:00:00` */
export const formatDateAsLocalDayTime = (
  value?: Date | string | null,
): string => {
  const day = formatDateAsLocalDay(value ?? undefined);
  return day ? `${day}T00:00:00` : "";
};

/** Parses `YYYY-MM-DD` as local midnight; falls back to `Date` parsing. */
export const parseLocalDay = (value?: string | null): Date | undefined => {
  if (!value) return undefined;

  const dayMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (dayMatch) {
    const date = new Date(
      Number(dayMatch[1]),
      Number(dayMatch[2]) - 1,
      Number(dayMatch[3]),
    );
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};
