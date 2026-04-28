"use client";

import GoogleMapsPolyLineLocation from "../../mapsLocation/GoogleMapsPolyLinedLocation";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

const BranchesLocations = () => {
  const { carDetails } = useBookedCarDetailsStore();

  if (!carDetails?.latitude || !carDetails?.longitude) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-visible rounded-2xl">
      <GoogleMapsPolyLineLocation
        hideUserLocation
        containerHeight="100%"
        destinationLat={carDetails.latitude}
        destinationLng={carDetails.longitude}
        disableMapClickToChangeLocation
        destinationName={carDetails.branchName}
        destinationLogoUrl={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${carDetails.company.logo}`}
        autoFitBounds={true}
        hideSearch={true}
      />
    </div>
  );
};

export default BranchesLocations;
