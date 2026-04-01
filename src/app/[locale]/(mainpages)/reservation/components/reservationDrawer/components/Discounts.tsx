"use client";

import React, { useState, useEffect } from "react";
import RadioOfferCard from "@/app/(components)/customCards/RadioOfferCard";
import { RadioGroup } from "@/app/(components)/ui/radio-group";
import { LucideEqualApproximately, SaudiRiyal } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  type CarouselApi,
} from "@/app/(components)/ui/carousel";
import { useLocale, useTranslations } from "next-intl";
import { useUserPoints } from "@/hooks/api/useUserPoints";
import { usePointPackages } from "@/hooks/api/usePointPackages";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { X } from "lucide-react";

const Discounts = () => {
  const { data: pointPackages } = usePointPackages();
  const { data: userPointsData } = useUserPoints();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations();

  const { formData, setFormField } = useBookedCarDetailsStore();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const filteredPointPackages = pointPackages?.filter(
    (pkg) => (userPointsData?.availablePoints || 0) >= pkg.points,
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  return (
    <div className="">
      <div className="flex items-center gap-4 mb-2">
        <p className="text-base font-bold"> القسائم و الخصومات:</p>
        {formData.points?.pointsPkId && (
          <button
            onClick={() => setFormField("points", null)}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
          >
            <X size={14} />
            {isRtl ? "إلغاء التحديد" : "Clear selection"}
          </button>
        )}
      </div>
      <div className="w-fit bg-StatusGreen px-3 py-1 rounded-lg font-bold text-StatusDarkGreen border-2 border-StatusDarkGreen flex items-center">
        <span>لديك {userPointsData?.availablePoints} نقطة</span>
        <LucideEqualApproximately className="mx-2" />
        <span>{userPointsData?.availablePointsValue}</span>
        <SaudiRiyal className="mx-1" />
      </div>

      <RadioGroup
        dir={isRtl ? "rtl" : "ltr"}
        className="w-full mt-2 block relative"
        value={formData.points?.pointsPkId?.toString() || ""}
        onValueChange={(val) => {
          const selectedPkg = filteredPointPackages?.find(
            (p) => p.packageId.toString() === val,
          );
          setFormField("points", {
            type: "PACKAGE",
            pointsPkId: parseInt(val),
            value: selectedPkg?.pointsValue || 0,
          });
        }}
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
                  className={`${filteredPointPackages.length > 1 ? "basis-[90%]" : ""} select-none`}
                >
                  <RadioOfferCard
                    title={pkg.name + " (" + pkg.points + ")"}
                    value={pkg.packageId.toString()}
                    discount={pkg.pointsValue.toString()}
                    isBlurred={current !== index}
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
            لا توجد أي عروض حاليا
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default Discounts;
