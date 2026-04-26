"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { UserReservationsPaylod } from "@/types/myBookings/myBookings";
import { useTranslations } from "next-intl";

interface PeriodSearchProps {
  value: UserReservationsPaylod["localStatus"];
  onValueChange?: (value: UserReservationsPaylod["localStatus"]) => void;
}

export const BookingsStatus: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  const t = useTranslations("profile.myBookingsPage.statusTabs");

  return (
    <Tabs
      value={value}
      onValueChange={(newValue) =>
        onValueChange?.(newValue as UserReservationsPaylod["localStatus"])
      }
      className=""
    >
      <TabsList className="w-full bg-Grey100 p-1.5 sm:p-2">
        <TabsTrigger value="current" className="login-tab-trigger flex-1 py-2 sm:py-3">
          <span className="login-tab-text text-sm sm:text-base">
            {t("current")}
          </span>
        </TabsTrigger>
        <TabsTrigger value="finished" className="login-tab-trigger flex-1 py-2 sm:py-3">
          <span className="login-tab-text text-sm sm:text-base">
            {t("previous")}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
