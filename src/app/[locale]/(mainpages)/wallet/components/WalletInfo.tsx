"use client";

import { Separator } from "@/app/(components)/ui/separator";
import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";

const WalletInfo = () => {
  const { data: walletInfo } = useWalletInfo();

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative min-w-[56px] min-h-[56px] w-[56px] h-[56px] rounded-lg overflow-hidden bg-gray-200">
          <Image src="/userDefaultIcon.png" alt="" fill />
        </div>
        <div>
          <p className="font-bold text-lg">
            أهلاً {walletInfo?.ownerName ? walletInfo.ownerName : "عبد الرحمن"}
          </p>
          <p className="text-sm">قُم بتحديث بياناتك الشخضية و ضبط الأعدادات</p>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">المحفظة</p>
          </div>

          <div>
            <p className="bg-StatusGreen border-2 border-StatusDarkGreen px-4 py-2 rounded-xl flex items-center gap-1">
              <span className="text-sm">لديك</span>
              <span className="font-extrabold text-sm mx-1">
                {walletInfo?.balance !== undefined ? walletInfo.balance : "..."}
              </span>
              <SaudiRiyal className="w-5 h-5" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletInfo;
