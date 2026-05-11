"use client";

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
import { useLocale, useTranslations } from "next-intl";
import { normalizeImageUrl } from "@/util";
import { useCallback, useEffect, useState } from "react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/(components)/ui/carousel";

interface CarsGridProps {
  cars: CarContent[];
  isLoading: boolean;
  rentalDays: number;
}

type BranchCarGroup = {
  branchId: number | null;
  cars: CarContent[];
};

/** Stable, first-seen order of distinct company names in a branch row. */
const companyNamesHeadingFromCars = (
  cars: CarContent[],
  locale: string,
): string | null => {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const car of cars) {
    const name =
      locale === "ar" ? car.companyNameAr?.trim() : car.companyName?.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    ordered.push(name);
  }
  return ordered.length ? ordered.join(" · ") : null;
};

const groupCarsByBranchStable = (cars: CarContent[]): BranchCarGroup[] => {
  const orderedKeys: (number | "__none__")[] = [];
  const groups = new Map<number | "__none__", BranchCarGroup>();

  for (const car of cars) {
    const hasBid = car.branchId != null && !Number.isNaN(car.branchId);
    const key: number | "__none__" = hasBid
      ? (car.branchId as number)
      : "__none__";

    if (!groups.has(key)) {
      groups.set(key, {
        branchId: hasBid ? (car.branchId as number) : null,
        cars: [],
      });
      orderedKeys.push(key);
    }

    groups.get(key)!.cars.push(car);
  }

  return orderedKeys.map((k) => groups.get(k)!);
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
    originalPrice:
      rentalDays > 0
        ? originalPriceResult.totalPrice
        : originalPriceResult.pricePerDay,
  };
};

interface BranchCarsCarouselProps {
  cars: CarContent[];
  locale: string;
  isRtl: boolean;
  rentalDays: number;
  isShowTax: boolean;
  discountPrefix: string;
  pricingTypeLabels: Record<PricingType, string>;
}

const BranchCarsCarousel = ({
  cars,
  locale,
  isRtl,
  rentalDays,
  isShowTax,
  discountPrefix,
  pricingTypeLabels,
}: BranchCarsCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [showControls, setShowControls] = useState(false);

  const updateControlVisibility = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) {
      setShowControls(false);
      return;
    }

    setShowControls(carouselApi.scrollSnapList().length > 1);
  }, []);

  useEffect(() => {
    if (!api) return;

    updateControlVisibility(api);
    api.on("reInit", updateControlVisibility);
    api.on("select", updateControlVisibility);

    return () => {
      api.off("reInit", updateControlVisibility);
      api.off("select", updateControlVisibility);
    };
  }, [api, updateControlVisibility]);

  return (
    <Carousel
      lang={locale}
      setApi={setApi}
      opts={{
        align: "start",
        direction: isRtl ? "rtl" : "ltr",
      }}
      className="w-full"
    >
      <CarouselContent className="py-3">
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
              ? `${discountPrefix} ${discountPercentage}% - ${pricingTypeLabels[pricingType]}`
              : "";

          return (
            <div key={car.ccbId} className="relative">
              <CarouselItem className="basis-[350px] max-w-sm shrink-0 mx-2 cursor-grab">
                <Link
                  href={`/carDetails/${car.ccbId}`}
                  className="my-3 block w-[350px] max-w-sm"
                >
                  <CarsCard
                    className="w-full h-full min-w-0"
                    showTax={isShowTax}
                    firstBadgeTitle={discountBadge}
                    firstBadgeColor="green"
                    carImage={normalizeImageUrl(car.carImage)}
                    carName={car.carName}
                    advancedCard
                    carBrand={car.categoryNameArabic}
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
              </CarouselItem>
            </div>
          );
        })}
      </CarouselContent>
      {showControls ? (
        <>
          <CarouselPrevious className="absolute right-0 top-1/2 -mr-15" />
          <CarouselNext className="absolute left-0 top-1/2 -ml-15" />
        </>
      ) : null}
    </Carousel>
  );
};

const CarsGrid = ({ cars, isLoading, rentalDays }: CarsGridProps) => {
  const t = useTranslations("carDetails");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const isShowTax = useBookedCarDetailsStore(
    (state) => state.showPricesWithTax,
  );
  const pricingTypeLabels: Record<PricingType, string> = {
    DAILY: t("pricingType.daily"),
    WEEKLY: t("pricingType.weekly"),
    HALF_MONTHLY: t("pricingType.halfMonthly"),
    MONTHLY: t("pricingType.monthly"),
    YEARLY: t("pricingType.yearly"),
  };

  if (isLoading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 md:grid-cols-2 md:mt-10 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[min(28rem,70vh)] rounded-2xl sm:h-104 md:h-112"
          />
        ))}
      </div>
    );
  }

  const branchGroups = groupCarsByBranchStable(cars);
  const listingHasBranches = cars.some(
    (car) => car.branchId != null && !Number.isNaN(car.branchId),
  );
  const showBranchHeadings =
    listingHasBranches &&
    (branchGroups.length > 1 || branchGroups[0]?.branchId != null);

  return (
    <div className="mt-6 flex flex-col gap-5">
      {branchGroups.map((group) => {
        const companyHeading = companyNamesHeadingFromCars(group.cars, locale);
        return (
          <div key={group.branchId ?? "__no_branch__"} className="min-w-0">
            {showBranchHeadings ? (
              <h3 className="mb-3 text-base font-semibold text-foreground sm:text-lg">
                {group.branchId != null ? (
                  <>
                    <span className="block">
                      {companyHeading ??
                        t("branchIdLabel", { id: group.branchId })}
                    </span>
                  </>
                ) : (
                  (companyHeading ?? t("branchWithoutId"))
                )}
              </h3>
            ) : null}
            <BranchCarsCarousel
              cars={group.cars}
              locale={locale}
              isRtl={isRtl}
              rentalDays={rentalDays}
              isShowTax={isShowTax}
              discountPrefix={t("discountPrefix")}
              pricingTypeLabels={pricingTypeLabels}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CarsGrid;
