import { useMemo } from "react";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";

export const useRentalDays = (fromDate?: string | Date, toDate?: string | Date) => {
  return useMemo(() => {
    if (!fromDate || !toDate) return 0;

    const normalizedFromDate = formatLocalDateTime(fromDate);
    const normalizedToDate = formatLocalDateTime(toDate);
    if (!normalizedFromDate || !normalizedToDate) return 0;

    const from = new Date(normalizedFromDate);
    const to = new Date(normalizedToDate);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;

    const diffTime = to.getTime() - from.getTime();
    if (diffTime <= 0) return 0;

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [fromDate, toDate]);
};