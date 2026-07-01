"use client";

import { cn, formatPrice } from "@/lib/utils";
import { Button, Checkbox } from "@/app/(components)";
import WarningMessage from "@/app/(components)/WarningMessage";
import { toast } from "sonner";
import WalletBalance from "../WalletBalance";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";
import { usePayWithWallet } from "@/hooks/api/payment/walletPayment/usePayWithWallet";
import { usePayWithGateway } from "@/hooks/api/payment/gatewayPayment/usePayWithGateway";
import { usePayChangeLocationWithGateway } from "@/hooks/api/payment/gatewayPayment/usePayChangeLocationWithGateway";
import { usePayChangeLocationWithWallet } from "@/hooks/api/payment/walletPayment/usePayChangeLocationWithWallet";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { resetAllStores } from "@/lib/stores/resetAllStores";
import ReservationSuccessComponent from "../ReservationSuccessComponent";
import { SaudiRiyal } from "lucide-react";
import { Link } from "@/i18n/routing";
import PaymentGateWay from "../PaymentGateWay";

type PaymentMethodsProps = {
  isRTL?: boolean;
  reservationId?: number | null;
  changeLocationId?: number | null;
  paymentMode?: "reservation" | "change-location";
  amount?: number;
  onPaySuccess?: () => void;
  successBehavior?: "redirect-my-bookings" | "callback-only";
};

const SUCCESS_REDIRECT_SECONDS = 5;

