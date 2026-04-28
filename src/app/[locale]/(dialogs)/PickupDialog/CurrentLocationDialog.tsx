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

export function CurrentLocationDialog() {
  const { address, isDialogOpen, openDialog, closeDialog, setLocation } =
    useLocationStore();
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const pathname = usePathname();
  const isTermsPage = pathname.includes("/terms&conditions");

  // Temporary state — only committed to the store on save
  const [tempLocation, setTempLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    addressId?: number;
  } | null>(null);

  useEffect(() => {
    if (isTermsPage) {
      return;
    }
    const hasClosed = sessionStorage.getItem("hasClosedLocationDialog");
    if (!hasClosed) {
      const timer = setTimeout(() => openDialog(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isTermsPage, openDialog]);

  useEffect(() => {
    if (isTermsPage && isDialogOpen) {
      closeDialog();
    }
  }, [closeDialog, isDialogOpen, isTermsPage]);

  useEffect(() => {
    if (isDialogOpen) {
      setTempLocation(null);
    }
  }, [isDialogOpen]);

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

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      openDialog();
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    closeDialog();
    setTempLocation(null);
    sessionStorage.setItem("hasClosedLocationDialog", "true");
  };

  const handleSave = () => {
    if (tempLocation) {
      setLocation(tempLocation.lat, tempLocation.lng, tempLocation.address);
    }
    closeDialog();
    sessionStorage.setItem("hasClosedLocationDialog", "true");
  };

  return (
    <DialogWrapper
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      closeOnOutsideClick={false}
      size="xl"
      header={{ mainTitle: "موقعك الحالي" }}
      content={
        <div className="overflow-hidden relative">
          <div className="flex p-2 gap-2">
            <LocateFixed />
            {tempLocation?.address ?? address}
          </div>
          <GoogleMapsLocation
            storeless
            selectedLat={tempLocation?.lat}
            selectedLng={tempLocation?.lng}
            onLocationChange={(lat, lng, addr) =>
              setTempLocation({ lat, lng, address: addr })
            }
          />
          <UserSavedAddresses
            userAddresses={userAddresses}
            tempLocation={tempLocation}
            setTempLocation={setTempLocation}
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
