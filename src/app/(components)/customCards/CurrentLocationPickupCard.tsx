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
    <div className="">
      <div className="bg-white w-3/4 mt-10 mx-auto rounded-[18px] grid grid-cols-2 overflow-hidden shadow-xl border-2 border-white">
        <Image
          src="/pickupCard/currentLocation.png"
          alt="bgApp2"
          width={500}
          height={400}
          className="w-full h-full"
        />
        <div className=" flex items-center justify-center">
          <div className=" w-[80%]">
            <h3 className="font-bold text-2xl">{title}</h3>
            <p className="text-Grey700 text-base font-normal mt-4">
              {description}
            </p>

            <div className="mt-8">
              <label className="text-base font-normal text-primary">
                حدد موقع أستلام السيارة:
              </label>
              <Input
                className="text-base! rounded-xl mt-2"
                type="search"
                placeholder="أدخل العنوان..."
                startIcon={<MapPin className="w-6! h-6! text-primary" />}
              />

              <div className="flex justify-end">
                <Button
                  onClick={onClick}
                  className="text-base font-normal mt-6"
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
