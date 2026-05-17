export interface CarContent {
  ccbId: number;
  carNameEn: string
  carNameAr: string
  companyName: string;
  companyNameAr: string;
  carImage: string;
  companyCarCode: string;
  price: number | null;
  companyCarStatus: string;
  ccId: number;
  companyLogo: string;
  brandNameEnglish: string;
  brandNameArabic: string;
  typeNameEnglish: string;
  typeNameArabic: string;
  brandName: string;
  typeName: string;
  categoryNameEnglish: string;
  categoryNameArabic: string;
  categoryIcon: string;
  year: number;
  otherSpecs: string;
  otherSpecsEnglish: string;
  daysForFreeDelivery: number | null;
  allowedKm: number | null;
  unlimitedKm: number | null;
  unlimitedKmPrice: number | null;
  deliveryInMinutes: number | null;
  totalBranches: number | null;
  totalCarsInBranches: number | null;
  dailyPrice: number | null;
  offerDailyPrice: number | null;
  weeklyPrice: number | null;
  offerWeeklyPrice: number | null;
  halfMonthPrice: number | null;
  offerHalfMonthPrice: number | null;
  monthlyPrice: number | null;
  offerMonthlyPrice: number | null;
  yearlyPrice: number | null;
  offerYearlyPrice: number | null;
  serviceIds: number[];
  offerType: string | null;
  offerValue: number | null;
  categoryName: string;
  /** Present when listings are grouped by branch (company-cars API, offers, etc.). */
  branchId?: number | null;
  branchName?: string | null;
  branchEnglishName?: string | null;
  branchArabicName?: string | null;
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

export interface CarApiResponse {
  content: CarContent[];
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
