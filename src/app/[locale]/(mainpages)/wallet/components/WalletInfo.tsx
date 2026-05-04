"use client";

import { Separator } from "@/app/(components)/ui/separator";
import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";
import { formatPrice } from "@/lib/utils";

const WalletInfo = () => {
  const { data: walletInfo } = useWalletInfo();

  return (
    <>
      <div className="flex min-w-0 items-start gap-3 sm:items-center">
        <div className="relative h-[56px] w-[56px] min-h-[56px] min-w-[56px] shrink-0 overflow-hidden rounded-lg bg-gray-200">
          <Image src="/userDefaultIcon.png" alt="" fill />
        </div>
        <div className="min-w-0 flex-1">
          <p className="wrap-break-word text-base font-bold sm:text-lg">
            أهلاً {walletInfo?.ownerName ? walletInfo.ownerName : "عبد الرحمن"}
          </p>
          <p className="text-sm text-Grey600">
            قُم بتحديث بياناتك الشخضية و ضبط الأعدادات
          </p>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-lg font-bold">المحفظة</p>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <p className="flex items-center gap-1 rounded-xl border-2 border-StatusDarkGreen bg-StatusGreen px-3 py-2 sm:px-4">
              <span className="text-sm">لديك</span>
              <span className="mx-1 text-sm font-extrabold tabular-nums">
                {walletInfo?.balance !== undefined
                  ? formatPrice(walletInfo.balance, { maxFractionDigits: 0, truncate: true })
                  : "..."}
              </span>
              <SaudiRiyal className="h-5 w-5 shrink-0" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletInfo;
