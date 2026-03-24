"use client";

import { DialogWrapper } from "@/app/(components)";
import CarPickupDialogTabs from "@/app/(components)/carPickupDialogComponent/CarPickupDialogTabs";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";

export function PickupDialog() {
  const { open, activeTab, setOpen, closeDialog, confirmDialog } = usePickupDialogStore();

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      size="lg"
      header={{ mainTitle: "مكان الأستلام" }}
      content={<CarPickupDialogTabs customDefaultValue={activeTab} />}
      footer={
        <div className="w-full flex items-center justify-end gap-2 mt-2">
          <button
            onClick={closeDialog}
            className="py-3 text-primary font-normal w-fit px-2 underline underline-offset-3"
          >
            إغلاق
          </button>

          <button onClick={confirmDialog} className="rounded-[12px] py-3 bg-primary text-white font-bold w-fit px-5">
            أظهار النتائج
          </button>
        </div>
      }
    />
  );
}
