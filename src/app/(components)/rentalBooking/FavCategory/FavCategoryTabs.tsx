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
      <TabsList className="bg-transparent relative">
        {carCategories?.map((category) => (
          <React.Fragment key={category.categoryId}>
            <TabsTrigger
              value={category.categoryId.toString()}
              className="login-tab-trigger flex-1 py-2 md:py-3 bg-[url(/cars/carCateforyBG.png)] bg-cover bg-center bg-no-repeat"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${category.icon}`}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute top-13 left-1/2 -translate-x-1/2">
                <span className="login-tab-text text-xs sm:text-sm md:text-base">
                  {category.arabicName}
                </span>
              </div>
            </TabsTrigger>
          </React.Fragment>
        ))}
      </TabsList>
    </Tabs>
  );
};
