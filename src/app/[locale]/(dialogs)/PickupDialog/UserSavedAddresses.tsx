"use client";

import { useEffect, useState } from "react";
import UpdateUserSavedLocationDialog from "../../(mainpages)/userProfile/components/userDialog/UpdateUserSavedLocationDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserAddress } from "@/types/userProfile/userAddress";
import { Separator } from "@/app/(components)/ui/separator";
import { MapPinPlus } from "lucide-react";
import { useAuth } from "@/app/(components)/navbar/hooks/useAuth";
import { useTranslations } from "next-intl";
import { findNearestSavedAddress } from "@/lib/utils/matchSavedAddress";

type TempLocation = {
  lat: number;
  lng: number;
  address: string;
  addressId?: number;
} | null;

interface UserSavedAddressesProps {
  userAddresses: UserAddress[];
  tempLocation: TempLocation;
  setTempLocation: (location: NonNullable<TempLocation>) => void;
  onAddressAdded?: (address: UserAddress) => void;
}

export function UserSavedAddresses({
  userAddresses,
  tempLocation,
  setTempLocation,
  onAddressAdded,
}: UserSavedAddressesProps) {
  const t = useTranslations("home");
  const { userData } = useAuth();
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (!tempLocation || !userAddresses?.length) {
      return;
    }

    const matchedSaved = findNearestSavedAddress(
      tempLocation.lat,
      tempLocation.lng,
      userAddresses,
    );

    if (
      !matchedSaved ||
      (tempLocation.lat === matchedSaved.latitude &&
        tempLocation.lng === matchedSaved.longitude &&
        tempLocation.address === matchedSaved.addressName)
    ) {
      return;
    }

    setTempLocation({
      lat: matchedSaved.latitude,
      lng: matchedSaved.longitude,
      address: matchedSaved.addressName,
      addressId: matchedSaved.addressId,
    });
  }, [tempLocation, userAddresses, setTempLocation]);

  return (
    <div className="absolute bottom-0 left-0 rounded-2xl! bg-gray-100/10! p-2 backdrop-blur-sm w-full">
      <div className="w-full flex justify-between items-center">
        <p className="text-base font-bold mb-2">
          {t("pickupDialog.savedAddressesTitle")}
        </p>
        <button
          type="button"
          onClick={() => setIsAddAddressDialogOpen(true)}
          className="text-base fontbold underline cursor-pointer flex items-center gap-1"
        >
          <MapPinPlus className="w-5 h-5" />
          <span>{t("pickupDialog.addNewAddress")}</span>
          <span></span>
        </button>
      </div>
      <Separator className="my-2" />
      {userAddresses?.length ? (
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-3">
          {userAddresses.map((savedAddress) => {
            const isSelected =
              tempLocation?.lat === savedAddress.latitude &&
              tempLocation?.lng === savedAddress.longitude &&
              tempLocation?.address === savedAddress.addressName;

            return (
              <button
                key={savedAddress.addressId}
                type="button"
                onClick={() =>
                  setTempLocation({
                    lat: savedAddress.latitude,
                    lng: savedAddress.longitude,
                    address: savedAddress.addressName,
                    addressId: savedAddress.addressId,
                  })
                }
                className={`w-[180px] shrink-0 rounded-lg border p-1 text-start transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-Grey100 bg-white hover:border-primary/30"
                }`}
                title={savedAddress.address}
              >
                <p className="line-clamp-1 text-xs font-bold">
                  {savedAddress.addressName}
                </p>
                <p className="line-clamp-1 text-[10px] text-Grey600">
                  {savedAddress.address}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="py-2 text-center text-xs text-Grey600">
          {t("pickupDialog.noSavedAddresses")}
        </p>
      )}
      <QueryClientProvider client={queryClient}>
        <UpdateUserSavedLocationDialog
          open={isAddAddressDialogOpen}
          setOpen={setIsAddAddressDialogOpen}
          initialShowAddForm
          addFormOnlyMode
          initialLat={tempLocation?.lat}
          initialLng={tempLocation?.lng}
          initialAddress={tempLocation?.address}
          initialMobile={userData?.mobile}
          onSuccess={(newAddress) => {
            setTempLocation({
              lat: newAddress.latitude,
              lng: newAddress.longitude,
              address: newAddress.addressName,
              addressId: newAddress.addressId,
            });
            onAddressAdded?.(newAddress);
          }}
        />
      </QueryClientProvider>
    </div>
  );
}
