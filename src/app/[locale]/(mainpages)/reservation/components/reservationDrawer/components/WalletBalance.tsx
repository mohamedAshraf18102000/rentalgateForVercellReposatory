"use client";

import { Switch } from "@/app/(components)/ui/switch";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";
import { formatPrice } from "@/lib/utils";
import { SaudiRiyal } from "lucide-react";
import { useTranslations } from "next-intl";

const WalletBalance = () => {
  const { data: wallet } = useWalletInfo();
  const t = useTranslations("carDetails");

  return (
    <div className="flex flex-col justify-between gap-2 rounded-xl p-2 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-2">
        <Switch id="wallet-switch" />
        <p className="text-sm">{t("reservation.wallet.useBalanceLabel")}</p>
        <p className="font-bold">{formatPrice(wallet?.balance || 0)}</p>
        <SaudiRiyal className="h-6 w-6" />
      </div>
      <div className="h-7 w-7 self-end sm:self-auto">
        <img src="/profile/actionIcons/wallet.webp" alt="" />
      </div>
    </div>
  );
};

export default WalletBalance;
