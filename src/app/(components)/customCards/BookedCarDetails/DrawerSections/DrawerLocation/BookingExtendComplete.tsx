import { Button } from "@/app/(components)";
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import type { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
  const additionalAmount =
    extendData != null ? extendData.total - extendData.basePrice : null;

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col bg-background animate-in fade-in slide-in-from-right duration-300"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SheetHeader className="mt-10 flex flex-row items-center gap-2 space-y-0 px-6 text-start">
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
          <p>{t("myBookingsDrawer.extendBooking.complete.title")}</p>
        </SheetTitle>
      </SheetHeader>
      <div className="flex flex-1 flex-col px-6 pt-6">
        <p className="text-Grey700 text-sm">
          {t("myBookingsDrawer.extendBooking.complete.description")}
        </p>
        {additionalAmount != null && (
          <p className="mt-4 text-base font-medium">
            {t("myBookingsDrawer.extendBooking.complete.additionalAmount")}:{" "}
            {additionalAmount}
          </p>
        )}
      </div>
      <SheetFooter className="mt-auto border-t p-6">
        <Button type="button" className="text-base! w-full" onClick={onDone}>
          {t("myBookingsDrawer.extendBooking.complete.done")}
        </Button>
      </SheetFooter>
    </div>
  );
};

export default BookingExtendComplete;