const PaymentMethods = ({
  isRTL = false,
  reservationId = null,
  changeLocationId = null,
  paymentMode = "reservation",
  amount = 0,
  onPaySuccess,
  successBehavior = "redirect-my-bookings",
}: PaymentMethodsProps) => {
  const router = useRouter();
  const t = useTranslations("carDetails");
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();
  const isChangeLocationPayment = paymentMode === "change-location";
  const paymentTargetId = isChangeLocationPayment
    ? changeLocationId
    : reservationId;
  const [useWallet, setUseWallet] = useState(false);
  const [useGateway, setUseGateway] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const { data: wallet, isPending: walletPending } = useWalletInfo();
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [secondsUntilRedirect, setSecondsUntilRedirect] = useState(
    SUCCESS_REDIRECT_SECONDS,
  );
  const didNavigateAfterSuccessRef = useRef(false);
  const {
    mutate: payReservationWithWallet,
    isPending: isPayingReservationWithWallet,
    isError: isReservationWalletPayError,
    error: reservationWalletPayError,
    reset: resetPayReservationWithWallet,
  } = usePayWithWallet();
  const {
    mutate: payReservationWithGateway,
    isPending: isPayingReservationWithGateway,
    isError: isReservationGatewayPayError,
    error: reservationGatewayPayError,
    reset: resetPayReservationWithGateway,
  } = usePayWithGateway();
  const {
    mutate: payChangeLocationWithWallet,
    isPending: isPayingChangeLocationWithWallet,
    isError: isChangeLocationWalletPayError,
    error: changeLocationWalletPayError,
    reset: resetPayChangeLocationWithWallet,
  } = usePayChangeLocationWithWallet();
  const {
    mutate: payChangeLocationWithGateway,
    isPending: isPayingChangeLocationWithGateway,
    isError: isChangeLocationGatewayPayError,
    error: changeLocationGatewayPayError,
    reset: resetPayChangeLocationWithGateway,
  } = usePayChangeLocationWithGateway();

  const isPayingWithWallet = isChangeLocationPayment
    ? isPayingChangeLocationWithWallet
    : isPayingReservationWithWallet;
  const isPayingWithGateway = isChangeLocationPayment
    ? isPayingChangeLocationWithGateway
    : isPayingReservationWithGateway;
  const isWalletPayError = isChangeLocationPayment
    ? isChangeLocationWalletPayError
    : isReservationWalletPayError;
  const isGatewayPayError = isChangeLocationPayment
    ? isChangeLocationGatewayPayError
    : isReservationGatewayPayError;
  const walletPayError = isChangeLocationPayment
    ? changeLocationWalletPayError
    : reservationWalletPayError;
  const gatewayPayError = isChangeLocationPayment
    ? changeLocationGatewayPayError
    : reservationGatewayPayError;

  const resetPayWithWallet = isChangeLocationPayment
    ? resetPayChangeLocationWithWallet
    : resetPayReservationWithWallet;
  const resetPayWithGateway = isChangeLocationPayment
    ? resetPayChangeLocationWithGateway
    : resetPayReservationWithGateway;

  const isPaying = isPayingWithWallet || isPayingWithGateway;
  const isError = isWalletPayError || isGatewayPayError;

  const handleUseWalletChange = (value: boolean) => {
    setUseWallet(value);
    if (value) setUseGateway(false);
  };

  const handleUseGatewayChange = (value: boolean) => {
    setUseGateway(value);
    if (value) setUseWallet(false);
  };

  useEffect(() => {
    resetPayWithWallet();
    resetPayWithGateway();
  }, [
    useWallet,
    useGateway,
    paymentTargetId,
    amount,
    resetPayWithWallet,
    resetPayWithGateway,
  ]);

  const balance =
    walletPending || wallet == null ? null : Number(wallet.balance);
  const balanceInsufficient = balance !== null && amount > balance;

  const hasSelectedPaymentMethod = useWallet || useGateway;
  const isReadyToPay = hasSelectedPaymentMethod && termsAccepted && !isPaying;

  const showTermsError =
    (hasSelectedPaymentMethod || validationAttempted) && !termsAccepted;
  const showPaymentMethodError =
    validationAttempted && !useWallet && !useGateway;

  const validatePayment = (): boolean => {
    setValidationAttempted(true);

    if (!useWallet && !useGateway) {
      toast.error(t("reservation.wallet.validation.paymentMethodRequired"), {
        position: "top-center",
      });
      return false;
    }

    if (!termsAccepted) {
      toast.error(t("reservation.wallet.validation.termsRequired"), {
        position: "top-center",
      });
      return false;
    }

    console.log("paymentTargetId", paymentTargetId);

    if (paymentTargetId == null || paymentTargetId <= 0) {
      toast.error(
        isChangeLocationPayment
          ? tCommon("myBookingsDrawer.locationChangePayment.missingTargetId")
          : t("reservation.wallet.validation.paymentMethodRequired"),
        { position: "top-center" },
      );
      return false;
    }

    if (useWallet) {
      if (amount <= 0) {
        toast.error(t("reservation.wallet.validation.paymentMethodRequired"), {
          position: "top-center",
        });
        return false;
      }

      if (balanceInsufficient) {
        toast.error(t("reservation.wallet.balanceNotEnough"), {
          position: "top-center",
        });
        return false;
      }

      if (walletPending || isPaying) {
        return false;
      }

      return true;
    }

    if (isPaying) {
      return false;
    }

    return true;
  };

  const walletErrorMessage =
    walletPayError?.message &&
    walletPayError.message.toLowerCase().includes("insufficient")
      ? t("reservation.wallet.balanceNotEnough")
      : walletPayError?.message;

  const errorMessage = useWallet
    ? walletErrorMessage
    : gatewayPayError?.message;

  const invalidateAfterWalletSuccess = async () => {
    const invalidations = [
      queryClient.invalidateQueries({ queryKey: ["walletInfo"] }),
    ];

    if (isChangeLocationPayment) {
      invalidations.push(
        queryClient.invalidateQueries({
          queryKey: ["user-reservation-details"],
        }),
        queryClient.invalidateQueries({ queryKey: ["user-reservations"] }),
      );
    }

    await Promise.all(invalidations);
  };

  const handleCompletePayment = () => {
    if (!validatePayment() || paymentTargetId == null) return;

    if (useGateway) {
      if (isChangeLocationPayment) {
        payChangeLocationWithGateway(paymentTargetId, {
          onSuccess: (response) => {
            const paymentUrl = response.data?.paymentUrl;
            if (paymentUrl) {
              window.location.href = paymentUrl;
            }
          },
        });
        return;
      }

      payReservationWithGateway(paymentTargetId, {
        onSuccess: (response) => {
          const paymentUrl = response.data?.paymentUrl;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          }
        },
      });
      return;
    }

    if (isChangeLocationPayment) {
      payChangeLocationWithWallet(
        { changeLocationId: paymentTargetId, amount },
        {
          onSuccess: async () => {
            try {
              await invalidateAfterWalletSuccess();
            } finally {
              setPaymentSucceeded(true);
            }
          },
        },
      );
      return;
    }

    payReservationWithWallet(
      { reservationId: paymentTargetId, amount },
      {
        onSuccess: async () => {
          try {
            await invalidateAfterWalletSuccess();
          } finally {
            setPaymentSucceeded(true);
            router.prefetch("/myBookings");
          }
        },
      },
    );
  };

  const navigateAfterSuccess = useCallback(() => {
    if (didNavigateAfterSuccessRef.current) return;
    didNavigateAfterSuccessRef.current = true;

    if (successBehavior === "callback-only") {
      onPaySuccess?.();
      return;
    }

    resetAllStores({ excludeLocationReset: true });
    onPaySuccess?.();
    router.replace("/myBookings");
  }, [onPaySuccess, router, successBehavior]);

  useEffect(() => {
    if (!paymentSucceeded) return;
    didNavigateAfterSuccessRef.current = false;
    setSecondsUntilRedirect(SUCCESS_REDIRECT_SECONDS);
    const intervalId = setInterval(() => {
      setSecondsUntilRedirect((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [paymentSucceeded]);

  useEffect(() => {
    if (!paymentSucceeded || secondsUntilRedirect > 0) return;
    navigateAfterSuccess();
  }, [paymentSucceeded, secondsUntilRedirect, navigateAfterSuccess]);

  const handleNavigateNow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateAfterSuccess();
  };

  const successTitle = isChangeLocationPayment
    ? tCommon("myBookingsDrawer.locationChangePayment.successTitle")
    : undefined;

  const redirectCountdownText = isChangeLocationPayment
    ? tCommon("myBookingsDrawer.locationChangePayment.redirectCountdown", {
        seconds: secondsUntilRedirect,
      })
    : t("reservation.wallet.redirectCountdown", {
        seconds: secondsUntilRedirect,
      });

  const goNowLabel = isChangeLocationPayment
    ? tCommon("myBookingsDrawer.locationChangePayment.redirectGoNow")
    : t("reservation.wallet.redirectGoNow");

  if (paymentSucceeded) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col items-center justify-center px-4",
          "animate-in fade-in duration-300 ease-out",
          "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none",
          isRTL ? "slide-in-from-right" : "slide-in-from-left",
        )}
      >
        <ReservationSuccessComponent
          successTitle={successTitle}
          redirectCountdownText={redirectCountdownText}
          goNowLabel={goNowLabel}
          onNavigateNow={handleNavigateNow}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        "animate-in fade-in duration-300 ease-out",
        "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none",
        isRTL ? "slide-in-from-right" : "slide-in-from-left",
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto pt-1">
            <div>
              <WalletBalance
                wallet={wallet || null}
                loading={walletPending}
                useWallet={useWallet}
                onUseWalletChange={handleUseWalletChange}
              />
              {useWallet && balanceInsufficient ? (
                <p className="mt-2 text-sm text-StatusRed">
                  *{t("reservation.wallet.balanceNotEnough")}
                </p>
              ) : null}
              {isError && errorMessage ? (
                <p className="text-sm text-StatusRed">*{errorMessage}</p>
              ) : null}
            </div>

            <PaymentGateWay
              useGateway={useGateway}
              onUseGatewayChange={handleUseGatewayChange}
            />
          </div>
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
            {t.rich("reservation.wallet.termsAgreement", {
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
        {showTermsError ? (
          <WarningMessage
            message={t("reservation.wallet.validation.termsRequired")}
            removeIcon
            className="mt-2 px-1"
          />
        ) : null}
        {showPaymentMethodError ? (
          <WarningMessage
            message={t("reservation.wallet.validation.paymentMethodRequired")}
            removeIcon
            className="mt-2 px-1"
          />
        ) : null}
      </div>

      <div className="sticky bottom-0 shrink-0 border-t-2 bg-background p-5 shadow-[0px_-13px_15px_0px_#01250514]">
        <Button
          className="w-full text-lg! flex items-center justify-center"
          type="button"
          loading={isPaying}
          disabled={!isReadyToPay}
          onClick={handleCompletePayment}
        >
          <p className="flex items-center gap-1">
            <span>{t("reservation.drawer.payLabel")}</span>
            <span>{formatPrice(amount)}</span>
            <SaudiRiyal className="h-6! w-6!" />
          </p>
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethods;
