import Image from "next/image";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import RecieveCarIcon from "../../../../public/profile/myBookings/RecieveCarIcon";
import BookingDateIcon from "../../../../public/profile/myBookings/BookingDateIcon";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

const BookedCarsDetails = () => {
  return (
    <div className=" flex min-h-[240px] rounded-2xl overflow-hidden ">
      <div className="w-[40%]  relative">
        <Image src="/banner_ar.png" alt="img" fill />
        <Badge className="text-sm font-bold absolute top-0 -right-2 bg-StatusBrownBG text-StatusBrown200  p-4 rounded-none rounded-bl-2xl">
          تصل خلال 20 دقيقة
        </Badge>
      </div>
      <div className="w-[60%] bg-white p-4">
        <div className="flex gap-5 items-center">
          <p className="w-3/4 font-bold text-sm">
            أسم السيارة وسنة الصنع و ممكن يبقى أكتر من كده
          </p>
          <p className="w-1/4 h-full bg-Grey100 text-center p-2 rounded-lg">
            SUVs
          </p>
        </div>
        <Separator className="my-4" />
        <div className=" h-16">
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <RecieveCarIcon />
              <span>مكان الأستلام:</span>
            </div>
            <span>السعودية، مكة، تفاصيل الم</span>
          </div>

          <div className="flex gap-2 justify-between mt-3">
            <div className="flex gap-2">
              <BookingDateIcon />
              <span>مكان الأستلام:</span>
            </div>
            <span>السعودية، مكة، تفاصيل الم</span>
          </div>
        </div>
        <Separator className="my-4" />

        <div className="p-2 flex justify-between">
          <div>
            <span className="text-Grey700">رقم الحجز:</span>
            <span className="font-bold text-lg mx-2">860</span>
          </div>
          <Button
            variant="outline"
            className="text-base!"
            icon={<ChevronLeft className="w-8 h-8" />}
          >
            عرض التفاصيل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookedCarsDetails;
