import OffersCard from "@/app/(components)/customCards/OffersCard";
import { LucideEqualApproximately, SaudiRiyal } from "lucide-react";

const Discounts = () => {
  return (
    <div className="">
      <p className="text-base font-bold mb-2"> القسائم و الخصومات:</p>
      <div className="w-fit bg-StatusGreen px-3 py-1 rounded-lg font-bold text-StatusDarkGreen border-2 border-StatusDarkGreen flex items-center">
        <span>لديك 7539 نقطة</span>
        <LucideEqualApproximately className="mx-2" />
        <span>9000</span>
        <SaudiRiyal className="mx-1" />
      </div>
    </div>
  );
};

export default Discounts;
