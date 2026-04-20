import { Badge } from "@/app/(components)/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/(components)/ui/card";
import Image from "next/image";
import { SaudiRiyal } from "lucide-react";
import RoundedRec from "../../../../constants/icons/RoundedRec";
import ExeclusiveOfferIcon from "../../../../constants/icons/ExeclusiveOfferIcon";
import FreeKmIcon from "../../../../constants/icons/FreeKmIcon";
import StarIcon from "../../../../constants/icons/StarIcon";

import { PricingType } from "@/lib/utils/calculateRentalPrice";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getPriceWithoutTax } from "@/lib/utils/getPriceWithoutTax";

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
}

const pricingTypeLabels: Record<PricingType, string> = {
  DAILY: "يومي",
  WEEKLY: "أسبوعي",
  HALF_MONTHLY: "نصف شهري",
  MONTHLY: "شهري",
  YEARLY: "سنوي",
};

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
}: carsCard) => {
  return (
    <article>
      <Card
        className={`group relative mx-auto w-full max-w-sm pt-0 rounded-[18px] hover:shadow-lg transition-all duration-300 border-0! ring-0 hover:ring-1 cursor-pointer ${advancedCard ? "bg-transparent hover:bg-white" : "bg-white"}`}
      >
        {/* Car Image */}
        <figure
          className={`relative z-20 rounded-[18px] transition-all duration-300 ${advancedCard ? "bg-transparent group-hover:bg-Grey100 border border-white" : "bg-Grey100"}`}
        >
          <img
            src={carImage}
            alt="سيارة للإيجار"
            className="relative z-20 w-full object-contain min-h-[250px] max-h-[250px]"
          />
          {typeof firstBadgeTitle === "string" &&
            firstBadgeTitle.length > 0 && (
              <Badge
                className={`absolute top-0 -right-2 z-30 p-2 text-xs font-bold sm:p-4 sm:text-sm ${firstBadgeColor === "red" ? "bg-StatusBrownBG text-StatusBrown200" : "bg-StatusGreen text-StatusDarkGreen"}`}
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

          <RoundedRec className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50" />

          <figcaption className="flex items-center gap-2 absolute bottom-0 left-1/2 -translate-x-1/2 z-50">
            <ExeclusiveOfferIcon />
            <span className="text-xs font-bold text-StatusDarkGreen sm:text-sm">
              عرض خاص
            </span>
          </figcaption>
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
                  src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${companyLogo}`}
                  alt="Event cover"
                  width={100}
                  height={100}
                  className="w-[50px] h-[50px] object-fill rounded-2xl border-2 border-Grey100 p-0.5"
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
              <FreeKmIcon />
              <p className="text-xs sm:text-sm">
                الكيلومترات المجانية: <strong>{freeKm} كم / اليوم</strong>
              </p>
            </div>

            {/* Price */}
            <div className="flex flex-col mt-3">
              <div className="flex items-center">
                {showTax ? (
                  <>
                    {priceBeforeOffer && priceBeforeOffer > (carPrice || 0) && (
                      <span className="text-xs text-Grey500 line-through sm:text-sm">
                        {formatPrice(priceBeforeOffer)}
                      </span>
                    )}
                    <data
                      value="10.56"
                      className="mx-2 text-sm font-bold sm:text-base"
                    >
                      {formatPrice(carPrice!)}
                    </data>
                  </>
                ) : (
                  <>
                    {priceBeforeOffer && priceBeforeOffer > (carPrice || 0) && (
                      <span className="text-xs text-Grey500 line-through sm:text-sm">
                        {formatPrice(getPriceWithoutTax(priceBeforeOffer))}
                      </span>
                    )}
                    <data
                      value="10.56"
                      className="mx-2 text-sm font-bold sm:text-base"
                    >
                      {formatPrice(getPriceWithoutTax(carPrice!))}
                    </data>
                  </>
                )}

                <p className="flex items-center text-sm sm:text-base">
                  <SaudiRiyal className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="mx-1">/ يوم</span>
                </p>
              </div>
              {/* {rentalDays && rentalDays > 0 && totalPrice && (
                <div className="text-xs font-medium text-Grey600 mt-1">
                  <span>إجمالي السعر لـ {rentalDays} أيام: </span>
                  <span className="font-bold text-foreground">
                    {totalPrice} <SaudiRiyal className="inline w-3 h-3" />
                  </span>
                </div>
              )} */}
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
