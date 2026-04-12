"use client";

import OffersCarousel from "@/app/(components)/offersCarousel/OffersCarousel";
import { useHomeStore } from "@/lib/stores/useHomeStore";

const offerSlideImageClass =
  "min-h-[11rem] h-[min(42vw,15rem)] sm:h-64 sm:min-h-[16rem] " +
  "md:h-80 md:min-h-[18rem] lg:h-96 lg:min-h-[22rem] " +
  "xl:h-[28rem] 2xl:h-[37.5rem]";

function CompanyOffers() {
  const latestOffersRaw = useHomeStore((state) => state.data?.latestOffers);
  const latestOffers = latestOffersRaw || [];

  return (
    <div className="container-custom mt-6 rounded-2xl overflow-hidden sm:mt-10">
      <h4 className="mb-3 px-2 text-center text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
        عروض رينتال جيت
      </h4>
      <OffersCarousel
        offers={latestOffers}
        itemsPerSlide={1}
        className={offerSlideImageClass}
      />
    </div>
  );
}

export default CompanyOffers;
