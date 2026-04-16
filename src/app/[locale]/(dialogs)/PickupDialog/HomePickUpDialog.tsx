"use client";

import { DialogWrapper } from "@/app/(components)";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import UpdateUserSavedLocationDialog from "@/app/[locale]/(mainpages)/userProfile/components/userDialog/UpdateUserSavedLocationDialog";
import { useState } from "react";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import HomePickupDialogTabs from "@/app/(components)/homePickupDialog/HomePickupDialogTabs";

export function HomePickUpDialog({ title }: { title?: string }) {
  const {
    open,
    activeTab,
    setOpen,
    closeDialog,
    confirmDialog,
    isUnsavedMapLocation,
    target,
    setIsUnsavedMapLocation,
  } = usePickupDialogStore();
  const { filters, setFilter } = useUserPreferedFiltersStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleConfirm = () => {
    if (activeTab === "currentLocation" && isUnsavedMapLocation) {
      setShowSaveDialog(true);
    } else {
      confirmDialog();
    }
  };

  const initialLat =
    target === "return" ? filters.carReturnLocationLat : filters.pickupLat;
  const initialLng =
    target === "return" ? filters.carReturnLocationLng : filters.pickupLng;
  const initialAddress =
    target === "return" ? filters.carReturnLocation : filters.pickupName;

  return (
    <>
      <DialogWrapper
        open={open}
        onOpenChange={setOpen}
        size="lg"
        header={{
          mainTitle: target === "return" ? "مكان التسليم" : "مكان الأستلام",
        }}
        content={<HomePickupDialogTabs customDefaultValue={activeTab} />}
        footer={
          <div className="mt-2 flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={closeDialog}
              className="w-full px-2 py-3 text-center font-normal text-primary underline underline-offset-3 sm:w-fit"
            >
              إغلاق
            </button>

            <button
              onClick={handleConfirm}
              className="w-full rounded-[12px] bg-primary px-5 py-3 font-bold text-white sm:w-fit"
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
        onSuccess={(address) => {
          if (target === "return") {
            setFilter("carReturnLocation", address.addressName);
            setFilter("carReturnLocationLat", address.latitude);
            setFilter("carReturnLocationLng", address.longitude);
            setFilter("carReturnLocationType", "currentLocation");
            setFilter("carReturnLocationId", String(address.addressId));
          } else {
            setFilter("pickupName", address.addressName);
            setFilter("pickupLat", address.latitude);
            setFilter("pickupLng", address.longitude);
            setFilter("pickupType", "currentLocation");
            setFilter("pickupId", String(address.addressId));
          }
          setIsUnsavedMapLocation(false);
          setShowSaveDialog(false);
          confirmDialog();
        }}
      />
    </>
  );
}
