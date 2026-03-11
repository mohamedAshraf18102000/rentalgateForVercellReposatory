"use client";

<<<<<<< Updated upstream
import { DialogWrapper } from "@/app/(components)";
import CarPickupDialogTabs from "@/app/(components)/carPickupDialogComponent/CarPickupDialogTabs";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";

export function CurrentLocationDialog() {
  const { open, activeTab, setOpen, closeDialog } = usePickupDialogStore();

  return (
    <DialogWrapper
      open={true}
      onOpenChange={setOpen}
=======
import { useState, useEffect } from "react";
import { DialogWrapper } from "@/app/(components)";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { useLocationStore } from "@/lib/stores/useLocationStore";

export function CurrentLocationDialog() {
  const [open, setOpen] = useState(false);

  const setLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    // الحصول على الموقع الحالي وحفظه في الـ store
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

    // التحقق من إذا كان المستخدم قد أغلق الدايلوج سابقاً في هذه الجلسة
    const hasClosed = sessionStorage.getItem("hasClosedLocationDialog");

    if (!hasClosed) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [setLocation]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // حفظ حالة الإغلاق لمنعه من الظهور مرة أخرى تلقائياً
      sessionStorage.setItem("hasClosedLocationDialog", "true");
    }
  };

  const closeDialog = () => {
    setOpen(false);
    sessionStorage.setItem("hasClosedLocationDialog", "true");
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
>>>>>>> Stashed changes
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
            onClick={closeDialog}
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
