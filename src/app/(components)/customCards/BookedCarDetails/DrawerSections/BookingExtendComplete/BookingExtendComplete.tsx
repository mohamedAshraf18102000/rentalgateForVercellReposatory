"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Checkbox } from "@/app/(components)";
import { Separator } from "@/app/(components)/ui/separator";
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import WarningMessage from "@/app/(components)/WarningMessage";
import WalletBalance from "@/app/[locale]/(mainpages)/reservation/components/reservationDrawer/components/WalletBalance";
import { useCreateExtension } from "@/hooks/api/booking/useCreateExtension";
import { useExtendReservation } from "@/hooks/api/booking/useExtendReservation";
import { usePayExtensionWithWallet } from "@/hooks/api/payment/usePayExtensionWithWallet";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";
import { cn, formatPrice } from "@/lib/utils";
import type { ExtendReservationPayload } from "@/services/mybookings/extendReservation.service";
import type { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, SaudiRiyal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import BookingExtendDetails from "./BookingExtendDetails";

type Phase = "details" | "payment";

interface BookingExtendCompleteProps {
  extendData?: ReservationDetailsResponse | null;
  originalPayload?: ExtendReservationPayload | null;
  onBack?: () => void;
  onDone?: () => void;
}

const SUCCESS_REDIRECT_SECONDS = 5;

const BookingExtendComplete = ({
  extendData,
  originalPayload,
  onBack,
  onDone,
}: BookingExtendCompleteProps) => {
  const t = useTranslations("common");
  const tCar = useTranslations("carDetails");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const BackIcon = isRTL ? ChevronRight : ChevronLeft;
  const queryClient = useQueryClient();

  // ── Phase ────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("details");

  // ── Quote state (for display in details phase) ───────────────────────────
  const [currentQuote, setCurrentQuote] =
    useState<ReservationDetailsResponse | null>(extendData ?? null);

  // ── Created extension state (source of truth for payment) ───────────────
  const [createdExtensionId, setCreatedExtensionId] = useState<number | null>(
    null,
  );
  const [createdExtensionTotal, setCreatedExtensionTotal] = useState<number>(0);

  // ── Promo state ──────────────────────────────────────────────────────────
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoCodeType, setPromoCodeType] = useState<number | null>(null);
  const [promoDiscountValue, setPromoDiscountValue] = useState<number | null>(
    null,
  );

  // ── Points state ─────────────────────────────────────────────────────────
  const [selectedPointsPkId, setSelectedPointsPkId] = useState<number | null>(
    null,
  );

  // ── Payment state ────────────────────────────────────────────────────────
  const [useWallet, setUseWallet] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [secondsUntilRedirect, setSecondsUntilRedirect] = useState(
    SUCCESS_REDIRECT_SECONDS,
  );
  const didNavigateRef = useRef(false);

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const { mutate: extendReservation, isPending: isReQuoting } =
    useExtendReservation();
  const { mutate: createExtension, isPending: isCreatingExtension } =
    useCreateExtension();
  const { data: wallet, isPending: walletPending } = useWalletInfo();
  const {
    mutate: payWithWallet,
    isPending: isPaying,
    isError,
    error,
    reset: resetPayMutation,
  } = usePayExtensionWithWallet();

  // Sync initial quote data
  useEffect(() => {
    if (extendData) setCurrentQuote(extendData);
  }, [extendData]);

  // Reset pay mutation when wallet selection or phase changes
  useEffect(() => {
    resetPayMutation();
  }, [useWallet, phase, resetPayMutation]);

  // ── Re-quote (when promo/points change in details phase) ─────────────────
  const triggerReQuote = useCallback(
    (newPromoCode: string | null, newPointsPkId: number | null) => {
      if (!originalPayload) return;

      const reQuotePayload: ExtendReservationPayload = {
        ...originalPayload,
        promoCode: newPromoCode ?? undefined,
        points:
          newPointsPkId !== null
            ? ({ type: "PACKAGE", pointsPkId: newPointsPkId } as Record<
                string,
                unknown
              >)
            : undefined,
      };

      extendReservation(reQuotePayload, {
        onSuccess: (data) => setCurrentQuote(data),
      });
    },
    [originalPayload, extendReservation],
  );

  // ── Build the full payload with current promo/points ─────────────────────
  const buildExtensionPayload =
    useCallback((): ExtendReservationPayload | null => {
      if (!originalPayload) return null;
      return {
        ...originalPayload,
        promoCode: promoCode ?? undefined,
        points:
          selectedPointsPkId !== null
            ? ({ type: "PACKAGE", pointsPkId: selectedPointsPkId } as Record<
                string,
                unknown
              >)
            : undefined,
      };
    }, [originalPayload, promoCode, selectedPointsPkId]);

  // ── Promo handlers ───────────────────────────────────────────────────────
  const handlePromoApplied = (
    code: string,
    codeType: number,
    discountValue: number,
  ) => {
    setPromoCode(code);
    setPromoCodeType(codeType);
    setPromoDiscountValue(discountValue);
    triggerReQuote(code, selectedPointsPkId);
  };

  const handlePromoCleared = () => {
    setPromoCode(null);
    setPromoCodeType(null);
    setPromoDiscountValue(null);
    triggerReQuote(null, selectedPointsPkId);
  };

  // ── Points handlers ──────────────────────────────────────────────────────
  const handlePointsSelected = (pkId: number) => {
    setSelectedPointsPkId(pkId);
    triggerReQuote(promoCode, pkId);
  };

  const handlePointsCleared = () => {
    setSelectedPointsPkId(null);
    triggerReQuote(promoCode, null);
  };

  // ── Step 1: Create extension → transition to payment phase ───────────────
  const handleCompletePaymentClick = () => {
    const createPayload = buildExtensionPayload();
    if (!createPayload) return;

    createExtension(createPayload, {
      onSuccess: (data) => {
        setCreatedExtensionId(data.extendId);
        setCreatedExtensionTotal(data.total);
        setPhase("payment");
      },
    });
  };

  // ── Payment helpers (use backend-confirmed extendId + total) ─────────────
  const payableTotal = createdExtensionTotal;
  const balance =
    walletPending || wallet == null ? null : Number(wallet.balance);
  const balanceInsufficient = balance !== null && payableTotal > balance;

  const canPayWithoutTerms =
    useWallet &&
    createdExtensionId != null &&
    payableTotal > 0 &&
    !isPaying &&
    !walletPending &&
    !balanceInsufficient;

  const showTermsError =
    (canPayWithoutTerms || validationAttempted) && !termsAccepted;
  const showWalletError = validationAttempted && !useWallet;

  const validatePayment = (): boolean => {
    setValidationAttempted(true);
    if (
      !useWallet ||
      !termsAccepted ||
      createdExtensionId == null ||
      payableTotal <= 0 ||
      balanceInsufficient ||
      walletPending ||
      isPaying
    ) {
      return false;
    }
    return true;
  };

  const errorMessage =
    error?.message && error.message.toLowerCase().includes("insufficient")
      ? tCar("reservation.wallet.balanceNotEnough")
      : error?.message;

  // ── Step 2: Wallet payment with extendId from created extension ───────────
  const handleWalletPayment = () => {
    if (!validatePayment() || createdExtensionId == null) return;

    payWithWallet(
      { extendId: createdExtensionId, amount: payableTotal },
      {
        onSuccess: async () => {
          try {
            await Promise.all([
              queryClient.invalidateQueries({ queryKey: ["walletInfo"] }),
              queryClient.invalidateQueries({
                queryKey: ["user-reservation-details"],
              }),
              queryClient.invalidateQueries({
                queryKey: ["user-reservations"],
              }),
            ]);
          } finally {
            setPaymentSucceeded(true);
          }
        },
      },
    );
  };

  // ── Success countdown & navigation ───────────────────────────────────────
  const navigateAfterSuccess = useCallback(() => {
    if (didNavigateRef.current) return;
    didNavigateRef.current = true;
    onDone?.();
  }, [onDone]);

  useEffect(() => {
    if (!paymentSucceeded) return;
    didNavigateRef.current = false;
    setSecondsUntilRedirect(SUCCESS_REDIRECT_SECONDS);
    const id = setInterval(() => {
      setSecondsUntilRedirect((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [paymentSucceeded]);

  useEffect(() => {
    if (!paymentSucceeded || secondsUntilRedirect > 0) return;
    navigateAfterSuccess();
  }, [paymentSucceeded, secondsUntilRedirect, navigateAfterSuccess]);

  // ── Back-to-details: reset payment + created extension state ─────────────
  const handleBackToDetails = () => {
    setPhase("details");
    setUseWallet(false);
    setTermsAccepted(false);
    setValidationAttempted(false);
    setCreatedExtensionId(null);
    setCreatedExtensionTotal(0);
    resetPayMutation();
  };

  // ── Derived titles ───────────────────────────────────────────────────────
  const title =
    phase === "payment"
      ? t("myBookingsDrawer.extendBooking.complete.paymentTitle")
      : t("myBookingsDrawer.extendBooking.complete.title");

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col bg-background animate-in fade-in duration-300 ${
        isRTL ? "slide-in-from-right" : "slide-in-from-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ── Header ── */}
      <SheetHeader className="mt-10 flex flex-col gap-2 space-y-0 px-6 text-start">
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={phase === "payment" ? handleBackToDetails : onBack}
            aria-label={t("backToBookingDetails")}
          >
            <BackIcon className="h-5 w-5" />
          </Button>
          <SheetTitle className="text-start text-xl">{title}</SheetTitle>
        </div>
        <Separator />
      </SheetHeader>

      {/* ── Phase: details ── */}
      {phase === "details" && (
        <>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
            <BookingExtendDetails
              extendData={currentQuote}
              isReQuoting={isReQuoting}
              promoCode={promoCode}
              promoCodeType={promoCodeType}
              promoDiscountValue={promoDiscountValue}
              selectedPointsPkId={selectedPointsPkId}
              onPromoApplied={handlePromoApplied}
              onPromoCleared={handlePromoCleared}
              onPointsSelected={handlePointsSelected}
              onPointsCleared={handlePointsCleared}
            />
          </div>
          <SheetFooter className="mt-0 border-t-2 p-5 shadow-[0px_-13px_15px_0px_#01250514]">
            <Button
              type="button"
              className="w-full text-lg! flex items-center justify-center gap-1"
              loading={isReQuoting || isCreatingExtension}
              disabled={!currentQuote || isReQuoting || isCreatingExtension}
              onClick={handleCompletePaymentClick}
            >
              <span>
                {t("myBookingsDrawer.extendBooking.complete.completePayment")}
              </span>
              <span>{formatPrice(currentQuote?.total ?? 0)}</span>
              <SaudiRiyal className="h-6! w-6!" />
            </Button>
          </SheetFooter>
        </>
      )}

      {/* ── Phase: payment – success ── */}
      {phase === "payment" && paymentSucceeded && (
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col items-center justify-center px-4",
            "animate-in fade-in duration-300 ease-out",
          )}
        >
          <div className="text-center flex flex-col items-center justify-center">
            <div className="relative h-[80px] w-[80px] rounded-full bg-Grey100">
              <Image
                src="/bussinesAccounts/dialogeSuccessImage.png"
                alt=""
                fill
              />
            </div>
            <div className="mt-5">
              <p className="text-base! font-bold">
                {t(
                  "myBookingsDrawer.extendBooking.complete.paymentSuccessTitle",
                )}
              </p>
              <p className="mt-2 text-sm text-Grey700">
                {t(
                  "myBookingsDrawer.extendBooking.complete.paymentRedirectCountdown",
                  { seconds: secondsUntilRedirect },
                )}
              </p>
              <Link
                href="/myBookings"
                className="my-2 block text-sm text-Grey700 underline underline-offset-5"
                onClick={(e) => {
                  e.preventDefault();
                  navigateAfterSuccess();
                }}
              >
                {t(
                  "myBookingsDrawer.extendBooking.complete.paymentRedirectGoNow",
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Phase: payment – wallet form ── */}
      {phase === "payment" && !paymentSucceeded && (
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            "animate-in fade-in duration-300 ease-out",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 sm:px-6">
            <div className="min-h-0 flex-1 overflow-y-auto pt-1">
              <WalletBalance
                wallet={wallet || null}
                loading={walletPending}
                useWallet={useWallet}
                onUseWalletChange={setUseWallet}
              />
              {useWallet && balanceInsufficient && (
                <p className="mt-2 text-sm text-StatusRed">
                  *{tCar("reservation.wallet.balanceNotEnough")}
                </p>
              )}
              {isError && errorMessage && (
                <p className="mt-1 text-sm text-StatusRed">*{errorMessage}</p>
              )}
            </div>
          </div>

          <div className="w-full px-5 pb-2">
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-xs",
                showTermsError && "border border-StatusRed bg-red-50",
              )}
            >
              <Checkbox
                width={20}
                height={20}
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  setTermsAccepted(checked === true);
                  if (checked === true) setValidationAttempted(false);
                }}
              />
              <span>
                {tCar.rich("reservation.wallet.termsAgreement", {
                  link: (chunks) => (
                    <Link
                      href="/terms&conditions#booking-terms"
                      className="text-blue-500 underline cursor-pointer mx-0.5"
                      target="_blank"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </div>
            {showTermsError && (
              <WarningMessage
                message={tCar("reservation.wallet.validation.termsRequired")}
                removeIcon
                className="mt-2 px-1"
              />
            )}
            {showWalletError && (
              <WarningMessage
                message={tCar("reservation.wallet.validation.walletRequired")}
                removeIcon
                className="mt-2 px-1"
              />
            )}
          </div>

          <div className="sticky bottom-0 shrink-0 border-t-2 bg-background p-5 shadow-[0px_-13px_15px_0px_#01250514]">
            <Button
              className="w-full text-lg! flex items-center justify-center"
              type="button"
              loading={isPaying}
              disabled={!canPayWithoutTerms}
              onClick={handleWalletPayment}
            >
              <p className="flex items-center gap-1">
                <span>{tCar("reservation.drawer.payLabel")}</span>
                <span>{formatPrice(payableTotal)}</span>
                <SaudiRiyal className="h-6! w-6!" />
              </p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingExtendComplete;
