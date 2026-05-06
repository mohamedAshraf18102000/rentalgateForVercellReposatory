"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/app/(components)/ui/button";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import { Separator } from "@/app/(components)/ui/separator";
import {
  Sheet,
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
  ArrowRight,
  PhoneCall,
  SaudiRiyal,
  SaudiRiyalIcon,
  SquarePen,
  User,
} from "lucide-react";
import { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";
import { useLocale, useTranslations } from "next-intl";
import type { ExtendReservationDriverPayload } from "@/services/mybookings/extendReservation.service";

import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useStatusLabel } from "@/hooks/useBookingStatusLabel";
import { ReservationStatus } from "@/types/myBookings/myBookings";
import { reverseGeocode } from "@/lib/utils/reverseGeocode";
import LocationFrom_To from "./DrawerSections/locationFrom_To/LocationFrom_To";

const CancelConfirmation = dynamic(
  () => import("./DrawerSections/DrawerLocation/CancelConfirmation"),
  { ssr: false },
);

const DrawerLocationChange = dynamic(
  () => import("./DrawerSections/DrawerLocation/DrawerLocationChange"),
  { ssr: false },
);

const BookingPaymentDetailsCollapseLazy = dynamic(
  () => import("./DrawerSections/BookingPaymentDetailsCollapse"),
  { ssr: false },
);

const BookingExtending = dynamic(
  () => import("./DrawerSections/DrawerLocation/BookingExtending"),
  { ssr: false },
);

const BookingComplement = dynamic(
  () => import("./DrawerSections/DrawerLocation/BookingComplement"),
  { ssr: false },
);

interface BookedCarDetailsDrawerProps {
  trigger?: React.ReactNode;
  data?: ReservationDetailsResponse;
  onOpen?: () => void;
}

const LocationFromToSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 min-w-[260px]">
      <Skeleton className="h-4 w-56 bg-Grey200" />
      <Skeleton className="h-4 w-14 mr-8 bg-Grey200" />
      <Skeleton className="h-4 w-56 bg-Grey200" />
    </div>
  );
};

