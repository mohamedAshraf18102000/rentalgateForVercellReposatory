"use client";
import RoundedRec from "@/constants/icons/RoundedRec";
import { Badge } from "../../ui/badge";
import ExeclusiveOfferIcon from "@/constants/icons/ExeclusiveOfferIcon";
import Image from "next/image";
import { StarIcon } from "@/constants/icons";
import { ChevronLeft, ChevronRight, Flame, SaudiRiyal } from "lucide-react";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import FreeKmIcon from "@/constants/icons/FreeKmIcon";
import UnlimitedKmIcon from "@/constants/icons/UnlimitedKmIcon";
import { useRouter } from "next/navigation";
import {
  Car,
  Company,
  Specification,
  WorkingHours,
} from "@/types/companyCars/carDetails";
import CarCategoryBadge from "../../carCategoryBadge/CarCategoryBadge";
import DOMPurify from "dompurify";
import { PricingType } from "@/lib/utils/calculateRentalPrice";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getPriceWithoutTax } from "@/lib/utils/getPriceWithoutTax";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import SpecificationsDialog from "./SpecificationsDialog";
import WorkingTimes from "./WorkingTimes";
import { normalizeImageUrl } from "@/util";
import HangedOfferIcon from "./components/hangedOffer/HangedOfferIcon";

interface CarDetailsCardProps {
  car: Car;
  company: Company;
  extraKmPrice: number;
  unlimitedKm: number;
  ccbId: number;
  daysForFreeDelivery?: number | null;
  // ── Shared props (same as CarsCard BaseCardProps) ──
  advancedCard?: boolean;
  extraBadgeTitle?: string;
  firstBadgeTitle?: string;
  firstBadgeColor?: "green" | "red";
  extraBadgeColor?: "green" | "red";
  extraContent?: React.ReactNode;
  priceBeforeOffer?: number;
  unlimitedKmPrice?: number;
  carImage?: string;
  carName?: string;
  carBrand?: string;
  companyLogo?: string;
  companyName?: string;
  deliveryInMinutes?: number;
  freeKm?: number;
  carPrice?: number;
  originalPrice?: number;
  pricingType?: PricingType;
  totalPrice?: number;
  originalTotalPrice?: number;
  rentalDays?: number;
  showRating?: boolean;
  rate?: number;
  dailyPrice?: number;
  showTax?: boolean;
  specifications?: Specification[];
  workingTime?: WorkingHours;
}

