import { Badge } from "@/app/(components)/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/(components)/ui/card";
import Image from "next/image";
import { SaudiRiyal } from "lucide-react";
import RoundedRec from "../../../../../public/shared/RoundedRec";
import ExeclusiveOfferIcon from "../../../../../public/shared/ExeclusiveOfferIcon";
import FreeKmIcon from "../../../../../public/shared/FreeKmIcon";
import StarIcon from "../../../../../public/shared/starIcon";

const CarsCard = () => {
  return (
    <article className="">
      <Card className="relative mx-auto w-full max-w-sm pt-0 rounded-[18px] hover:shadow-lg transition-all duration-300 border-0! ring-0 hover:ring-1 cursor-pointer">
        {/* Car Image */}
        <figure className="relative z-20 bg-Grey100 rounded-b-[18px]">
          <img
            src="/cars/car1.png"
            alt="سيارة للإيجار"
            className="relative z-20 mt-10 w-full object-cover scale-90"
          />

          <Badge className="text-sm font-bold absolute top-0 -right-2 bg-StatusGreen text-StatusDarkGreen p-4">
            خصم 20%
          </Badge>

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
            <h3 className="w-3/4 text-base">
              أسم و نوع السيارة و ممكن يبقى أكتر من كده
            </h3>

            <Badge className="text-sm font-bold" variant="secondary">
              SUV
            </Badge>
          </CardTitle>

          {/* Brand & Rating */}
          <CardContent className="p-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Image
                  src="/cars/car1.png"
                  alt="Event cover"
                  width={100}
                  height={100}
                  className="w-[50px] h-[50px] object-contain rounded-2xl border-2 border-Grey100 p-0.5"
                />
                <span className="text-base">الغزال</span>
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
          </CardContent>
        </CardHeader>
      </Card>
    </article>
  );
};

export default CarsCard;
