"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { UserReservationsPaylod } from "@/types/myBookings/myBookings";

interface PeriodSearchProps {
  value: UserReservationsPaylod["localStatus"];
  onValueChange?: (value: UserReservationsPaylod["localStatus"]) => void;
}

export const BookingsStatus: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={(newValue) =>
        onValueChange?.(newValue as UserReservationsPaylod["localStatus"])
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
        <TabsTrigger value="finished" className="login-tab-trigger">
          <span className="login-tab-text text-base">السابقة</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
