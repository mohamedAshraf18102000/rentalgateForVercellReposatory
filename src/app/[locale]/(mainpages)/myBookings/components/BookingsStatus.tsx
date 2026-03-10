"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";

interface PeriodSearchProps {
  value: "all" | "current" | "past";
  onValueChange?: (value: "all" | "current" | "past") => void;
}

export const BookingsStatus: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={(newValue) =>
        onValueChange?.(newValue as "all" | "current" | "past")
      }
      className=""
    >
      <TabsList className="bg-Grey100 p-2">
        <TabsTrigger value="all" className="login-tab-trigger">
          <span className="login-tab-text text-base">الكل</span>
        </TabsTrigger>
        <TabsTrigger value="current" className="login-tab-trigger">
          <span className="login-tab-text text-base">الحالية</span>
        </TabsTrigger>
        <TabsTrigger value="past" className="login-tab-trigger">
          <span className="login-tab-text text-base">السابقة</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
