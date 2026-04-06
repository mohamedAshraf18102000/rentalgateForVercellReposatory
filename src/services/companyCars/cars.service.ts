import { fetcher } from "../api";
import { CarApiResponse } from "@/types/companyCars/cars";

interface CarFilters {
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
  page?: string;
  size?: string;
}

export const getCompanyCars = async (
  page: number = 1,
  filters?: CarFilters,
): Promise<CarApiResponse> => {
  const query: string[] = [];

  // required params
  query.push(`page=${filters?.page ?? page}`);  
  query.push(`size=${filters?.size ?? 20}`);

  // helper function
  const addParam = (key: string, value?: string | number) => {
    if (value !== undefined && value !== null && value !== "") {
      query.push(`${key}=${value}`);
    } else {
      // 👈 هنا بنبعت key بس بدون value
      query.push(key);
    }
  };

  if (filters) {
    addParam("maxPrice", filters.maxPrice);
    addParam("minPrice", filters.minPrice);
    addParam("categoryId", filters.categoryId);
    addParam("airportId", filters.airportId);
    addParam("trainStationId", filters.trainStationId);
    addParam("brandId", filters.brandId);
    addParam("typeId", filters.typeId);

    // params إضافية
    addParam("searchType", "location"); // ثابتة حسب المثال
    addParam("priceType", ""); // أو حط القيمة لو عندك
    addParam("sortBy", ""); // نفس الكلام

    if (filters.latitude != null) {
      query.push(`latitude=${filters.latitude}`);
    }

    if (filters.longitude != null) {
      query.push(`longitude=${filters.longitude}`);
    }
  }

  const queryString = query.join("&");

  return fetcher<CarApiResponse>(
    `/company-cars/filter-and-sort?${queryString}`,
  );
};
