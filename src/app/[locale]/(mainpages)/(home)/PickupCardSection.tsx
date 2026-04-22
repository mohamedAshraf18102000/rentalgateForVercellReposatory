import { PickUpCardDetails } from "@/types/pickUpTypes";
import PickupCardSectionClient from "./PickupCardSectionClient";

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
    description: "أينما تكن, سياراتك ستكون في إنتظارك",
    image: "/pickupCard/Showroom.png",
  },
];

export default function PickUpCardsSection() {
  return <PickupCardSectionClient pickupCardDetails={pickupCardDetails} />;
}
