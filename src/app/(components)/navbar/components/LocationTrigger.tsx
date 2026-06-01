"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, MapPinCheck, MapPinOff } from "lucide-react";
import PositioningIcon from "@/constants/icons/PositioningIcon";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { cn } from "@/lib/utils";
import {
  emitApiErrorDialog,
  emitCloseDialog,
} from "@/lib/utils/errorDialogEvents";
import { Spinner } from "../../ui/spinner";
export interface LocationTriggerTranslations {
  updateLocationPrefix: string;
  updateLocationLink: string;
  updateLocationSuffix: string;
  selectPickupLocation: string;
  locationPermissionGranted: string;
  detectingLocation: string;
}

interface LocationTriggerProps {
  translations: LocationTriggerTranslations;
  className?: string;
  labelClassName?: string;
}

export function LocationTrigger({
  translations,
  className,
  labelClassName,
}: LocationTriggerProps) {
  const pathname = usePathname();
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] =
    useState(false);
  const userPhysical_Address = useLocationStore(
    (state) => state.userPhysical_Address,
  );
  const isDetectingUserLocation = useLocationStore(
    (state) => state.isDetectingUserLocation,
  );
  const openLocationDialog = useLocationStore((state) => state.openDialog);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) {
      return;
    }

    let permissionStatus: PermissionStatus | undefined;

    const syncPermissionState = () => {
      setIsLocationPermissionGranted(permissionStatus?.state === "granted");
    };

    void navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        permissionStatus = status;
        syncPermissionState();
        status.addEventListener("change", syncPermissionState);
      })
      .catch(() => {});

    return () => {
      permissionStatus?.removeEventListener("change", syncPermissionState);
    };
  }, []);

  const DialogError = () => {
    return (
      <span>
        {translations.updateLocationPrefix}{" "}
        <Link
          className="underline underline-offset-3!"
          href="/bookings"
          onClick={() => emitCloseDialog()}
        >
          {translations.updateLocationLink}
        </Link>{" "}
        {translations.updateLocationSuffix}
      </span>
    );
  };

  const handleOpenLocationDialog = () => {
    if (pathname.includes("/reservation") || pathname.includes("/carDetails")) {
      emitApiErrorDialog(<DialogError />);
      return;
    }

    openLocationDialog("navbarSSSS");
  };

  const address = userPhysical_Address ?? "";
  const hasAddress = address.length > 0;
  const displayedAddress =
    hasAddress && address.length > 20 ? `${address.slice(0, 20)}...` : address;

  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1 cursor-pointer hover:bg-Grey100 p-1 rounded-xl transition duration-200",
        hasAddress && "underline underline-offset-1",
        className,
      )}
      title={userPhysical_Address?.toString()}
      onClick={handleOpenLocationDialog}
    >
      <span className="scale-90 shrink-0">
        <PositioningIcon />
      </span>
      {hasAddress ? (
        <span className={cn("truncate", labelClassName)}>
          {displayedAddress}
        </span>
      ) : (
        <span
          className={cn(
            "text-sm underline underline-offset-3 truncate flex items-center gap-2",
            labelClassName,
          )}
        >
          {translations.selectPickupLocation}
        </span>
      )}
      <ChevronDown className="w-4 h-4 shrink-0" />
      {isDetectingUserLocation ? (
        <span title={translations.detectingLocation}>
          <Spinner className="size-4" />
        </span>
      ) : isLocationPermissionGranted ? (
        <span title={translations.locationPermissionGranted}>
          <MapPinCheck className="size-4 text-StatusDarkGreen" />
        </span>
      ) : (
        <span title={translations.selectPickupLocation}>
          <MapPinOff className="size-4 text-StatusRed" />
        </span>
      )}
    </button>
  );
}
