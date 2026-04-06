"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { CarCategory } from "@/lib/stores/useUserPreferedFiltersStore";

interface PeriodSearchProps {
  value: CarCategory;
  onValueChange: (value: CarCategory) => void;
}

export const FavCategoryTabs: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={(newValue) => onValueChange(newValue as CarCategory)}
      className="w-full"
    >
      <TabsList className="bg-Grey100 p-1 md:p-2 w-full flex justify-between h-auto">
        <TabsTrigger
          value="small"
          className="login-tab-trigger flex-1 py-2 md:py-3"
        >
          <span className="login-tab-text text-xs sm:text-sm md:text-base">
            صغيرة
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="economy"
          className="login-tab-trigger flex-1 py-2 md:py-3"
        >
          <span className="login-tab-text text-xs sm:text-sm md:text-base">
            إقتصادية
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="family"
          className="login-tab-trigger flex-1 py-2 md:py-3"
        >
          <span className="login-tab-text text-xs sm:text-sm md:text-base">
            عائلية
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="luxury"
          className="login-tab-trigger flex-1 py-2 md:py-3"
        >
          <span className="login-tab-text text-xs sm:text-sm md:text-base">
            فاخرة
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
