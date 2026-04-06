"use client";

import PickUpCard from "@/app/(components)/customCards/PickUpCard";
import { PickUpCardDetails } from "@/types/pickUpTypes";
import CurrentLocationPickupCard from "@/app/(components)/customCards/CurrentLocationPickupCard";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";

const pickupCardDetails: PickUpCardDetails[] = [
  {
    key: "airport",
    title: "من المطار",
    description: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي",
    image: "/pickupCard/Airport.png",
  },
  {
    key: "trainStation",
    title: "من محطة القطار",
    description: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي",
    image: "/pickupCard/Train.png",
  },
  {
    key: "branches",
    title: "من المعرض",
    description: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي",
    image: "/pickupCard/Showroom.png",
  },
  {
    key: "currentLocation",
    title: "أو من أي موقع أينما كان",
    description: "إينما تكن, سياراتك ستكون في إنتظارك",
    image: "/pickupCard/Showroom.png",
  },
];

export default function PickUpCardsSection() {
  const { openDialog } = usePickupDialogStore();

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
            <>
              <CurrentLocationPickupCard
                title={card.title}
                description={card.description}
                onClick={() => openDialog(card.key)}
              />
            </>
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
