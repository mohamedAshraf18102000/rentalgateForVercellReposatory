"use client";

import { Button } from "@/app/(components)";
import { Separator } from "@/app/(components)/ui/separator";
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import type { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";
import { ChevronLeft, ChevronRight, SaudiRiyal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import BookingExtendDetails from "./BookingExtendDetails";

interface BookingExtendCompleteProps {
  extendData?: ReservationDetailsResponse | null;
  onBack?: () => void;
  onDone?: () => void;
}

const BookingExtendComplete = ({
  extendData,
  onBack,
  onDone,
}: BookingExtendCompleteProps) => {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const BackIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col bg-background animate-in fade-in slide-in-from-right duration-300"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SheetHeader className="mt-10 flex flex-col gap-2 space-y-0 px-6 text-start">
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onBack}
            aria-label={t("backToBookingDetails")}
          >
            <BackIcon className="h-5 w-5" />
          </Button>
          <SheetTitle className="text-start text-xl">
            {t("myBookingsDrawer.extendBooking.complete.title")}
          </SheetTitle>
        </div>

        <Separator />
      </SheetHeader>
      <BookingExtendDetails />
      <SheetFooter className="mt-0 border-t-2 p-5 shadow-[0px_-13px_15px_0px_#01250514]">
        <Button type="button" className="w-full text-lg!" onClick={onDone}>
          {t("myBookingsDrawer.extendBooking.complete.done")}
        </Button>
      </SheetFooter>
    </div>
  );
};

export default BookingExtendComplete;
