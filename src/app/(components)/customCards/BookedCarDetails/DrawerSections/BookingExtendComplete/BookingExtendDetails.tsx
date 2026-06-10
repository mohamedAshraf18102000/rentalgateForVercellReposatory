"use client";

import { Separator } from "@/app/(components)/ui/separator";
import type { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";
import { useLocale, useTranslations } from "next-intl";
import ExtensionPriceBreakdown from "./ExtensionPriceBreakdown";
import ExtensionCoupon from "./ExtensionCoupon";
import ExtensionDiscounts from "./ExtensionDiscounts";
import ReservationDetailsSkeleton from "@/app/[locale]/(mainpages)/reservation/components/reservationDrawer/components/ReservationDetailsSkeleton";

export interface BookingExtendDetailsProps {
  extendData: ReservationDetailsResponse | null;
  isReQuoting?: boolean;
  promoCode?: string | null;
  promoCodeType?: number | null;
  promoDiscountValue?: number | null;
  selectedPointsPkId?: number | null;
  onPromoApplied: (code: string, codeType: number, discountValue: number) => void;
  onPromoCleared: () => void;
  onPointsSelected: (pkId: number, value: number) => void;
  onPointsCleared: () => void;
}

const BookingExtendDetails = ({
  extendData,
  isReQuoting,
  promoCode,
  promoCodeType,
  promoDiscountValue,
  selectedPointsPkId,
  onPromoApplied,
  onPromoCleared,
  onPointsSelected,
  onPointsCleared,
}: BookingExtendDetailsProps) => {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="flex flex-col gap-4" dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <h2 className="text-base font-bold mb-3">
          {t("myBookingsDrawer.extendBooking.complete.bookingDetailsTitle")}
        </h2>
        <div className="bg-Grey100 p-3 rounded-xl">
          {!extendData || isReQuoting ? (
            <ReservationDetailsSkeleton />
          ) : (
            <ExtensionPriceBreakdown data={extendData} isCalculating={isReQuoting} />
          )}
        </div>
      </div>

      <div className="mt-2">
        <ExtensionCoupon
          promoCode={promoCode}
          promoCodeType={promoCodeType}
          promoDiscountValue={promoDiscountValue}
          onApplied={onPromoApplied}
          onCleared={onPromoCleared}
          isCalculating={isReQuoting}
        />
      </div>

      <Separator className="my-1" />

      <ExtensionDiscounts
        selectedPointsPkId={selectedPointsPkId}
        onPointsSelected={onPointsSelected}
        onPointsCleared={onPointsCleared}
        isCalculating={isReQuoting}
      />
    </div>
  );
};

export default BookingExtendDetails;
