"use client";

import { Button } from "@/app/(components)";
import { Separator } from "@/app/(components)/ui/separator";
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import ReservationFinalDetailsItem from "@/app/[locale]/(mainpages)/reservation/components/reservationDrawer/components/ReservationFinalDetailsItem";
import { formatPrice } from "@/lib/utils";
import type { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";
import { ChevronLeft, ChevronRight, SaudiRiyal } from "lucide-react";
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

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-4">
        <h2 className="text-base font-bold">
          {t("myBookingsDrawer.extendBooking.complete.bookingDetailsTitle")}
        </h2>

        <div className="mt-3 flex flex-col gap-6 rounded-xl bg-Grey100 p-3">
          <ReservationFinalDetailsItem
            itemHeader={t(
              "myBookingsDrawer.paymentDetails.rentalDurationCostHeader",
            )}
            largeText
            items={[
              {
                label: t(
                  "myBookingsDrawer.paymentDetails.subtotalBeforeTaxLabel",
                ),
                isAvailable: (extendData?.basePrice ?? 0) !== 0,
                value: formatPrice(extendData?.basePrice || 0),
              },
            ]}
          />

          <ReservationFinalDetailsItem
            itemHeader={t(
              "myBookingsDrawer.paymentDetails.additionalServicesCostHeader",
            )}
            largeText
            items={[
              {
                isAvailable: (extendData?.invoiceFee ?? 0) !== 0,
                label: t(
                  "myBookingsDrawer.paymentDetails.rentalAgreementFeeLabel",
                ),
                value: formatPrice(extendData?.invoiceFee || 0),
              },
              {
                isAvailable: (extendData?.servicesPrice ?? 0) !== 0,
                label: t(
                  "myBookingsDrawer.paymentDetails.additionalServicesLabel",
                ),
                value: formatPrice(extendData?.servicesPrice || 0),
              },
              {
                isAvailable: (extendData?.driverPrice ?? 0) !== 0,
                label: t("myBookingsDrawer.paymentDetails.driverServiceLabel"),
                value: formatPrice(extendData?.driverPrice || 0),
              },
              {
                isAvailable: (extendData?.extraKmPrice ?? 0) !== 0,
                label: t(
                  "myBookingsDrawer.paymentDetails.extraKilometersFeeLabel",
                ),
                value: formatPrice(extendData?.extraKmPrice || 0),
              },
              {
                isAvailable: (extendData?.receiveFee ?? 0) !== 0,
                label: t("myBookingsDrawer.paymentDetails.pickupFeeLabel"),
                value: formatPrice(extendData?.receiveFee || 0),
              },
              {
                isAvailable: (extendData?.deliverFee ?? 0) !== 0,
                label: t("myBookingsDrawer.paymentDetails.deliveryFeeLabel"),
                value: formatPrice(extendData?.deliverFee || 0),
              },
            ]}
          />

          <ReservationFinalDetailsItem
            itemHeader={t(
              "myBookingsDrawer.paymentDetails.discountsAndOffersHeader",
            )}
            largeText
            offer
            items={[
              {
                label: t(
                  "myBookingsDrawer.paymentDetails.rentalDaysOfferDiscountLabel",
                  {
                    days: extendData?.days ?? 0,
                  },
                ),
                isAvailable: (extendData?.carDaysDiscount ?? 0) !== 0,
                value: (
                  <span dir="ltr">
                    -{formatPrice(extendData?.carDaysDiscount || 0)}
                  </span>
                ),
              },
              {
                label: t("myBookingsDrawer.paymentDetails.promoCodeLabel"),
                isAvailable: (extendData?.promoDiscount ?? 0) !== 0,
                value: (
                  <span dir="ltr" className="rounded-lg p-1">
                    <span>-</span>
                    {formatPrice(extendData?.promoDiscount || 0)}
                  </span>
                ),
              },
              {
                label: t("myBookingsDrawer.paymentDetails.pointsDiscountLabel"),
                isAvailable: (extendData?.pointsDiscount ?? 0) !== 0,
                value: (
                  <span dir="ltr" className="rounded-lg p-1">
                    -{formatPrice(extendData?.pointsDiscount || 0)}
                  </span>
                ),
              },
            ]}
          />

          <ReservationFinalDetailsItem
            largeText
            showSeparator
            itemHeader={t(
              "myBookingsDrawer.extendBooking.complete.amountDetailsHeader",
            )}
            items={[
              {
                label: t(
                  "myBookingsDrawer.paymentDetails.totalBeforeTaxLabel",
                ),
                value: formatPrice(extendData?.totalBeforeTax || 0),
              },
              {
                label: t("myBookingsDrawer.paymentDetails.taxValueLabel"),
                value: formatPrice(extendData?.taxValue || 0),
              },
            ]}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t px-6 py-4">
        <span className="text-base font-semibold text-gray-900">
          {t("myBookingsDrawer.extendBooking.complete.additionalAmount")}
        </span>
        <div className="flex items-center gap-1 text-lg font-bold">
          <span>{formatPrice(extendData?.total || 0)}</span>
          <SaudiRiyal className="h-6! w-6!" />
        </div>
      </div>

      <SheetFooter className="mt-0 border-t-2 p-5 shadow-[0px_-13px_15px_0px_#01250514]">
        <Button
          type="button"
          className="w-full text-lg!"
          onClick={onDone}
        >
          {t("myBookingsDrawer.extendBooking.complete.done")}
        </Button>
      </SheetFooter>
    </div>
  );
};

export default BookingExtendComplete;
