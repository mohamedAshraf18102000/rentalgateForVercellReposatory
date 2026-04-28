"use client";

import { useEffect } from "react";
import { UserAddress } from "@/types/userProfile/userAddress";

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
}

const AUTO_SELECT_DISTANCE_KM = 0.2;

const toRadians = (value: number) => (value * Math.PI) / 180;

const getDistanceInKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export function UserSavedAddresses({
  userAddresses,
  tempLocation,
  setTempLocation,
}: UserSavedAddressesProps) {
  useEffect(() => {
    if (!tempLocation || !userAddresses?.length) {
      return;
    }

    const nearestAddress = userAddresses.reduce<{
      address: UserAddress;
      distance: number;
    } | null>((nearest, currentAddress) => {
      const distance = getDistanceInKm(
        tempLocation.lat,
        tempLocation.lng,
        currentAddress.latitude,
        currentAddress.longitude,
      );

      if (!nearest || distance < nearest.distance) {
        return { address: currentAddress, distance };
      }

      return nearest;
    }, null);

    if (
      !nearestAddress ||
      nearestAddress.distance > AUTO_SELECT_DISTANCE_KM ||
      (tempLocation.lat === nearestAddress.address.latitude &&
        tempLocation.lng === nearestAddress.address.longitude &&
        tempLocation.address === nearestAddress.address.addressName)
    ) {
      return;
    }

    setTempLocation({
      lat: nearestAddress.address.latitude,
      lng: nearestAddress.address.longitude,
      address: nearestAddress.address.addressName,
      addressId: nearestAddress.address.addressId,
    });
  }, [tempLocation, userAddresses, setTempLocation]);

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
                    addressId: savedAddress.addressId,
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
