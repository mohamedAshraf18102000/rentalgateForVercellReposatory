"use client";

import { useState, useEffect, useRef } from "react";
import { Button, CarCard } from "@/ui";
import { ArrowIcon } from "@/icons";
import Autoplay from "embla-carousel-autoplay";
import { ProtectedLink } from "../../../(components)/ProtectedLink";
import { useTranslations } from "next-intl";
import { fetchHomeData, type CarCardData } from "@/constants/api";
import { type CarouselApi } from "@/app/(components)/ui/carousel";
import MoreRequestedCarsCarousel from "@/app/(components)/mostRequestedCars/MoreRequestedCarsCarousel";

export const MostRequestedCars = ({ locale }: { locale: string }) => {
  const t = useTranslations("home");
  const isRTL = locale === "ar";
  const [cars, setCars] = useState<CarCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // useEffect(() => {
  //   const loadCars = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await fetchHomeData(locale);
  //       setCars(data);
  //     } catch (error) {
  //       console.error("Error fetching cars:", error);
  //       setCars([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadCars();
  // }, []);

  if (isLoading) {
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
              {locale === "ar" ? "جاري التحميل..." : "Loading..."}
            </p>
          </div>
        </section>
      </section>
    );
  }

  if (cars.length === 0) {
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
          <ProtectedLink href="/cars">
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
        <MoreRequestedCarsCarousel />
      </section>
    </section>
  );
};
