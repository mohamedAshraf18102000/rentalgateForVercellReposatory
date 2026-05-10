"use client";

import { Badge } from "@/app/(components)/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/(components)/ui/card";
import Image from "next/image";
import { SaudiRiyal } from "lucide-react";
import FreeKmIcon from "../../../../constants/icons/FreeKmIcon";
import StarIcon from "../../../../constants/icons/StarIcon";

import { PricingType } from "@/lib/utils/calculateRentalPrice";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getPriceWithoutTax } from "@/lib/utils/getPriceWithoutTax";
import { useTranslations } from "next-intl";
import { normalizeImageUrl } from "@/util";
import HangedOfferIcon from "./components/hangedOffer/HangedOfferIcon";
import { Button } from "../../ui/button";

interface carsCard {
  advancedCard?: boolean;
  extraBadgeTitle?: string;
  firstBadgeTitle?: string;
  firstBadgeColor?: "green" | "red";
  extraBadgeColor?: "green" | "red";
  extraContent?: React.ReactNode;
  priceBeforeOffer?: number;

  carImage?: string;
  carName?: string;
  carBrand?: string;
  companyLogo?: string;
  companyName?: string;
  deliveryInMinutes?: number;
  freeKm?: number;
  carPrice?: number;
  pricingType?: PricingType;
  totalPrice?: number;
  rentalDays?: number;
  showTax?: boolean;
  onClick?: () => void;
}

