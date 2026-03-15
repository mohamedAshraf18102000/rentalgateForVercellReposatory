"use client";
import OffersCarousel from "@/app/(components)/offersCarousel/OffersCarousel";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import Image from "next/image";
import { useHomeStore } from "@/lib/stores/useHomeStore";

const Offers = () => {
  const todayOffersRaw = useHomeStore((state) => state.data?.todayOffers);
  const todayOffers = todayOffersRaw || [];

  return (
    <WrapperContainer className="my-10">
      <div className="flex flex-col items-center justify-center">
        <h6 className="text-3xl font-bold text-center">عروض اليوم الواحد</h6>
        <div className="bg-Green200 p-2 rounded-[8px] flex items-center gap-3 mt-3">
          <Image
            width={100}
            height={100}
            className="object-contain w-6 h-6"
            src="/shared/FestivalIcon.png"
            alt="offer"
          />
          <p className="font-bold text-base">
            أفضل عروض التأجير اليومية متبقي{" "}
            <span className="bg-white p-1 rounded-[5px]">10</span>
            <span className="mx-1">:</span>
            <span className="bg-white p-1 rounded-[5px]">10</span>
            <span className="mx-1">ساعات</span>
          </p>
          <Image
            width={100}
            height={100}
            className="object-contain w-6 h-6"
            src="/shared/FestivalIcon.png"
            alt="offer"
          />
        </div>
      </div>
      <OffersCarousel offers={todayOffers} />
    </WrapperContainer>
  );
};

export default Offers;
