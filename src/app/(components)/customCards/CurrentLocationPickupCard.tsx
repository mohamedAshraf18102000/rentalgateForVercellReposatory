import Image from "next/image";
import { Button, Input } from "@/app/(components)";
import { MapPin } from "lucide-react";

const CurrentLocationPickupCard = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <div className="w-full px-4 md:px-0">
      <div className="bg-white w-full max-w-5xl mt-6 md:mt-10 mx-auto rounded-[18px] grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-xl border-2 border-white min-h-[350px]">
        <div className="relative h-48 md:h-full min-h-[250px]">
          <Image
            src="/pickupCard/currentLocation.png"
            alt="bgApp2"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full">
            <h3 className="font-bold text-xl md:text-2xl text-center md:text-right">
              {title}
            </h3>
            <p className="text-Grey700 text-sm md:text-base font-normal mt-3 md:mt-4 text-center md:text-right">
              {description}
            </p>

            <div className="mt-6 md:mt-8">
              <label className="text-sm md:text-base font-normal text-primary block text-right mb-2">
                حدد موقع أستلام السيارة:
              </label>
              <Input
                className="text-sm! md:text-base! rounded-xl"
                type="search"
                placeholder="أدخل العنوان..."
                startIcon={
                  <MapPin className="w-5! h-5! md:w-6! md:h-6! text-primary" />
                }
              />

              <div className="flex justify-center md:justify-end">
                <Button
                  onClick={onClick}
                  className="text-sm md:text-base font-normal mt-5 md:mt-6 w-full md:w-auto"
                >
                  إظهار النتائج
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentLocationPickupCard;
