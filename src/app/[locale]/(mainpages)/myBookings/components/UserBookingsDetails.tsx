"use client";
import { Separator } from "@/app/(components)/ui/separator";
import Image from "next/image";
import { BookingsStatus } from "./BookingsStatus";
import PaginationDateView from "@/app/(components)/PaginationDateView";
import BookedCarsDetails from "@/app/(components)/customCards/BookedCarDetails/BookedCarsDetails";
import { useGetUserReservations } from "@/hooks/api/useGetUserReservations";

import { useState } from "react";
import { UserReservationsPaylod } from "@/types/myBookings/myBookings";
import BookingCardSkeleton from "./BookingCardSkeleton";
import { useAuth } from "@/app/(components)/navbar/hooks/useAuth";
import { useTranslations } from "next-intl";

const UserBookingsDetails = () => {
  const t = useTranslations("profile");
  const { userData: storeUserData, isClient } = useAuth();
  const [status, setStatus] =
    useState<UserReservationsPaylod["localStatus"]>("current");
  const { data: reservationsData, isPending } = useGetUserReservations({
    localStatus: status,
  });

  return (
    <>
      <div className="my-5 flex min-w-0 flex-col gap-3 sm:gap-4 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1 rounded-2xl bg-white p-4 sm:p-5">
          <div className="flex items-start gap-3 sm:items-center">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg sm:h-[56px] sm:w-[56px]">
              <Image src="/banner_ar.png" alt="" fill />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold sm:text-lg">
                {t("profilePage.greeting", {
                  name: isClient ? (storeUserData?.clientName ?? "...") : "...",
                })}
              </p>
              <p className="text-sm">
                {t("myBookingsPage.updateAndSettingsHint")}
              </p>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="">
            <p className="font-bold text-lg">{t("myBookingsPage.title")}</p>
            <p className="text-sm text-Grey700">
              {t("myBookingsPage.showAllBookings")}
            </p>
            <div className="mt-4">
              <BookingsStatus value={status} onValueChange={setStatus} />
            </div>
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col items-center rounded-2xl bg-white p-4 sm:p-5 lg:w-auto lg:min-w-[280px] lg:flex-[0_1_280px]">
          <img
            src="/profile/actionIcons/bookings.webp"
            alt={t("myBookingsPage.bookingsImageAlt")}
            className="h-16 w-16 sm:h-[80px] sm:w-[80px]"
          />
          <Separator className="my-4" />
          <div className="text-center">
            <p className="font-bold">
              {t("myBookingsPage.shownBookingsCount")}
            </p>
            <PaginationDateView
              shown={isClient ? String(reservationsData?.length) : "0"}
              total={isClient ? String(reservationsData?.length) : "0"}
              className="mt-3"
              loading={isPending}
            />
          </div>
        </div>
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        {!isClient || isPending ? (
          Array.from({ length: 4 }).map((_, index) => (
            <BookingCardSkeleton key={index} />
          ))
        ) : reservationsData && reservationsData.length > 0 ? (
          reservationsData.map((item) => (
            <BookedCarsDetails key={item.reservationId} data={item} />
          ))
        ) : (
          <>
            <div className="col-span-full flex h-[350px] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center text-sm text-Grey700 sm:text-base">
              <img
                src="/notFound/notFound.webp"
                alt={t("myBookingsPage.noReservationsFoundAlt")}
                className="w-[250px] h-[250px] "
              />
              <span className="text-base mt-3">
                {t("myBookingsPage.noReservationsFound")}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserBookingsDetails;
