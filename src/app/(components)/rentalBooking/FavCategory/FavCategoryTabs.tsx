"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { CarCategory } from "@/lib/stores/useUserPreferedFiltersStore";
import { useHomeStore } from "@/lib/stores/useHomeStore";

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
      <TabsList className="bg-Grey100 p-1 md:p-2 w-full flex justify-between h-auto">
        {carCategories?.map((category) => (
          <TabsTrigger
            key={category.categoryId}
            value={category.categoryId.toString()}
            className="login-tab-trigger flex-1 py-2 md:py-3"
          >
            <span className="login-tab-text text-xs sm:text-sm md:text-base">
              {category.arabicName}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