const CarsCard = ({
  advancedCard,
  extraBadgeTitle,
  extraBadgeColor,
  extraContent,
  carImage,
  carName,
  carBrand,
  companyName,
  companyLogo,
  freeKm,
  carPrice,
  firstBadgeTitle,
  firstBadgeColor,
  priceBeforeOffer,
  showTax,
  pricingType = "DAILY",
  totalPrice,
  rentalDays,
  onClick,
}: carsCard) => {
  const t = useTranslations("carDetails");
  const pricingTypeLabels: Record<PricingType, string> = {
    DAILY: t("pricingType.daily"),
    WEEKLY: t("pricingType.weekly"),
    HALF_MONTHLY: t("pricingType.halfMonthly"),
    MONTHLY: t("pricingType.monthly"),
    YEARLY: t("pricingType.yearly"),
  };
  const hasSelectedRentalDays =
    typeof rentalDays === "number" && rentalDays > 0;
  const shouldUseTotalPrice =
    hasSelectedRentalDays && typeof totalPrice === "number" && totalPrice > 0;
  const displayedPrice = shouldUseTotalPrice ? totalPrice : carPrice;
  const hasDisplayedPrice =
    typeof displayedPrice === "number" && displayedPrice > 0;
  const hasOffer =
    hasDisplayedPrice &&
    typeof priceBeforeOffer === "number" &&
    priceBeforeOffer > displayedPrice;

  return (
    <article>
      <Card
        onClick={onClick}
        className={`select-none! relative mx-auto w-full max-w-sm pt-0 rounded-[18px] hover:shadow-lg transition-all duration-300 border-0! ring-1 cursor-pointer bg-white`}
      >
        {/* Car Image */}
        <figure
          className={`relative z-20 rounded-[18px] transition-all duration-300 p-3 ${advancedCard ? "bg-Grey100 border border-white" : "bg-Grey100"}`}
        >
          <img
            src={carImage}
            alt={t("carImageAlt")}
            className="relative z-20 w-full object-cover min-h-[250px] max-h-[250px] rounded-lg"
          />
          {typeof firstBadgeTitle === "string" &&
            firstBadgeTitle.length > 0 && (
              <Badge
                className={`absolute top-0 -right-2 z-30 p-2 text-xs font-bold sm:p-4 sm:text-sm ${firstBadgeColor === "red" ? "bg-StatusBrownBG text-StatusBrown200" : "bg-white text-primary-red"}`}
              >
                {firstBadgeTitle}
              </Badge>
            )}

          {extraBadgeTitle && (
            <Badge
              className={`absolute top-10 -right-2 z-50 p-2 text-xs font-bold sm:p-4 sm:text-sm ${extraBadgeColor === "red" ? "bg-StatusBrownBG text-StatusBrown200" : "bg-StatusGreen text-StatusDarkGreen"}`}
            >
              {extraBadgeTitle}
            </Badge>
          )}

          {hasOffer && (
            <>
              <figcaption className="absolute top-5 left-5 z-50 scale-120">
                <HangedOfferIcon />
              </figcaption>
            </>
          )}
        </figure>

        <CardHeader className="mt-5">
          <CardTitle className="font-bold flex justify-between items-start">
            <h3 className="w-3/4 text-sm sm:text-base">{carName}</h3>

            <Badge className="text-xs font-bold sm:text-sm" variant="secondary">
              {carBrand}
            </Badge>
          </CardTitle>

          {/* Brand & Rating */}
          <CardContent className="p-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Image
                  src={normalizeImageUrl(companyLogo)}
                  alt="Event cover"
                  width={100}
                  height={100}
                  className="w-[40px] h-[40px] object-fill rounded-full border-2 border-Grey100 p-0.5"
                />
                <span className="text-sm sm:text-base">{companyName}</span>
              </div>

              <div className="flex items-center gap-1">
                <data value="4.2" className="text-sm font-bold sm:text-base">
                  4.2
                </data>
                <StarIcon />
              </div>
            </div>
          </CardContent>

          {/* Free KM */}
          <CardContent className="p-0">
            <div className="flex items-center gap-1">
              <div className="w-10 h-10 scale-90">
                <FreeKmIcon />
              </div>
              <p className="text-xs sm:text-sm mx-3">
                {t("freeKilometersLabel")}{" "}
                <strong>
                  {freeKm} {t("kmPerDay")}
                </strong>
              </p>
            </div>

            {/* Price */}

            <div className="w-full py-1 rounded-lg mt-3 bg-[linear-gradient(180deg,#BE2326_0%,#581012_100%)] text-white flex justify-between items-center px-3">
              <div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {hasDisplayedPrice &&
                      (showTax ? (
                        <>
                          <data
                            value="10.56"
                            className=" text-sm font-bold sm:text-base"
                          >
                            {formatPrice(displayedPrice)}
                          </data>
                        </>
                      ) : (
                        <>
                          {priceBeforeOffer &&
                            priceBeforeOffer > displayedPrice && (
                              <span className="text-xs text-Grey500 line-through sm:text-sm">
                                {formatPrice(
                                  getPriceWithoutTax(priceBeforeOffer),
                                )}
                              </span>
                            )}
                          <data
                            value="10.56"
                            className="mx-2 text-sm font-bold sm:text-base"
                          >
                            {formatPrice(getPriceWithoutTax(displayedPrice))}
                          </data>
                        </>
                      ))}

                    <p className="flex items-center text-sm sm:text-base">
                      <SaudiRiyal className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="mx-1">
                        {t("pricePerPricingType", {
                          pricingType: pricingTypeLabels[pricingType],
                        })}
                      </span>
                    </p>
                    {priceBeforeOffer && priceBeforeOffer > displayedPrice! && (
                      <span className="text-xs text-Grey500 line-through sm:text-sm">
                        {formatPrice(priceBeforeOffer)}
                      </span>
                    )}
                  </div>
                  {shouldUseTotalPrice && (
                    <div className="mt-1 text-xs font-medium text-white">
                      <span>{`${t("totalForDays", { days: rentalDays })}: `}</span>
                      <span className="font-bold text-white mx-1">
                        {showTax
                          ? formatPrice(totalPrice)
                          : formatPrice(getPriceWithoutTax(totalPrice))}
                        <SaudiRiyal className="inline h-3 w-3" />
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[#CFCFCF] text-[12px]">
                  {showTax ? "شامل الضريبة" : "غير شامل الضريبة"}
                </p>
              </div>

              <div className="">
                <Button
                  variant="secondary"
                  className=" bg-white font-bold text-base"
                >
                  <span className="bg-linear-to-b from-[#BE2326] to-[#581012] bg-clip-text text-transparent">
                    احجز الآن
                  </span>
                </Button>
              </div>
            </div>
            {extraContent && (
              <div className="w-full h-full">{extraContent}</div>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </article>
  );
};

export default CarsCard;
