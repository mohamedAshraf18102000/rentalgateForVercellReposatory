"use client";

import { useEffect } from "react";
import { DialogWrapper } from "@/app/(components)";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { reverseGeocode } from "@/lib/utils/reverseGeocode";

export function CurrentLocationDialog() {
  const { isDialogOpen, openDialog, closeDialog, setLocation } =
    useLocationStore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          setLocation(latitude, longitude, address);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }

    const hasClosed = sessionStorage.getItem("hasClosedLocationDialog");
    if (!hasClosed) {
      const timer = setTimeout(() => openDialog(), 3000);
      return () => clearTimeout(timer);
    }
  }, [setLocation, openDialog]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      openDialog();
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    closeDialog();
    sessionStorage.setItem("hasClosedLocationDialog", "true");
  };

  return (
    <DialogWrapper
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      size="xl"
      header={{ mainTitle: "مكان الأستلام" }}
      content={
        <div className="overflow-hidden">
          <GoogleMapsLocation />
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-end gap-2 mt-2">
          <button
            onClick={handleClose}
            className="py-3 text-primary font-normal w-fit px-2 underline underline-offset-3"
          >
            إغلاق
          </button>

          <button className="rounded-xl py-3 bg-primary text-white font-bold w-fit px-5">
            أظهار النتائج
          </button>
        </div>
      }
    />
  );
}
