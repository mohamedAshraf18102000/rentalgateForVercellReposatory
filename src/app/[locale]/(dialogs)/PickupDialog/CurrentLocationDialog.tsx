"use client";

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
