import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { CompanyService } from "@/types/companyCars/carServices";
import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { calculateServicePrice } from "@/lib/utils/calculateServicePrice";

interface ServiceCardProps {
  service: CompanyService;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const rentalDays =
    useBookedCarDetailsStore((state) => state.formData.rentalDays) || 1;

  const calculatedPrice = useMemo(
    () => calculateServicePrice(service, rentalDays),
    [service, rentalDays],
  );

  return (
    <div className="rounded-2xl w-fill flex overflow-hidden relative border-2 border-white">
      <div className="relative w-[30%] h-[92PX]">
        <Image src={"/cars/car1.png"} fill alt="" className="object-contain " />
      </div>
      <div className="bg-white w-[70%] p-2">
        <div className="">
          <p className="font-extrabold text-base">
            {service.serviceArabicName}
          </p>
          <div className="flex mt-3 items-center">
            <span className="font-bold text-lg">
              {formatPrice(calculatedPrice)}
            </span>
            <span className="mx-1">
              <SaudiRiyal />
            </span>
            {service.csType === "everyday" && (
              <span className="text-sm text-Grey500">
                {rentalDays > 1 ? `( لـ ${rentalDays} يوم )` : "/ اليوم"}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="bg-gray-100 absolute left-0 -top-1 p-2 rounded-r-xl font-bold">
        خارج المدينة
      </p>
    </div>
  );
};

export default ServiceCard;
