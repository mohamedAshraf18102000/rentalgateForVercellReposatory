"use client";

import { UserAddress } from "@/types/userProfile/userAddress";

type TempLocation = {
  lat: number;
  lng: number;
  address: string;
} | null;

interface UserSavedAddressesProps {
  userAddresses: UserAddress[];
  tempLocation: TempLocation;
  setTempLocation: (location: NonNullable<TempLocation>) => void;
}

export function UserSavedAddresses({
  userAddresses,
  tempLocation,
  setTempLocation,
}: UserSavedAddressesProps) {
  return (
    <div className="absolute bottom-0 left-0 w-full rounded-2xl! bg-gray-100/50! p-2 backdrop-blur-sm">
      <p className="text-lg font-bold">العناوين المسجله</p>
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
                  })
                }
                className={`w-[180px] shrink-0 rounded-xl border p-2 text-start transition-all ${
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
          لا توجد عناوين محفوظة
        </p>
      )}
    </div>
  );
}
