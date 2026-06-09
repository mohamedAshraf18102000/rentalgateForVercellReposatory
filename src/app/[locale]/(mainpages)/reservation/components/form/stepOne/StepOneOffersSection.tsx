"use client";

import OffersCard from "@/app/(components)/customCards/OffersCard";
import { Separator } from "@/app/(components)/ui/separator";
import ExeclusiveOfferIcon from "@/constants/icons/ExeclusiveOfferIcon";
import { OfferPackage } from "@/types/companyCars/carDetails";
import { useLocale } from "next-intl";
import { formatOfferRecommendedEndDate } from "./stepOneDateTimeUtils";

interface StepOneOffersSectionProps {
  bestOffer: OfferPackage | null | undefined;
  offerPackages: OfferPackage[] | undefined;
  fromDate: Date | undefined;
  rentalDays: number;
  daysCountLabel: (count: number) => string;
  offerTextPrefix: string;
  offersTitle: string;
}

const StepOneOffersSection = ({
  bestOffer,
  offerPackages,
  fromDate,
  rentalDays,
  daysCountLabel,
  offerTextPrefix,
  offersTitle,
}: StepOneOffersSectionProps) => {
  const locale = useLocale();
  if (!offerPackages || offerPackages.length === 0) {
    return bestOffer ? (
      <div className="bg-StatusGreen p-2 rounded-xl flex items-center justify-center gap-3 text-StatusDarkGreen mt-5">
        <div className="scale-130">
          <ExeclusiveOfferIcon />
        </div>

        <p className="flex gap-1 items-center">
          <span className="text-sm font-extrabold">
            {daysCountLabel(bestOffer.extraDays)}
          </span>
          <span>{offerTextPrefix}</span>
          <span className="text-sm font-extrabold">
            {daysCountLabel(bestOffer.days)}
          </span>
        </p>
      </div>
    ) : null;
  }

  return (
    <>
      {bestOffer && (
        <div className="bg-StatusGreen p-2 rounded-xl flex items-center justify-center gap-3 text-StatusDarkGreen mt-5">
          <div className="scale-130">
            <ExeclusiveOfferIcon />
          </div>

          <p className="flex gap-1 items-center">
            <span className="text-sm font-extrabold">
              {daysCountLabel(bestOffer.extraDays)}
            </span>
            <span>{offerTextPrefix}</span>
            <span className="text-sm font-extrabold">
              {daysCountLabel(bestOffer.days)}
            </span>
          </p>
        </div>
      )}
      <Separator className="my-2" />
      <div className="mb-6">
        <p className="text-base">{offersTitle}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offerPackages.map((offer) => {
          const targetRentalDays = offer.days + offer.extraDays;
          const warnToTakeOfferDate = formatOfferRecommendedEndDate(
            fromDate,
            offer,
            locale,
          );

          return (
            <OffersCard
              key={offer.ccoId}
              offerPackage={offer}
              warningAvailable={
                warnToTakeOfferDate !== "" && rentalDays < targetRentalDays
              }
              warnToTakeOfferDate={warnToTakeOfferDate}
            />
          );
        })}
      </div>
    </>
  );
};

export default StepOneOffersSection;
