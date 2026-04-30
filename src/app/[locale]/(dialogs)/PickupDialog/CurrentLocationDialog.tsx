"use client";

import { useEffect, useState } from "react";
import { DialogWrapper } from "@/app/(components)";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { LocateFixed } from "lucide-react";
import { usePathname } from "next/navigation";
import { getUserAddress } from "@/services/userProfile/getUserAddress.service";
import { UserAddress } from "@/types/userProfile/userAddress";
import { UserSavedAddresses } from "./UserSavedAddresses";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

type TempLocation = {
  lat: number;
  lng: number;
  address: string;
  addressId?: number;
};

export function CurrentLocationDialog() {
  // StateManagment Stores

  const {
    userPhysical_Latitude,
    userPhysical_Longitude,
    userPhysical_Address,
    userPhysical_AddressId,
    isDialogOpen,
    dialogOpenSource,
    openDialog,
    closeDialog,
    setUserPhysical_Location,
  } = useLocationStore();

  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [filterTempLocation, setFilterTempLocation] =
    useState<TempLocation | null>(null);
  const pathname = usePathname();
  const isTermsPage = pathname.includes("/terms&conditions");
  const setFilter = useUserPreferedFiltersStore((state) => state.setFilter);
  const applyFilters = useUserPreferedFiltersStore(
    (state) => state.applyFilters,
  );
  const filters = useUserPreferedFiltersStore((state) => state.filters);

  useEffect(() => {
    if (isTermsPage) {
      return;
    }
    const hasClosed = sessionStorage.getItem("hasClosedLocationDialog");
    if (!hasClosed) {
      const timer = setTimeout(() => openDialog("auto"), 3000);
      return () => clearTimeout(timer);
    }
  }, [isTermsPage, openDialog]);

  useEffect(() => {
    if (isTermsPage && isDialogOpen) {
      closeDialog();
    }
  }, [closeDialog, isDialogOpen, isTermsPage]);

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }

    let isMounted = true;
    getUserAddress()
      .then((addresses) => {
        if (isMounted) {
          setUserAddresses(addresses ?? []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUserAddresses([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isDialogOpen]);

  useEffect(() => {
    if (!isDialogOpen || dialogOpenSource !== "filterComponent") {
      return;
    }

    if (
      typeof filters.pickupLat === "number" &&
      typeof filters.pickupLng === "number"
    ) {
      setFilterTempLocation({
        lat: filters.pickupLat,
        lng: filters.pickupLng,
        address: filters.pickupName ?? "",
      });
      return;
    }

    setFilterTempLocation(null);
  }, [
    dialogOpenSource,
    filters.pickupLat,
    filters.pickupLng,
    filters.pickupName,
    isDialogOpen,
  ]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      openDialog();
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    closeDialog();
    sessionStorage.setItem("hasClosedLocationDialog", "true");
  };

  const handleSave = () => {
    if (dialogOpenSource === "filterComponent") {
      const selectedSavedAddressId =
        typeof filterTempLocation?.addressId === "number"
          ? String(filterTempLocation.addressId)
          : "";

      setFilter("pickupLat", filterTempLocation?.lat);
      setFilter("pickupLng", filterTempLocation?.lng);
      setFilter("pickupName", filterTempLocation?.address ?? "");
      setFilter("pickupType", "currentLocation");
      setFilter("pickupId", selectedSavedAddressId);
      setFilter("pickupAirportId", undefined);
      setFilter("pickupTrainId", undefined);

      setFilter("carReturnLocationLat", filterTempLocation?.lat);
      setFilter("carReturnLocationLng", filterTempLocation?.lng);
      setFilter("carReturnLocation", filterTempLocation?.address ?? "");
      setFilter("carReturnLocationType", "currentLocation");
      setFilter("carReturnLocationId", selectedSavedAddressId);
      setFilter("carReturnAirportId", undefined);
      setFilter("carReturnTrainId", undefined);
      applyFilters();
      closeDialog();
      sessionStorage.setItem("hasClosedLocationDialog", "true");
    } else {
      closeDialog();
      sessionStorage.setItem("hasClosedLocationDialog", "true");
    }
  };

  const isFilterDialog = dialogOpenSource === "filterComponent";
  const displayedAddress = isFilterDialog
    ? filterTempLocation?.address
    : userPhysical_Address;
  const selectedLat = isFilterDialog
    ? filterTempLocation?.lat
    : (userPhysical_Latitude ?? undefined);
  const selectedLng = isFilterDialog
    ? filterTempLocation?.lng
    : (userPhysical_Longitude ?? undefined);
  const tempLocationForSavedAddresses = isFilterDialog
    ? filterTempLocation
    : userPhysical_Latitude !== null &&
        userPhysical_Longitude !== null &&
        userPhysical_Address
      ? {
          lat: userPhysical_Latitude,
          lng: userPhysical_Longitude,
          address: userPhysical_Address,
          addressId: userPhysical_AddressId ?? undefined,
        }
      : null;

  return (
    <DialogWrapper
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      closeOnOutsideClick={false}
      size="xl"
      header={{ mainTitle: `موقعك الحالي ${dialogOpenSource}` }}
      content={
        <div
          className="overflow-hidden relative"
          data-open-source={dialogOpenSource ?? undefined}
        >
          <div className="flex p-2 gap-2">
            <LocateFixed />
            {displayedAddress}
          </div>
          <GoogleMapsLocation
            storeless
            selectedLat={selectedLat}
            selectedLng={selectedLng}
            onLocationChange={(lat, lng, addr) => {
              if (isFilterDialog) {
                setFilterTempLocation({ lat, lng, address: addr });
                return;
              }
              setUserPhysical_Location(lat, lng, addr, null);
            }}
          />
          <UserSavedAddresses
            userAddresses={userAddresses}
            tempLocation={tempLocationForSavedAddresses}
            onAddressAdded={(newAddress) => {
              setUserAddresses((previousAddresses) => {
                const isAlreadyAdded = previousAddresses.some(
                  (address) => address.addressId === newAddress.addressId,
                );
                if (isAlreadyAdded) {
                  return previousAddresses;
                }
                return [newAddress, ...previousAddresses];
              });
            }}
            setTempLocation={(location) => {
              if (isFilterDialog) {
                setFilterTempLocation(location);
                return;
              }
              setUserPhysical_Location(
                location.lat,
                location.lng,
                location.address,
                location.addressId ?? null,
              );
            }}
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
