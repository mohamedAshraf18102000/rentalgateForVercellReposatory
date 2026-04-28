"use client";
import GoogleMapsLocation from "../../mapsLocation/GoogleMapsLocation";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";

const HomeBranchesLocations = () => {
  const { setFormData } = useBookedCarDetailsStore();
  const { setFilter } = useUserPreferedFiltersStore();
  const { setIsUnsavedMapLocation } = usePickupDialogStore();

  const handleBranchMapSelection = (
    lat: number,
    lng: number,
    address: string,
  ) => {
    setFormData({
      pickupType: "BRANCH",
      branchId: null,
      pickupName: address || "",
      pickupLat: lat,
      pickupLong: lng,
      pickupId: null,
      pickupAirportId: null,
      pickupTrainId: null,
    });

    // Keep filters draft in sync so save/location dialogs have current values.
    setFilter("pickupName", address || "");
    setFilter("pickupLat", lat);
    setFilter("pickupLng", lng);
    setFilter("pickupType", "branches");
    setFilter("pickupId", "");
    setFilter("pickupAirportId", undefined);
    setFilter("pickupTrainId", undefined);

    setIsUnsavedMapLocation(false);
  };

  return (
    <GoogleMapsLocation
      storeless
      onLocationChange={(lat, lng, address) =>
        handleBranchMapSelection(lat, lng, address)
      }
    />
  );
};

export default HomeBranchesLocations;
