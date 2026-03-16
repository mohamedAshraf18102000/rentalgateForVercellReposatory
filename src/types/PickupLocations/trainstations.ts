export interface StationsResponse {
  content: Station[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Station {
  stationId: number;
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
  stationName: string;
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
