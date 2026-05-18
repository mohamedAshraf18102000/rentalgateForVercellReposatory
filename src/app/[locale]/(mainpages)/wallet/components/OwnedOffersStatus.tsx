"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { useTranslations } from "next-intl";

interface PeriodSearchProps {
  value: "all" | "current" | "past";
  onValueChange?: (value: "all" | "gift" | "used") => void;
}

export const OwnedOffersStatus: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  const t = useTranslations("profile.walletPage.offersTabs");

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
            <span className="login-tab-text text-base">{t("all")}</span>
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
