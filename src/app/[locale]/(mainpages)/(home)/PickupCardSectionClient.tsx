"use client";

import { useEffect, useState } from "react";
import PickUpCard from "@/app/(components)/customCards/PickUpCard";
import CurrentLocationPickupCard from "@/app/(components)/customCards/CurrentLocationPickupCard";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useRouter } from "next/navigation";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { PickUpCardDetails } from "@/types/pickUpTypes";

interface PickupCardSectionClientProps {
  pickupCardDetails: PickUpCardDetails[];
}

export default function PickupCardSectionClient({
  pickupCardDetails,
}: PickupCardSectionClientProps) {
  const address = useLocationStore((state) => state.address);
  const openLocationDialog = useLocationStore((state) => state.openDialog);
  const { openDialog } = usePickupDialogStore();
  const router = useRouter();
  const [pendingLocationNavigation, setPendingLocationNavigation] =
    useState(false);

  useEffect(() => {
    if (pendingLocationNavigation && address !== null) {
      setPendingLocationNavigation(false);
      router.push(`/bookings`);
    }
  }, [address, pendingLocationNavigation, router]);

  const hadnleLocationClick = () => {
    if (address === null) {
      setPendingLocationNavigation(true);
      openLocationDialog();
      return;
    }

    router.push(`/bookings`);
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
              onClick={hadnleLocationClick}
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
