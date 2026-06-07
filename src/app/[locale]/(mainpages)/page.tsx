import { redirect } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import HomeMockups from "./(home)/HomeMockups";
import HomeSlider from "./(home)/HomeSlider";
import { MostRequestedCars } from "./(home)/MostRequestedCars/MoreRequestedCars";
import PickUpArea from "./(home)/PickUpArea";
import RentalGateInfo from "./(home)/RentalGateInfo";
import RentalBookingSearchSection from "./(home)/RentalBookingSearchSection";
import SuccessPartners from "./(home)/SuccessPartners";
import Offers from "./(home)/offers/Offers";
import CompanyOffers from "./(home)/offers/CompanyOffers";
import CompanyOffersLocationRefresh from "./(home)/offers/CompanyOffersLocationRefresh";
import BussinessAccountsContent from "./bussinessAccounts/components/BussinessAccountsContent";
import WrapperContainer from "../../(components)/wrapperContainer/WrapperContainer";
import { HomeResponse } from "@/types/home/home";
import { Suspense } from "react";
import { getHomePageDetailsWithAuth } from "@/services/home/home.service";
import RemoveCacheWhenUserRefresh from "../RemoveCacheWhenUserRefresh";
type Props = {
  params: Promise<{ locale: string }>;
};

const page = async ({ params }: Props) => {
  const { locale } = await params;

  setRequestLocale(locale);

  let homeData: HomeResponse;
  try {
    homeData = await getHomePageDetailsWithAuth();
  } catch (error) {
    console.error("Error fetching home data:", error);
    return redirect({ href: "/maintenance", locale });
  }
  return (
    <>
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
      <Suspense fallback={null}>
        <CompanyOffersLocationRefresh />
        <CompanyOffers />
      </Suspense>
      <HomeMockups />
      <WrapperContainer>
        <BussinessAccountsContent withOutStepper />
      </WrapperContainer>
    </>
  );
};

export default page;
