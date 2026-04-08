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
  title = "LOREM",
  discount = "LOREM",
  image = "/offers/offerImage.png",
  id,
  isBlurred = false,
  titleClassname,
}: RadioOfferCardProps) => {
  return (
    <label
      htmlFor={id || value}
      className={`border-2 border-primary w-full flex justify-between items-center rounded-2xl relative overflow-hidden h-[90px] cursor-pointer transition-all duration-300 group ${
        isBlurred
          ? "opacity-30 blur-[1px] pointer-events-none"
          : "hover:bg-Grey50"
      }`}
    >
      <div className="w-full h-full flex items-center gap-3">
        <div className="relative w-[100px] h-full overflow-hidden bg-gray-200">
          <Image
            src={image}
            alt="offer"
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex items-center h-full">
          <div className="">
            <p
              className={`text-base font-bold text-Grey900 truncate mb-1 ${titleClassname}`}
            >
              {title}
            </p>
            <div className="flex items-center gap-1 w-full">
              <span className="text-gray-600 text-base!">وفر</span>
              <span className="text-gray-600 text-base!"> :</span>
              <div className="flex items-center">
                <span className="font-bold">{discount}</span>
                <SaudiRiyal className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-3">
        <RadioGroupItem
          value={value}
          id={id || value}
          className="w-6 h-6 border-2 border-Grey300 data-[state=checked]:border-primary data-[state=checked]:text-primary shrink-0"
        />
      </div>
    </label>
  );
};

export default RadioOfferCard;
