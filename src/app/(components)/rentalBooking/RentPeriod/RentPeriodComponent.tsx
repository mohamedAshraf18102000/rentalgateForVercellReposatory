"use client";

import Image from "next/image";
import { PeriodSearchTabs } from "./PeriodSearchTabs";
import {
  useUserPreferedFiltersStore,
  RentPeriod,
} from "@/lib/stores/useUserPreferedFiltersStore";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

const RentPeriodComponent = () => {
  const { filters, setFilter } = useUserPreferedFiltersStore();
  const t = useTranslations("home");

  return (
    <div className="h-full md:h-full rounded-2xl! overflow-hidden shadow-lg border-2 border-white">
      <div className="relative h-[200px]! md:h-[50%] overflow-hidden">
        <Image
          src="/rentalSearch/img1.webp"
          alt="bgApp2"
          fill
          className="object-cover"
        />
      </div>
      <div className="bg-white h-full p-4 text-center">
        <h4 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 whitespace-nowrap">
          {t("rentPeriodCard.title")}
        </h4>
        <p className="text-sm text-Grey700 mb-3">
          {t("rentPeriodCard.description")}
        </p>
        <PeriodSearchTabs
          value={filters.rentPeriod}
          onValueChange={(value) =>
            setFilter("rentPeriod", value as RentPeriod)
          }
        />

        <div className="bg-primary w-full sm:w-[80%] md:w-[60%] mx-auto mt-3 text-white text-center rounded-[8px] text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-3">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="leading-snug">{t("rentPeriodCard.note")}</span>
        </div>
      </div>
    </div>
  );
};

export default RentPeriodComponent;
