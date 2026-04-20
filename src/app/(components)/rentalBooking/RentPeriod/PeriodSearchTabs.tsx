"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { RentPeriod } from "@/lib/stores/useUserPreferedFiltersStore";

interface PeriodSearchProps {
  value: RentPeriod;
  onValueChange: (value: RentPeriod) => void;
}

export const PeriodSearchTabs: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={(newValue) => onValueChange(newValue as RentPeriod)}
      className="w-full"
    >
      <TabsList className="bg-transparent p-1 md:p-2 w-full flex justify-between h-auto">
        <TabsTrigger
          value="daily"
          className="login-tab-trigger flex-1 py-2 md:py-3 bg-[#F2F2F2]"
        >
          <span className="login-tab-text text-xs sm:text-sm md:text-base">
            باليوم
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="weekly"
          className="login-tab-trigger flex-1 py-2 md:py-3 bg-[#F2F2F2]"
        >
          <span className="login-tab-text text-xs sm:text-sm md:text-base">
            بالأسبوع
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="monthly"
          className="login-tab-trigger flex-1 py-2 md:py-3 bg-[#F2F2F2]"
        >
          <span className="login-tab-text text-xs sm:text-sm md:text-base">
            بالشهر
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="yearly"
          className="login-tab-trigger flex-1 py-2 md:py-3 bg-[#F2F2F2]"
        >
          <span className="login-tab-text text-xs sm:text-sm md:text-base">
            بالسنة
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
