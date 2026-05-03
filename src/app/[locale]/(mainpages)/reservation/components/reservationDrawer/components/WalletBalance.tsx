"use client";

import { Skeleton } from "@/app/(components)/ui/skeleton";
import { Switch } from "@/app/(components)/ui/switch";
import { formatPrice } from "@/lib/utils";
import { WalletInfo } from "@/types/wallet/wallet";
import { SaudiRiyal } from "lucide-react";
import { useTranslations } from "next-intl";

type WalletBalanceProps = {
  wallet: WalletInfo | null;
  loading?: boolean;
  useWallet: boolean;
  onUseWalletChange: (value: boolean) => void;
};

const WalletBalance = ({
  wallet,
  loading,
  useWallet,
  onUseWalletChange,
}: WalletBalanceProps) => {
  const t = useTranslations("carDetails");

  if (loading) {
    return <Skeleton className="w-full h-10" />;
  }
  return (
    <>
      <div className="flex flex-col justify-between gap-2 p-2 sm:flex-row sm:items-center bg-Grey100 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <Switch
            id="wallet-switch"
            checked={useWallet}
            onCheckedChange={onUseWalletChange}
            disabled={wallet == null}
          />
          <p className="text-sm">{t("reservation.wallet.useBalanceLabel")}</p>
          <p className="font-bold">{formatPrice(wallet?.balance || 0)}</p>
          <SaudiRiyal className="h-6 w-6" />
        </div>
        <div className="h-7 w-7 self-end sm:self-auto">
          <img src="/profile/actionIcons/wallet.webp" alt="" />
        </div>
      </div>
    </>
  );
};

export default WalletBalance;
