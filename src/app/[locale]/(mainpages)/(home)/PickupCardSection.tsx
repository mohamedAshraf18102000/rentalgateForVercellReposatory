import { PickUpCardDetails } from "@/types/pickUpTypes";
import PickupCardSectionClient from "./PickupCardSectionClient";
import { useTranslations } from "next-intl";

export default function PickUpCardsSection() {
  const t = useTranslations("home");

  const pickupCardDetails: PickUpCardDetails[] = [
    {
      key: "airport",
      title: t("pickupCards.airport.title"),
      description: t("pickupCards.airport.description"),
      image: "/pickupCard/Airport.png",
    },
    {
      key: "trainStation",
      title: t("pickupCards.trainStation.title"),
      description: t("pickupCards.trainStation.description"),
      image: "/pickupCard/Train.png",
    },
    {
      key: "branches",
      title: t("pickupCards.branches.title"),
      description: t("pickupCards.branches.description"),
      image: "/pickupCard/Showroom.png",
    },
    {
      key: "currentLocation",
      title: t("pickupCards.currentLocation.title"),
      description: t("pickupCards.currentLocation.description"),
      image: "/pickupCard/Showroom.png",
    },
  ];

  return <PickupCardSectionClient pickupCardDetails={pickupCardDetails} />;
}
