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
import { useGetUserReservationById } from "@/hooks/api/useGetUserReservationById";

const BookedCarsDetails = ({ data }: { data: Reservation }) => {
  const t = useTranslations("common");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  const {
    data: reservationDetails,
    refetch,
    isFetching,
  } = useGetUserReservationById(data.reservationId, false);
  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border-2 sm:min-h-[240px] sm:flex-row">
      <div className="relative h-[200px] w-full shrink-0 sm:h-auto sm:w-[40%]">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${data.carImage}`}
          alt="img"
          className="pointer-events-none scale-120 object-contain"
          fill
        />
        <Badge
          className={`absolute top-0 -right-2 rounded-none rounded-bl-2xl p-3 text-xs font-bold sm:p-4 sm:text-sm ${data.reservationStatus === "PAID" ? "bg-StatusGreen text-StatusDarkGreen" : "bg-StatusBrownBG text-StatusBrown200"}`}
        >
          {data.reservationStatus === "PAID" ? t("paid") : t("notPaid")}
        </Badge>
      </div>
      <div className="min-w-0 flex-1 bg-white p-3 sm:w-[60%] sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <p className="min-w-0 flex-1 text-sm font-bold sm:w-3/4">
            {data.carBrandEnglishName} {data.carName}
          </p>
          <p className="shrink-0 rounded-lg bg-Grey100 p-2 text-center text-xs font-bold sm:h-full sm:w-1/4 sm:text-sm">
            {data.carCategoryEnglishName}
          </p>
        </div>
        <Separator className="my-3 sm:my-4" />
        <div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div className="flex shrink-0 gap-2">
              <RecieveCarIcon />
              <span className="text-sm">{t("pickupTime")}:</span>
            </div>
            <span className="min-w-0 wrap-break-word text-end text-xs sm:text-sm">
              {format(new Date(data.startDate), "yyyy/MM/dd | hh:mm a", {
                locale: dateLocale,
              })}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div className="flex shrink-0 gap-2">
              <BookingDateIcon />
              <span className="text-sm">{t("dropoffTime")}:</span>
            </div>
            <span className="min-w-0 wrap-break-word text-end text-xs sm:text-sm">
              {format(new Date(data.endDate), "yyyy/MM/dd | hh:mm a", {
                locale: dateLocale,
              })}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
            <div className="flex shrink-0 gap-2">
              <BookingDateIcon />
              <span className="text-sm">{t("pickupLocation")}</span>
            </div>
            <span className="min-w-0 wrap-break-word text-end text-xs sm:text-sm">
              {t(`receiveTypes.${data.receiveType}`)}
            </span>
          </div>
        </div>
        <Separator className="my-3 sm:my-4" />

        <div className="flex flex-col gap-3 p-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="text-Grey700">{t("bookingNumber")}:</span>
            <span className="mx-2 text-base font-bold sm:text-lg">
              {data.reservationId}
            </span>
          </div>
          <BookedCarDetailsDrawer
            data={reservationDetails}
            trigger={
              <Button
                variant="outline"
                className="w-full text-base! sm:w-auto"
                icon={<ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />}
                onClick={() => refetch()}
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
