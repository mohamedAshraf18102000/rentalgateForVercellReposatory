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
  name?: string;
  userPhysicalLongitudeFilter?: number;
  userPhysicalLatitudeFilter?: number;
}

const hasAppliedFilters = (filters?: CarFilters): boolean =>
  Boolean(
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
      filters.priceType,
      filters.sortBy,
      filters.name,
    ].some((value) => value !== undefined && value !== null && value !== ""),
  );

export const getCompanyCars = async (
  page: number = 1,
  filters?: CarFilters,
): Promise<CarApiResponse> => {
  const query: string[] = [];

  query.push(`page=${filters?.page ?? page}`);
  query.push(`size=${filters?.size ?? 20}`);

  if (!hasAppliedFilters(filters)) {
    const latitude =
      filters?.userPhysicalLatitudeFilter ?? filters?.latitude;
    const longitude =
      filters?.userPhysicalLongitudeFilter ?? filters?.longitude;

    if (latitude != null) {
      query.push(`latitude=${latitude}`);
    }

    if (longitude != null) {
      query.push(`longitude=${longitude}`);
    }

    if (filters?.searchType) {
      query.push(`searchType=${filters.searchType}`);
    }
  } else if (filters) {
    const addParam = (key: string, value?: string | number) => {
      if (value !== undefined && value !== null && value !== "") {
        query.push(`${key}=${value}`);
      }
    };

    const hasAirport =
      filters.airportId !== undefined &&
      filters.airportId !== null &&
      filters.airportId !== "";
    const hasTrainStation =
      filters.trainStationId !== undefined &&
      filters.trainStationId !== null &&
      filters.trainStationId !== "";

    addParam("maxPrice", filters.maxPrice);
    addParam("minPrice", filters.minPrice);
    addParam("categoryId", filters.categoryId);
    addParam("airportId", filters.airportId);
    addParam("trainStationId", filters.trainStationId);
    addParam("brandId", filters.brandId);
    addParam("typeId", filters.typeId);
    addParam("locationType", filters.locationType);

    if (hasAirport) {
      addParam("searchType", "airport");
    } else if (hasTrainStation) {
      addParam("searchType", "train");
    } else if (filters.searchType) {
      addParam("searchType", filters.searchType);
    }
    addParam("priceType", filters.priceType ?? "");
    addParam("sortBy", filters.sortBy ?? "");
    addParam("name", filters.name);

    if (!(hasAirport || hasTrainStation)) {
      const latitudeToUse =
        filters.latitude ?? filters.userPhysicalLatitudeFilter;
      const longitudeToUse =
        filters.longitude ?? filters.userPhysicalLongitudeFilter;

      if (latitudeToUse != null) {
        query.push(`latitude=${latitudeToUse}`);
      }

      if (longitudeToUse != null) {
        query.push(`longitude=${longitudeToUse}`);
      }
    }
  }

  const queryString = query.join("&");

  return fetcher<CarApiResponse>(
    `/company-cars/filter-and-sort?${queryString}`,
  );
};