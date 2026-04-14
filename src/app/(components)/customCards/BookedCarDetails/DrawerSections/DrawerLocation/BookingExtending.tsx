import { Button, Input } from "@/app/(components)";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { useExtendReservation } from "@/hooks/api/booking/useExtendReservation";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";
import type {
  ExtendReservationDriverPayload,
  ExtendReservationPayload,
} from "@/services/mybookings/extendReservation.service";
import { toast } from "sonner";

import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";

interface BookingExtendingProps {
  setShowBookingExtending: (show: boolean) => void;
  reservationId?: number;
  bookingStartDate?: string | Date | null;
  bookingEndDate?: string | Date | null;
  driver?: ExtendReservationDriverPayload | null;
  points?: Record<string, unknown> | null;
  promoCode?: string | null;
  carOfferPkId?: number | null;
  pricing?: boolean;
}

const BookingExtending = ({
  setShowBookingExtending,
  reservationId,
  bookingStartDate,
  bookingEndDate,
  driver,
  points,
  promoCode,
  carOfferPkId,
  pricing,
}: BookingExtendingProps) => {
  const { mutate: extendReservation, isPending: isExtendingReservation } =
    useExtendReservation();

  const arabicDays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const parseDate = (value?: string | Date | null): Date | null => {
    if (!value) return null;
    const parsedDate =
      value instanceof Date ? new Date(value) : new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const formatDateTimeLikePicker = (date: Date): string => {
    const day = arabicDays[date.getDay()];
    const dayNum = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "مساءً" : "صباحاً";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    return `${day} ${dayNum}-${month}-${year}  ${displayHour}:${minutes} ${ampm}`;
  };

  const fromDate = useMemo(
    () => parseDate(bookingStartDate) ?? new Date(),
    [bookingStartDate],
  );
  const [toDate, setToDate] = useState<Date | null>(() =>
    parseDate(bookingEndDate),
  );
  const normalizedDriver: ExtendReservationDriverPayload = driver ?? {
    driverRequested: false,
    outOfCity: null,
    driverHours: null,
    driverDays: 1,
  };

  const handleExtendReservation = () => {
    if (!reservationId) {
      toast.error("تعذر تحديد الحجز الحالي");
      return;
    }

    if (!toDate) {
      toast.error("يرجى اختيار وقت التسليم الجديد");
      return;
    }
    const formattedStartDate = formatLocalDateTime(bookingStartDate);
    const formattedEndDate = formatLocalDateTime(toDate);

    if (!formattedEndDate) {
      toast.error("صيغة وقت التسليم غير صالحة");
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
      onSuccess: () => {
        toast.success("تم تمديد الحجز بنجاح");
        setShowBookingExtending(false);
      },
      onError: (error: Error) => {
        toast.error(error.message || "حدث خطأ أثناء تمديد الحجز");
      },
    });
  };

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col bg-background animate-in fade-in slide-in-from-right duration-300"
      dir="rtl"
    >
      <SheetHeader className="mt-10 flex flex-row items-center gap-2 space-y-0 px-6 text-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setShowBookingExtending(false)}
          aria-label="Back"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <SheetTitle className="text-start text-xl">
          <p>تمديد الحجز </p>
        </SheetTitle>
      </SheetHeader>
      <div className="flex flex-1 flex-col">
        <div className="px-6 pt-6">
          <div className="w-full flex flex-col gap-4 mb-1">
            <div className="w-full space-y-2">
              <label className="text-base font-medium mb-2! block">
                تاريخ ووقت الاستلام:
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
                label="وقت التسليم الجديد:"
                className="w-full"
                inputClassName="text-base!"
                withTime
                allowClear
                minDate={fromDate}
                value={toDate}
                onChange={setToDate}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 border-t mt-auto">
          <Button
            type="button"
            className="text-base! w-1/2 bg-transparent text-black border-2 border-Grey400 hover:bg-transparent"
            onClick={() => setShowBookingExtending(false)}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            className="text-base! w-1/2"
            onClick={handleExtendReservation}
            disabled={!toDate || isExtendingReservation}
          >
            {isExtendingReservation ? "جاري التمديد..." : "تمديد الحجز"}
          </Button>
        </SheetFooter>
      </div>
    </div>
  );
};

export default BookingExtending;
