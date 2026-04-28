"use client";

import { useMemo } from "react";
import PickUpCard from "@/app/(components)/customCards/PickUpCard";
import CurrentLocationPickupCard from "@/app/(components)/customCards/CurrentLocationPickupCard";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { PickUpCardDetails } from "@/types/pickUpTypes";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useRouter } from "next/navigation";

interface PickupCardSectionClientProps {
  pickupCardDetails: PickUpCardDetails[];
}

export default function PickupCardSectionClient({
  pickupCardDetails,
}: PickupCardSectionClientProps) {
  const router = useRouter();
  const { openDialog } = usePickupDialogStore();
  const {
    openDialog: openLocationDialog,
    confirmedDialogAddress,
    confirmedDialogLatitude,
    confirmedDialogLongitude,
  } = useLocationStore();
  const { appliedFilters, setFilter, applyFilters } = useUserPreferedFiltersStore();

  const hasAppliedCurrentLocationFilter =
    appliedFilters.pickupType === "currentLocation" &&
    !!appliedFilters.pickupName &&
    typeof appliedFilters.pickupLat === "number" &&
    typeof appliedFilters.pickupLng === "number";

  const selectedPickupAddress = useMemo(() => {
    if (hasAppliedCurrentLocationFilter) {
      return appliedFilters.pickupName;
    }
    return confirmedDialogAddress ?? "";
  }, [
    hasAppliedCurrentLocationFilter,
    appliedFilters.pickupName,
    confirmedDialogAddress,
  ]);

  const resolvedPickupCoordinates = useMemo(() => {
    const lat =
      hasAppliedCurrentLocationFilter
        ? appliedFilters.pickupLat
        : typeof confirmedDialogLatitude === "number"
          ? confirmedDialogLatitude
          : undefined;
    const lng =
      hasAppliedCurrentLocationFilter
        ? appliedFilters.pickupLng
        : typeof confirmedDialogLongitude === "number"
          ? confirmedDialogLongitude
          : undefined;

    return { lat, lng };
  }, [
    hasAppliedCurrentLocationFilter,
    appliedFilters.pickupLat,
    appliedFilters.pickupLng,
    confirmedDialogLatitude,
    confirmedDialogLongitude,
  ]);

  const hasValidPickupSelection = useMemo(() => {
    return Boolean(
      selectedPickupAddress &&
        typeof resolvedPickupCoordinates.lat === "number" &&
        typeof resolvedPickupCoordinates.lng === "number",
    );
  }, [selectedPickupAddress, resolvedPickupCoordinates.lat, resolvedPickupCoordinates.lng]);

  const hadnleLocationClick = () => {
    openLocationDialog("homeCard");
  };

  const handleShowResultsClick = () => {
    if (hasValidPickupSelection) {
      setFilter("pickupType", "currentLocation");
      setFilter("pickupName", selectedPickupAddress);
      setFilter("pickupLat", resolvedPickupCoordinates.lat);
      setFilter("pickupLng", resolvedPickupCoordinates.lng);
      setFilter("pickupId", "");
      setFilter("pickupAirportId", undefined);
      setFilter("pickupTrainId", undefined);
      applyFilters();
    }
    router.push("/bookings");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch justify-items-center">
      {pickupCardDetails.map((card) => (
        <div
          key={card.key}
          className={
            card.key === "currentLocation"
              ? "col-span-1 md:col-span-2 lg:col-span-3 w-full"
              : "w-full"
          }
        >
          {card.key === "currentLocation" ? (
            <CurrentLocationPickupCard
              title={card.title}
              description={card.description}
              selectedAddress={selectedPickupAddress}
              onClick={hadnleLocationClick}
              onShowResultsClick={handleShowResultsClick}
            />
          ) : (
            <div className="xl:min-h-[480px]">
              <PickUpCard
                title={card.title}
                description={card.description}
                image={card.image}
                onClick={() => openDialog(card.key)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
