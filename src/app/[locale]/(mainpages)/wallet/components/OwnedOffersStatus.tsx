"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";

interface PeriodSearchProps {
  value: "all" | "current" | "past";
  onValueChange?: (value: "all" | "gift" | "used") => void;
}

export const OwnedOffersStatus: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <>
      <Tabs
        value={value}
        onValueChange={(newValue) =>
          onValueChange?.(newValue as "all" | "gift" | "used")
        }
        className=""
      >
        <TabsList className="bg-Grey100 p-2">
          <TabsTrigger value="all" className="login-tab-trigger">
            <span className="login-tab-text text-base">الكل</span>
          </TabsTrigger>
          {/* <TabsTrigger value="gift" className="login-tab-trigger">
            <span className="login-tab-text text-base">المكتسبة</span>
          </TabsTrigger>
          <TabsTrigger value="used" className="login-tab-trigger">
            <span className="login-tab-text text-base">المستخدمة</span>
          </TabsTrigger> */}
        </TabsList>
      </Tabs>
    </>
  );
};
