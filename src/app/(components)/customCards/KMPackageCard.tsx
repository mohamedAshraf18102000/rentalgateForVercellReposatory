"use client";

import { KilometerPackage } from "@/types/companyCars/carDetails";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { SaudiRiyal } from "lucide-react";

type TofferPackageProps = {
  kilometerPackage: KilometerPackage;
  className?: string;
  warningAvailable?: boolean;
  warnToTakeOfferDate?: string;
};

const KMPackageCard = ({
  kilometerPackage,
  warnToTakeOfferDate,
  warningAvailable,
}: TofferPackageProps) => {
  const t = useTranslations("carDetails.kmPackageCard");

  return (
    <div className="border-2 w-full flex items-end rounded-2xl relative overflow-hidden min-h-[100px] sm:min-h-[100px] bg-white">
      {/* Badge */}
      <Badge className="text-xs sm:text-sm font-bold absolute top-0 -left-2 z-10 bg-StatusGreen text-StatusDarkGreen px-3 py-2 sm:p-4 rounded-none rounded-br-2xl leading-tight">
        {t("badgeKmOffer")}
      </Badge>

      {/* Image Section */}
      <div className="relative w-1/3 sm:w-[40%] shrink-0 bg-Grey100 self-stretch min-h-[80px] sm:min-h-[80px]">
        <Image
          src="/offers/offerImage.png"
          alt="offer"
          fill
          className="object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 flex-1 min-w-0">
        <p className="text-xs sm:text-sm md:text-base font-normal mt-6! leading-snug sm:leading-normal">
          {t("bookPrefix")}{" "}
          <span className="font-bold">
            {t("kmCount", { count: kilometerPackage.km })}
          </span>{" "}
          <span className="font-bold inline-flex items-center gap-0.5 align-middle whitespace-nowrap">
            {t("pricePrefix")} {formatPrice(kilometerPackage.price)}
            <SaudiRiyal
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
              aria-hidden
            />
          </span>
        </p>
      </div>
    </div>
  );
};

export default KMPackageCard;
