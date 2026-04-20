import Image from "next/image";
import { PeriodSearchTabs } from "./PeriodSearchTabs";
import {
  useUserPreferedFiltersStore,
  RentPeriod,
} from "@/lib/stores/useUserPreferedFiltersStore";
import { Info } from "lucide-react";

const RentPeriodComponent = () => {
  const { filters, setFilter } = useUserPreferedFiltersStore();

  return (
    <div className="h-[480px] md:h-full rounded-2xl! overflow-hidden shadow-lg border-2 border-white">
      <div className="relative h-[200px] md:h-[50%] overflow-hidden">
        <Image
          src="/rentalSearch/img1.webp"
          alt="bgApp2"
          fill
          className="object-cover"
        />
      </div>
      <div className="bg-white h-[280px] md:h-[50%] p-4 text-center">
        <h4 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 whitespace-nowrap">
          أبحث بمدة الإيجار
        </h4>
        <p className="text-sm text-Grey700 mb-3">
          اختر المدة اللي تناسب احتياجك، وإحنا نسهّل عليك البحث
        </p>
        <PeriodSearchTabs
          value={filters.rentPeriod}
          onValueChange={(value) =>
            setFilter("rentPeriod", value as RentPeriod)
          }
        />

        <div className="bg-primary w-[60%] mx-auto mt-3 text-white text-center rounded-[8px] text-sm flex items-center justify-center gap-2 py-2">
          <Info size={20} />
          <span>الإيجار السنوي لا ينتهي بالتمليك</span>
        </div>
      </div>
    </div>
  );
};

export default RentPeriodComponent;
