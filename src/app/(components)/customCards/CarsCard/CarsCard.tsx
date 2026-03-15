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

interface carsCard {
  advancedCard?: boolean;
  extraBadgeTitle?: string;
  firstBadgeColor?: "green" | "red";
  extraBadgeColor?: "green" | "red";
  extraContent?: React.ReactNode;

  carImage?: string;
  carName?: string;
  carBrand?: string;
  companyLogo?: string;
  companyName?: string;
  deliveryInMinutes?: number;
}

const CarsCard = ({
  advancedCard,
  extraBadgeTitle,
  firstBadgeColor,
  extraBadgeColor,
  extraContent,
  carImage,
  carName,
  carBrand,
  companyName,
  companyLogo,
  deliveryInMinutes,
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
            className="relative z-20 mt-10 w-full object-cover scale-90 min-h-[210px] max-h-[210px]"
          />
            {/* {typeof deliveryInMinutes === "number" && deliveryInMinutes >= 0 && (
              <Badge
                className={`text-sm font-bold absolute top-0 -right-2  p-4 ${firstBadgeColor === "red" ? "bg-StatusBrownBG text-StatusBrown200" : "bg-StatusGreen text-StatusDarkGreen"}`}
              >
                تصل خلال {deliveryInMinutes} دقيقة
              </Badge>
            )} */}

          {extraBadgeTitle && (
            <Badge
              className={`text-sm font-bold z-50 absolute top-10 -right-2  p-4 ${extraBadgeColor === "red" ? "bg-StatusBrownBG text-StatusBrown200" : "bg-StatusGreen text-StatusDarkGreen"}`}
            >
              {extraBadgeTitle}
            </Badge>
          )}

          <RoundedRec className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50" />

          <figcaption className="flex items-center gap-2 absolute bottom-0 left-1/2 -translate-x-1/2 z-50">
            <ExeclusiveOfferIcon />
            <span className="text-sm font-bold text-StatusDarkGreen">
              عرض خاص
            </span>
          </figcaption>
        </figure>

        <CardHeader className="mt-5">
          <CardTitle className="font-bold flex justify-between items-start">
            <h3 className="w-3/4 text-base">{carName}</h3>

            <Badge className="text-sm font-bold" variant="secondary">
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
                <span className="text-base">{companyName}</span>
              </div>

              <div className="flex items-center gap-1">
                <data value="4.2" className="font-bold text-base">
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
              <p className="text-sm">
                الكيلومترات المجانية: <strong>350 كم / اليوم</strong>
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center mt-3">
              <span className="line-through text-sm text-Grey500">15.00</span>

              <data value="10.56" className="text-base mx-2 font-bold">
                10.56
              </data>

              <p className="flex items-center text-base">
                <SaudiRiyal className="w-5 h-5" />
                <span>/ يوم</span>
              </p>
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
