import { CompanyService } from "@/types/companyCars/carServices";
import { SaudiRiyal } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
  service: CompanyService;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
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
          <div className="flex mt-3">
            <span>{service.price}</span>
            <span>
              <SaudiRiyal />
            </span>
            <span>/كم</span>
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
