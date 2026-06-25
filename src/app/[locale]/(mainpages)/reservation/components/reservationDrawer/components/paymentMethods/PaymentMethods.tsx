"use client";

import { cn, formatPrice } from "@/lib/utils";
import { Button, Checkbox } from "@/app/(components)";
import WarningMessage from "@/app/(components)/WarningMessage";
import { toast } from "sonner";
import WalletBalance from "../WalletBalance";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";
import { usePayWithWallet } from "@/hooks/api/payment/walletPayment/usePayWithWallet";
import { usePayWithGateway } from "@/hooks/api/payment/gatewayPayment/usePayWithGateway";
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
  amount?: number;
  onPaySuccess?: () => void;
};

const SUCCESS_REDIRECT_SECONDS = 5;

const PaymentMethods = ({
  isRTL = false,
  reservationId = null,
  amount = 0,
  onPaySuccess,
}: PaymentMethodsProps) => {
  const router = useRouter();
  const t = useTranslations("carDetails");
  const queryClient = useQueryClient();
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
    mutate: payWithWalletMutation,
    isPending: isPayingWithWallet,
    isError: isWalletPayError,
    error: walletPayError,
    reset: resetPayWithWallet,
  } = usePayWithWallet();
  const {
    mutate: payWithGatewayMutation,
    isPending: isPayingWithGateway,
    isError: isGatewayPayError,
    error: gatewayPayError,
    reset: resetPayWithGateway,
  } = usePayWithGateway();

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
    reservationId,
    amount,
    resetPayWithWallet,
    resetPayWithGateway,
  ]);

  const balance =
    walletPending || wallet == null ? null : Number(wallet.balance);
  const balanceInsufficient = balance !== null && amount > balance;

  const canPayWithWallet =
    useWallet &&
    reservationId != null &&
    reservationId > 0 &&
    amount > 0 &&
    !isPaying &&
    !walletPending &&
    !balanceInsufficient;

  const canPayWithGateway =
    useGateway &&
    reservationId != null &&
    reservationId > 0 &&
    !isPaying;

  const canPayWithoutTerms = canPayWithWallet || canPayWithGateway;

  const showTermsError =
    (canPayWithoutTerms || validationAttempted) && !termsAccepted;
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

    if (useWallet) {
      if (
        reservationId == null ||
        reservationId <= 0 ||
        amount <= 0 ||
        balanceInsufficient ||
        walletPending ||
        isPaying
      ) {
        return false;
      }
      return true;
    }

    if (
      reservationId == null ||
      reservationId <= 0 ||
      isPaying
    ) {
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

  const handleCompletePayment = () => {
    if (!validatePayment() || reservationId == null) return;

    if (useGateway) {
      payWithGatewayMutation(reservationId, {
        onSuccess: (response) => {
          const paymentUrl = response.data?.paymentUrl;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          }
        },
      });
      return;
    }

    payWithWalletMutation(
      { reservationId, amount },
      {
        onSuccess: async () => {
          try {
            await queryClient.invalidateQueries({ queryKey: ["walletInfo"] });
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
    resetAllStores({ excludeLocationReset: true });
    onPaySuccess?.();
    router.replace("/myBookings");
  }, [onPaySuccess, router]);

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
          redirectCountdownText={t("reservation.wallet.redirectCountdown", {
            seconds: secondsUntilRedirect,
          })}
          goNowLabel={t("reservation.wallet.redirectGoNow")}
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
          disabled={!canPayWithoutTerms}
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
