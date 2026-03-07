import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import { Separator } from "@/app/(components)/ui/separator";
import { Input } from "@/app/(components)/ui/input";
import { ArrowLeft, Funnel, MapPin, Search, UserRound } from "lucide-react";
import PositioningIcon from "@/constants/icons/PositioningIcon";
import { Button, Checkbox } from "@/app/(components)";

const BookCars = () => {
  return (
    <section className="mt-[60px]">
      <div className=" w-full">
        <div className="flex items-center gap-2">
          <Checkbox
            className="rounded-[7px]"
            width={25}
            height={25}
            id="rememberMe"
            checked={true}
          />
          <label htmlFor="rememberMe" className="text-base font-bold">
            عرض الأسعار بالضريبة
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="p-5 bg-white w-[70%] shadow-xl rounded-2xl flex items-end gap-4">
          <Input
            labelIcon={<PositioningIcon />}
            id="name"
            type="text"
            placeholder="ادخل الاسم"
            label="مكان الأستلام:"
            className="bg-white! border-2! border-Grey400! rounded-xl!"
            labelClassName="text-base text-primary"
            startIcon={<UserRound className="text-primary" />}
          />
          <Input
            labelIcon={<PositioningIcon />}
            id="name"
            type="text"
            placeholder="ادخل الاسم"
            label="مكان الأستلام:"
            className="bg-white! border-2! border-Grey400! rounded-xl!"
            labelClassName="text-base text-primary"
            startIcon={<UserRound className="text-primary" />}
          />
          <div className="">
            <ArrowLeft className="w-8 h-8" />
          </div>
          <Input
            labelIcon={<PositioningIcon />}
            id="name"
            type="text"
            placeholder="ادخل الاسم"
            className="bg-white! border-2! border-Grey400! rounded-xl!"
            labelClassName="text-base text-primary"
            startIcon={<UserRound className="text-primary" />}
          />

          <button className="border-2 border-Grey400 rounded-xl p-1.5 text-base font-bold flex items-center gap-2">
            <Funnel />
            <span>تصفية </span>
          </button>

          <Button className="w-10! h-10! p-0!">
            <Search className="w-6! h-6!" />
          </Button>
        </div>

        <div className="p-5 bg-white w-[15%] shadow-xl rounded-2xl">
          <p className="">السيارات الظاهرة:</p>
          <Separator className="my-4" />
          <div className="flex items-center justify-evenly">
            <p className="p-2 rounded-lg font-bold">12</p>
            <p className="p-2 rounded-lg ">من أصل</p>
            <p className="p-2 rounded-lg font-bold">1249 </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 mt-10">
        <CarsCard advancedCard />
        <CarsCard advancedCard />
        <CarsCard advancedCard />
        <CarsCard advancedCard />
      </div>
    </section>
  );
};

export default BookCars;
