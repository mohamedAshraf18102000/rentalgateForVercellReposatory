"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import PositioningIcon from "@/constants/icons/PositioningIcon";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { cn } from "@/lib/utils";
import {
  emitApiErrorDialog,
  emitCloseDialog,
} from "@/lib/utils/errorDialogEvents";

export interface LocationTriggerTranslations {
  updateLocationPrefix: string;
  updateLocationLink: string;
  updateLocationSuffix: string;
  selectPickupLocation: string;
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
  const userPhysical_Address = useLocationStore(
    (state) => state.userPhysical_Address,
  );
  const openLocationDialog = useLocationStore((state) => state.openDialog);

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
        <span className={cn("truncate", labelClassName)}>{displayedAddress}</span>
      ) : (
        <span
          className={cn(
            "text-sm underline underline-offset-3 truncate",
            labelClassName,
          )}
        >
          {translations.selectPickupLocation}
        </span>
      )}
      <ChevronDown className="w-4 h-4 shrink-0" />
    </button>
  );
}
