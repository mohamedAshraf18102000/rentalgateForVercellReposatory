// ─────────────────────────────
// Offer Car
// ─────────────────────────────
export interface OfferCar {
    ccbId: number;
    car: OfferedCar;
    company: Company;
    updateDate: string;

    numberOfCars: number;
    allowedLateHours: number;
    allowedKm: number;

    extraLateHourPrice: number;
    extraKmPrice: number;

    unlimitedKm: number;
    unlimitedKmPrice: number;

    daysForFreeDelivery: number;

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

// ─────────────────────────────
// Car
// ─────────────────────────────
export interface OfferedCar {
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
}

// ─────────────────────────────
// Company
// ─────────────────────────────
export interface Company {
    companyId: number;
    averageRating: number;
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

// ─────────────────────────────
// Packages
// ─────────────────────────────
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
    notes: string | null;
}

// ─────────────────────────────
// Locations
// ─────────────────────────────
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

// ─────────────────────────────
// Rating
// ─────────────────────────────
export interface Rating {
    rateId: number;
    rateDate: string;
    rate: number;
    companyRate: number;
    comments: string;
    clientName: string;
    clientMobile: string;
    reservationId: number;
}


export interface OfferCarsResponse {
    offerId: number;
    offerType: number;
    offerValue: number;
    cars: OfferCar[];
}