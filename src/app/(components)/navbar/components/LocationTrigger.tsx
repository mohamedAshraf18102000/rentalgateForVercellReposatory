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
  const [permissionState, setPermissionState] = useState<
    "loading" | "granted" | "denied"
  >("loading");

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
      setPermissionState(
        permissionStatus?.state === "granted" ? "granted" : "denied",
      );
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
        "flex items-center gap-1 cursor-pointer hover:bg-Grey100 p-1 rounded-xl transition duration-200  underline underline-offset-1",
        className,
      )}
      title={userPhysical_Address?.toString()}
      onClick={handleOpenLocationDialog}
    >
      <span className="flex items-center justify-center w-5 h-5 shrink-0">
        {isDetectingUserLocation ? (
          <Spinner className="size-4" />
        ) : permissionState === "loading" ? (
          <div className="size-5" />
        ) : permissionState === "granted" ? (
          <MapPinCheck className="size-5 text-StatusDarkGreen" />
        ) : (
          <MapPinOff className="size-5 text-StatusRed" />
        )}
      </span>

      {/* {hasAddress ? (
        <span className={cn("truncate inline-block w-[140px]", labelClassName)}>
          {displayedAddress || translations.selectPickupLocation}
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
      )} */}
      <span className={cn("truncate max-w-26 text-sm", labelClassName)}>
        {displayedAddress || translations.selectPickupLocation}
      </span>
      <ChevronDown className="w-4 h-4 shrink-0" />
    </button>
  );
}
