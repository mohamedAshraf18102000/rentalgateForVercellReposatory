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
    setOpen,
    closeDialog,
    confirmDialog,
    isUnsavedMapLocation,
    activeTab,
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
  const applyPickupSelectionToFilters = () => {
    if (formData.pickupType === "AIRPORT") {
      setFilter("pickupType", "airport");
      setFilter("pickupId", String(formData.pickupAirportId ?? ""));
      setFilter("pickupAirportId", formData.pickupAirportId ?? undefined);
      setFilter("pickupTrainId", undefined);
      setFilter("pickupName", formData.pickupName || "");
      setFilter("pickupLat", undefined);
      setFilter("pickupLng", undefined);
      setFilter("carReturnLocationType", "airport");
      setFilter("carReturnAirportId", formData.pickupAirportId ?? undefined);
      setFilter("carReturnTrainId", undefined);
      setFilter("carReturnLocation", formData.pickupName || "");
      setFilter("carReturnLocationId", String(formData.pickupAirportId ?? ""));
      setFilter("carReturnLocationLat", undefined);
      setFilter("carReturnLocationLng", undefined);
      return;
    }

    if (formData.pickupType === "TRAIN_STATION") {
      setFilter("pickupType", "trainStation");
      setFilter("pickupTrainId", formData.pickupTrainId ?? undefined);
      setFilter("pickupAirportId", undefined);
      setFilter("pickupId", String(formData.pickupTrainId ?? ""));
      setFilter("pickupName", formData.pickupName || "");
      setFilter("pickupLat", undefined);
      setFilter("pickupLng", undefined);
      setFilter("carReturnLocationType", "trainStation");
      setFilter("carReturnTrainId", formData.pickupTrainId ?? undefined);
      setFilter("carReturnAirportId", undefined);
      setFilter("carReturnLocation", formData.pickupName || "");
      setFilter("carReturnLocationId", String(formData.pickupTrainId ?? ""));
      setFilter("carReturnLocationLat", undefined);
      setFilter("carReturnLocationLng", undefined);
      return;
    }

    if (formData.pickupType === "MY_LOCATION") {
      setFilter("pickupType", "currentLocation");
      setFilter("pickupId", formData.pickupId || "");
      setFilter("pickupTrainId", undefined);
      setFilter("pickupAirportId", undefined);
      setFilter("pickupName", formData.pickupName || "");
      setFilter("pickupLat", formData.pickupLat ?? undefined);
      setFilter("pickupLng", formData.pickupLong ?? undefined);
      setFilter("carReturnLocationType", "currentLocation");
      setFilter("carReturnTrainId", undefined);
      setFilter("carReturnAirportId", undefined);
      setFilter("carReturnLocation", formData.pickupName || "");
      setFilter("carReturnLocationId", formData.pickupId || "");
      setFilter("carReturnLocationLat", formData.pickupLat ?? undefined);
      setFilter("carReturnLocationLng", formData.pickupLong ?? undefined);
      return;
    }

    if (formData.pickupType === "BRANCH") {
      setFilter("pickupType", "branches");
      setFilter("pickupId", "");
      setFilter("pickupTrainId", undefined);
      setFilter("pickupAirportId", undefined);
      setFilter("pickupName", formData.pickupName || "");
      setFilter("pickupLat", formData.pickupLat ?? undefined);
      setFilter("pickupLng", formData.pickupLong ?? undefined);
      setFilter("carReturnLocationType", "branches");
      setFilter("carReturnTrainId", undefined);
      setFilter("carReturnAirportId", undefined);
      setFilter("carReturnLocation", formData.pickupName || "");
      setFilter("carReturnLocationId", "");
      setFilter("carReturnLocationLat", formData.pickupLat ?? undefined);
      setFilter("carReturnLocationLng", formData.pickupLong ?? undefined);
      return;
    }

    // branch or any other type fallback
    setFilter("pickupType", "");
    setFilter("pickupId", formData.pickupId || "");
    setFilter("pickupTrainId", undefined);
    setFilter("pickupAirportId", undefined);
    setFilter("pickupName", formData.pickupName || "");
    setFilter("pickupLat", formData.pickupLat ?? undefined);
    setFilter("pickupLng", formData.pickupLong ?? undefined);
    setFilter("carReturnLocationType", "");
    setFilter("carReturnTrainId", undefined);
    setFilter("carReturnAirportId", undefined);
    setFilter("carReturnLocation", formData.pickupName || "");
    setFilter("carReturnLocationId", formData.pickupId || "");
    setFilter("carReturnLocationLat", formData.pickupLat ?? undefined);
    setFilter("carReturnLocationLng", formData.pickupLong ?? undefined);
  };

  const syncReturnWithPickupInFormData = () => {
    setFormData({
      carReturnLocation: formData.pickupName || "",
      carReturnLocationId:
        formData.pickupType === "TRAIN_STATION"
          ? String(formData.pickupTrainId ?? "")
          : formData.pickupType === "AIRPORT"
            ? String(formData.pickupAirportId ?? "")
            : formData.pickupId || null,
      returnLat: formData.pickupLat ?? null,
      returnLong: formData.pickupLong ?? null,
      returnType: formData.pickupType,
      returnTrainId: formData.pickupTrainId ?? null,
      returnAirportId: formData.pickupAirportId ?? null,
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
        syncReturnWithPickupInFormData();
        applyPickupSelectionToFilters();
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
