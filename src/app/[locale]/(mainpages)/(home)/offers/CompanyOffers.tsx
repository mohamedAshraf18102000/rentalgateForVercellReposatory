"use client";
import { useTranslations, useLocale } from "next-intl";
import { useSharedStore } from "@/lib/api/stores";
import OffersCarousel from "@/app/(components)/offersCarousel/OffersCarousel";
import { LatestOffer } from "@/types/home/home";

import { useHomeStore } from "@/lib/stores/useHomeStore";

function CompanyOffers() {
  const latestOffersRaw = useHomeStore((state) => state.data?.latestOffers);
  const latestOffers = latestOffersRaw || [];

  const locale = useLocale();

  return (
    <div className="container-custom mt-10 rounded-2xl overflow-hidden">
      <h4 className="text-3xl font-bold mb-4 text-center">عروض رينتال جيت</h4>
      <OffersCarousel offers={latestOffers} itemsPerSlide={1} className="h-[600px]" />
    </div>
  );
}

export default CompanyOffers;
