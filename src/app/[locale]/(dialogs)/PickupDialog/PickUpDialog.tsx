"use client";

import { DialogWrapper } from "@/app/(components)";
import CarPickupDialogTabs from "@/app/(components)/carPickupDialogComponent/CarPickupDialogTabs";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import UpdateUserSavedLocationDialog from "@/app/[locale]/(mainpages)/userProfile/components/userDialog/UpdateUserSavedLocationDialog";
import { useState } from "react";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

export function PickupDialog({ title }: { title?: string }) {
  const { open, activeTab, setOpen, closeDialog, confirmDialog, isUnsavedMapLocation, target } =
    usePickupDialogStore();
  const { filters } = useUserPreferedFiltersStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleConfirm = () => {
    if (activeTab === "currentLocation" && isUnsavedMapLocation) {
      setShowSaveDialog(true);
    } else {
      confirmDialog();
    }
  };

  const initialLat = target === "return" ? filters.carReturnLocationLat : filters.pickupLat;
  const initialLng = target === "return" ? filters.carReturnLocationLng : filters.pickupLng;
  const initialAddress = target === "return" ? filters.carReturnLocation : filters.pickupName;

  return (
    <>
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

            <button
              onClick={handleConfirm}
              className="rounded-[12px] py-3 bg-primary text-white font-bold w-fit px-5"
            >
              {title || "أظهار النتائج"}
            </button>
          </div>
        }
      />
      <UpdateUserSavedLocationDialog
        open={showSaveDialog}
        setOpen={setShowSaveDialog}
        initialShowAddForm={true}
        initialLat={initialLat}
        initialLng={initialLng}
        initialAddress={initialAddress}
      />
    </>
  );
}
