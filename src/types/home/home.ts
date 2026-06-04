export type Banner = {
  bannerId: number;
  bannerName: string;
  bannerType: string;
  objId: number;
  image: string;
  englishImage: string | null;
  status: string;
};

export type CarCategory = {
  categoryId: number;
  englishName: string;
  arabicName: string;
  icon: string;
  notes: string;
  status: string;
  name: string;
};

export type Company = {
  id: number;
  averageRating: number;
  englishName: string;
  arabicName: string;
  countryId: number;
  driverService: string;
  driverServiceOutside: string;
  logo: string;
  name: string;
};

export type LatestOffer = {
  offerId: number;
  englishName: string;
  arabicName: string;
  image: string;
  englishImage: string;
  companyNameEnglish: string;
  companyNameArabic: string;

  branchEnglishName: string;
  branchArabicName: string;

  startDate: string;
  endDate: string;
  offerStatus: string;
  offerType: number;
  offerTypeDescription: string;
  offerValue: number;
  offerCars: number;
  offerCarsDescription: string;
};

export type TodaysOfferSelectedCar = {
  ccbId: number;
  categoryNameArabic: string;
  brandNameArabic: string;
  typeNameArabic: string;
  yearName: string;
  carName: string;
  companyCarCode: string | null;
  status: string;
};

export type TodaysOffer = {
  offerId: number;
  branchId: number;
  branchEnglishName: string;
  branchArabicName: string;
  companyId: number;
  companyNameEnglish: string;
  companyNameArabic: string;
  creationDate: string;
  startDate: string;
  endDate: string;
  englishName: string;
  arabicName: string;
  image: string;
  englishImage: string;
  detailsEnglish: string;
  detailsArabic: string;
  offerType: number;
  offerTypeDescription: string;
  offerValue: number;
  offerStatus: string;
  offerCars: number;
  offerCarsDescription: string;
  notes: string;
  selectedCars: TodaysOfferSelectedCar[];

  name: string;
  companyName: string;
  details: string;
};

export type Currency = {
  currencyId: number;
  englishName: string;
  arabicName: string;
  symbole: string;
  lastPrice: number;
  notes: string;
  name: string;
};

export type Country = {
  countryId: number;
  englishName: string;
  arabicName: string;
  currency: Currency;
  latitude: number | null;
  longitude: number | null;
  flag: string;
  notes: string;
  name: string;
};

export type Client = {
  clientId: number;
  clientName: string;
  creationDate: string;
  mobile: string;
  email: string;
  country: Country;
  city: unknown | null;
  residenceType: number;
  nationality: string;
  licenseExpirationDate: string;
  licenseImage: string;
  profileImage: string | null;
  personalId: string;
  borderNumber: string | null;
  passportNumber: string | null;
  referralCode: string | null;
  notes: string | null;
  status: string;
};

export type LastSeenCompany = {
  companyId: number;
  averageRating: number;
  englishName: string;
  arabicName: string;
  logo: string;
  companyStatus: string;
  driverService: string | null;
  driverServiceOutside: string | null;
  dayNumberHoursForDriverServiceInside: number | null;
  dayNumberHoursForDriverServiceOutside: number | null;
  name: string;
};

export type LastSeenCar = {
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
  otherSpecs: string | null;
  otherSpecsEnglish: string | null;
  categoryName: string;
};

export type LastSeenCompanyCarBranch = {
  ccbId: number;
  company: LastSeenCompany;
  car: LastSeenCar;
  companyCarCode: string;
  companyCarStatus: string;
  deliveryInMinutes: number | null;
  allowedLateHours: number;
  extraLateHourPrice: number;
  allowedKm: number;
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
  showRating: number | null;
  notes: string | null;
  offerType: number | null;
  offerValue: number | null;

  branches: unknown[] | null;
  kilometerPackages: unknown[] | null;
  offerPackages: unknown[] | null;
  serviceIds: unknown[] | null;
  airports: unknown[] | null;
  trainStations: unknown[] | null;
  ratings: unknown[] | null;
};

export type LastSeen = {
  historyId: number;
  client: Client;
  companyCarBranch: LastSeenCompanyCarBranch;
  historyDate: string;
  notes: string;
};

export type CurrentReservation = {
  reservationId: number;
  carName: string;
  carImage: string;
  carBrandArabicName: string;
  carBrandEnglishName: string;
  carTypeArabicName: string;
  carTypeEnglishName: string;
  carCategoryArabicName: string;
  carCategoryEnglishName: string;
  year: number;
  startDate: string;
  endDate: string;
  reservationStatus: string;
  receiveType: string;
  extended: boolean | null;
  ccid: number;
};

export type HomeResponse = {
  banners: Banner[];
  carCategories: CarCategory[];
  companies: Company[];
  latestOffers: LatestOffer[];
  todayOffers: TodaysOffer[];

  lastSeen: LastSeen[];

  currentReservation: CurrentReservation | null;
};