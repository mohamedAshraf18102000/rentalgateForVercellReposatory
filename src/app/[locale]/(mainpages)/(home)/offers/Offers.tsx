"use client";
import OffersCarousel from "@/app/(components)/offersCarousel/OffersCarousel";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { TodaysOffer } from "@/types/home/home";
import OffersCountDown from "./components/OffersCountDown";

const Offers = ({ todayOffersData }: { todayOffersData: TodaysOffer[] }) => {
  return (
    <WrapperContainer className="my-10">
      <div className="flex flex-col items-center justify-center">
        <h6 className="text-3xl font-bold text-center">عروض اليوم الواحد</h6>
        <OffersCountDown />
      </div>
      <OffersCarousel offers={todayOffersData} />
    </WrapperContainer>
  );
};

export default Offers;
