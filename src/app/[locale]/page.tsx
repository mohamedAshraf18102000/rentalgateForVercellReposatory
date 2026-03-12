import { fetchHomeAllData } from "@/constants/api";
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
import BussinessAccounts from "./(mainpages)/bussinessAccounts/components/RentalGateBussinessAccounts/BussinessAccounts";
import { CurrentLocationDialog } from "./(dialogs)/PickupDialog/CurrentLocationDialog";
import BussinessAccountsContent from "./(mainpages)/bussinessAccounts/components/BussinessAccountsContent";
import WrapperContainer from "../(components)/wrapperContainer/WrapperContainer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let offers: any[] = [];
  let banners: any[] = [];
  try {
    const homeData = await fetchHomeAllData();
    offers = homeData.data?.offers || [];
    banners = homeData.data?.banners || [];
  } catch (error) {
    console.error("Error fetching home data:", error);
    offers = [];
    banners = [];
  }

  return (
    <main>
      <CurrentLocationDialog />
      <HomeSlider banners={banners} />
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
