import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import {
  ServiceCardBase,
  ServicePriceInput,
} from "@/types/companyCars/carServices";
import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { calculateServicePrice } from "@/lib/utils/calculateServicePrice";
import { getPriceWithoutTax } from "@/lib/utils/getPriceWithoutTax";
import { useLocale, useTranslations } from "next-intl";

interface ServiceCardProps<T extends ServiceCardBase = ServiceCardBase> {
  extraIcon?: React.ReactNode | null;
  service: T;
  showTax: boolean;
}

function ServiceCard<T extends ServiceCardBase>({
  service,
  showTax,
  extraIcon = null,
}: ServiceCardProps<T>) {
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const rentalDays =
    useBookedCarDetailsStore((state) => state.formData.rentalDays) || 1;

  const calculatedPrice = useMemo(() => {
    if ("csType" in service && "priceType" in service) {
      return calculateServicePrice(service as ServicePriceInput, rentalDays);
    }
    return service.price;
  }, [service, rentalDays]);

  const serviceName =
    locale === "ar" ? service.serviceArabicName : service.serviceEnglishName;

  return (
    <div className="relative flex min-h-[92px] overflow-hidden rounded-2xl border-2 border-white">
      {extraIcon === null ? (
        <div className="relative w-[30%] min-w-[90px] sm:min-w-[110px]">
          <Image
            src={"/cars/services/serviceIcon.webp"}
            fill
            alt=""
            className="object-fill"
          />
        </div>
      ) : (
        <div className="relative w-[30%] min-w-[90px] sm:min-w-[110px] flex items-center justify-center">
          {extraIcon}
        </div>
      )}
      <div className="w-[70%] bg-white p-2 sm:p-3 flex items-center">
        <div className="">
          <p className="text-sm font-extrabold sm:text-base">{serviceName}</p>
          <div className="mt-2 flex flex-wrap items-center sm:mt-3">
            {service.price !== 0 && (
              <>
                <span className="text-base font-bold sm:text-lg">
                  {showTax
                    ? formatPrice(calculatedPrice)
                    : formatPrice(getPriceWithoutTax(calculatedPrice))}
                </span>
                <span className="mx-1">
                  <SaudiRiyal />
                </span>
              </>
            )}
            {"csType" in service && service.csType === "everyday" && (
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
}

export default ServiceCard;
