import React from "react";
import Image from "next/image";
import { Button } from "@/app/(components)/ui/button";
import { Separator } from "@/app/(components)/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/(components)/ui/sheet";
import { Badge } from "../../ui/badge";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import {
  ArrowLeft,
  Dot,
  MapPin,
  Minus,
  SaudiRiyal,
  SaudiRiyalIcon,
  SquarePen,
} from "lucide-react";
import BookingPaymentDetailsCollapse from "./DrawerSections/BookingPaymentDetailsCollapse";

interface BookedCarDetailsDrawerProps {
  trigger?: React.ReactNode;
  data?: {
    id: string;
    name: string;
    image: string;
    category: string;
    pickupLocation: string;
    bookingDate: string;
    bookingNumber: string;
  };
}

const BookedCarDetailsDrawer = ({
  trigger,
  data,
}: BookedCarDetailsDrawerProps) => {
  return (
    <Sheet>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        dir="rtl"
        className="flex flex-col p-0 sm:max-w-[45%] w-full"
      >
        <SheetHeader className="text-start! mt-10 px-6 ">
          <SheetTitle>تفاصيل الحجز</SheetTitle>
        </SheetHeader>
        <div className="w-[95%] mx-auto overflow-y-auto px-3">
          <div className="">
            <div className=" flex gap-2 items-center">
              <div className="relative h-34 w-[40%] rounded-2xl overflow-hidden">
                <Image src="/Card_Cars.png" fill alt="img" />
                <Badge className="text-sm font-bold absolute top-0 -right-2 bg-StatusBrownBG text-StatusBrown200  p-4 rounded-none rounded-bl-2xl">
                  تصل خلال 20 دقيقة
                </Badge>
              </div>
              <div className="flex flex-col gap-y-2">
                <div>
                  <span className="mx-2">رقم الحجز:</span>
                  <span className="font-bold text-lg">860</span>
                </div>

                <div>
                  <p className="w-fit h-full bg-Grey100 text-center px-3 py-1 rounded-lg">
                    SUVs
                  </p>
                </div>
                <p className="font-bold">
                  أسم السيارة وسنة الصنع و ممكن يبقى أكتر من كده
                </p>
              </div>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="p-3 bg-Grey100 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-base flex items-center gap-2">
                <CarRentIcon />
                <span>مدة الإيجار:</span>
                <span className="text-Grey700">(15 يوم)</span>
              </div>

              <div className="text-base flex items-center gap-2 mt-3">
                <span className="text-black">من 15-10-2025 | 6:00 صباحاً</span>

                <ArrowLeft />

                <span className="text-black">من 30-10-2025 | 6:00 مساءاً</span>
              </div>
            </div>

            <div>
              <Button className="p-3">
                <SquarePen className="text-white w-5! h-5!" />
              </Button>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="p-3 bg-Grey100 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center">
                <Dot className=" w-8 h-8 mx-2" />
                <span>من:</span>

                <span className="mx-2">
                  السعودية، أنه أطول من كده عيتكتب بالمنظرده
                </span>
              </div>
              <div className="flex items-center">
                <Minus className="rotate-90 w-8 h-8 mx-2" />
              </div>
              <div className="flex items-center">
                <MapPin className=" w-8 h-8 mx-2" />
                <span>إلـى:</span>
                <span className="mx-2">
                  السعودية، أنه أطول من كده عيتكتب بالمنظرده
                </span>
              </div>
            </div>

            <div>
              <Button className="p-3">
                <SquarePen className="text-white w-5! h-5!" />
              </Button>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="bg-StatusGreen p-2 border-2 border-StatusDarkGreen w-fit flex items-center rounded-xl font-bold">
                <span className="text-StatusDarkGreen mx-1">الخدمة:</span>
                <span>70.00</span>
                <SaudiRiyalIcon />
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <div className=" flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">أجمالي التكلفة:</p>
            </div>
            <div className="flex items-center">
              <span className="line-through mx-3 text-sm text-Grey500">
                15.00
              </span>
              <span className="text-2xl font-bold">104.17</span>
              <SaudiRiyal className="w-8! h-8!" />
            </div>
          </div>
          <BookingPaymentDetailsCollapse />
        </div>
        <SheetFooter className="p-6 border-t mt-auto ">
          <Button
            variant="destructive"
            className="text-base! w-1/4 border-2 border-StatusRed bg-transparent text-StatusRed"
          >
            إلغاء الحجز
          </Button>
          <Button className="text-base! w-3/4">عرض حجوزاتي</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BookedCarDetailsDrawer;
