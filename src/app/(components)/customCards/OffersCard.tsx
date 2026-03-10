import { Badge } from "../ui/badge";
import Image from "next/image";
import { SaudiRiyalIcon } from "lucide-react";

const OffersCard = () => {
  return (
    <div className="border-2 w-full flex items-end gap-5 rounded-2xl relative overflow-hidden">
      <Badge className="text-sm font-bold absolute top-0 -left-2 bg-StatusGreen text-StatusDarkGreen  p-4 rounded-none rounded-br-2xl">
        يومين مجاناً
      </Badge>
      <div className="relative w-[40%] h-32 bg-Grey100">
        <Image src="/offers/offerImage.png" alt="offer" fill />
      </div>
      <div className="relative w-[60%]">
        <p>أحجز أسبوع</p>
        <p className="flex items-center my-5">
          <span className="text-Grey600">وفر:</span>
          <span className="mx-2">10.00 </span>
          <SaudiRiyalIcon className="text-StatusDarkGreen!" />
        </p>
      </div>
    </div>
  );
};

export default OffersCard;
