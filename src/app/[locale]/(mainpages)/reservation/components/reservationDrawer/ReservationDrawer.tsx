"use client";

import { Button } from "@/app/(components)/ui/button";
import { Separator } from "@/app/(components)/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import { SaudiRiyal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReservationFinalDetails from "./components/ReservationFinalDetails";
import Coupon from "./components/Coupon";
import Discounts from "./components/Discounts";
import { formatPrice } from "@/lib/utils/formatPrice";
import { CalculateQuotePriceResponse } from "@/services/calculateQuotePrice/calculateQuotePrice.service";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import ReservationDetailsSkeleton from "./components/ReservationDetailsSkeleton";
import { useLocale, useTranslations } from "next-intl";
import PaymentMethods from "./components/paymentMethods/PaymentMethods";
import { useCreateReservation } from "@/hooks/api/reservation/useCreateReservation";
import { buildReservationPayload } from "../../utils/buildReservationPayload";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

type ReservationDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  reservationData?: CalculateQuotePriceResponse;
  onCalculateQuote?: () => void;
  isCalculating?: boolean;
};

const ReservationDrawer = ({
  open,
  onOpenChange,
  reservationData,
  onCalculateQuote,
  isCalculating,
}: ReservationDrawerProps) => {
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const isRTL = locale === "ar";
  const [showPaymentPage, setShowPaymentPage] = useState(false);

  const paymentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    mutate: createReservation,
    isPending: isCreatingReservation,
    data: createdReservationData,
  } = useCreateReservation();

  useEffect(() => {
    if (!open) {
      setShowPaymentPage(false);
      if (paymentTimerRef.current) {
        clearTimeout(paymentTimerRef.current);
        paymentTimerRef.current = null;
      }
    }
  }, [open]);

  const handlePayClick = () => {
    const latestFormData = useBookedCarDetailsStore.getState().formData;
    const payload = buildReservationPayload(latestFormData);
    createReservation(payload, {
      onSuccess: () => {
        setShowPaymentPage(true);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        dir={isRTL ? "rtl" : "ltr"}
        side={isRTL ? "right" : "left"}
        className="flex w-full max-w-full flex-col p-0 sm:max-w-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-start! mt-8 px-4 sm:mt-10 sm:px-6">
          <SheetTitle>
            {showPaymentPage
              ? t("reservation.drawer.checkoutTitle")
              : t("reservation.drawer.invoiceTitle")}
          </SheetTitle>
          <Separator className="" />
        </SheetHeader>
        {showPaymentPage ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <PaymentMethods
              isRTL={isRTL}
              reservationId={createdReservationData?.reservationId}
              amount={reservationData?.total ?? 0}
              onPaySuccess={() => onOpenChange?.(false)}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-3 sm:px-4">
              <div className="w-full p-1.5 sm:p-2">
                <h1 className="text-base font-bold">
                  {t("reservation.drawer.bookingDetailsTitle")}
                </h1>
                <div className="bg-Grey100 p-3 mt-3 rounded-xl">
                  {isCalculating ? (
                    <ReservationDetailsSkeleton />
                  ) : (
                    <ReservationFinalDetails
                      data={reservationData}
                      isCalculating={isCalculating}
                    />
                  )}
                </div>
                <div className="mt-6">
                  <Coupon
                    isCalculating={isCalculating}
                    onApplied={onCalculateQuote}
                  />
                </div>
                <div className="mt-6">
                  <Separator className="my-2" />
                </div>
                <div className="mt-6">
                  <Discounts
                    isCalculating={isCalculating}
                    onApplied={onCalculateQuote}
                  />
                </div>
              </div>
            </div>
            <SheetFooter className="border-t-2 p-5 shadow-[0px_-13px_15px_0px_#01250514]">
              <Button
                className="w-full text-lg! flex items-center justify-center"
                type="button"
                loading={isCreatingReservation || isCalculating}
                disabled={isCreatingReservation || isCalculating}
                onClick={handlePayClick}
              >
                <span>{t("reservation.drawer.payLabel")}</span>
                <span className="mx-1">
                  {formatPrice(reservationData?.total || 0)}
                </span>
                <SaudiRiyal className="h-6! w-6!" />
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ReservationDrawer;
