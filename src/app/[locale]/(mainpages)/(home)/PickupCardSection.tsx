"use client";

import { useState } from "react";
import PickUpCard from "@/app/(components)/customCards/PickUpCard";
import { DialogWrapper } from "@/app/(components)/ui/dialog-wrapper";
import CarPickupDialogTabs from "@/app/(components)/carPickupDialogComponent/CarPickupDialogTabs";
import { PickUpCardDetails } from "@/types/pickUpTypes";
import CurrentLocationPickupCard from "@/app/(components)/customCards/CurrentLocationPickupCard";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";

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
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] =
    useState<PickUpCardDetails["key"]>("currentLocation");

  const handleCardClick = (key: PickUpCardDetails["key"]) => {
    setActiveTab(key);
    setOpen(true);
  };

  return (
    <>
      <DialogWrapper
        open={open}
        onOpenChange={setOpen}
        size="lg"
        trigger={
          <div className="grid grid-cols-3 gap-4 w-full items-center justify-items-center">
            {pickupCardDetails.map((card) => (
              <div
                key={card.key}
                className={
                  card.key === "currentLocation" ? "col-span-3 w-full" : ""
                }
              >
                {card.key === "currentLocation" ? (
                  <div onClick={() => handleCardClick(card.key)}>
                    <CurrentLocationPickupCard
                      title={card.title}
                      description={card.description}
                    />
                  </div>
                ) : (
                  <PickUpCard
                    title={card.title}
                    description={card.description}
                    image={card.image}
                    onClick={() => handleCardClick(card.key)}
                  />
                )}
              </div>
            ))}
          </div>
        }
        header={{ mainTitle: "مكان الأستلام" }}
        content={<CarPickupDialogTabs customDefaultValue={activeTab} />}
        footer={
          <div className="w-full flex items-center justify-end gap-2 mt-2">
            <button
              onClick={() => setOpen(false)}
              className="py-3 text-primary font-normal w-fit px-2 underline underline-offset-3"
            >
              إغلاق
            </button>

            <button className="rounded-[12px] py-3 bg-primary text-white font-bold w-fit px-5">
              أظهار النتائج
            </button>
          </div>
        }
      />
    </>
  );
}
