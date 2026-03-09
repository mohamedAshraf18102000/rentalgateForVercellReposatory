import RoundedRec from "@/constants/icons/RoundedRec";
import { Badge } from "../../ui/badge";
import ExeclusiveOfferIcon from "@/constants/icons/ExeclusiveOfferIcon";
import Image from "next/image";
import { StarIcon } from "@/constants/icons";
import { ChevronLeft, Dot, Flame, SaudiRiyal } from "lucide-react";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import FreeKmIcon from "@/constants/icons/FreeKmIcon";
import UnlimitedKmIcon from "@/constants/icons/UnlimitedKmIcon";

const CarDetailsCard = () => {
  return (
    <section className="mt-5 flex w-full rounded-[18px] overflow-hidden border-2 border-white shadow-xl">
      <div className="w-[40%] overflow-hidden">
        <figure
          className={`relative overflow-hidden h-full transition-all duration-300 `}
        >
          <img
            src="/cars/car1.png"
            alt="سيارة للإيجار"
            className="relative z-20 w-full object-contain scale-85 mt-20 mb-5"
          />

          <Badge className="text-sm font-bold absolute top-0 -right-2 bg-StatusGreen text-StatusDarkGreen p-4">
            خصم 20%
          </Badge>

          <div className="flex justify-between absolute top-12  items-center gap-4 bg-white rounded-l-[18px] w-fit p-1">
            <div className="flex items-center gap-1">
              <Image
                src="/cars/car1.png"
                alt="Event cover"
                width={100}
                height={100}
                className="w-[45px] h-[45px] object-contain rounded-2xl border-2 border-Grey100 p-0.5"
              />
              <span className="text-base mx-1">الغزال</span>
            </div>

            <div className="flex items-center gap-1">
              <data value="4.2" className="text-base">
                4.2
              </data>
              <StarIcon />
            </div>
          </div>

          <RoundedRec className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50" />

          <figcaption className="flex items-center gap-2 absolute bottom-0 left-1/2 -translate-x-1/2 z-50">
            <ExeclusiveOfferIcon />
            <span className="text-sm font-bold text-StatusDarkGreen">
              عرض خاص
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="w-[60%] p-6 bg-white">
        <div className="flex items-center justify-between w-full text-base">
          <div className="flex items-center">
            <span>السعر شامل الضريبة:</span>
            <span className="text-Grey500 line-through mx-1">150</span>
            <span className="font-bold">200</span>
            <SaudiRiyal />
            <span>/ يوم</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="text-base!"
              icon={<ChevronLeft className="w-8 h-8" />}
            >
              حجز للغير
            </Button>
            <Button
              className="text-base!"
              icon={<ChevronLeft className="w-8 h-8" />}
            >
              أحجزها الآن
            </Button>
          </div>
        </div>

        <Separator className="my-3" />
        <div className="flex items-center justify-between gap-2 font-bold">
          <p>أسم السيارة وسنة الصنع و ممكن يبقى أكتر من كده</p>
          <div className="p-2 bg-Grey100 rounded-[12px] w-fit">SUV</div>
        </div>
        <Separator className="my-3" />
        <div>
          <p>مواصفات السيارة:</p>
          <div className=" w-full p-2 grid grid-cols-2 gap-2 mt-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center text-Grey700 text-base"
              >
                <Dot />
                <p>مكيفة</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-2 gap-2 justify-between items-center">
          <div className="flex items-center gap-1">
            <FreeKmIcon />
            <p className="text-sm">
              الكيلومترات المجانية:
              <strong>350 كم / اليوم</strong>
            </p>
          </div>

          <div className="flex items-center gap-1">
            <FreeKmIcon />
            <p className="text-sm">
              تكلفة الكيلو متر الزيادة:
              <strong>350 كم / اليوم</strong>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-1">
            <UnlimitedKmIcon />
            <p className="text-sm">
              عدد كيلومترات لا نهائي:
              <strong>350 كم / اليوم</strong>
            </p>
            <p className="text-sm p-2 bg-StatusBrownBG rounded-[8px] text-StatusBrown200 font-bold flex items-center gap-1">
              <Flame />
              <span>قيادة بلا نهاية</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarDetailsCard;
