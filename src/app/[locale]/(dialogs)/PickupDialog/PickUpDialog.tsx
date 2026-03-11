"use client";

import { useEffect } from "react";
import { DialogWrapper } from "@/app/(components)";
import CarPickupDialogTabs from "@/app/(components)/carPickupDialogComponent/CarPickupDialogTabs";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";

export function PickupDialog() {
  const { open, activeTab, setOpen, closeDialog } = usePickupDialogStore();
  const setLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }

    const hasClosed = sessionStorage.getItem("hasClosedLocationDialog");
    if (!hasClosed) {
      const timer = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [setLocation, setOpen]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      sessionStorage.setItem("hasClosedLocationDialog", "true");
    }
  };

  const handleClose = () => {
    closeDialog();
    sessionStorage.setItem("hasClosedLocationDialog", "true");
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      size="lg"
      header={{ mainTitle: "مكان الأستلام" }}
      content={<CarPickupDialogTabs customDefaultValue={activeTab} />}
      footer={
        <div className="w-full flex items-center justify-end gap-2 mt-2">
          <button
            onClick={handleClose}
            className="py-3 text-primary font-normal w-fit px-2 underline underline-offset-3"
          >
            إغلاق
          </button>

          <button className="rounded-[12px] py-3 bg-primary text-white font-bold w-fit px-5">
            أظهار النتائج
          </button>
        </div>
      }
    />
  );
}
