import { Button, Input } from "@/app/(components)";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { useExtendReservation } from "@/hooks/api/booking/useExtendReservation";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";
import type {
  ReservationDetailsResponse,
  ReservationExtend,
} from "@/types/myBookings/BookingDetails";
import type {
  ExtendReservationDriverPayload,
  ExtendReservationPayload,
} from "@/services/mybookings/extendReservation.service";
import { toast } from "sonner";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";

interface BookingExtendingProps {
  setShowBookingExtending: (show: boolean) => void;
  onExtendSuccess?: (
    data: ReservationDetailsResponse,
    payload: ExtendReservationPayload,
  ) => void;
  reservationId?: number;
  bookingStartDate?: string | Date | null;
  bookingEndDate?: string | Date | null;
  reservationExtends?: ReservationExtend[];
  driver?: ExtendReservationDriverPayload | null;
  points?: Record<string, unknown> | null;
  promoCode?: string | null;
  carOfferPkId?: number | null;
  pricing?: boolean;
  amount?: number;
}

const BookingExtending = ({
  setShowBookingExtending,
  onExtendSuccess,
  reservationId,
  bookingStartDate,
  bookingEndDate,
  reservationExtends,
  driver,
  points,
  promoCode,
  carOfferPkId,
  pricing,
  amount,
}: BookingExtendingProps) => {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const BackIcon = isRTL ? ChevronRight : ChevronLeft;
  const { mutate: extendReservation, isPending: isExtendingReservation } =
    useExtendReservation();

  const parseDate = (value?: string | Date | null): Date | null => {
    if (!value) return null;
    const parsedDate =
      value instanceof Date ? new Date(value) : new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const formatDateTimeLikePicker = (date: Date): string => {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const fromDate = useMemo(
    () => parseDate(bookingStartDate) ?? new Date(),
    [bookingStartDate],
  );

  const getLastExtendEndDate = (
    extendsList?: ReservationExtend[],
  ): Date | null => {
    if (!extendsList?.length) return null;

    return extendsList.reduce<Date | null>((latest, extend) => {
      const extendEndDate = parseDate(extend.endDate);
      if (!extendEndDate) return latest;
      if (!latest || extendEndDate.getTime() > latest.getTime()) {
        return extendEndDate;
      }
      return latest;
    }, null);
  };

  const lastExtendEndDate = useMemo(
    () => getLastExtendEndDate(reservationExtends),
    [reservationExtends],
  );

  const [toDate, setToDate] = useState<Date | null>(
    () => getLastExtendEndDate(reservationExtends) ?? parseDate(bookingEndDate),
  );
  const normalizedDriver: ExtendReservationDriverPayload = driver ?? {
    driverRequested: false,
    outOfCity: null,
    driverHours: null,
    driverDays: 1,
  };

  const handleExtendReservation = () => {
    if (!reservationId) {
      toast.error(
        t("myBookingsDrawer.extendBooking.toast.unableToDetectReservation"),
      );
      return;
    }

    if (!toDate) {
      toast.error(
        t("myBookingsDrawer.extendBooking.toast.selectNewDropoffTime"),
      );
      return;
    }
    const formattedStartDate = formatLocalDateTime(bookingStartDate);
    const formattedEndDate = formatLocalDateTime(toDate);

    if (!formattedEndDate) {
      toast.error(
        t("myBookingsDrawer.extendBooking.toast.invalidDropoffTimeFormat"),
      );
      return;
    }

    const payload: ExtendReservationPayload = {
      reservationId,
      ...(formattedStartDate ? { startDate: formattedStartDate } : {}),
      endDate: formattedEndDate,
      driver: normalizedDriver,
      ...(points !== undefined ? { points } : {}),
      ...(promoCode !== undefined ? { promoCode } : {}),
      ...(carOfferPkId !== undefined ? { carOfferPkId } : {}),
      ...(pricing !== undefined ? { pricing } : {}),
    };

    extendReservation(payload, {
      onSuccess: (data) => {
        onExtendSuccess?.(data, payload);
      },
    });
  };

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col bg-background animate-in fade-in duration-300 ${
        isRTL ? "slide-in-from-right" : "slide-in-from-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SheetHeader className="mt-10 flex flex-row items-center gap-2 space-y-0 px-6 text-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setShowBookingExtending(false)}
          aria-label={t("backToBookingDetails")}
        >
          <BackIcon className="h-5 w-5" />
        </Button>
        <SheetTitle className="text-start text-xl">
          <p>{t("myBookingsDrawer.extendBooking.title")}</p>
        </SheetTitle>
      </SheetHeader>
      <div className="flex flex-1 flex-col">
        <div className="px-6 pt-6">
          <div className="w-full flex flex-col gap-4 mb-1">
            <div className="w-full space-y-2">
              <label className="text-base font-medium mb-2! block">
                {t("myBookingsDrawer.extendBooking.pickupDateTimeLabel")}
              </label>
              <Input
                readOnly
                disabled
                value={formatDateTimeLikePicker(fromDate)}
                className="text-base!"
              />
            </div>
            <div className="w-full">
              <DateTimePicker
                labelClassName="text-base!"
                label={t("myBookingsDrawer.extendBooking.newDropoffTimeLabel")}
                className="w-full"
                inputClassName="text-base!"
                withTime
                allowClear
                minDate={lastExtendEndDate ?? fromDate}
                value={toDate}
                onChange={setToDate}
              />
            </div>
          </div>
        </div>
        {/* <div className="p-2 rounde-xl bg-red-900 text-white mx-6"> booking Amount: {amount}</div> */}

        <SheetFooter className="p-6 border-t mt-auto flex! flex-row! gap-3! md:gap-0!">
          <Button
            variant="ghost"
            type="button"
            className="text-base! w-1/4 bg-transparent text-black border-2 border-Grey400 hover:bg-transparent"
            onClick={() => setShowBookingExtending(false)}
          >
            {t("cancel")}
          </Button>

          <Button
            type="button"
            className="text-base! w-3/4"
            onClick={handleExtendReservation}
            disabled={!toDate || isExtendingReservation}
          >
            {isExtendingReservation
              ? t("myBookingsDrawer.extendBooking.extending")
              : t("myBookingsDrawer.extendBooking.submit")}
          </Button>
        </SheetFooter>
      </div>
    </div>
  );
};

export default BookingExtending;
