"use client";

import { DialogWrapper } from "@/app/(components)";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import UpdateUserSavedLocationDialog from "@/app/[locale]/(mainpages)/userProfile/components/userDialog/UpdateUserSavedLocationDialog";
import { useState } from "react";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import HomePickupDialogTabs from "@/app/(components)/homePickupDialog/HomePickupDialogTabs";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/app/(components)/navbar/hooks/useAuth";

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
  const { filters, setFilter, applyFilters } = useUserPreferedFiltersStore();
  const { authenticated } = useAuth();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("home");
  const bookingsPath = `/${locale}/bookings`;
  const isOnBookingsPage = pathname === bookingsPath;

  const handleConfirm = () => {
    if (
      activeTab === "currentLocation" &&
      isUnsavedMapLocation &&
      authenticated
    ) {
      setShowSaveDialog(true);
    } else {
      if (target === "pickup") {
        applyFilters();
      }
      confirmDialog();
      if (target === "pickup") {
        if (!isOnBookingsPage) {
          router.push(bookingsPath);
        }
      }
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
        className=""
        open={open}
        onOpenChange={setOpen}
        size="lg"
        header={{
          mainTitle:
            target === "return"
              ? t("pickupDialog.returnTitle")
              : t("pickupDialog.pickupTitle"),
        }}
        content={<HomePickupDialogTabs customDefaultValue={activeTab} />}
        footer={
          <div className="mt-2 flex w-full gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={closeDialog}
              className="w-full px-2 py-3 text-center font-normal text-primary underline underline-offset-3 sm:w-fit"
            >
              {t("pickupDialog.close")}
            </button>

            <button
              onClick={handleConfirm}
              className="w-full rounded-[12px] bg-primary px-5 py-3 font-bold text-white sm:w-fit"
            >
              {title || t("pickupDialog.showResults")}
            </button>
          </div>
        }
      />
      {authenticated && (
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
            if (target === "pickup") {
              applyFilters();
            }
            setIsUnsavedMapLocation(false);
            setShowSaveDialog(false);
            confirmDialog();
            if (target === "pickup") {
              if (!isOnBookingsPage) {
                router.push(bookingsPath);
              }
            }
          }}
        />
      )}
    </>
  );
}
