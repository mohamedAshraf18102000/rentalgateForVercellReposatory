"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { CarCategory } from "@/lib/stores/useUserPreferedFiltersStore";
import { useHomeStore } from "@/lib/stores/useHomeStore";
import React from "react";

interface PeriodSearchProps {
  value: CarCategory;
  onValueChange: (value: CarCategory) => void;
}

export const FavCategoryTabs: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  const carCategories = useHomeStore((s) => s.data?.carCategories);

  return (
    <Tabs
      value={value}
      onValueChange={(newValue) => onValueChange(newValue as CarCategory)}
      className="w-full"
    >
      <TabsList className="relative h-auto w-full bg-transparent p-0 flex flex-wrap gap-2">
        {carCategories?.map((category) => (
          <React.Fragment key={category.categoryId}>
            <TabsTrigger
              value={category.categoryId.toString()}
              className="login-tab-trigger relative flex min-h-24 max-w-full flex-[1_1_calc(50%-0.25rem)] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-Grey200 px-2 py-2 sm:min-h-28 sm:flex-[1_1_calc(33.333%-0.4rem)] sm:px-3 sm:py-3 lg:flex-[1_1_calc(25%-0.4rem)] bg-[url(/cars/carCateforyBG.png)] bg-cover bg-center bg-no-repeat"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${category.icon}`}
                alt=""
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
              <span className="login-tab-text block w-full truncate text-center text-xs sm:text-sm md:text-base">
                {category.arabicName}
              </span>
            </TabsTrigger>
          </React.Fragment>
        ))}
      </TabsList>
    </Tabs>
  );
};
