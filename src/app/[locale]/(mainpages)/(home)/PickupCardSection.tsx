"use client";

import PickUpCard from "@/app/(components)/customCards/PickUpCard";
import { PickUpCardDetails } from "@/types/pickUpTypes";
import CurrentLocationPickupCard from "@/app/(components)/customCards/CurrentLocationPickupCard";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";

const pickupCardDetails: PickUpCardDetails[] = [
  {
    key: "airport",
    title: "من محطة المطار",
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
    <div className="grid grid-cols-3 gap-4 w-full items-center justify-items-center">
      {pickupCardDetails.map((card) => (
        <div
          key={card.key}
          className={card.key === "currentLocation" ? "col-span-3 w-full" : ""}
        >
          {card.key === "currentLocation" ? (
            <CurrentLocationPickupCard
              title={card.title}
              description={card.description}
              onClick={() => openDialog(card.key)}
            />
          ) : (
            <PickUpCard
              title={card.title}
              description={card.description}
              image={card.image}
              onClick={() => openDialog(card.key)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
