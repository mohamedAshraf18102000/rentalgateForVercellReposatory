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
  startDate: string;
  endDate: string;
  offerStatus: string;
  offerType: number;
  offerTypeDescription: string;
  offerValue: number;
  offerCars: number;
  offerCarsDescription: string;
};

export type TodaysOffer = {
  offerId: number;
  branchId: number;
  branchEnglishName: string;
  branchArabicName: string;
  companyId: number;
  companyNameEnglish: string;
  companyNameArabic: string;
  creationDate: string; // ISO date
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
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
  selectedCars: {
    ccbId: number;
    categoryNameArabic: string;
    brandNameArabic: string;
    typeNameArabic: string;
    yearName: string;
    carName: string;
    companyCarCode: string | null;
    status: string;
  }[];

  name: string;
  companyName: string;
  details: string;
};

export type HomeResponse = {
  banners: Banner[];
  carCategories: CarCategory[];
  companies: Company[];
  latestOffers: LatestOffer[];
  todayOffers: TodaysOffer[];
};
