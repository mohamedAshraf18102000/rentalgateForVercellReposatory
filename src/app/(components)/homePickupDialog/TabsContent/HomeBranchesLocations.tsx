"use client";
import { useEffect, useState } from "react";
import GoogleMapsLocation from "../../mapsLocation/GoogleMapsLocation";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { UserSavedAddresses } from "@/app/[locale]/(dialogs)/PickupDialog/UserSavedAddresses";
import { getUserAddress } from "@/services/userProfile/getUserAddress.service";
import { UserAddress } from "@/types/userProfile/userAddress";

const HomeBranchesLocations = () => {
  const { setFilter } = useUserPreferedFiltersStore();
  const { setIsUnsavedMapLocation } = usePickupDialogStore();
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [tempLocation, setTempLocationState] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  useEffect(() => {
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
  }, []);

  const handleBranchMapSelection = (
    lat: number,
    lng: number,
    address: string,
  ) => {
    setFilter("pickupName", address || "");
    setFilter("pickupLat", lat);
    setFilter("pickupLng", lng);
    setFilter("pickupType", "branches");
    setFilter("pickupId", "");
    setFilter("pickupAirportId", undefined);
    setFilter("pickupTrainId", undefined);

    setIsUnsavedMapLocation(false);
  };

  const setTempLocation = (location: { lat: number; lng: number; address: string }) => {
    setTempLocationState(location);
    handleBranchMapSelection(location.lat, location.lng, location.address);
  };

  return (
    <div className="relative">
      <GoogleMapsLocation
        storeless
        selectedLat={tempLocation?.lat}
        selectedLng={tempLocation?.lng}
        onLocationChange={(lat, lng, address) => setTempLocation({ lat, lng, address })}
      />
      <UserSavedAddresses
        userAddresses={userAddresses}
        tempLocation={tempLocation}
        setTempLocation={setTempLocation}
      />
    </div>
  );
};

export default HomeBranchesLocations;
