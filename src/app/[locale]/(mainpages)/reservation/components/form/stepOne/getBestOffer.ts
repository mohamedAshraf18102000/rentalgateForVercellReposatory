import { OfferPackage } from "@/types/companyCars/carDetails";

const getOfferTotalDays = (offer: OfferPackage) =>
  offer.days + offer.extraDays;

export const getBestOffer = (offers: OfferPackage[], rentalDays: number) => {
  if (rentalDays <= 0 || offers.length === 0) return undefined;

  const exactMatch = offers
    .filter((offer) => rentalDays === getOfferTotalDays(offer))
    .sort((a, b) => b.extraDays - a.extraDays)[0];

  if (exactMatch) return exactMatch;

  const qualifiedOffer = offers
    .filter((offer) => rentalDays >= getOfferTotalDays(offer))
    .sort((a, b) => {
      const totalDaysDiff = getOfferTotalDays(b) - getOfferTotalDays(a);
      if (totalDaysDiff !== 0) return totalDaysDiff;
      return b.extraDays - a.extraDays;
    })[0];

  if (qualifiedOffer) return qualifiedOffer;

  return offers
    .filter((offer) => rentalDays > offer.days)
    .sort((a, b) => {
      if (b.days !== a.days) return b.days - a.days;
      return b.extraDays - a.extraDays;
    })[0];
};
