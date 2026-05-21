export interface CarDetailsResponse {
  ccbId: number;
  car: Car;
  company: Company;
  insuranceWithDeductible: number | null

  updateDate: string;

  numberOfCars: number;

  allowedLateHours: number;
  allowedKm: number;

  extraLateHourPrice: number;
  extraKmPrice: number;

  unlimitedKm: number;
  unlimitedKmPrice: number | null;

  daysForFreeDelivery: number | null;

  dailyPrice: number;
  offerDailyPrice: number;

  weeklyPrice: number;
  offerWeeklyPrice: number;

  halfMonthPrice: number;
  offerHalfMonthPrice: number;

  monthlyPrice: number;
  offerMonthlyPrice: number;

  yearlyPrice: number;
  offerYearlyPrice: number;

  showRating: boolean;

  workingHours: WorkingHours;

  // NEW: rate can be missing from response
  rate?: number;

  notes: string | null;

  ccId: number | null;
  companyCarCode: string | null;
  companyCarStatus: string | null;

  deliveryServiceAvailable: boolean;

  branchId: number;
  branchEnglishName: string;
  branchArabicName: string;
  branchStatus: string;
  branchType: number;

  mobile: string;
  address: string;
  mapLink: string;

  latitude: number;
  longitude: number;

  countryId: number;
  countryEnglishName: string;
  countryArabicName: string;
  countryFlag: string;

  cityId: number;
  cityEnglishName: string;
  cityArabicName: string;

  kilometerPackages: KilometerPackage[];
  offerPackages: OfferPackage[];

  serviceIds: number[];

  airports: Airport[];
  trainStations: TrainStation[];

  // UPDATED
  ratings: Rating[];

  // NEW
  specifications: Specification[];

  branchTypeDisplay: string;
  countryName: string;
  cityName: string;
  branchName: string;
}

export interface Car {
  carId: number;
  carCode: string;
  carName: string;

  brandName: string;
  typeName: string;

  categoryNameEnglish: string;
  categoryNameArabic: string;
  categoryIcon: string;

  brandNameEnglish: string;
  brandNameArabic: string;

  typeNameEnglish: string;
  typeNameArabic: string;

  year: number;

  image: string;

  // UPDATED: now can be null
  otherSpecs: string | null;
  otherSpecsEnglish: string | null;

  categoryName: string;
}

export interface Company {
  companyId: number;

  englishName: string;
  arabicName: string;

  logo: string;

  companyStatus: string;

  driverService: string;
  driverServiceOutside: string;

  // UPDATED: now can be null
  dayNumberHoursForDriverServiceInside: number | null;
  dayNumberHoursForDriverServiceOutside: number | null;

  name: string;
}

export interface KilometerPackage {
  cceId: number;
  km: number;
  price: number;
  notes: string | null;
}

export interface OfferPackage {
  ccoId: number;

  days: number;
  extraDays: number;

  startDate: string | null;
  endDate: string | null;

  applyOnFullCost: boolean;

  notes: string | null;
}

export interface Airport {
  caId: number;
  airportId: number;

  englishName: string;
  arabicName: string;

  cityId: number;

  latitude: number;
  longitude: number;

  contract: string;

  price: number;

  notes: string | null;

  name: string;
}

export interface TrainStation {
  ctId: number;
  stationId: number;

  englishName: string;
  arabicName: string;

  cityId: number;

  latitude: number;
  longitude: number;

  contract: string;

  price: number;

  notes: string | null;

  name: string;
}

export interface Rating {
  rateId: number;
  rateDate: string;

  rate: number;
  companyRate: number;

  comments: string | null;

  clientName: string;
  clientMobile: string;

  reservationId: number;
}

export interface Specification {
  specificationId: number;

  englishName: string;
  arabicName: string;

  icon: string | null;

  name: string;
}

export interface WorkingHourBreak {
  id: number;
  dayOfWeek:
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";
  startTime: string | null;
  endTime: string | null;
}

export interface WorkingHours {
  hourId: number;
  branchId: number;
  branchEnName: string;
  branchArName: string;

  sunOpenTime: string | null;
  monOpenTime: string | null;
  tueOpenTime: string | null;
  wedOpenTime: string | null;
  thuOpenTime: string | null;
  friOpenTime: string | null;
  satOpenTime: string | null;

  sunCloseTime: string | null;
  monCloseTime: string | null;
  tueCloseTime: string | null;
  wedCloseTime: string | null;
  thuCloseTime: string | null;
  friCloseTime: string | null;
  satCloseTime: string | null;

  breaks: WorkingHourBreak[];
}