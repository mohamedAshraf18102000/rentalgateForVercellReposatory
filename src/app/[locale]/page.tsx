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
import { CurrentLocationDialog } from "./(dialogs)/PickupDialog/CurrentLocationDialog";
import BussinessAccountsContent from "./(mainpages)/bussinessAccounts/components/BussinessAccountsContent";
import WrapperContainer from "../(components)/wrapperContainer/WrapperContainer";
import { HomeResponse } from "@/types/home/home";

import { getHomePageDetails } from "@/services/home/home.service";
import { HomeStoreHydrator } from "@/lib/stores/HomeStoreHydrator";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let homeData: HomeResponse | null = null;

  try {
    homeData = await getHomePageDetails();
  } catch (error) {
    console.error("Error fetching home data:", error);
  }

  return (
    <main>
      {homeData && <HomeStoreHydrator data={homeData} />}
      <CurrentLocationDialog />
      <HomeSlider />
      <PickUpArea />
      <RentalGateInfo />
      <RentalBookingSearchSection />
      <SuccessPartners />
      <Offers />
      <MostRequestedCars locale={locale} />
      <CompanyOffers />
      <HomeMockups />
      <WrapperContainer>  
        <BussinessAccountsContent withOutStepper />
      </WrapperContainer>
    </main>
  );
}
