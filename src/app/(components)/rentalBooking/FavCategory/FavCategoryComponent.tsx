"use client";

import Image from "next/image";
import { FavCategoryTabs } from "./FavCategoryTabs";
import {
  useUserPreferedFiltersStore,
  CarCategory,
} from "@/lib/stores/useUserPreferedFiltersStore";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { HomeResponse } from "@/types/home/home";

const FavCategoryComponent = ({
  categories,
}: {
  categories: HomeResponse["carCategories"];
}) => {
  const { filters, setFilter, applyFilters } = useUserPreferedFiltersStore();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <div className="h-full md:h-full rounded-2xl! overflow-hidden shadow-lg border-2 border-white">
      <div className="relative h-[200px]! md:h-[50%] overflow-hidden pointer-events-none select-none!">
        <Image
          src="/rentalSearch/img2.webp"
          alt="bgApp2"
          fill
          className="object-cover scale-120"
        />
      </div>
      <div className="bg-white h-full p-4 text-center">
        <h4 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 whitespace-nowrap">
          {t("favCategoryCard.title")}
        </h4>
        <p className="text-sm text-Grey700 mb-3">
          {t("favCategoryCard.description")}
        </p>
        <FavCategoryTabs
          value={filters.carCategory}
          categories={categories}
          onValueChange={(value) => {
            setFilter("carCategory", value as CarCategory);
            setFilter("categoryId", value);
            applyFilters();
            router.push(`/${locale}/bookings`);
          }}
        />
      </div>
    </div>
  );
};

export default FavCategoryComponent;
