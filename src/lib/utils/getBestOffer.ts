import { OfferPackage } from "@/types/companyCars/carDetails";

export const getBestOffer = (offers: OfferPackage[], rentalDays: number) => {
    return offers
        .filter(o => rentalDays > o.days)
        .sort((a, b) => b.days - a.days)[0];
};