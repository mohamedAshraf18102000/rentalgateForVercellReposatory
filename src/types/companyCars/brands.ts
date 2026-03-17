export interface Brand {
  brandId: number;
  englishName: string;
  arabicName: string;
  home: number;
  icon: string;
  notes: string;
  status: "ACTIVE" | "INACTIVE";
  name: string;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface BrandsResponse {
  content: Brand[];
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
