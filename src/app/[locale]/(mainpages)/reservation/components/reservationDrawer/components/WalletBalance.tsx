"use client";

import { Switch } from "@/app/(components)/ui/switch";
import { SaudiRiyal } from "lucide-react";

const WalletBalance = () => {
  return (
    <div className="p-2 rounded-xl flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Switch id="wallet-switch" />
        <p className="text-sm">أستخدم رصيد المحفظة:</p>
        <p className="font-bold">20.00</p>
        <SaudiRiyal className="h-6 w-6" />
      </div>
      <div className="h-7 w-7">
        <img src="/profile/actionIcons/wallet.webp" alt="" />
      </div>
    </div>
  );
};

export default WalletBalance;
