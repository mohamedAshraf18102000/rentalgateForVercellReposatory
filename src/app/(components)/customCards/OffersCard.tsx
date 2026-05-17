import { OfferPackage } from "@/types/companyCars/carDetails";
import { Badge } from "../ui/badge";
import Image from "next/image";

type TofferPackageProps = {
  offerPackage: OfferPackage;
  className?: string;
  warningAvailable?: boolean;
  warnToTakeOfferDate?: string;
};

const OffersCard = ({
  offerPackage,
  warnToTakeOfferDate,
  warningAvailable,
}: TofferPackageProps) => {
  return (
    <div className="border-2 w-full flex items-end rounded-2xl relative overflow-hidden min-h-[100px] sm:min-h-[100px] bg-white">
      {/* Badge */}
      <Badge className="text-xs sm:text-sm font-bold absolute top-0 -left-2 z-10 bg-StatusGreen text-StatusDarkGreen px-3 py-2 sm:p-4 rounded-none rounded-br-2xl leading-tight">
        {offerPackage.extraDays} {offerPackage.extraDays > 1 ? "أيام" : "يوم"}{" "}
        مجاناً
      </Badge>

      {/* Image Section */}
      <div className="relative w-1/3 sm:w-[35%] shrink-0 bg-Grey100 self-stretch min-h-[80px] sm:min-h-[80px]">
        <Image
          src="/offers/offerImage.png"
          alt="offer"
          fill
          className="object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 flex-1 min-w-0">
        <p className="text-sm sm:text-base font-normal block mt-6!">
          <span>
            احجز{" "}
            <span className="font-bold">
              {offerPackage.days} {offerPackage.days > 1 ? "أيام" : "يوم"}{" "}
            </span>{" "}
            و
          </span>
          احصل علي
          <span className="font-bold">
            {" "}
            {offerPackage.extraDays}{" "}
            {offerPackage.extraDays > 1 ? "أيام" : "يوم"} مجاناً
          </span>
        </p>

        {warningAvailable && (
          <span className="text-xs font-semibold text-StatusDarkGreen">
            <span> للاستفادة من العرض اختر تاريخ الانتهاء حتي</span>{" "}
            <span className="font-extrabold">{warnToTakeOfferDate}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default OffersCard;
