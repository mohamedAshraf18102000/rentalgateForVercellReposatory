import { fetcher } from "../api";
import { CarApiResponse } from "@/types/companyCars/cars";

export interface CarFilters {
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  locationType?: string;
  airportId?: string;
  trainStationId?: string;
  brandId?: string;
  typeId?: string;
  latitude?: number;
  longitude?: number;
  page?: string | number;
  size?: string | number;
  searchType?: string;
  priceType?: string;
  sortBy?: string;
  userPhysicalLongitudeFilter?: number;
  userPhysicalLatitudeFilter?: number;
}

export const getCompanyCars = async (
  page: number = 1,
  filters?: CarFilters,
): Promise<CarApiResponse> => {
  const hasAppliedFilters = Boolean(
    filters &&
    [
      filters.minPrice,
      filters.maxPrice,
      filters.categoryId,
      filters.locationType,
      filters.airportId,
      filters.trainStationId,
      filters.brandId,
      filters.typeId,
      filters.searchType,
      filters.priceType,
      filters.sortBy,
      filters.longitude,
      filters.latitude,
    ].some((value) => value !== undefined && value !== null && value !== ""),
  );

  if (!hasAppliedFilters) {
    const latitude = filters?.userPhysicalLatitudeFilter ?? "";
    const longitude = filters?.userPhysicalLongitudeFilter ?? "";

    return fetcher<CarApiResponse>(
      `/company-cars?latitude=${latitude}&longitude=${longitude}`,
    );
  }

  const query: string[] = [];

  // required params
  query.push(`page=${filters?.page ?? page}`);
  query.push(`size=${filters?.size ?? 20}`);

  // helper function
  const addParam = (key: string, value?: string | number) => {
    if (value !== undefined && value !== null && value !== "") {
      query.push(`${key}=${value}`);
    }
  };

  if (filters) {
    const hasAirport =
      filters.airportId !== undefined &&
      filters.airportId !== null &&
      filters.airportId !== "";
    const hasTrainStation =
      filters.trainStationId !== undefined &&
      filters.trainStationId !== null &&
      filters.trainStationId !== "";

    // Backend expects different searchType based on the active location.
    const searchTypeToUse = hasAirport
      ? "airport"
      : hasTrainStation
        ? "train"
        : filters.searchType ?? "location";

    addParam("maxPrice", filters.maxPrice);
    addParam("minPrice", filters.minPrice);
    addParam("categoryId", filters.categoryId);
    addParam("airportId", filters.airportId);
    addParam("trainStationId", filters.trainStationId);
    addParam("brandId", filters.brandId);
    addParam("typeId", filters.typeId);
    addParam("locationType", filters.locationType);

    // params إضافية
    addParam("searchType", searchTypeToUse);
    addParam("priceType", filters.priceType ?? "");
    addParam("sortBy", filters.sortBy ?? "");

    // When searching by airport/train station, backend does not accept lat/lng.
    if (!(hasAirport || hasTrainStation)) {
      if (filters.latitude != null) {
        query.push(`latitude=${filters.latitude}`);
      }

      if (filters.longitude != null) {
        query.push(`longitude=${filters.longitude}`);
      }
    }
  }

  const queryString = query.join("&");

  return fetcher<CarApiResponse>(
    `/company-cars/filter-and-sort?${queryString}`,
  );
};
