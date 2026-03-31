import Image from "next/image";
import { SaudiRiyalIcon } from "lucide-react";
import { RadioGroupItem } from "../ui/radio-group";

interface RadioOfferCardProps {
  value: string;
  title?: string;
  discount?: string;
  image?: string;
  id?: string;
}

const RadioOfferCard = ({
  value,
  title = "أستبدل نقطاتك كلها",
  discount = "10.00",
  image = "/offers/offerImage.png",
  id,
}: RadioOfferCardProps) => {
  return (
    <label
      htmlFor={id || value}
      className="border-2 border-primary w-full flex justify-between items-center gap-5 rounded-2xl relative overflow-hidden h-[90px] cursor-pointer hover:bg-Grey50 transition-all duration-300 group"
    >
      <div>
        <RadioGroupItem
          value={value}
          id={id || value}
          className="w-6 h-6 border-2 border-Grey300 data-[state=checked]:border-primary data-[state=checked]:text-primary shrink-0"
        />
      </div>
      {/* <div className="">
        <p className="text-base font-bold text-Grey900 truncate mb-1">
          {title}
        </p>
        <p className="flex items-center text-sm">
          <span className="text-Grey600">وفر:</span>
          <span className="mx-2 text-primary font-bold text-lg">
            {discount}
          </span>
          <SaudiRiyalIcon className="w-5 h-5 text-primary" />
        </p>
      </div> */}

      <div className="relative w-[100px] h-full overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt="offer"
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </label>
  );
};

export default RadioOfferCard;
