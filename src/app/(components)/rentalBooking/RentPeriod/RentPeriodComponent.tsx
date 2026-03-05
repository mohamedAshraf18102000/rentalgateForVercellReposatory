import Image from "next/image";
import { PeriodSearchTabs } from "./PeriodSearchTabs";
import { Button } from "../../ui/button";
import { useState } from "react";

interface RentPeriodComponentProps {
  value: "daily" | "weekly" | "monthly" | "yearly";
  onValueChange: (value: "daily" | "weekly" | "monthly" | "yearly") => void;
}

const RentPeriodComponent = ({
  value,
  onValueChange,
}: RentPeriodComponentProps) => {
  const [searchType, setSearchType] = useState(value);

  return (
    <div className="h-full rounded-2xl! overflow-hidden">
      <div className="relative h-[50%] overflow-hidden">
        <Image
          src="/rentalSearch/img1.webp"
          alt="bgApp2"
          fill
          className="object-cover w-full h-full"
        />
      </div>
      <div className="bg-white h-[50%] p-2 text-center pt-4 ">
        <h4 className="font-bold text-2xl mb-3">أبحث بمدة الإيجار</h4>
        <p className="text-sm text-Grey700 mb-3">
          اختر المدة اللي تناسب احتياجك، وإحنا نسهّل عليك البحث
        </p>
        <PeriodSearchTabs value={searchType} onValueChange={setSearchType} />

        <Button className="mt-4 text-sm">إظهار النتائج</Button>
      </div>
    </div>
  );
};

export default RentPeriodComponent;
