import { setRequestLocale } from "next-intl/server";
import HomeMockups from "./(mainpages)/(home)/HomeMockups";
import HomeSlider from "./(mainpages)/(home)/HomeSlider";
import { MostRequestedCars } from "./(mainpages)/(home)/MostRequestedCars/MoreRequestedCars";
import PickUpArea from "./(mainpages)/(home)/PickUpArea";
import RentalGateInfo from "./(mainpages)/(home)/RentalGateInfo";
import RentalBookingSearchSection from "./(mainpages)/(home)/RentalBookingSearchSection";
import SuccessPartners from "./(mainpages)/(home)/SuccessPartners";
import Offers from "./(mainpages)/(home)/offers/Offers";
import CompanyOffers from "./(mainpages)/(home)/offers/CompanyOffers";
import CompanyOffersLocationRefresh from "./(mainpages)/(home)/offers/CompanyOffersLocationRefresh";
import BussinessAccountsContent from "./(mainpages)/bussinessAccounts/components/BussinessAccountsContent";
import WrapperContainer from "../(components)/wrapperContainer/WrapperContainer";
import { HomeResponse } from "@/types/home/home";

import { getHomePageDetailsWithAuth } from "@/services/home/home.service";
import RemoveCacheWhenUserRefresh from "./RemoveCacheWhenUserRefresh";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let homeData: HomeResponse | null = null;

  try {
    homeData = await getHomePageDetailsWithAuth();
    console.log("homeData", homeData);
  } catch (error) {
    console.error("Error fetching home data:", error);
  }

  return (
    <main>
      <RemoveCacheWhenUserRefresh />
      <HomeSlider bannersData={homeData?.banners ?? []} />
      <PickUpArea />
      <RentalGateInfo />
      <RentalBookingSearchSection homeData={homeData} />
      <SuccessPartners companiesData={homeData?.companies ?? []} />
      {(homeData?.todayOffers?.length ?? 0) > 0 && (
        <Offers todayOffersData={homeData?.todayOffers ?? []} />
      )}
      <MostRequestedCars locale={locale} homeData={homeData} />
      <CompanyOffersLocationRefresh />
      <CompanyOffers />
      <HomeMockups />
      <WrapperContainer>
        <BussinessAccountsContent withOutStepper />
      </WrapperContainer>
    </main>
  );
}
