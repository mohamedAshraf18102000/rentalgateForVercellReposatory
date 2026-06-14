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
import { useStatusLabel } from "@/hooks/useBookingStatusLabel";
import { normalizeImageUrl } from "@/util";
import { getStatusColor } from "@/util/bookingStatus";

const BookedCarsDetails = ({ data }: { data: Reservation }) => {
  const getStatusLabel = useStatusLabel();

  const t = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const dateLocale = locale === "ar" ? ar : enUS;

  const { data: reservationDetails, refetch } = useGetUserReservationById(
    data.reservationId,
    false,
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex min-h-0 flex-col overflow-hidden rounded-2xl border-2 sm:min-h-[240px] sm:flex-row"
    >
      <div className="relative h-[200px] w-full shrink-0 sm:h-auto sm:w-[40%] overflow-hidden">
        <Image
          src={normalizeImageUrl(data.carImage)}
          alt="img"
          className="pointer-events-none object-contain"
          fill
        />
        <Badge
          className={`absolute top-0 max-w-[calc(100%-0.5rem)] whitespace-normal wrap-break-word rounded-none p-3 text-xs leading-tight font-bold sm:p-4 sm:text-sm ${
            isRTL ? "-right-2 rounded-bl-2xl" : "-left-2 rounded-br-2xl"
          } ${getStatusColor(data.reservationStatus)}`}
        >
          {getStatusLabel(data.reservationStatus)}
        </Badge>
      </div>
      <div className="min-w-0 flex-1 bg-white p-3 sm:w-[60%] sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <p className="min-w-0 flex-1 text-sm font-bold sm:w-3/4">
            {locale === "ar" ? data.carNameAr : data.carNameEn}
          </p>
          <p className="shrink-0 rounded-lg bg-Grey100 p-2 text-center text-xs font-bold sm:h-full sm:w-1/4 sm:text-sm">
            {locale === "ar" ? data.categoryNameAr : data.categoryNameEn}
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
              {format(
                new Date(data.startDate),
                `${locale === "ar" ? "yyyy/MM/dd" : "dd/MM/yyyy"} | hh:mm a`,
                {
                  locale: dateLocale,
                },
              )}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div className="flex shrink-0 gap-2">
              <BookingDateIcon />
              <span className="text-sm">{t("dropoffTime")}:</span>
            </div>
            <span className="min-w-0 wrap-break-word text-end text-xs sm:text-sm">
              {format(
                new Date(data.endDate),
                `${locale === "ar" ? "yyyy/MM/dd" : "dd/MM/yyyy"} | hh:mm a`,
                {
                  locale: dateLocale,
                },
              )}
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
            onOpen={() => {
              void refetch();
            }}
            trigger={
              <Button
                variant="outline"
                className="w-full text-base! sm:w-auto"
                icon={
                  <ChevronLeft
                    className={`h-6 w-6 sm:h-8 sm:w-8 ${isRTL ? "" : "rotate-180"}`}
                  />
                }
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
