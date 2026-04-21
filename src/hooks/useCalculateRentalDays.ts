import { useMemo } from "react";

export const useRentalDays = (fromDate?: string | Date, toDate?: string | Date) => {
    return useMemo(() => {
        if (!fromDate || !toDate) return 0;

        const from = new Date(fromDate);
        const to = new Date(toDate);

        const diffTime = Math.abs(to.getTime() - from.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [fromDate, toDate]);
};