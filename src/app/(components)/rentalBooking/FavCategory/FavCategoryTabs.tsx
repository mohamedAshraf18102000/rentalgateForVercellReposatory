"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";

interface PeriodSearchProps {
  value: "small" | "economy" | "family" | "luxury";
  onValueChange: (value: "small" | "economy" | "family" | "luxury") => void;
}

export const FavCategoryTabs: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={(newValue) =>
        onValueChange(newValue as "small" | "economy" | "family" | "luxury")
      }
    >
      <TabsList className="bg-Grey100 p-2">
        <TabsTrigger value="small" className="login-tab-trigger">
          <span className="login-tab-text text-base">صغيرة</span>
        </TabsTrigger>
        <TabsTrigger value="economy" className="login-tab-trigger">
          <span className="login-tab-text text-base">أقتصادية</span>
        </TabsTrigger>
        <TabsTrigger value="family" className="login-tab-trigger">
          <span className="login-tab-text text-base">عائلية</span>
        </TabsTrigger>
        <TabsTrigger value="luxury" className="login-tab-trigger">
          <span className="login-tab-text text-base">فاخرة</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
