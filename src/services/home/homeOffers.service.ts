import { fetcher } from "../api";
import { IOffersResponse } from "@/types/home/homeOffers";

/** Call `getHomePageOffers` only when this returns true — do not invoke the fetch otherwise. */
export function hasHomeOffersCoordinates(
  latitude: string,
  longitude: string,
): boolean {
  return Boolean(latitude?.trim() && longitude?.trim());
}

export const getHomePageOffers = async (
  latitude: string,
  longitude: string,
): Promise<IOffersResponse> => {
  const params = new URLSearchParams({
    latitude,
    longitude,
  });

  return fetcher<IOffersResponse>(
    `/company-offers/nearest?${params.toString()}`,
    {
      method: "GET",
      skipErrorToast: true,
    }
  );
};