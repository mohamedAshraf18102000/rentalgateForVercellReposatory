import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import GoogleMapsPolyLineLocation from "@/app/(components)/mapsLocation/GoogleMapsPolyLinedLocation";
import {
  ReservationFormData,
  useBookedCarDetailsStore,
} from "@/lib/stores/useBookedCarDetailsStore";
import { normalizeImageUrl } from "@/util";
import { ReservationPricingDetails } from "../../hooks/useReservationPricing";

interface ReservationCarSidebarProps {
  locale: string;
  formData: ReservationFormData;
  isShowTax: boolean;
  rentalDays: number;
  pricingDetails: ReservationPricingDetails;
}

const ReservationCarSidebar = ({
  locale,
  formData,
  isShowTax,
  rentalDays,
  pricingDetails,
}: ReservationCarSidebarProps) => {
  const carDetails = useBookedCarDetailsStore((s) => s.carDetails);

  const showBranchMap =
    formData.returnType === "BRANCH" || formData.pickupType === "BRANCH";

  return (
    <div className="w-full lg:w-1/4">
      <div className="">
        <CarsCard
          removeBookNowButton={true}
          rate={carDetails?.company?.averageRating ?? 0}
          showTax={isShowTax}
          freeKm={carDetails?.allowedKm}
          carName={carDetails?.car.carName}
          companyName={
            locale === "ar"
              ? carDetails?.company.arabicName
              : carDetails?.company.englishName
          }
          companyLogo={carDetails?.company.logo}
          carBrand={
            locale === "ar"
              ? carDetails?.car.brandNameArabic
              : carDetails?.car.brandNameEnglish
          }
          carImage={normalizeImageUrl(carDetails?.car.image)}
          pricingType={pricingDetails.pricingType}
          carPrice={pricingDetails.pricePerDay}
          priceBeforeOffer={pricingDetails.originalPricePerDay}
          rentalDays={rentalDays}
          totalPrice={pricingDetails.totalPrice}
          extraContent={
            showBranchMap && (
              <div className="relative mt-2 h-[180px] w-full overflow-visible rounded-2xl sm:h-[220px]">
                <GoogleMapsPolyLineLocation
                  hideUserLocation
                  containerHeight="100%"
                  destinationLat={carDetails?.latitude}
                  destinationLng={carDetails?.longitude}
                  disableMapClickToChangeLocation
                  destinationName={carDetails?.branchName}
                  destinationLogoUrl={normalizeImageUrl(
                    carDetails?.company.logo,
                  )}
                  autoFitBounds={true}
                  hideSearch={true}
                />
              </div>
            )
          }
        />
      </div>
    </div>
  );
};

export default ReservationCarSidebar;
