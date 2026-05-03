"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/app/(components)";
import WalletBalance from "../WalletBalance";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";
import { usePayWithWallet } from "@/hooks/api/payment/usePayWithWallet";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { resetAllStores } from "@/lib/stores/resetAllStores";
import ReservationSuccessComponent from "../ReservationSuccessComponent";

type PaymentMethodsProps = {
  isRTL?: boolean;
  reservationId?: number | null;
  amount?: number;
  onPaySuccess?: () => void;
};

const SUCCESS_REDIRECT_SECONDS = 10;

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
  const { data: wallet, isPending: walletPending } = useWalletInfo();
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [secondsUntilRedirect, setSecondsUntilRedirect] = useState(
    SUCCESS_REDIRECT_SECONDS,
  );
  const didNavigateAfterSuccessRef = useRef(false);
  const {
    mutate: payWithWalletMutation,
    isPending: isPaying,
    isError,
    error,
    reset: resetPayWithWallet,
  } = usePayWithWallet();

  useEffect(() => {
    resetPayWithWallet();
  }, [useWallet, reservationId, amount, resetPayWithWallet]);

  const balance =
    walletPending || wallet == null ? null : Number(wallet.balance);
  const balanceInsufficient = balance !== null && amount > balance;

  const canPay =
    useWallet &&
    reservationId != null &&
    reservationId > 0 &&
    amount > 0 &&
    !isPaying &&
    !walletPending &&
    !balanceInsufficient;

  const errorMessage =
    error?.message && error.message.toLowerCase().includes("insufficient")
      ? t("reservation.wallet.balanceNotEnough")
      : error?.message;

  const handleCompletePayment = () => {
    if (
      !useWallet ||
      reservationId == null ||
      reservationId <= 0 ||
      amount <= 0 ||
      balanceInsufficient
    )
      return;
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
    resetAllStores();
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
                onUseWalletChange={setUseWallet}
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
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 shrink-0 border-t-2 bg-background p-5 shadow-[0px_-13px_15px_0px_#01250514]">
        <Button
          className="w-full text-lg! flex items-center justify-center"
          type="button"
          loading={isPaying}
          disabled={!canPay}
          onClick={handleCompletePayment}
        >
          <span>استكمال الدفع</span>
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethods;
