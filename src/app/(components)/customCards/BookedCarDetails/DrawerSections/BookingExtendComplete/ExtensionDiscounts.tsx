"use client";

import React, { useEffect, useState } from "react";
import RadioOfferCard from "@/app/(components)/customCards/RadioOfferCard";
import { RadioGroup } from "@/app/(components)/ui/radio-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  type CarouselApi,
} from "@/app/(components)/ui/carousel";
import { LucideEqualApproximately, SaudiRiyal, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePointPackages } from "@/hooks/api/usePointPackages";
import { useUserPoints } from "@/hooks/api/useUserPoints";

interface ExtensionDiscountsProps {
  selectedPointsPkId?: number | null;
  onPointsSelected?: (pkId: number, value: number) => void;
  onPointsCleared?: () => void;
  isCalculating?: boolean;
}

const ExtensionDiscounts = ({
  selectedPointsPkId,
  onPointsSelected,
  onPointsCleared,
  isCalculating,
}: ExtensionDiscountsProps) => {
  const { data: pointPackages } = usePointPackages();
  const { data: userPointsData } = useUserPoints();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("carDetails");

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const filteredPointPackages = pointPackages?.filter(
    (pkg) => (userPointsData?.availablePoints || 0) >= pkg.points,
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3 sm:gap-4">
        <p className="text-base font-bold">
          {t("reservation.discounts.title")}
        </p>
        {selectedPointsPkId && (
          <button
            onClick={() => onPointsCleared?.()}
            disabled={isCalculating}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors font-medium disabled:opacity-50"
          >
            <X size={14} />
            {t("reservation.discounts.clearSelection")}
          </button>
        )}
      </div>

      <div className="flex w-full flex-wrap items-center rounded-lg border-2 border-StatusDarkGreen bg-StatusGreen px-3 py-1 text-sm font-bold text-StatusDarkGreen sm:w-fit sm:text-base">
        <span>
          {t("reservation.discounts.availablePoints", {
            points: userPointsData?.availablePoints ?? 0,
          })}
        </span>
        <LucideEqualApproximately className="mx-2" />
        <span>{userPointsData?.availablePointsValue}</span>
        <SaudiRiyal className="mx-1" />
      </div>

      <RadioGroup
        dir={isRtl ? "rtl" : "ltr"}
        className="w-full mt-2 block relative"
        value={selectedPointsPkId?.toString() || ""}
        onValueChange={(val) => {
          const selectedPkg = filteredPointPackages?.find(
            (p) => p.packageId.toString() === val,
          );
          if (selectedPkg) {
            onPointsSelected?.(parseInt(val), selectedPkg.pointsValue);
          }
        }}
        disabled={isCalculating}
      >
        {filteredPointPackages && filteredPointPackages.length > 0 ? (
          <Carousel
            setApi={setApi}
            dir={isRtl ? "rtl" : "ltr"}
            lang={locale}
            opts={{
              align: "start",
              direction: isRtl ? "rtl" : "ltr",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="py-2">
              {filteredPointPackages.map((pkg, index) => (
                <CarouselItem
                  key={pkg.packageId}
                  className={`${filteredPointPackages.length > 1 ? "basis-[95%] sm:basis-[90%]" : ""} select-none`}
                >
                  <RadioOfferCard
                    title={pkg.name + " (" + pkg.points + ")"}
                    value={pkg.packageId.toString()}
                    discount={pkg.pointsValue.toString()}
                    isBlurred={current !== index}
                    titleClassname="text-[10px]!"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {filteredPointPackages.length > 1 && (
              <div className="flex items-center justify-end gap-4 absolute top-1/2 -translate-y-1/2 w-full z-10 pointer-events-none">
                <div className="pointer-events-auto">
                  <CarouselNext className="bg-white text-black border-2 relative" />
                </div>
              </div>
            )}
          </Carousel>
        ) : (
          <div className="w-full py-8 text-center text-gray-500 text-sm font-medium">
            {t("reservation.discounts.noOffers")}
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default ExtensionDiscounts;
