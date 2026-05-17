"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { CarCategory } from "@/lib/stores/useUserPreferedFiltersStore";
import { CarCategory as HomeCarCategory } from "@/types/home/home";
import React from "react";
import { normalizeImageUrl } from "@/util";

interface PeriodSearchProps {
  value: CarCategory;
  onValueChange: (value: CarCategory) => void;
  categories: HomeCarCategory[];
}

export const FavCategoryTabs: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
  categories,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={(newValue) => onValueChange(newValue as CarCategory)}
      className="w-full"
    >
      <TabsList className="bg-transparent grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[2px] h-fit">
        {categories.map((category) => (
          <TabsTrigger
            key={category.categoryId}
            value={category.categoryId.toString()}
            className="login-tab-trigger flex-1 h-auto p-0 bg-transparent data-[state=active]:bg-transparent"
          >
            <div className="h-fit p-2 flex flex-col gap-1 items-center">
              <div className="w-full p-1 bg-[url(/cars/carCateforyBG.png)] bg-cover bg-center bg-no-repeat rounded-2xl">
                <img
                  src={normalizeImageUrl(category.icon)}
                  alt="img"
                  className="object-contain scale-75 sm:scale-100"
                />
              </div>
              <span className="login-tab-text text-sm!">{category.name}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
