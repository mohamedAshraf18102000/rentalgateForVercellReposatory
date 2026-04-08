import Image from "next/image";
import { RadioGroupItem } from "../ui/radio-group";
import { SaudiRiyal } from "lucide-react";

interface RadioOfferCardProps {
  value: string;
  title?: string;
  discount?: string;
  image?: string;
  id?: string;
  isBlurred?: boolean;
  titleClassname?: string;
}

const RadioOfferCard = ({
  value,
  title = "",
  discount = "",
  image = "/offers/offerImage.png",
  id,
  isBlurred = false,
  titleClassname,
}: RadioOfferCardProps) => {
  return (
    <label
      title={title}
      htmlFor={id || value}
      className={`border-2 border-primary w-full flex justify-between items-center rounded-2xl relative overflow-hidden h-20 sm:h-[90px] cursor-pointer transition-all duration-300 group ${
        isBlurred
          ? "opacity-30 blur-[1px] pointer-events-none"
          : "hover:bg-Grey50"
      } `}
    >
      <div className="flex justify-between items-center w-full h-full px-3 sm:px-4 gap-2 sm:gap-4">
        <div className="h-full flex items-center gap-2 sm:gap-3 overflow-hidden">
          <div className="relative w-16 sm:w-20 md:w-[100px] h-full overflow-hidden bg-gray-200 shrink-0">
            <Image
              src={image}
              alt="offer"
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p
              className={`text-sm sm:text-base font-bold text-Grey900 truncate mb-0.5 sm:mb-1 ${titleClassname}`}
            >
              {title}
            </p>
            <div className="flex items-center gap-1 w-full text-xs sm:text-sm">
              <span className="text-gray-600">وفر</span>
              <span className="text-gray-600"> :</span>
              <div className="flex items-center">
                <span className="font-bold">{discount}</span>
                <SaudiRiyal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 flex items-center">
          <RadioGroupItem
            value={value}
            id={id || value}
            className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-Grey300 data-[state=checked]:border-primary data-[state=checked]:text-primary"
          />
        </div>
      </div>
    </label>
  );
};

export default RadioOfferCard;
