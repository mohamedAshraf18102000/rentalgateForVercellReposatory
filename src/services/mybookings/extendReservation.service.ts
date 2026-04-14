import { fetcher } from "../api";
import { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";

export type ExtendReservationDriverPayload = {
    driverRequested: boolean | null;
    outOfCity: boolean | null;
    driverHours: number | null;
    driverDays: number | null;
};

export type ExtendReservationPayload = {
    reservationId: number;
    startDate?: string | Date | null;
    endDate: string | Date;
    driver?: ExtendReservationDriverPayload | null;
    points?: Record<string, unknown> | null;
    promoCode?: string | null;
    carOfferPkId?: number | null;
    pricing?: boolean;
};

export const extendReservation = (payload: ExtendReservationPayload) => {
    return fetcher<ReservationDetailsResponse>(
        `/reservation-extends/quote`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
};
