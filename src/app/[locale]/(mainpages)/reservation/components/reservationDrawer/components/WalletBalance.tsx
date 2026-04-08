"use client";

import { Switch } from "@/app/(components)/ui/switch";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";
import { formatPrice } from "@/lib/utils";
import { SaudiRiyal } from "lucide-react";

const WalletBalance = () => {
  const { data: wallet } = useWalletInfo();

  console.log(wallet);

  return (
    <div className="p-2 rounded-xl flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Switch id="wallet-switch" />
        <p className="text-sm">أستخدم رصيد المحفظة:</p>
        <p className="font-bold">{formatPrice(wallet?.balance || 0)}</p>
        <SaudiRiyal className="h-6 w-6" />
      </div>
      <div className="h-7 w-7">
        <img src="/profile/actionIcons/wallet.webp" alt="" />
      </div>
    </div>
  );
};

export default WalletBalance;
