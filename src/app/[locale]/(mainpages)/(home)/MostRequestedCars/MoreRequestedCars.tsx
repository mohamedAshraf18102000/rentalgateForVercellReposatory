"use client";

import { Button } from "@/ui";
import { ArrowIcon } from "@/icons";
import { ProtectedLink } from "../../../(components)/ProtectedLink";
import { useTranslations } from "next-intl";
import MoreRequestedCarsCarousel from "@/app/(components)/mostRequestedCars/MoreRequestedCarsCarousel";
import { useHomeStore } from "@/lib/stores/useHomeStore";

export const MostRequestedCars = ({ locale }: { locale: string }) => {
  const t = useTranslations("home");
  const isRTL = locale === "ar";

  const homeData = useHomeStore((state) => state.data);
  const lastSeen = homeData?.lastSeen ?? [];

  if (lastSeen.length === 0) {
    return (
      <section className="bg-white py-[60px]">
        <section className="container-custom">
          <header className="flex items-center justify-between mb-4">
            <h2
              className={`text-2xl font-bold text-gray-900 align-middle leading-[130%] tracking-normal [font-family:var(--font-zain)] ${isRTL ? "text-right" : "text-left"}`}
            >
              {t("mostRequestedCars")}
            </h2>
          </header>
          <div className="text-center py-8">
            <p className="text-gray-500">
              {locale === "ar" ? "لا يوجد سيارات حاليا" : "No cars available"}
            </p>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="bg-white py-[60px]">
      <section className="container-custom">
        <header className="flex items-center justify-between">
          <h2
            className={`text-2xl font-bold text-gray-900 align-middle leading-[130%] tracking-normal [font-family:var(--font-zain)] ${isRTL ? "text-right" : "text-left"}`}
          >
            {t("mostRequestedCars")}
          </h2>
          <ProtectedLink href="/#">
            <Button
              variant="outline"
              size="lg"
              className="text-sm font-medium text-gray-900 rounded-[10px]"
              icon={
                <ArrowIcon className={`w-4 h-4 ${isRTL ? "" : "rotate-180"}`} />
              }
            >
              {t("viewAll")}
            </Button>
          </ProtectedLink>
        </header>
        <MoreRequestedCarsCarousel data={lastSeen} />
      </section>
    </section>
  );
};
