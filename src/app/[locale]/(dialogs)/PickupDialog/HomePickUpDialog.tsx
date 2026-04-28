"use client";

import { DialogWrapper } from "@/app/(components)";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import UpdateUserSavedLocationDialog from "@/app/[locale]/(mainpages)/userProfile/components/userDialog/UpdateUserSavedLocationDialog";
import { useState } from "react";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import HomePickupDialogTabs from "@/app/(components)/homePickupDialog/HomePickupDialogTabs";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
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

  const { formData, setFormData } = useBookedCarDetailsStore();
  const { authenticated } = useAuth();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("home");
  const bookingsPath = `/${locale}/bookings`;
  const isOnBookingsPage = pathname === bookingsPath;

  const applyPickupSelectionToFilters = (
    latestFormData: ReturnType<typeof useBookedCarDetailsStore.getState>["formData"],
  ) => {
    if (latestFormData.pickupType === "AIRPORT") {
      setFilter("pickupType", "airport");
      setFilter("pickupId", String(latestFormData.pickupAirportId ?? ""));
      setFilter("pickupAirportId", latestFormData.pickupAirportId ?? undefined);
      setFilter("pickupTrainId", undefined);
      setFilter("pickupName", latestFormData.pickupName || "");
      setFilter("pickupLat", undefined);
      setFilter("pickupLng", undefined);
      setFilter("carReturnLocationType", "airport");
      setFilter("carReturnAirportId", latestFormData.pickupAirportId ?? undefined);
      setFilter("carReturnTrainId", undefined);
      setFilter("carReturnLocation", latestFormData.pickupName || "");
      setFilter("carReturnLocationId", String(latestFormData.pickupAirportId ?? ""));
      setFilter("carReturnLocationLat", undefined);
      setFilter("carReturnLocationLng", undefined);
      return;
    }

    if (latestFormData.pickupType === "TRAIN_STATION") {
      setFilter("pickupType", "trainStation");
      setFilter("pickupTrainId", latestFormData.pickupTrainId ?? undefined);
      setFilter("pickupAirportId", undefined);
      setFilter("pickupId", String(latestFormData.pickupTrainId ?? ""));
      setFilter("pickupName", latestFormData.pickupName || "");
      setFilter("pickupLat", undefined);
      setFilter("pickupLng", undefined);
      setFilter("carReturnLocationType", "trainStation");
      setFilter("carReturnTrainId", latestFormData.pickupTrainId ?? undefined);
      setFilter("carReturnAirportId", undefined);
      setFilter("carReturnLocation", latestFormData.pickupName || "");
      setFilter("carReturnLocationId", String(latestFormData.pickupTrainId ?? ""));
      setFilter("carReturnLocationLat", undefined);
      setFilter("carReturnLocationLng", undefined);
      return;
    }

    if (latestFormData.pickupType === "MY_LOCATION") {
      setFilter("pickupType", "currentLocation");
      setFilter("pickupId", latestFormData.pickupId || "");
      setFilter("pickupTrainId", undefined);
      setFilter("pickupAirportId", undefined);
      setFilter("pickupName", latestFormData.pickupName || "");
      setFilter("pickupLat", latestFormData.pickupLat ?? undefined);
      setFilter("pickupLng", latestFormData.pickupLong ?? undefined);
      setFilter("carReturnLocationType", "currentLocation");
      setFilter("carReturnTrainId", undefined);
      setFilter("carReturnAirportId", undefined);
      setFilter("carReturnLocation", latestFormData.pickupName || "");
      setFilter("carReturnLocationId", latestFormData.pickupId || "");
      setFilter("carReturnLocationLat", latestFormData.pickupLat ?? undefined);
      setFilter("carReturnLocationLng", latestFormData.pickupLong ?? undefined);
      return;
    }

    if (latestFormData.pickupType === "BRANCH") {
      setFilter("pickupType", "branches");
      setFilter("pickupId", "");
      setFilter("pickupTrainId", undefined);
      setFilter("pickupAirportId", undefined);
      setFilter("pickupName", latestFormData.pickupName || "");
      setFilter("pickupLat", latestFormData.pickupLat ?? undefined);
      setFilter("pickupLng", latestFormData.pickupLong ?? undefined);
      setFilter("carReturnLocationType", "branches");
      setFilter("carReturnTrainId", undefined);
      setFilter("carReturnAirportId", undefined);
      setFilter("carReturnLocation", latestFormData.pickupName || "");
      setFilter("carReturnLocationId", "");
      setFilter("carReturnLocationLat", latestFormData.pickupLat ?? undefined);
      setFilter("carReturnLocationLng", latestFormData.pickupLong ?? undefined);
      return;
    }

    // branch or any other type fallback
    setFilter("pickupType", "");
    setFilter("pickupId", latestFormData.pickupId || "");
    setFilter("pickupTrainId", undefined);
    setFilter("pickupAirportId", undefined);
    setFilter("pickupName", latestFormData.pickupName || "");
    setFilter("pickupLat", latestFormData.pickupLat ?? undefined);
    setFilter("pickupLng", latestFormData.pickupLong ?? undefined);
    setFilter("carReturnLocationType", "");
    setFilter("carReturnTrainId", undefined);
    setFilter("carReturnAirportId", undefined);
    setFilter("carReturnLocation", latestFormData.pickupName || "");
    setFilter("carReturnLocationId", latestFormData.pickupId || "");
    setFilter("carReturnLocationLat", latestFormData.pickupLat ?? undefined);
    setFilter("carReturnLocationLng", latestFormData.pickupLong ?? undefined);
  };

  const syncReturnWithPickupInFormData = (
    latestFormData: ReturnType<typeof useBookedCarDetailsStore.getState>["formData"],
  ) => {
    setFormData({
      carReturnLocation: latestFormData.pickupName || "",
      carReturnLocationId:
        latestFormData.pickupType === "TRAIN_STATION"
          ? String(latestFormData.pickupTrainId ?? "")
          : latestFormData.pickupType === "AIRPORT"
            ? String(latestFormData.pickupAirportId ?? "")
            : latestFormData.pickupId || null,
      returnLat: latestFormData.pickupLat ?? null,
      returnLong: latestFormData.pickupLong ?? null,
      returnType: latestFormData.pickupType,
      returnTrainId: latestFormData.pickupTrainId ?? null,
      returnAirportId: latestFormData.pickupAirportId ?? null,
    });
  };

  const handleConfirm = () => {
    if (
      activeTab === "currentLocation" &&
      isUnsavedMapLocation &&
      authenticated
    ) {
      setShowSaveDialog(true);
    } else {
      if (target === "pickup") {
        const latestFormData = useBookedCarDetailsStore.getState().formData;
        syncReturnWithPickupInFormData(latestFormData);
        applyPickupSelectionToFilters(latestFormData);
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
              setFormData({
                pickupName: address.addressName,
                pickupLat: address.latitude,
                pickupLong: address.longitude,
                pickupType: "MY_LOCATION",
                pickupId: String(address.addressId),
                pickupAirportId: null,
                pickupTrainId: null,
              });
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
