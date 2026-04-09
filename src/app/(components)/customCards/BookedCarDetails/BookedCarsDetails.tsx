"use client";
import Image from "next/image";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import RecieveCarIcon from "../../../../../public/profile/myBookings/RecieveCarIcon";
import BookingDateIcon from "../../../../../public/profile/myBookings/BookingDateIcon";
import { Button } from "../../ui/button";
import { ChevronLeft } from "lucide-react";
import BookedCarDetailsDrawer from "./BookedCarDetailsDrawer";
import { Reservation } from "@/types/myBookings/myBookings";

import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

const BookedCarsDetails = ({ data }: { data: Reservation }) => {
  const t = useTranslations("common");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;
  return (
    <div className=" flex min-h-[240px] rounded-2xl overflow-hidden border-2">
      <div className="w-[40%] relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${data.carImage}`}
          alt="img"
          className="object-contain scale-120 pointer-events-none"
          fill
        />
        <Badge
          className={`text-sm font-bold absolute top-0 -right-2 ${data.reservationStatus === "PAID" ? "bg-StatusGreen text-StatusDarkGreen" : "bg-StatusBrownBG text-StatusBrown200"}  p-4 rounded-none rounded-bl-2xl`}
        >
          {data.reservationStatus === "PAID" ? t("paid") : t("notPaid")}
        </Badge>
      </div>
      <div className="w-[60%] bg-white p-4">
        <div className="flex gap-5 items-center">
          <p className="w-3/4 font-bold text-sm">
            {data.carBrandEnglishName} {data.carName}
          </p>
          <p className="w-1/4 h-full bg-Grey100 text-center p-2 rounded-lg font-bold">
            {data.carCategoryEnglishName}
          </p>
        </div>
        <Separator className="my-4" />
        <div className="">
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <RecieveCarIcon />
              <span>{t("pickupTime")}:</span>
            </div>
            <span>
              {format(new Date(data.startDate), "yyyy/MM/dd | hh:mm a", {
                locale: dateLocale,
              })}
            </span>
          </div>

          <div className="flex gap-2 justify-between mt-3">
            <div className="flex gap-2">
              <BookingDateIcon />
              <span>{t("dropoffTime")}:</span>
            </div>
            <span>
              {format(new Date(data.endDate), "yyyy/MM/dd | hh:mm a", {
                locale: dateLocale,
              })}
            </span>
          </div>

          <div className="flex gap-2 justify-between mt-3">
            <div className="flex gap-2">
              <BookingDateIcon />
              <span>{t("pickupLocation")}</span>
            </div>
            <span>{t(`receiveTypes.${data.receiveType}`)}</span>
          </div>
        </div>
        <Separator className="my-4" />

        <div className="p-2 flex justify-between">
          <div>
            <span className="text-Grey700">{t("bookingNumber")}:</span>
            <span className="font-bold text-lg mx-2">{data.reservationId}</span>
          </div>
          <BookedCarDetailsDrawer
            data={{
              id: "860",
              name: "أسم السيارة وسنة الصنع و ممكن يبقى أكتر من كده",
              image: "/banner_ar.png",
              category: "SUVs",
              pickupLocation: "السعودية، مكة، تفاصيل الم",
              bookingDate: "السعودية، مكة، تفاصيل الم",
              bookingNumber: "860",
            }}
            trigger={
              <Button
                variant="outline"
                className="text-base!"
                icon={<ChevronLeft className="w-8 h-8" />}
              >
                {t("viewDetails")}
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BookedCarsDetails;
