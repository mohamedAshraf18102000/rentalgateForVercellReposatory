export interface AirportsResponse {
  content: Airport[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Airport {
  airportId: number;
  englishName: string;
  arabicName: string;
  cityId: number;
  cityEnglishName: string | null;
  cityArabicName: string | null;
  latitude: number;
  longitude: number;
  notes: string;
  status: "ACTIVE" | "INACTIVE";
  name: string;
  cityName: string | null;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
