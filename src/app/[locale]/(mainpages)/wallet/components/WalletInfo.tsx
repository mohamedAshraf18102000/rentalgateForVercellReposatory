"use client";

import { Separator } from "@/app/(components)/ui/separator";
import { ChevronRight, SaudiRiyal } from "lucide-react";
import Image from "next/image";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const WalletInfo = () => {
  const router = useRouter();
  const { data: walletInfo } = useWalletInfo();
  const t = useTranslations("profile.walletPage");
  const tProfile = useTranslations("profile");

  return (
    <>
      <div className="flex min-w-0 items-start gap-3 sm:items-center">
        <div className="relative h-[56px] w-[56px] min-h-[56px] min-w-[56px] shrink-0 overflow-hidden rounded-lg bg-gray-200">
          <Image src="/userDefaultIcon.png" alt={t("userAvatarAlt")} fill />
        </div>
        <div className="min-w-0 flex-1">
          <p className="wrap-break-word text-base font-bold sm:text-lg">
            {tProfile("profilePage.greeting", {
              name: walletInfo?.ownerName ?? "...",
            })}
          </p>
          <p className="text-sm text-Grey600">عرض جميع معاملات المحفظة.</p>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="">
        <div className="flex flex-col sm:flex-row sm:items-center bg-Grey100 p-3 rounded-xl gap-3 md:gap-20">
          <div className="min-w-0 flex items-center gap-2">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-lg border-2 cursor-pointer bg-white transition-all duration-300"
              onClick={() => {
                router.back();
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 relative">
              <Image src="/profile/actionIcons/wallet.webp" alt="wallet" fill />
            </div>
            <p className="text-lg font-bold">{t("walletTitle")}</p>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <p className="flex items-center gap-1 rounded-lg border-2 border-StatusDarkGreen bg-StatusGreen px-3 py-2 sm:px-4">
              <span className="text-sm">{t("balancePrefix")}</span>
              <span className="mx-1 text-sm font-extrabold tabular-nums">
                {walletInfo?.balance !== undefined
                  ? formatPrice(walletInfo.balance, {
                      maxFractionDigits: 0,
                      truncate: true,
                    })
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
