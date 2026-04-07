export interface CarDetailsResponse {
  ccbId: number;
  car: Car;
  company: Company;
  updateDate: string;
  numberOfCars: number;
  allowedLateHours: number;
  allowedKm: number;
  extraLateHourPrice: number;
  extraKmPrice: number;
  unlimitedKm: number;
  unlimitedKmPrice: number;
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
  rate: number;
  notes: string | null;
  ccId: number | null;
  companyCarCode: string | null;
  companyCarStatus: string | null;

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
  ratings: Rating[];

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
  otherSpecs: string;
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
  dayNumberHoursForDriverServiceInside: number;
  dayNumberHoursForDriverServiceOutside: number;
  name: string;
}

export interface KilometerPackage {
  cceId: number;
  km: number;
  price: number;
  notes: string | null;
}

export interface OfferPackage {}

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

export interface Rating {}
