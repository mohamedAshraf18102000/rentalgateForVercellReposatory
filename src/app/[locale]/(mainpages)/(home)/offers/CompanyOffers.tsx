import OffersCarousel from "@/app/(components)/offersCarousel/OffersCarousel";
import {
  getHomePageOffers,
  hasHomeOffersCoordinates,
} from "@/services/home/homeOffers.service";
import { LatestOffer } from "@/types/home/home";
import type { IOffer } from "@/types/home/homeOffers";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

const offerSlideImageClass =
  "min-h-[11rem] h-[min(42vw,15rem)] sm:h-64 sm:min-h-[16rem] " +
  "md:h-80 md:min-h-[18rem] lg:h-96 lg:min-h-[22rem] " +
  "xl:h-[28rem] 2xl:h-[37.5rem]";

function toLatestOffers(offers: IOffer[]): LatestOffer[] {
  return offers.map((o) => ({
    offerId: o.offerId,
    englishName: o.englishName,
    arabicName: o.arabicName,
    image: o.image,
    englishImage: o.englishImage,
    companyNameEnglish: o.companyNameEnglish,
    companyNameArabic: o.companyNameArabic,
    branchEnglishName: o.branchEnglishName,
    branchArabicName: o.branchArabicName,
    startDate: o.startDate,
    endDate: o.endDate,
    offerStatus: o.offerStatus,
    offerType: o.offerType,
    offerTypeDescription: o.offerTypeDescription,
    offerValue: o.offerValue,
    offerCars: o.offerCars,
    offerCarsDescription: o.offerCarsDescription,
  }));
}

async function CompanyOffers() {
  const t = await getTranslations("home");
  const cookieStore = await cookies();
  const latitude = cookieStore.get("lat")?.value ?? "";
  const longitude = cookieStore.get("lng")?.value ?? "";

  let latestOffersData: LatestOffer[] = [];

  if (hasHomeOffersCoordinates(latitude, longitude)) {
    try {
      const response = await getHomePageOffers(latitude, longitude);
      latestOffersData = toLatestOffers(response.content ?? []);
    } catch {
      latestOffersData = [];
    }
  }

  if (latestOffersData.length === 0) {
    return null;
  }

  return (
    <div className="container-custom mt-6 rounded-2xl overflow-hidden sm:mt-10">
      <h4 className="mb-3 px-2 text-center text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
        {t("companyOffers.title")}
      </h4>
      <OffersCarousel
        offers={latestOffersData}
        itemsPerSlide={1}
        className={offerSlideImageClass}
        withoutDetails
      />
    </div>
  );
}

export default CompanyOffers;
