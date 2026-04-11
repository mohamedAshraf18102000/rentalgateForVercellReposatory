import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import { CarContent } from "@/types/companyCars/cars";
import {
  calculateRentalPrice,
  PricingType,
} from "@/lib/utils/calculateRentalPrice";
import { calculateDiscount } from "@/lib/utils/calculateDiscount";
import Link from "next/link";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

interface CarsGridProps {
  cars: CarContent[];
  isLoading: boolean;
  rentalDays: number;
}

const pricingTypeLabels: Record<PricingType, string> = {
  DAILY: "يومي",
  WEEKLY: "أسبوعي",
  HALF_MONTHLY: "نصف شهري",
  MONTHLY: "شهري",
  YEARLY: "سنوي",
};

const getOriginalAndOfferPrice = (
  car: CarContent,
  pricingType: PricingType,
): { originalPrice: number; offerPrice: number } => {
  switch (pricingType) {
    case "DAILY":
      return {
        originalPrice: car.dailyPrice ?? 0,
        offerPrice: car.offerDailyPrice ?? 0,
      };
    case "WEEKLY":
      return {
        originalPrice: car.weeklyPrice ?? 0,
        offerPrice: car.offerWeeklyPrice ?? 0,
      };
    case "HALF_MONTHLY":
      return {
        originalPrice: car.halfMonthPrice ?? 0,
        offerPrice: car.offerHalfMonthPrice ?? 0,
      };
    case "MONTHLY":
      return {
        originalPrice: car.monthlyPrice ?? 0,
        offerPrice: car.offerMonthlyPrice ?? 0,
      };
    case "YEARLY":
      return {
        originalPrice: car.yearlyPrice ?? 0,
        offerPrice: car.offerYearlyPrice ?? 0,
      };
  }
};

const getCarPricing = (car: CarContent, rentalDays: number) => {
  const effectiveDays = rentalDays > 0 ? rentalDays : 1;

  const priceResult = calculateRentalPrice({
    days: effectiveDays,
    dailyPrice: car.dailyPrice ?? 0,
    weeklyPrice: car.weeklyPrice ?? 0,
    halfMonthlyPrice: car.halfMonthPrice ?? 0,
    monthlyPrice: car.monthlyPrice ?? 0,
    yearlyPrice: car.yearlyPrice ?? 0,
    offerDailyPrice: car.offerDailyPrice ?? 0,
    offerWeeklyPrice: car.offerWeeklyPrice ?? 0,
    offerHalfMonthlyPrice: car.offerHalfMonthPrice ?? 0,
    offerMonthlyPrice: car.offerMonthlyPrice ?? 0,
    offerYearlyPrice: car.offerYearlyPrice ?? 0,
  });

  const originalPriceResult = calculateRentalPrice({
    days: effectiveDays,
    dailyPrice: car.dailyPrice ?? 0,
    weeklyPrice: car.weeklyPrice ?? 0,
    halfMonthlyPrice: car.halfMonthPrice ?? 0,
    monthlyPrice: car.monthlyPrice ?? 0,
    yearlyPrice: car.yearlyPrice ?? 0,
    offerDailyPrice: 0,
    offerWeeklyPrice: 0,
    offerHalfMonthlyPrice: 0,
    offerMonthlyPrice: 0,
    offerYearlyPrice: 0,
  });

  const { originalPrice, offerPrice } = getOriginalAndOfferPrice(
    car,
    priceResult.pricingType,
  );

  const discountResult = calculateDiscount({ originalPrice, offerPrice });

  return {
    pricePerDay: priceResult.pricePerDay,
    totalPrice: priceResult.totalPrice,
    pricingType: priceResult.pricingType,
    discountPercentage: discountResult.discountPercentage,
    originalPrice: originalPriceResult.pricePerDay,
  };
};

const CarsGrid = ({ cars, isLoading, rentalDays }: CarsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-8 mt-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[450px] rounded-2xl" />
        ))}
      </div>
    );
  }

  const isShowTax = useBookedCarDetailsStore(
    (state) => state.showPricesWithTax,
  );

  return (
    <div className="grid grid-cols-4 gap-8 mt-10">
      {cars.map((car) => {
        const {
          pricePerDay,
          discountPercentage,
          pricingType,
          originalPrice,
          totalPrice,
        } = getCarPricing(car, rentalDays);

        const discountBadge =
          discountPercentage > 0
            ? `خصم ${discountPercentage}% - ${pricingTypeLabels[pricingType]}`
            : "";

        return (
          <Link key={car.ccbId} href={`/carDetails/${car.ccbId}`}>
            <CarsCard
              showTax={isShowTax}
              firstBadgeTitle={discountBadge}
              firstBadgeColor="green"
              carImage={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${car.carImage}`}
              carName={car.carName}
              advancedCard
              carBrand={car.brandName}
              companyLogo={car.companyLogo}
              companyName={car.companyName}
              deliveryInMinutes={car.deliveryInMinutes ?? 0}
              carPrice={pricePerDay}
              priceBeforeOffer={originalPrice}
              freeKm={car.allowedKm ?? 0}
              pricingType={pricingType}
              totalPrice={totalPrice}
              rentalDays={rentalDays}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default CarsGrid;
