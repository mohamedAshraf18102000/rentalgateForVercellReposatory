"use client";

import { useState, useEffect, useRef } from "react";
import { Button, CarCard } from "@/ui";
import { ArrowIcon } from "@/icons";
import Autoplay from "embla-carousel-autoplay";
import { ProtectedLink } from "../../../(components)/ProtectedLink";
import { useTranslations } from "next-intl";
import { fetchHomeData, type CarCardData } from "@/constants/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/app/(components)/ui/carousel";

export const MostRequestedCars = ({ locale }: { locale: string }) => {
  const t = useTranslations("home");
  const isRTL = locale === "ar";
  const [cars, setCars] = useState<CarCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setIsLoading(true);
        const data = await fetchHomeData(locale);
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCars();
  }, []);

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
    return null;
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
        <div className="relative mt-4" dir={locale === "ar" ? "rtl" : "ltr"}>
          <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
              direction: locale === "ar" ? "rtl" : "ltr",
            }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <div className="relative">
              <CarouselContent className="-ml-2 md:-ml-4  pb-3 ">
                {cars.map((car) => (
                  <CarouselItem
                    key={car.id}
                    className="pl-2 md:pl-4 basis-[230px]"
                  >
                    <div
                      className="w-[230px] flex px-2  "
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      <CarCard {...car} locale={locale} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Shadow gradient on the left side */}
              <div
                className={`absolute top-0 bottom-0 w-20 pointer-events-none z-10 ${
                  locale === "en"
                    ? "right-0 bg-gradient-to-l from-white via-white/80 to-transparent"
                    : "left-0 bg-gradient-to-r from-white via-white/80 to-transparent"
                }`}
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-4">
              {/* Pagination dots */}
              <div
                className={`flex items-center gap-2  ${isRTL ? "justify-end" : "justify-start"}`}
              >
                {Array.from({
                  length: Math.min(3, Math.ceil(cars.length / 3)),
                }).map((_, index) => {
                  const isActive = Math.floor(current / 3) === index;
                  const activeIndex = Math.floor(current / 3);
                  const distanceFromActive = Math.abs(index - activeIndex);

                  // Progressive sizing based on distance from active dot
                  const sizeClass = isActive
                    ? "h-2 w-6 rounded-full" // Active: pill-shaped, orange
                    : distanceFromActive === 1
                      ? "h-1.5 w-1.5 rounded-full" // Closest to active: medium
                      : distanceFromActive === 2
                        ? "h-1 w-1 rounded-full" // Further: smaller
                        : "h-0.5 w-0.5 rounded-full"; // Furthest: smallest

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        const slidesPerPage = 3;
                        api?.scrollTo(index * slidesPerPage);
                      }}
                      className={`transition-all duration-300 ${sizeClass} ${
                        isActive ? "bg-primary" : "bg-gray-300"
                      }`}
                      aria-label={`Go to page ${index + 1}`}
                    />
                  );
                })}
              </div>

              <div
                className={`flex items-center gap-2   ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-10 w-10 rounded-[12px] bg-primary hover:bg-primary-hover border-none text-white  " />
                <CarouselNext className="relative right-0 top-0 translate-y-0 h-10 w-10 rounded-[12px] bg-white hover:bg-gray-100 border border-[#ECEEF2] text-gray-900  " />
              </div>
            </div>
          </Carousel>
        </div>
      </section>
    </section>
  );
};
