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

import { PricingType } from "@/lib/utils/calculateRentalPrice";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getPriceWithoutTax } from "@/lib/utils/getPriceWithoutTax";
import { useTranslations } from "next-intl";
import { normalizeImageUrl } from "@/util";
import dynamic from "next/dynamic";

const HangedOfferIcon = dynamic(
  () => import("./components/hangedOffer/HangedOfferIcon"),
  { ssr: false },
);
import RatingStars from "./components/RatingStars";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import ExeclusiveOfferIcon from "@/constants/icons/ExeclusiveOfferIcon";
import RoundedRec from "@/constants/icons/RoundedRec";

interface carsCard {
  rate: number;
  daysForFreeDelivery?: number | null;
  advancedCard?: boolean;
  extraBadgeTitle?: string;
  firstBadgeTitle?: string;
  firstBadgeColor?: "green" | "red";
  extraBadgeColor?: "green" | "red";
  extraContent?: React.ReactNode;
  priceBeforeOffer?: number;
  className?: string;
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
  rate,
  daysForFreeDelivery,
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
  className,
  totalPrice,
  rentalDays,
  onClick,
}: carsCard) => {
  const t = useTranslations("carDetails");

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
        className={cn(
          "select-none! relative mx-auto w-full max-w-sm pt-0 rounded-[18px] hover:shadow-lg transition-all duration-300 border-0! ring-1 cursor-pointer bg-white",
          className,
        )}
      >
        {/* Car Image */}
        <figure
          className={`relative z-20 rounded-[18px] transition-all duration-300 p-3 ${advancedCard ? "bg-Grey100 border border-white" : "bg-Grey100"}`}
        >
          <img
            src={carImage}
            alt={t("carImageAlt")}
            className="relative z-20 w-full object-contain min-h-[200px] max-h-[200px] rounded-lg"
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

          {typeof daysForFreeDelivery === "number" &&
            daysForFreeDelivery > 0 && (
              <>
                <RoundedRec className="absolute inset-x-0 bottom-0 z-40 px-9" />
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
                {rate && (
                  <>
                    <data
                      value={String(rate)}
                      className="text-sm font-bold sm:text-base"
                    >
                      {rate}
                    </data>
                    <div className="flex items-center" aria-hidden>
                      <RatingStars rating={rate} />
                    </div>
                  </>
                )}
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
                    <span className="mx-1">
                      {priceBeforeOffer &&
                        priceBeforeOffer > displayedPrice! && (
                          <span className="text-xs text-white/60 line-through sm:text-sm">
                            {formatPrice(priceBeforeOffer)}
                          </span>
                        )}
                    </span>
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
                      <span className="mx-1">/</span>
                      <span>{`${hasSelectedRentalDays ? rentalDays : 1} ${t("days")}`}</span>
                    </p>
                  </div>
                </div>
                <p className="text-[#CFCFCF] text-[12px]">
                  {showTax ? t("taxIncluded") : t("taxExcluded")}
                </p>
              </div>

              <div className="">
                <Button
                  variant="secondary"
                  className=" bg-white font-bold text-sm! px-2! py-2! rounded-lg!"
                >
                  <span className="bg-linear-to-b from-[#BE2326] to-[#581012] bg-clip-text text-transparent">
                    {t("bookNow")}
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
