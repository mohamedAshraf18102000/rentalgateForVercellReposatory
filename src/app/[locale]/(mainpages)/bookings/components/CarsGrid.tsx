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
import getOfferTypeMessage from "@/app/(components)/customCards/CarsCard/utils/offerTypes";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselDots,
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
  reactKey: string;
  cars: CarContent[];
};

const normalizeBranchId = (branchId: unknown): number | null => {
  if (branchId == null || branchId === "") return null;
  if (typeof branchId !== "number" && typeof branchId !== "string") {
    return null;
  }

  const parsedBranchId =
    typeof branchId === "number" ? branchId : Number(branchId);

  return Number.isFinite(parsedBranchId) ? parsedBranchId : null;
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

const branchNameHeadingFromCars = (
  cars: CarContent[],
  locale: string,
): string | null => {
  for (const car of cars) {
    const name =
      locale === "ar"
        ? car.branchArabicName?.trim() || car.branchName?.trim()
        : car.branchEnglishName?.trim() || car.branchName?.trim();

    if (name) return name;
  }

  return null;
};

const groupCarsByBranchStable = (cars: CarContent[]): BranchCarGroup[] => {
  const orderedKeys: string[] = [];
  const groups = new Map<string, BranchCarGroup>();

  for (const car of cars) {
    const normalizedBranchId = normalizeBranchId(car.branchId);
    const key =
      normalizedBranchId == null
        ? "__no_branch__"
        : `branch-${normalizedBranchId}`;

    if (!groups.has(key)) {
      groups.set(key, {
        branchId: normalizedBranchId,
        reactKey: key,
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
  const slideClassName =
    "basis-[90%] pl-3 sm:basis-[55%] sm:pl-4 lg:basis-[350px] xl:basis-[380px]";

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
      className="w-full md:px-12"
    >
      <CarouselContent className="-ml-3 py-2 sm:-ml-4 sm:py-3">
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
          const offerBadge = getOfferTypeMessage({
            offerType: car.offerType,
            offerValue: car.offerValue,
            locale,
          });

          return (
            <CarouselItem
              key={car.ccbId}
              className={`${slideClassName} cursor-grab`}
            >
              <Link
                href={`/carDetails/${car.ccbId}`}
                className="my-2 block h-full w-full sm:my-3"
              >
                <CarsCard
                  rate={car.companyAverageRating}
                  daysForFreeDelivery={car.daysForFreeDelivery}
                  className="h-full w-full min-w-0"
                  showTax={isShowTax}
                  firstBadgeTitle={offerBadge || undefined}
                  firstBadgeColor="red"
                  carImage={normalizeImageUrl(car.carImage)}
                  carName={locale === "ar" ? car.carNameAr : car.carNameEn}
                  advancedCard
                  carBrand={
                    locale === "ar"
                      ? car.categoryNameArabic
                      : car.categoryNameEnglish
                  }
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
          );
        })}
      </CarouselContent>
      {showControls ? (
        <>
          <CarouselPrevious
            className={`absolute top-1/2 z-10 hidden -translate-y-1/2 md:flex ${isRtl ? "right-0" : "left-0"}`}
          />
          <CarouselDots className="flex md:hidden" />
          <CarouselNext
            className={`absolute top-1/2 z-10 hidden -translate-y-1/2 md:flex ${isRtl ? "left-0" : "right-0"}`}
          />
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
    (car) => normalizeBranchId(car.branchId) != null,
  );
  const showBranchHeadings =
    listingHasBranches &&
    (branchGroups.length > 1 || branchGroups[0]?.branchId != null);

  return (
    <div className="mt-6 flex flex-col gap-5">
      {branchGroups.map((group) => {
        const companyHeading = companyNamesHeadingFromCars(group.cars, locale);
        const branchHeading = branchNameHeadingFromCars(group.cars, locale);
        return (
          <div key={group.reactKey} className="min-w-0">
            {showBranchHeadings ? (
              <h3 className="mb-3 text-base font-semibold text-foreground sm:text-lg">
                {group.branchId != null ? (
                  <>
                    <span className="block">
                      {companyHeading ??
                        t("branchIdLabel", { id: group.branchId })}
                      {branchHeading ? (
                        <span className="mx-1 text-[15px] font-normal text-muted-foreground">
                          ({branchHeading})
                        </span>
                      ) : null}
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