const BookedCarDetailsDrawer = ({
  trigger,
  data,
  onOpen,
}: BookedCarDetailsDrawerProps) => {
  const getStatusLabel = useStatusLabel();
  const t = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const DateArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const dateLocale = locale === "ar" ? ar : enUS;
  const [activeView, setActiveView] = useState<
    | "booking-details"
    | "cancel-booking"
    | "location-details"
    | "booking-extending"
    | "booking-complement"
  >("booking-details");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [normalReceiveAddress, setNormalReceiveAddress] = useState<
    string | null
  >(null);
  const [normalDeliverAddress, setNormalDeliverAddress] = useState<
    string | null
  >(null);
  const [changedReceiveAddress, setChangedReceiveAddress] = useState<
    string | null
  >(null);
  const [changedDeliverAddress, setChangedDeliverAddress] = useState<
    string | null
  >(null);
  const [isNormalReceiveAddressLoading, setIsNormalReceiveAddressLoading] =
    useState(false);
  const [isNormalDeliverAddressLoading, setIsNormalDeliverAddressLoading] =
    useState(false);
  const [isChangedReceiveAddressLoading, setIsChangedReceiveAddressLoading] =
    useState(false);
  const [isChangedDeliverAddressLoading, setIsChangedDeliverAddressLoading] =
    useState(false);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const lat = data?.receiveLocationLatitude;
    const lng = data?.receiveLocationLongitude;

    if (typeof lat !== "number" || typeof lng !== "number") {
      setNormalReceiveAddress(null);
      setIsNormalReceiveAddressLoading(false);
      return;
    }

    setIsNormalReceiveAddressLoading(true);
    let isMounted = true;
    const timeoutId = window.setTimeout(async () => {
      const address = await reverseGeocode(lat, lng);
      if (isMounted) {
        setNormalReceiveAddress(address);
        setIsNormalReceiveAddressLoading(false);
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [
    data?.receiveLocationLatitude,
    data?.receiveLocationLongitude,
    isDrawerOpen,
  ]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const lat = data?.deliverLocationLatitude;
    const lng = data?.deliverLocationLongitude;

    if (typeof lat !== "number" || typeof lng !== "number") {
      setNormalDeliverAddress(null);
      setIsNormalDeliverAddressLoading(false);
      return;
    }

    setIsNormalDeliverAddressLoading(true);
    let isMounted = true;
    const timeoutId = window.setTimeout(async () => {
      const address = await reverseGeocode(lat, lng);
      if (isMounted) {
        setNormalDeliverAddress(address);
        setIsNormalDeliverAddressLoading(false);
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [
    data?.deliverLocationLatitude,
    data?.deliverLocationLongitude,
    isDrawerOpen,
  ]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const lat = data?.locationChanges?.receiveLatitude;
    const lng = data?.locationChanges?.receiveLongitude;

    if (typeof lat !== "number" || typeof lng !== "number") {
      setChangedReceiveAddress(null);
      setIsChangedReceiveAddressLoading(false);
      return;
    }

    setIsChangedReceiveAddressLoading(true);
    let isMounted = true;
    const timeoutId = window.setTimeout(async () => {
      const address = await reverseGeocode(lat, lng);
      if (isMounted) {
        setChangedReceiveAddress(address);
        setIsChangedReceiveAddressLoading(false);
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [
    data?.locationChanges?.receiveLatitude,
    data?.locationChanges?.receiveLongitude,
    isDrawerOpen,
  ]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const lat = data?.locationChanges?.deliverLatitude;
    const lng = data?.locationChanges?.deliverLongitude;

    if (typeof lat !== "number" || typeof lng !== "number") {
      setChangedDeliverAddress(null);
      setIsChangedDeliverAddressLoading(false);
      return;
    }

    setIsChangedDeliverAddressLoading(true);
    let isMounted = true;
    const timeoutId = window.setTimeout(async () => {
      const address = await reverseGeocode(lat, lng);
      if (isMounted) {
        setChangedDeliverAddress(address);
        setIsChangedDeliverAddressLoading(false);
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [
    data?.locationChanges?.deliverLatitude,
    data?.locationChanges?.deliverLongitude,
    isDrawerOpen,
  ]);
  const isNormalLocationLoading =
    !data || isNormalReceiveAddressLoading || isNormalDeliverAddressLoading;
  const isChangedLocationLoading =
    isChangedReceiveAddressLoading || isChangedDeliverAddressLoading;
  const extendReservationMeta = data as
    | (ReservationDetailsResponse & {
        driver?: ExtendReservationDriverPayload | null;
        points?: Record<string, unknown> | null;
        promoCode?: string | null;
        carOfferPkId?: number | null;
        pricing?: boolean;
      })
    | undefined;

  return (
    <Sheet
      open={isDrawerOpen}
      onOpenChange={(open) => {
        setIsDrawerOpen(open);
        if (open) {
          onOpen?.();
          return;
        }
        setActiveView("booking-details");
      }}
    >
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        dir={isRTL ? "rtl" : "ltr"}
        side={isRTL ? "right" : "left"}
        className="flex w-full flex-col p-0 sm:max-w-[35%]"
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          {activeView === "booking-details" ? (
            <>
              <SheetHeader className="text-start! mt-10 px-6 ">
                <SheetTitle>{t("myBookingsDrawer.title")}</SheetTitle>
              </SheetHeader>
              <div className="mx-auto min-h-0 w-full flex-1 overflow-y-auto px-3 sm:w-[95%]">
                <div className="">
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <div className="relative h-34 w-full overflow-hidden rounded-2xl sm:w-[40%]">
                      <Image src="/Card_Cars.png" fill alt="img" />
                    </div>
                    <div className="flex w-full flex-col gap-y-2">
                      <div>
                        <Badge
                          className={`rounded-lg p-3 mb-2 text-xs font-bold sm:p-4 sm:text-sm ${data?.reservationStatus === "STARTED" ? "bg-StatusGreen text-StatusDarkGreen" : "bg-StatusBrownBG text-StatusBrown200"}`}
                        >
                          {getStatusLabel(
                            data?.reservationStatus as ReservationStatus,
                          )}
                        </Badge>
                        <br />
                        <span className="mx-2">{t("bookingNumber")}:</span>
                        <span className="font-bold text-lg">
                          {data?.reservationId}
                        </span>
                      </div>

                      <p className="font-bold">{data?.carName}</p>
                    </div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="bg-Grey100 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-base flex items-center gap-2">
                      <CarRentIcon />
                      <span>{t("myBookingsDrawer.rentalDurationLabel")}:</span>
                      <span className="text-Grey700">
                        {t("myBookingsDrawer.rentalDays", {
                          days: data?.days ?? 0,
                        })}
                      </span>
                    </div>

                    <div className="text-base flex items-center gap-2 mt-3">
                      <span className="text-black">
                        {data?.startDate &&
                          format(
                            new Date(data?.startDate),
                            "yyyy/MM/dd | hh:mm a",
                            {
                              locale: dateLocale,
                            },
                          )}
                      </span>

                      <DateArrowIcon />

                      <span className="text-black">
                        {data?.endDate &&
                          format(
                            new Date(data?.endDate),
                            "yyyy/MM/dd | hh:mm a",
                            {
                              locale: dateLocale,
                            },
                          )}
                      </span>
                    </div>
                  </div>

                  {data?.reservationStatus === "STARTED" && (
                    <div className="self-end sm:self-auto">
                      <Button
                        className="p-3"
                        onClick={() => setActiveView("booking-extending")}
                      >
                        <SquarePen className="text-white w-5! h-5!" />
                      </Button>
                    </div>
                  )}
                </div>
                <Separator className="my-3" />
                <div className="bg-Grey100 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:justify-between">
                  {isNormalLocationLoading ? (
                    <LocationFromToSkeleton />
                  ) : (
                    <div className="flex flex-col gap-3 w-full">
                      <LocationFrom_To
                        receiveLocationName={data?.receiveLocationName}
                        deliverLocationName={data?.deliverLocationName}
                        receiveAddress={normalReceiveAddress}
                        deliverAddress={normalDeliverAddress}
                      />

                      {data?.locationChanges && (
                        <>
                          <Separator className="w-[90%]! mx-auto!" />
                          <div className="">
                            <p className="text-StatusRedBG">
                              <span>*</span>
                              {t("myBookingsDrawer.locationChangedNotice")}
                            </p>
                            {isChangedLocationLoading ? (
                              <LocationFromToSkeleton />
                            ) : (
                              <LocationFrom_To
                                receiveLocationName={""}
                                deliverLocationName={""}
                                receiveAddress={changedReceiveAddress}
                                deliverAddress={changedDeliverAddress}
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {data?.locationChanges === null &&
                    data?.receiveType === "MY_LOCATION" &&
                    data?.deliverType === "MY_LOCATION" &&
                    (data.reservationStatus === "PAID" ||
                      data.reservationStatus === "IN_PROGRESS") && (
                      <div className="self-end sm:self-auto">
                        <Button
                          className="p-3"
                          onClick={() => setActiveView("location-details")}
                        >
                          <SquarePen className="text-white w-5! h-5!" />
                        </Button>
                      </div>
                    )}
                </div>

                {data &&
                  data?.reservationServices &&
                  data?.reservationServices.length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {data?.reservationServices.map((service) => (
                          <div
                            key={service.serviceId}
                            className="bg-StatusGreen border-StatusDarkGreen flex items-center rounded-xl border-2 p-2 font-bold"
                          >
                            <span className="text-StatusDarkGreen mx-1">
                              {isRTL ? service.arabicName : service.englishName}
                            </span>
                            <span>{service.price}</span>
                            <SaudiRiyalIcon />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                {data?.driverName && data?.driverMobile && (
                  <div className="w-full flex flex-col mt-2 bg-Grey100 p-4 rounded-xl">
                    <p>{t("myBookingsDrawer.driverDetailsTitle")}</p>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 break-all">
                        <User className="w-5! h-5!" />
                        <p>{data?.driverName}</p>
                      </div>

                      <a
                        className="bg-Grey200 w-10 h-10 flex items-center justify-center rounded-lg hover:scale-110 transition-all duration-300"
                        href={`tel:${data?.driverMobile}`}
                      >
                        <PhoneCall className="w-5! h-5! text-StatusDarkGreen" />
                      </a>
                    </div>
                  </div>
                )}

                <Separator className="my-3" />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-base">
                      {t("myBookingsDrawer.totalCostLabel")}:
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold">{data?.total}</span>
                    <SaudiRiyal className="w-6! h-6!" />
                  </div>
                </div>
                {data && <BookingPaymentDetailsCollapseLazy data={data} />}
              </div>
              <SheetFooter className="mt-auto flex-col gap-3 border-t p-6 sm:flex-row">
                {data?.reservationStatus !== "FINISHED" && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="text-base! w-full border-2 border-StatusRed bg-transparent text-StatusRed sm:w-1/4"
                    onClick={() => setActiveView("cancel-booking")}
                  >
                    {t("cancelBooking")}
                  </Button>
                )}
                {data?.reservationStatus === "FINISHED" && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="text-base! w-full border-2 border-StatusRed bg-transparent text-StatusRed sm:w-1/4"
                    onClick={() => setActiveView("booking-complement")}
                  >
                    ارسال شكوي
                  </Button>
                )}
                <Button className={`text-base! w-full sm:w-3/4`}>
                  {t("myBookings")}
                </Button>
              </SheetFooter>
            </>
          ) : activeView === "location-details" ? (
            <DrawerLocationChange
              reservationId={data?.reservationId}
              defaultLocationNames={[
                data?.receiveLocationName ?? "",
                data?.deliverLocationName ?? "",
              ]}
              setShowLocationDetails={(showLocationDetails) =>
                setActiveView(
                  showLocationDetails ? "location-details" : "booking-details",
                )
              }
            />
          ) : activeView === "booking-extending" ? (
            <BookingExtending
              amount={data?.total ?? 0}
              reservationId={data?.reservationId}
              bookingStartDate={data?.startDate}
              bookingEndDate={data?.endDate}
              driver={extendReservationMeta?.driver}
              points={extendReservationMeta?.points}
              promoCode={extendReservationMeta?.promoCode}
              carOfferPkId={extendReservationMeta?.carOfferPkId}
              pricing={extendReservationMeta?.pricing}
              setShowBookingExtending={(showBookingExtending) =>
                setActiveView(
                  showBookingExtending
                    ? "booking-extending"
                    : "booking-details",
                )
              }
            />
          ) : activeView === "booking-complement" ? (
            <BookingComplement
              reservationId={data?.reservationId}
              onSubmitted={() => setIsDrawerOpen(false)}
              onBack={() => setActiveView("booking-details")}
            />
          ) : (
            <CancelConfirmation
              setShowCancelBooking={(showCancelBooking) =>
                setActiveView(
                  showCancelBooking ? "cancel-booking" : "booking-details",
                )
              }
              reservationId={data?.reservationId}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookedCarDetailsDrawer;
