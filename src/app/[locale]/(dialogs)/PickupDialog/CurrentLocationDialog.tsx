"use client";

import { useEffect, useState } from "react";
import { DialogWrapper } from "@/app/(components)";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { LocateFixed } from "lucide-react";

export function CurrentLocationDialog() {
  const { address, isDialogOpen, openDialog, closeDialog, setLocation } =
    useLocationStore();

  // Temporary state — only committed to the store on save
  const [tempLocation, setTempLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  useEffect(() => {
    const hasClosed = sessionStorage.getItem("hasClosedLocationDialog");
    if (!hasClosed) {
      const timer = setTimeout(() => openDialog(), 3000);
      return () => clearTimeout(timer);
    }
  }, [openDialog]);

  // Reset temp state whenever the dialog opens so we start fresh
  useEffect(() => {
    if (isDialogOpen) {
      setTempLocation(null);
    }
  }, [isDialogOpen]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      openDialog();
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    closeDialog();
    setTempLocation(null);
    sessionStorage.setItem("hasClosedLocationDialog", "true");
  };

  const handleSave = () => {
    if (tempLocation) {
      setLocation(tempLocation.lat, tempLocation.lng, tempLocation.address);
    }
    closeDialog();
    sessionStorage.setItem("hasClosedLocationDialog", "true");
  };

  return (
    <DialogWrapper
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      closeOnOutsideClick={false}
      size="xl"
      header={{ mainTitle: "موقعك الحالي" }}
      content={
        <div className="overflow-hidden">
          <div className="flex p-2 gap-2">
            <LocateFixed />
            {tempLocation?.address ?? address}
          </div>
          <GoogleMapsLocation
            storeless
            onLocationChange={(lat, lng, addr) =>
              setTempLocation({ lat, lng, address: addr })
            }
          />
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

          <button
            onClick={handleSave}
            className="rounded-xl py-3 bg-primary text-white font-bold w-fit px-5"
          >
            حفظ
          </button>
        </div>
      }
    />
  );
}
