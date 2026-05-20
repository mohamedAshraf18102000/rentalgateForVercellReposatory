"use client";
import { useTranslations } from "next-intl";
import MoreRequestedCarsCarousel from "@/app/(components)/mostRequestedCars/MoreRequestedCarsCarousel";
import { HomeResponse } from "@/types/home/home";

export const MostRequestedCars = ({
  locale,
  homeData,
}: {
  locale: string;
  homeData: HomeResponse | null;
}) => {
  const t = useTranslations("home");
  const isRTL = locale === "ar";

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
    <section className="bg-white py-[20px]">
      <section className="container-custom">
        <header className="flex items-center justify-between">
          <h2
            className={`text-2xl font-bold text-gray-900 align-middle leading-[130%] tracking-normal [font-family:var(--font-zain)] ${isRTL ? "text-right" : "text-left"}`}
          >
            {t("mostRequestedCars")}
          </h2>
          {/* <ProtectedLink href="/#">
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
          </ProtectedLink> */}
        </header>
        <MoreRequestedCarsCarousel data={lastSeen} />
      </section>
    </section>
  );
};
