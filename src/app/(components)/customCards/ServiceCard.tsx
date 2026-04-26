import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { CompanyService } from "@/types/companyCars/carServices";
import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { calculateServicePrice } from "@/lib/utils/calculateServicePrice";
import { getPriceWithoutTax } from "@/lib/utils/getPriceWithoutTax";
import { useLocale, useTranslations } from "next-intl";

interface ServiceCardProps {
  service: CompanyService;
  showTax: boolean;
}

const ServiceCard = ({ service, showTax }: ServiceCardProps) => {
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const rentalDays =
    useBookedCarDetailsStore((state) => state.formData.rentalDays) || 1;

  const calculatedPrice = useMemo(
    () => calculateServicePrice(service, rentalDays),
    [service, rentalDays],
  );

  return (
    <div className="relative flex min-h-[92px] overflow-hidden rounded-2xl border-2 border-white">
      <div className="relative w-[30%] min-w-[90px] sm:min-w-[110px]">
        <Image src={"/cars/car1.png"} fill alt="" className="object-contain " />
      </div>
      <div className="w-[70%] bg-white p-2 sm:p-3">
        <div className="">
          <p className="text-sm font-extrabold sm:text-base">
            {locale === "ar" ? service.serviceArabicName : service.serviceEnglishName}
          </p>
          <div className="mt-2 flex flex-wrap items-center sm:mt-3">
            <span className="text-base font-bold sm:text-lg">
              {showTax
                ? formatPrice(calculatedPrice)
                : formatPrice(getPriceWithoutTax(calculatedPrice))}
            </span>
            <span className="mx-1">
              <SaudiRiyal />
            </span>
            {service.csType === "everyday" && (
              <span className="text-sm text-Grey500">
                {rentalDays > 1
                  ? t("forRentalDays", { days: rentalDays })
                  : t("perDayLabel")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
