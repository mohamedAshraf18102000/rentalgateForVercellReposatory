"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { DialogWrapper } from "@/app/(components)";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import {
  GeolocationError,
  GeolocationFailureReason,
  getBrowserPosition,
} from "@/lib/utils/geolocation";
import { findNearestSavedAddress } from "@/lib/utils/matchSavedAddress";
import { reverseGeocodeWithDetails } from "@/lib/utils/reverseGeocode";
import { LocateFixed } from "lucide-react";
import { usePathname } from "next/navigation";
import { getUserAddress } from "@/services/userProfile/getUserAddress.service";
import { UserAddress } from "@/types/userProfile/userAddress";
import { UserSavedAddresses } from "./UserSavedAddresses";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { getAuthToken } from "@/util/auth";
import { useTranslations } from "next-intl";

type TempLocation = {
  lat: number;
  lng: number;
  address: string;
  addressId?: number;
};

function CurrentLocationDialogContent() {
  const t = useTranslations("home");
  const isAuthenticated = !!getAuthToken();

  const {
    userPhysical_Latitude,
    userPhysical_Longitude,
    userPhysical_Address,
    userPhysical_AddressId,
    isSessionManualLocation,
    isDialogOpen,
    dialogOpenSource,
    openDialog,
    closeDialog,
    setUserPhysical_Location,
  } = useLocationStore();

  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [filterTempLocation, setFilterTempLocation] =
    useState<TempLocation | null>(null);
  const [dialogTempLocation, setDialogTempLocation] =
    useState<TempLocation | null>(null);
  const [geolocationError, setGeolocationError] =
    useState<GeolocationFailureReason | null>(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const hasManualMapEditRef = useRef(false);
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
      const timer = setTimeout(() => openDialog("auto"), 30_000);
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

    if (!getAuthToken()) {
      setUserAddresses([]);
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

  useEffect(() => {
    if (!isDialogOpen || dialogOpenSource === "filterComponent") {
      return;
    }

    hasManualMapEditRef.current = false;
    setGeolocationError(null);

    const loadSessionLocation = (): boolean => {
      if (
        userPhysical_Latitude !== null &&
        userPhysical_Longitude !== null &&
        userPhysical_Address
      ) {
        setDialogTempLocation({
          lat: userPhysical_Latitude,
          lng: userPhysical_Longitude,
          address: userPhysical_Address,
          addressId: userPhysical_AddressId ?? undefined,
        });
        return true;
      }

      setDialogTempLocation(null);
      return false;
    };

    if (isSessionManualLocation) {
      loadSessionLocation();
      return;
    }

    let isCancelled = false;

    const applyDetectedLocation = async (lat: number, lng: number) => {
      const matchedSaved = findNearestSavedAddress(lat, lng, userAddresses);

      if (matchedSaved) {
        if (isCancelled) {
          return;
        }

        setDialogTempLocation({
          lat: matchedSaved.latitude,
          lng: matchedSaved.longitude,
          address: matchedSaved.addressName,
          addressId: matchedSaved.addressId,
        });
        return;
      }

      const details = await reverseGeocodeWithDetails(lat, lng);
      if (isCancelled) {
        return;
      }

      setDialogTempLocation({
        lat,
        lng,
        address: details?.address ?? "",
      });
    };

    const detectLocation = async () => {
      loadSessionLocation();
      setIsAutoDetecting(true);
      useLocationStore.getState().setIsDetectingUserLocation(true);

      try {
        const coords = await getBrowserPosition();
        if (isCancelled) {
          return;
        }

        await applyDetectedLocation(coords.latitude, coords.longitude);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        if (error instanceof GeolocationError) {
          setGeolocationError(error.reason);
        } else {
          setGeolocationError("unknown");
        }

        loadSessionLocation();
      } finally {
        setIsAutoDetecting(false);
        useLocationStore.getState().setIsDetectingUserLocation(false);
      }
    };

    void detectLocation();

    return () => {
      isCancelled = true;
    };
  }, [
    dialogOpenSource,
    isDialogOpen,
    isSessionManualLocation,
    userPhysical_Address,
    userPhysical_AddressId,
    userPhysical_Latitude,
    userPhysical_Longitude,
  ]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      openDialog();
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    hasManualMapEditRef.current = false;
    setGeolocationError(null);
    setFilterTempLocation(null);
    setDialogTempLocation(null);
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
      const shouldMarkSessionManual =
        hasManualMapEditRef.current ||
        typeof dialogTempLocation?.addressId === "number";

      setUserPhysical_Location(
        dialogTempLocation?.lat ?? null,
        dialogTempLocation?.lng ?? null,
        dialogTempLocation?.address ?? null,
        dialogTempLocation?.addressId ?? null,
        { isSessionManual: shouldMarkSessionManual },
      );
      closeDialog();
      sessionStorage.setItem("hasClosedLocationDialog", "true");
    }
  };

  const geolocationErrorMessage = geolocationError
    ? t(`pickupDialog.geolocationErrors.${geolocationError}`)
    : null;

  const isFilterDialog = dialogOpenSource === "filterComponent";
  const displayedAddress = isFilterDialog
    ? filterTempLocation?.address
    : dialogTempLocation?.address;
  const selectedLat = isFilterDialog
    ? filterTempLocation?.lat
    : (dialogTempLocation?.lat ?? undefined);
  const selectedLng = isFilterDialog
    ? filterTempLocation?.lng
    : (dialogTempLocation?.lng ?? undefined);
  const tempLocationForSavedAddresses = isFilterDialog
    ? filterTempLocation
    : dialogTempLocation;

  return (
    <DialogWrapper
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      closeOnOutsideClick={false}
      size="xl"
      header={{ mainTitle: t("pickupDialog.currentLocationTitle") }}
      content={
        <div
          className="overflow-hidden relative"
          data-open-source={dialogOpenSource ?? undefined}
        >
          <div className="flex flex-col gap-1 p-2">
            <div className="flex gap-2">
              <LocateFixed className="shrink-0" />
              <span>
                {isAutoDetecting && !displayedAddress
                  ? t("pickupDialog.detectingLocation")
                  : displayedAddress}
              </span>
            </div>
            {geolocationErrorMessage && !isFilterDialog ? (
              <p className="text-sm text-Grey600 ps-8">{geolocationErrorMessage}</p>
            ) : null}
          </div>
          <GoogleMapsLocation
            storeless
            disableInitialGeolocation
            selectedLat={selectedLat}
            selectedLng={selectedLng}
            onLocationChange={(lat, lng, addr, isManual) => {
              if (isManual) {
                hasManualMapEditRef.current = true;
              }

              if (isFilterDialog) {
                setFilterTempLocation({ lat, lng, address: addr });
                return;
              }

              setDialogTempLocation({
                lat,
                lng,
                address: addr,
                addressId: isManual
                  ? undefined
                  : dialogTempLocation?.addressId,
              });
            }}
          />
          {isAuthenticated ? (
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

                if (typeof location.addressId === "number") {
                  hasManualMapEditRef.current = true;
                }

                setDialogTempLocation(location);
              }}
            />
          ) : null}
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-end gap-2 mt-2">
          <button
            onClick={handleClose}
            className="py-3 text-primary font-normal w-fit px-2 underline underline-offset-3"
          >
            {t("pickupDialog.close")}
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl py-3 bg-primary text-white font-bold w-fit px-5 text-base"
          >
            {t("pickupDialog.save")}
          </button>
        </div>
      }
    />
  );
}

export function CurrentLocationDialog() {
  return (
    <Suspense fallback={null}>
      <CurrentLocationDialogContent />
    </Suspense>
  );
}
