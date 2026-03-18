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
      onValueChange={(newValue) =>
        onValueChange(newValue as RentPeriod)
      }
      className=""
    >
      <TabsList className="bg-Grey100 p-2">
        <TabsTrigger value="daily" className="login-tab-trigger">
          <span className="login-tab-text text-base">يومي</span>
        </TabsTrigger>
        <TabsTrigger value="weekly" className="login-tab-trigger">
          <span className="login-tab-text text-base">أسبوعي</span>
        </TabsTrigger>
        <TabsTrigger value="monthly" className="login-tab-trigger">
          <span className="login-tab-text text-base">شهري</span>
        </TabsTrigger>
        <TabsTrigger value="yearly" className="login-tab-trigger">
          <span className="login-tab-text text-base">سنوي</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
