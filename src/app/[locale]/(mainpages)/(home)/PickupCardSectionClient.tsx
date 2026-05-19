"use client";

import PickUpCard from "@/app/(components)/customCards/PickUpCard";
import CurrentLocationPickupCard from "@/app/(components)/customCards/CurrentLocationPickupCard";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { PickUpCardDetails } from "@/types/pickUpTypes";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useRouter } from "next/navigation";

interface PickupCardSectionClientProps {
  pickupCardDetails: PickUpCardDetails[];
}

export default function PickupCardSectionClient({
  pickupCardDetails,
}: PickupCardSectionClientProps) {
  const router = useRouter();
  const { openDialog } = usePickupDialogStore();
  const { openDialog: openLocationDialog } = useLocationStore();

  const handleLocationClick = () => {
    openLocationDialog("filterComponent");
  };

  const handleShowResultsClick = () => {
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
              image={card.image}
              title={card.title}
              description={card.description}
              onClick={handleLocationClick}
              onShowResultsClick={handleShowResultsClick}
            />
          ) : (
            <div className="xl:min-h-[450px]">
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
