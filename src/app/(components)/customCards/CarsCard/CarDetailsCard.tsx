"use client";
import RoundedRec from "@/constants/icons/RoundedRec";
import { Badge } from "../../ui/badge";
import ExeclusiveOfferIcon from "@/constants/icons/ExeclusiveOfferIcon";
import Image from "next/image";
import { StarIcon } from "@/constants/icons";
import { ChevronLeft, Dot, Flame, SaudiRiyal } from "lucide-react";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import FreeKmIcon from "@/constants/icons/FreeKmIcon";
import UnlimitedKmIcon from "@/constants/icons/UnlimitedKmIcon";
import { useRouter } from "next/navigation";
import { Car, Company } from "@/types/companyCars/carDetails";
import CarCategoryBadge from "../../carCategoryBadge/CarCategoryBadge";
import DOMPurify from "dompurify";
import { PricingType } from "@/lib/utils/calculateRentalPrice";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getPriceWithoutTax } from "@/lib/utils/getPriceWithoutTax";
import { dialogRegistry } from "@/app/[locale]/(dialogs)/registry/dialogRegistry";
import { useMemo } from "react";

interface CarDetailsCardProps {
  car: Car;
  company: Company;
  extraKmPrice: number;
  unlimitedKm: number;
  ccbId: number;

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
}

const pricingTypeLabels: Record<PricingType, string> = {
  DAILY: "يومي",
  WEEKLY: "أسبوعي",
  HALF_MONTHLY: "نصف شهري",
  MONTHLY: "شهري",
  YEARLY: "سنوي",
};

const CarDetailsCard = ({
  car,
  company,
  extraKmPrice,
  unlimitedKm,
  ccbId,
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
}: CarDetailsCardProps) => {
  const router = useRouter();
  const otherSpecsPurified = DOMPurify.sanitize(car.otherSpecs, {
    ALLOWED_TAGS: [],
  });

  return (
    <section className="mt-5 flex w-full flex-col overflow-hidden rounded-[18px] border-2 border-white shadow-xl lg:flex-row">
      <div className="w-full overflow-hidden lg:w-[40%]">
        <figure
          className={`relative min-h-[220px] overflow-hidden transition-all duration-300 sm:min-h-[300px] lg:h-full lg:min-h-[450px]`}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${car.image}`}
              alt="سيارة للإيجار"
              className="relative z-20 w-full object-contain scale-85 mb-5 max-h-[400px]"
            />

            {typeof firstBadgeTitle === "string" &&
              firstBadgeTitle.length > 0 && (
                <Badge
                  className={`absolute -right-2 top-0 z-50 p-2 text-xs font-bold sm:p-4 sm:text-sm ${
                    firstBadgeColor === "red"
                      ? "bg-StatusBrownBG text-StatusBrown200"
                      : "bg-StatusGreen text-StatusDarkGreen"
                  }`}
                >
                  {firstBadgeTitle}
                </Badge>
              )}

            {extraBadgeTitle && (
              <Badge
                className={`absolute -right-2 top-10 z-50 p-2 text-xs font-bold sm:p-4 sm:text-sm ${
                  extraBadgeColor === "red"
                    ? "bg-StatusBrownBG text-StatusBrown200"
                    : "bg-StatusGreen text-StatusDarkGreen"
                }`}
              >
                {extraBadgeTitle}
              </Badge>
            )}
          </div>

          <div className="absolute top-10 z-50 flex w-fit max-w-[90%] items-center justify-between gap-2 rounded-l-[18px] bg-white p-1 sm:top-12 sm:gap-4">
            <div className="flex items-center gap-1">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${company?.logo}`}
                alt="Event cover"
                width={100}
                height={100}
                className="h-[38px] w-[38px] rounded-2xl border-2 border-Grey100 object-fill p-0.5 sm:h-[45px] sm:w-[45px]"
              />
              <span className="mx-1 line-clamp-1 text-sm sm:text-base">
                {company?.arabicName}
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

          <RoundedRec className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50" />

          <figcaption className="flex items-center gap-2 absolute bottom-0 left-1/2 -translate-x-1/2 z-50">
            <ExeclusiveOfferIcon />
            <span className="text-sm font-bold text-StatusDarkGreen">
              عرض خاص
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="w-full bg-white p-4 sm:p-6 lg:w-[60%]">
        <div className="flex w-full flex-col gap-3 text-sm sm:text-base xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center">
              <span>
                {showTax ? "السعر شامل الضريبة:" : "السعر غير شامل الضريبة:"}
              </span>

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
                  ? `( لـ ${rentalDays} يوم )`
                  : `/ ${pricingTypeLabels[pricingType]}`}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
            <Button
              variant="outline"
              className="w-full text-sm! sm:w-auto sm:text-base!"
              icon={<ChevronLeft className="w-8 h-8" />}
              onClick={() => router.push(`/reservation/${ccbId}?forOther=true`)}
            >
              حجز للغير
            </Button>
            <Button
              className="w-full text-sm! sm:w-auto sm:text-base!"
              icon={<ChevronLeft className="w-8 h-8" />}
              onClick={() => router.push(`/reservation/${ccbId}`)}
            >
              أحجزها الآن
            </Button>
          </div>
        </div>

        <Separator className="my-3" />
        <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between">
          <p>{car.carName}</p>
          <div className="p-1 bg-Grey100 rounded-[12px] w-fit">
            <CarCategoryBadge
              icon={car.categoryIcon}
              name={car.categoryNameArabic}
            />
          </div>
        </div>
        <Separator className="my-3" />
        <div>
          <p>مواصفات السيارة:</p>
          <div className="mt-2 grid w-full grid-cols-1 gap-2 p-2 sm:grid-cols-2">
            <div className="flex items-center text-Grey700 text-base">
              <Dot />
              <p>{otherSpecsPurified}</p>
            </div>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-1 items-center justify-between gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-1">
            <FreeKmIcon />
            <p className="text-sm">
              الكيلومترات المجانية:
              <strong>{freeKm ?? 350} </strong>
              <strong>كم / اليوم</strong>
            </p>
          </div>

          {extraKmPrice && (
            <div className="flex items-center gap-1">
              <FreeKmIcon />
              <p className="text-sm flex items-center">
                تكلفة الكيلو متر الزيادة:
                <strong className="mx-1">{extraKmPrice}</strong>
                <SaudiRiyal className="text-sm!" />
                <strong>/اليوم</strong>
              </p>
            </div>
          )}
        </div>
        {unlimitedKm !== 0 && (
          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-1">
              <UnlimitedKmIcon />
              <p className="text-sm flex items-center">
                <span className="mx-1">عدد كيلومترات لا نهائي:</span>
                <strong>{unlimitedKmPrice?.toString()}</strong>
                <span>
                  <SaudiRiyal />
                </span>
                <strong> / اليوم</strong>
              </p>
              <p className="mx-1 flex items-center gap-1 rounded-[8px] bg-StatusBrownBG p-2 text-sm font-bold text-StatusBrown200">
                <Flame />
                <span>قيادة بلا نهاية</span>
              </p>
            </div>
          </div>
        )}

        {/* Extra content slot */}
        {extraContent && (
          <div className="w-full h-full mt-3">{extraContent}</div>
        )}
      </div>
    </section>
  );
};

export default CarDetailsCard;
