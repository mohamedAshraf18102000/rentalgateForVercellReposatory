"use client";

import { useState, useEffect } from "react";
import { Button } from "@/ui";
import { ArrowIcon } from "@/icons";
import { ProtectedLink } from "../../../(components)/ProtectedLink";
import { useTranslations } from "next-intl";
import { type CarCardData } from "@/constants/api";
import { type CarouselApi } from "@/app/(components)/ui/carousel";
import MoreRequestedCarsCarousel from "@/app/(components)/mostRequestedCars/MoreRequestedCarsCarousel";

const dummyCars: CarCardData[] = [
  {
    id: 1,
    image: "/cars/elentra.webp",
    images: ["/cars/elentra.webp"],
    category: "SEDAN",
    categoryAr: "سيدان",
    categoryEn: "Sedan",
    title: "Hyundai Elantra 2024",
    mileage: 250,
    oldPrice: 220,
    currentPrice: 180,
    hasDiscount: true,
    brandName: "Hyundai",
    modelEnglishName: "Elantra",
    modelArabicName: "النترا",
    year: 2024,
  },
  {
    id: 2,
    image: "/cars/car1.png",
    images: ["/cars/car1.png"],
    category: "SUV",
    categoryAr: "سويف",
    categoryEn: "SUV",
    title: "Kia Sportage 2024",
    mileage: 250,
    oldPrice: 220,
    currentPrice: 180,
    hasDiscount: true,
    brandName: "KIA",
    modelEnglishName: "Kia Sportage",
    modelArabicName: "كيا سبورتاج",
    year: 2024,
  },
  {
    id: 3,
    image: "/cars/elentra.webp",
    images: ["/cars/elentra.webp"],
    category: "SEDAN",
    categoryAr: "سيدان",
    categoryEn: "Sedan",
    title: "Hyundai Elantra 2024",
    mileage: 250,
    oldPrice: 220,
    currentPrice: 180,
    hasDiscount: true,
    brandName: "Hyundai",
    modelEnglishName: "Elantra",
    modelArabicName: "النترا",
    year: 2024,
  },
  {
    id: 4,
    image: "/cars/car1.png",
    images: ["/cars/car1.png"],
    category: "SUV",
    categoryAr: "سويف",
    categoryEn: "SUV",
    title: "Kia Sportage 2024",
    mileage: 250,
    oldPrice: 220,
    currentPrice: 180,
    hasDiscount: true,
    brandName: "KIA",
    modelEnglishName: "Kia Sportage",
    modelArabicName: "كيا سبورتاج",
    year: 2024,
  },
  {
    id: 5,
    image: "/cars/elentra.webp",
    images: ["/cars/elentra.webp"],
    category: "SEDAN",
    categoryAr: "سيدان",
    categoryEn: "Sedan",
    title: "Hyundai Elantra 2024",
    mileage: 250,
    oldPrice: 220,
    currentPrice: 180,
    hasDiscount: true,
    brandName: "Hyundai",
    modelEnglishName: "Elantra",
    modelArabicName: "النترا",
    year: 2024,
  },
];

export const MostRequestedCars = ({ locale }: { locale: string }) => {
  const t = useTranslations("home");
  const isRTL = locale === "ar";
  const [cars, setCars] = useState<CarCardData[]>(dummyCars);
  const [isLoading, setIsLoading] = useState(false);
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
        <MoreRequestedCarsCarousel cars={cars} />
      </section>
    </section>
  );
};