const CarDetailsCard = ({
  car,
  company,
  extraKmPrice,
  unlimitedKm,
  ccbId,
  daysForFreeDelivery,
  extraBadgeTitle,
  firstBadgeTitle,
  firstBadgeColor,
  extraBadgeColor,
  extraContent,
  priceBeforeOffer,
  freeKm,
  carPrice,
  pricingType = "DAILY",
  totalPrice,
  originalTotalPrice,
  rentalDays,
  unlimitedKmPrice,
  showRating,
  rate,
  showTax,
  specifications = [],
  workingTime,
}: CarDetailsCardProps) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const isRTL = locale === "ar";
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
  const pricingTypeLabels: Record<PricingType, string> = useMemo(
    () => ({
      DAILY: t("pricingType.daily"),
      WEEKLY: t("pricingType.weekly"),
      HALF_MONTHLY: t("pricingType.halfMonthly"),
      MONTHLY: t("pricingType.monthly"),
      YEARLY: t("pricingType.yearly"),
    }),
    [t],
  );
  const legacySpecsText = useMemo(
    () =>
      DOMPurify.sanitize(
        locale === "ar"
          ? (car.otherSpecs ?? "")
          : car.otherSpecsEnglish || car.otherSpecs || "",
        { ALLOWED_TAGS: [] },
      ).trim(),
    [locale, car.otherSpecs, car.otherSpecsEnglish],
  );

  const hasSpecifications =
    specifications.length > 0 || legacySpecsText.length > 0;

  const isMultiDayRental = typeof rentalDays === "number" && rentalDays > 1;
  const hasOffer = isMultiDayRental
    ? typeof totalPrice === "number" &&
      totalPrice > 0 &&
      typeof originalTotalPrice === "number" &&
      originalTotalPrice > totalPrice
    : typeof carPrice === "number" &&
      carPrice > 0 &&
      typeof priceBeforeOffer === "number" &&
      priceBeforeOffer > carPrice;

  return (
    <section className="mt-5 flex w-full flex-col overflow-hidden rounded-[18px] border-2 border-white shadow-xl lg:flex-row">
      <div className="w-full overflow-hidden lg:w-[40%]">
        <figure
          className={`relative min-h-[220px] overflow-hidden transition-all duration-300 sm:min-h-[300px] lg:h-full lg:min-h-[450px]`}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={normalizeImageUrl(car.image)}
              alt={t("carImageAlt")}
              className="relative z-20 w-full object-contain scale-85 mb-5 max-h-[400px]"
            />

            {typeof firstBadgeTitle === "string" &&
              firstBadgeTitle.length > 0 && (
                <Badge
                  className={`absolute top-0 z-50 p-2 text-xs font-bold sm:p-4 sm:text-sm ${
                    isRTL ? "-right-2" : "-left-2"
                  } ${
                    firstBadgeColor === "red"
                      ? "bg-StatusBrownBG text-StatusBrown200"
                      : "bg-white text-primary-red"
                  }`}
                >
                  {firstBadgeTitle}
                </Badge>
              )}

            {extraBadgeTitle && (
              <Badge
                className={`absolute top-10 z-50 p-2 text-xs font-bold sm:p-4 sm:text-sm ${
                  isRTL ? "-right-2" : "-left-2"
                } ${
                  extraBadgeColor === "red"
                    ? "bg-StatusBrownBG text-StatusBrown200"
                    : "bg-StatusGreen text-StatusDarkGreen"
                }`}
              >
                {extraBadgeTitle}
              </Badge>
            )}
          </div>

          <div
            className={`absolute top-10 z-50 flex w-fit max-w-[90%] items-center justify-between gap-2 bg-white p-1 sm:top-12 sm:gap-4 ${
              isRTL ? "rounded-l-[18px]" : "rounded-r-[18px]"
            }`}
          >
            <div className="flex items-center gap-1">
              <Image
                src={normalizeImageUrl(company?.logo)}
                alt="Event cover"
                width={100}
                height={100}
                className="h-[38px] w-[38px] rounded-2xl border-2 border-Grey100 object-fill p-0.5 sm:h-[45px] sm:w-[45px]"
              />
              <span className="mx-1 line-clamp-1 text-sm sm:text-base">
                {locale === "ar" ? company?.arabicName : company?.englishName}
              </span>
            </div>

            {showRating && (
              <div className="flex items-center gap-1">
                <data value="4.2" className="text-sm sm:text-base">
                  {rate}
                </data>
                <StarIcon />
              </div>
            )}
          </div>

          {hasOffer && (
            <figcaption
              className={`absolute top-5  z-50 scale-120 ${isRTL ? "left-5" : "right-5"}`}
            >
              <HangedOfferIcon />
            </figcaption>
          )}

          {typeof daysForFreeDelivery === "number" && (
            <>
              <RoundedRec className="absolute inset-x-0 bottom-0 z-40 px-10" />
              <figcaption className="absolute inset-x-0 bottom-0 z-50 flex w-full items-center justify-center gap-1 px-2 py-0.5 sm:gap-2 sm:px-3">
                <span className="shrink-0">
                  <ExeclusiveOfferIcon />
                </span>
                <span className="min-w-0 text-center text-[10px] font-bold leading-tight text-StatusDarkGreen sm:text-xs md:text-sm">
                  {t("freeDeliveryForDays", { days: daysForFreeDelivery })}
                </span>
              </figcaption>
            </>
          )}
        </figure>
      </div>

      <div className="w-full bg-white p-4 sm:p-6 lg:w-[60%]">
        <div className="flex w-full flex-col gap-3 text-sm sm:text-base xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center">
              <span>{showTax ? t("priceWithTax") : t("priceWithoutTax")}</span>

              {showTax ? (
                <>
                  {(rentalDays && rentalDays > 1
                    ? originalTotalPrice
                    : priceBeforeOffer) &&
                    (rentalDays && rentalDays > 1
                      ? originalTotalPrice
                      : priceBeforeOffer)! >
                      (rentalDays && rentalDays > 1
                        ? totalPrice!
                        : carPrice || 0) && (
                      <span className="text-Grey500 line-through mx-1 text-sm">
                        {formatPrice(
                          rentalDays && rentalDays > 1
                            ? originalTotalPrice!
                            : priceBeforeOffer!,
                        )}
                      </span>
                    )}
                  <span className="font-bold mx-1">
                    {formatPrice(
                      rentalDays && rentalDays > 1
                        ? totalPrice!
                        : carPrice || 0,
                    )}
                  </span>
                </>
              ) : (
                <>
                  {(rentalDays && rentalDays > 1
                    ? originalTotalPrice
                    : priceBeforeOffer) &&
                    (rentalDays && rentalDays > 1
                      ? originalTotalPrice
                      : priceBeforeOffer)! >
                      (rentalDays && rentalDays > 1
                        ? totalPrice!
                        : carPrice || 0) && (
                      <span className="text-Grey500 line-through mx-1 text-sm">
                        {formatPrice(
                          getPriceWithoutTax(
                            rentalDays && rentalDays > 1
                              ? originalTotalPrice!
                              : priceBeforeOffer!,
                          ),
                        )}
                      </span>
                    )}
                  <span className="font-bold mx-1">
                    {formatPrice(
                      getPriceWithoutTax(
                        rentalDays && rentalDays > 1
                          ? totalPrice!
                          : carPrice || 0,
                      ),
                    )}
                  </span>
                </>
              )}
              <SaudiRiyal className="w-5 h-5" />
              <span className="mx-1 text-sm text-Grey500">
                {rentalDays && rentalDays > 1
                  ? t("forRentalDays", { days: rentalDays })
                  : t("pricePerPricingType", {
                      pricingType: pricingTypeLabels[pricingType],
                    })}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
            <Button
              variant="outline"
              className="w-full text-sm! sm:w-auto sm:text-base!"
              icon={<ChevronIcon className="w-8 h-8" />}
              onClick={() => router.push(`/reservation/${ccbId}?forOther=true`)}
            >
              {t("bookForOthers")}
            </Button>
            <Button
              className="w-full text-sm! sm:w-auto sm:text-base!"
              icon={<ChevronIcon className="w-8 h-8" />}
              onClick={() => router.push(`/reservation/${ccbId}`)}
            >
              {t("bookNow")}
            </Button>
          </div>
        </div>

        <Separator className="my-3 bg-Grey100" />
        <div className="">
          {workingTime && <WorkingTimes workingHours={workingTime} />}
        </div>

        <Separator className="my-3 bg-Grey100" />
        <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between">
          <p>{car.carName}</p>
          <div className="p-1 bg-Grey100 rounded-[12px] w-fit">
            <CarCategoryBadge
              icon={car.categoryIcon}
              name={
                locale === "ar"
                  ? car.categoryNameArabic
                  : car.categoryNameEnglish
              }
            />
          </div>
        </div>

        <Separator className="my-3 bg-Grey100" />

        <div className="grid grid-cols-1 items-center justify-between gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 scale-90">
              <FreeKmIcon />
            </div>
            <p className="text-sm">
              {t("freeKilometersLabel")}
              <strong>{freeKm ?? 350} </strong>
              <strong>{t("kmPerDay")}</strong>
            </p>
          </div>

          {extraKmPrice && (
            <div className="flex items-center gap-1">
              <div className="w-10 h-10 scale-90">
                <FreeKmIcon />
              </div>
              <p className="text-sm flex items-center">
                {t("extraKilometerCostLabel")}
                <strong className="mx-1">{extraKmPrice}</strong>
                <SaudiRiyal className="text-sm!" />
                <strong>{t("perDayCompact")}</strong>
              </p>
            </div>
          )}
        </div>
        {unlimitedKm !== 0 && (
          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-1">
              <UnlimitedKmIcon />
              <p className="text-sm flex items-center">
                <span className="mx-1">{t("unlimitedKilometersLabel")}</span>
                <strong>{unlimitedKmPrice?.toString()}</strong>
                <span>
                  <SaudiRiyal />
                </span>
                <strong>{t("perDayWithSpacing")}</strong>
              </p>
              <p className="mx-1 flex items-center gap-1 rounded-[8px] bg-StatusBrownBG p-2 text-sm font-bold text-StatusBrown200">
                <Flame />
                <span>{t("unlimitedDrivingBadge")}</span>
              </p>
            </div>
          </div>
        )}

        {/* Extra content slot */}
        {extraContent && (
          <div className="w-full h-full mt-3">{extraContent}</div>
        )}

        {hasSpecifications && (
          <>
            <Separator className="my-3 bg-Grey100" />
            <div className="flex items-center gap-3">
              <p>{t("specificationsTitle")}</p>
              <SpecificationsDialog
                specifications={specifications}
                legacySpecsText={legacySpecsText}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CarDetailsCard;
