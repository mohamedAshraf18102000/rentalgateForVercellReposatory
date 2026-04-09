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

const UserBookingsDetails = () => {
  const {
    userData: storeUserData,
    authenticated,
    isClient,
    isLoading,
  } = useAuth();
  const [status, setStatus] =
    useState<UserReservationsPaylod["localStatus"]>("current");
  const { data: reservationsData, isPending } = useGetUserReservations({
    localStatus: status,
  });

  return (
    <>
      <div className="my-5 flex gap-4">
        <div className="bg-white w-1/2 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="relative w-[56px] h-[56px] rounded-lg overflow-hidden">
              <Image src="/banner_ar.png" alt="" fill />
            </div>
            <div>
              <p className="font-bold text-lg">
                أهلاً {isClient ? storeUserData?.clientName : "..."}
              </p>
              <p className="text-sm">
                قُم بتحديث بياناتك الشخضية و ضبط الأعدادات
              </p>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="">
            <p className="font-bold text-lg">حجوزاتي</p>
            <p className="text-sm text-Grey700">عرض جميع الحجوزات </p>
            <div className="mt-4">
              <BookingsStatus value={status} onValueChange={setStatus} />
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl flex flex-col items-center">
          <img
            src="/profile/actionIcons/bookings.webp"
            alt="img"
            className="w-[80px] h-[80px]"
          />
          <Separator className="my-4" />
          <div className="text-center">
            <p className="font-bold">عدد الحجوزات المعروضة</p>
            <PaginationDateView
              shown={isClient ? String(reservationsData?.length) : "0"}
              total={isClient ? String(reservationsData?.length) : "0"}
              className="mt-3"
              loading={isPending}
            />
          </div>
        </div>
      </div>
      <div className=" w-full grid grid-cols-2 gap-4">
        {!isClient || isPending
          ? Array.from({ length: 4 }).map((_, index) => (
              <BookingCardSkeleton key={index} />
            ))
          : reservationsData?.map((item) => (
              <BookedCarsDetails key={item.reservationId} data={item} />
            ))}
      </div>
    </>
  );
};

export default UserBookingsDetails;
