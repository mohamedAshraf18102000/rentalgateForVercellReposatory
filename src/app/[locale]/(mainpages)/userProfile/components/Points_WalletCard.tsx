"use client";
import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn, formatPrice } from "@/lib/utils";

interface Points_WalletCardProps {
  icon: string;
  pointsTitle?: string;
  numberOfPoints?: number;
  valueINRial?: number;
  containerClassName?: string;
  loading?: boolean;
  onClick?: () => void;
}

const Points_WalletCard = ({
  icon,
  pointsTitle,
  numberOfPoints,
  valueINRial,
  containerClassName,
  loading,
  onClick,
}: Points_WalletCardProps) => {
  const t = useTranslations("profile.profilePage");

  if (loading) {
    return (
      <div className="flex w-full min-w-0 max-w-full items-center justify-between rounded-2xl bg-[linear-gradient(180deg,#BE2326_0%,#581012_100%)] p-3 text-white animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-[50px] h-[50px] bg-white/20 rounded-2xl" />
          <div className="w-20 h-5 bg-white/20 rounded-md" />
        </div>
        <div className="w-24 h-6 bg-white/20 rounded-md" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex w-full min-w-0 max-w-full items-center justify-between rounded-2xl bg-[linear-gradient(180deg,#BE2326_0%,#581012_100%)] p-3 text-white",
        containerClassName,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] relative rounded-2xl overflow-hidden">
          <Image className="object-contain" src={icon} alt="coin icon" fill />
        </div>

        <div className="">
          <p className="text-base">
            {numberOfPoints && (
              <span className="mx-1">{numberOfPoints ?? null}</span>
            )}
            <span className="text-sm">{pointsTitle ?? t("pointsLabel")}</span>
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-base sm:text-lg">
        <p className="tabular-nums">{formatPrice(valueINRial ?? 0)}</p>
        <SaudiRiyal className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </div>
  );
};

export default Points_WalletCard;
