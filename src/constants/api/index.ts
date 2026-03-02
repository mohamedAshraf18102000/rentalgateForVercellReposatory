import { normalizeImageUrl } from '@/util/image';
import { getAuthHeader } from '@/util/auth';

const API_BASE_URL = 'https://elmakam.net/api';

export const URL = (path: string) => {
  return `${API_BASE_URL}${path}`;
};

export interface CarApiResponse {
  carId: number;
  carStatus?: number | string; // يمكن أن يكون number أو string مثل "AVAILABLE"
  carName: string;
  carCode?: string;
  plateNumber?: string;
  images: string[];
  cover: string | null;
  image: string; // الصورة الرئيسية
  defaultImage?: string; // للتوافق مع الكود القديم
  numberOfDoors: number;
  numberOfPassengers: number;
  airCondition: boolean;
  insurancePrice: number;
  insuranceWeeklyPrice: number;
  insuranceMonthlyPrice: number;
  insuranceYearlyPrice: number;
  kmPrice: number;
  maxKm: number;
  extraHoursPrice?: number;
  offer: boolean;
  detailsEnglish: string;
  detailsArabic: string;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  yearlyPrice: number;
  offerDailyPrice: number;
  offerWeeklyPrice: number;
  offerMonthlyPrice: number;
  offerYearlyPrice: number;
  // الحقول الجديدة من API
  brandId?: number;
  modelId?: number;
  engineId?: number;
  yearId?: number;
  typeId?: number;
  showHome?: boolean;
  price?: number;
  systemId?: string;
  notes?: string;
  // الحقول القديمة (اختيارية للتوافق)
  brandName?: string;
  brandArabicName?: string;
  modelEnglishName?: string;
  modelArabicName?: string;
  carYear?: number;
  typeEnglishName?: string | null;
  typeArabicName?: string | null;
  finalPrice?: number;
  numOfDays?: number;
  datingType?: number;
  discountPercentage?: number;
  finalPriceBeforeDiscount?: number;
}

export interface CarDetailsApiResponse {
  message: string;
  data: CarApiResponse;
}

export interface CarsApiResponse {
  content: CarApiResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface FilterCarsApiResponse {
  message: string;
  data: CarsApiResponse;
}

export interface CarCardData {
  id: number;
  image: string;
  images: string[];
  category: string; // يمكن أن يكون أي نص من API
  categoryAr?: string; // النص العربي
  categoryEn?: string; // النص الإنجليزي
  title: string;
  mileage: number;
  oldPrice: number;
  currentPrice: number;
  hasDiscount: boolean;
  finalPriceBeforeDiscount?: number; // السعر النهائي قبل الخصم
  finalPrice?: number; // السعر النهائي
  numOfDays?: number; // عدد الأيام
  // الحقول المنفصلة لبناء العنوان بنفس تنسيق ReservationCard
  modelArabicName?: string;
  modelEnglishName?: string;
  brandArabicName?: string;
  brandName?: string;
  year?: number;
}

export interface OfferApiResponse {
  offerId: number;
  offerStatus: number;
  title: string;
  titleArabic: string;
  details: string;
  detailsArabic: string;
  terms: string;
  termsArabic: string;
  startDate: string;
  endDate: string;
  image: string;
  imageAr: string;
  notes: string;
}

export interface Banner {
  bannerId: number;
  bannerName: string;
  title: string;
  arabicTitle: string;
  image: string;
  arabicImage: string;
  englishText: string;
  arabicText: string;
  objType: string;
  objId: number;
  notes: string;
}

export interface HomeAllDataResponse {
  message: string;
  status: boolean;
  data: {
    offers: OfferApiResponse[];
    blogs: any[];
    welcomePoints: string;
    banners: Banner[];
  };
}

export const fetchHomeAllData = async (): Promise<HomeAllDataResponse> => {
  try {
    const res = await fetch(URL('/home'), {
      next: { revalidate: 300 }, // تخزين مؤقت لمدة 5 دقائق
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}. ${errorText}`);
    }

    const json: HomeAllDataResponse = await res.json();
    return json;
  } catch (error) {
    // إذا كان الخطأ من نوع Error، نعيده كما هو مع معلومات إضافية
    if (error instanceof Error) {
      throw new Error(`API Error in fetchHomeAllData: ${error.message}`);
    }
    throw error;
  }
};

export interface FilterCarsParams {
  page?: number;
  size?: number;
  typeIds?: number[];
  sort?: 'daily_price,desc' | 'daily_price,asc' | string;
  datingType?: number;
  startDate?: string;
  endDate?: string;
  cityId?: number;
  branchId?: number;
  carName?: string;
  showHome?: number;
  locale?: string;
}

export const fetchFilteredCars = async (params: FilterCarsParams = {}): Promise<CarCardData[]> => {
  const {
    page = 0,
    size = 100,
    typeIds = [],
    sort,
    datingType,
    startDate,
    endDate,
    cityId,
    branchId,
    carName,
    showHome,
    locale = 'ar',
  } = params;

  // بناء query parameters
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('size', size.toString());

  // إضافة typeIds متعددة
  typeIds.forEach((id) => {
    queryParams.append('typeIds', id.toString());
  });

  // إضافة sort - التنسيق الجديد: daily_price,desc
  if (sort) {
    queryParams.append('sort', sort);
  }

  // إضافة datingType
  if (datingType !== undefined) {
    queryParams.append('datingType', datingType.toString());
  }

  // إضافة startDate
  if (startDate) {
    queryParams.append('startDate', startDate);
  }

  // إضافة endDate
  if (endDate) {
    queryParams.append('endDate', endDate);
  }

  // إضافة cityId
  if (cityId !== undefined) {
    queryParams.append('cityId', cityId.toString());
  }

  // إضافة branchId
  if (branchId !== undefined) {
    queryParams.append('branchId', branchId.toString());
  }

  // إضافة carName
  if (carName && carName.trim() !== '') {
    queryParams.append('carName', carName.trim());
  }

  // إضافة showHome
  if (showHome !== undefined) {
    queryParams.append('showHome', showHome.toString());
  }

  try {
    const res = await fetch(URL(`/cars/filter?${queryParams.toString()}`), {
      next: { revalidate: 60 }, // Revalidate every 60 seconds for ISR
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      throw new Error(`Failed to fetch cars: ${res.status} ${res.statusText}. ${errorText}`);
    }

    const json: FilterCarsApiResponse = await res.json();

    // التحقق من بنية الاستجابة الجديدة
    if (!json.data || !json.data.content) {
      throw new Error("Invalid API response structure");
    }

    // تحويل البيانات من API إلى الشكل المطلوب
    return json.data.content.map(car => transformCarData(car, locale));
  } catch (error) {
    // إذا كان الخطأ من نوع Error، نعيده كما هو مع معلومات إضافية
    if (error instanceof Error) {
      throw new Error(`API Error in fetchFilteredCars: ${error.message}`);
    }
    throw error;
  }
};

const transformCarData = (car: CarApiResponse, locale: string = 'ar'): CarCardData => {
  // تنظيف نوع السيارة من المسافات الزائدة
  const typeArabic = car.typeArabicName?.trim() || '';
  const typeEnglish = car.typeEnglishName?.trim() || '';

  // استخدام القيم مباشرة من API إذا كانت موجودة، وإلا استخدام "نوع غير معروف"
  const category = typeArabic || 'نوع غير معروف';
  const categoryAr = typeArabic || 'نوع غير معروف';
  const categoryEn = typeEnglish || 'Unknown type';

  // بناء اسم السيارة من brand, model, year
  // استخدام اللغة المحددة (عربي أو إنجليزي)
  const brand = locale === 'ar'
    ? (car.brandArabicName || car.brandName || '')
    : (car.brandName || car.brandArabicName || '');
  const model = locale === 'ar'
    ? (car.modelArabicName || car.modelEnglishName || '')
    : (car.modelEnglishName || car.modelArabicName || '');
  const year = car.carYear ? car.carYear.toString() : '';

  // بناء العنوان من brand - year - model مع التعامل مع القيم الفارغة
  const parts: string[] = [];
  if (brand) parts.push(brand.trim());
  if (year) parts.push(year);
  if (model) parts.push(model.trim());

  // استخدام العنوان المبنى من brand/model/year إذا كان متوفراً، وإلا استخدام carName
  const carName = parts.length > 0 
    ? parts.join(' - ') 
    : (car.carName || 'Car');

  // تحديد السعر الحالي والخصم
  const hasOffer = car.offer && car.offerDailyPrice > 0 && car.offerDailyPrice < car.dailyPrice;
  const currentPrice = hasOffer ? car.offerDailyPrice : car.dailyPrice;
  const oldPrice = hasOffer ? car.dailyPrice : car.dailyPrice;

  // تجميع جميع الصور المتاحة وتطبيع الروابط
  const allImages: string[] = [];
  if (car.defaultImage) {
    allImages.push(normalizeImageUrl(car.defaultImage));
  }
  if (car.images && car.images.length > 0) {
    car.images.forEach((img) => {
      const normalizedImg = normalizeImageUrl(img);
      if (img && !allImages.includes(normalizedImg)) {
        allImages.push(normalizedImg);
      }
    });
  }

  // استخدام finalPriceBeforeDiscount و numOfDays من API إذا كانت متوفرة
  // وإلا استخدام الأسعار المحسوبة محلياً
  const finalPrice = car.finalPriceBeforeDiscount !== undefined
    ? car.finalPriceBeforeDiscount
    : (currentPrice || 0);
  const numDays = car.numOfDays !== undefined
    ? car.numOfDays
    : 1;

  return {
    id: car.carId,
    image: allImages[0] || '/shared/CarNotFound.png',
    images: allImages.length > 0 ? allImages : ['/shared/CarNotFound.png'],
    category,
    categoryAr,
    categoryEn,
    title: carName,
    mileage: car.maxKm || 0,
    oldPrice: oldPrice || 0,
    currentPrice: currentPrice || 0,
    hasDiscount: hasOffer,
    finalPriceBeforeDiscount: finalPrice,
    numOfDays: numDays,
    // إضافة الحقول المنفصلة
    modelArabicName: car.modelArabicName,
    modelEnglishName: car.modelEnglishName,
    brandArabicName: car.brandArabicName,
    brandName: car.brandName,
    year: car.carYear,
  };
};

export const fetchHomeData = async (locale: string = 'ar'): Promise<CarCardData[]> => {
  return fetchFilteredCars({ page: 0, size: 100, showHome: 1, locale });
};

export const fetchCarsData = async (locale: string = 'ar'): Promise<CarCardData[]> => {
  return fetchFilteredCars({ page: 0, size: 100, showHome: 0, locale });
};

export const fetchCarById = async (carId: number, params?: {
  datingType?: number;
  startDate?: string;
  endDate?: string;
  cityId?: number;
  branchId?: number;
}): Promise<CarApiResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.datingType !== undefined) {
      queryParams.append('datingType', params.datingType.toString());
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.cityId !== undefined) {
      queryParams.append('cityId', params.cityId.toString());
    }
    if (params?.branchId !== undefined) {
      queryParams.append('branchId', params.branchId.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/cars/${carId}?${queryString}`
      : `/cars/${carId}`;
    const url = URL(endpoint);

    // التحقق من صحة الـ URL
    if (!url || !url.startsWith('http')) {
      throw new Error(`Invalid URL: ${url}`);
    }

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds for ISR
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Car not found');
      }
      const errorText = await res.text().catch(() => 'Unknown error');
      throw new Error(`Failed to fetch car details: ${res.status} ${res.statusText}. ${errorText}`);
    }

    const json: CarDetailsApiResponse = await res.json();

    // التحقق من بنية الاستجابة الجديدة
    if (!json.data) {
      throw new Error(json.message || 'Failed to fetch car details: Invalid response structure');
    }

    // تحويل البيانات لتتوافق مع الواجهة
    const carData = json.data;
    return {
      ...carData,
      defaultImage: carData.image || carData.defaultImage || '',
    };
  } catch (error) {
    // تحسين رسالة الخطأ
    if (error instanceof TypeError && error.message.includes('fetch failed')) {
      console.error('Network error fetching car:', error);
      throw new Error('Network error: Unable to connect to the server. Please check your connection.');
    }
    // إعادة رمي الخطأ الأصلي إذا كان من نوع Error
    if (error instanceof Error) {
      throw error;
    }
    // في حالة خطأ غير معروف
    throw new Error('An unexpected error occurred while fetching car details');
  }
};

// Pricing API Types
export interface PricingRequestParams {
  carId: number;
  reservationStartDate: string; // ISO date string
  reservationEndDate: string; // ISO date string
  fromBranch: number;
  toBranch: number;
  carExtraKmQuota?: number;
  extraServices?: number[];
  points?: number;
  promoCode?: string;
  insurance?: number; // Note: API uses "insurance" (typo in API)
  extraKm?: number;
}

export interface PricingData {
  datingType: number;
  numOfDays: number;
  extraHoursCostWithVat: number;
  originalDailyPrice: number;
  originalDailyPriceWithoutVat: number;
  dailyPriceAfterDiscount: number;
  dailyPriceAfterDiscountWithoutVat: number;
  basePrice: number;
  insurance: number;
  anotherBranchPrice: number;
  pickupFee: number;
  deliveryFee: number;
  totalDeliveryFee: number;
  membershipDiscount: number;
  membershipLuxuryCarDiscount: number;
  carOfferDiscount: number;
  finalPriceWithExtraHoursCost: number;
  finalPriceBeforeDiscount: number;
  finalTotalPrice: number;
  totalPoints: number;
  totalPromoValue: number;
  tax: number;
  extraServicesCost: number;
  extraKmCost: number;
  extraNewDayHours: number;
  refCodeValid: boolean;
  unfreeHours: number;
}

export interface PricingApiResponse {
  message: string;
  data: PricingData;
}

/**
 * Get pricing for a car reservation
 * @param params - Pricing request parameters
 * @returns Pricing data from API
 */
export const fetchReservationPricing = async (
  params: PricingRequestParams
): Promise<PricingApiResponse> => {
  try {
    const payload = {
      carId: params.carId,
      reservationStartDate: params.reservationStartDate,
      reservationEndDate: params.reservationEndDate,
      reservationType: 1, // Constant
      fromBranch: params.fromBranch,
      toBranch: params.toBranch,
      os: 1, // Constant
      ...(params.carExtraKmQuota !== undefined && { carExtraKmQuota: params.carExtraKmQuota }),
      ...(params.extraServices && params.extraServices.length > 0 && { extraServices: params.extraServices }),
      ...(params.points !== undefined && { points: params.points }),
      ...(params.promoCode && { promoCode: params.promoCode }),
      ...(params.insurance !== undefined && { insurance: params.insurance }),
      ...(params.extraKm !== undefined && { extraKm: params.extraKm }),
    };

    const authHeader = getAuthHeader();
    const res = await fetch(URL('/reservations/pricing'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader, // إضافة Authorization header فقط إذا كان token موجود
      },
      body: JSON.stringify(payload),
    });

    let json: PricingApiResponse;
    try {
      json = await res.json();
    } catch (parseError) {
      // If JSON parsing fails, throw a generic error
      const error = new Error('Failed to parse API response');
      (error as any).apiMessage = 'DEFAULT';
      (error as any).status = res.status;
      throw error;
    }

    // Check if response is successful
    if (!res.ok || json.message !== 'SUCCESS' || !json.data) {
      // Throw error with API message for proper handling
      const errorMessage = json.message || 'Failed to fetch pricing';
      const error = new Error(errorMessage);
      (error as any).apiMessage = json.message; // Store original API message
      (error as any).status = res.status;
      throw error;
    }

    // Handle API typo: convert "insurence" to "insurance"
    if (json.data && 'insurence' in json.data) {
      json.data.insurance = (json.data as any).insurence;
      delete (json.data as any).insurence;
    }

    return json;
  } catch (error) {
    // If error already has apiMessage, re-throw as is
    if (error instanceof Error && (error as any).apiMessage) {
      throw error;
    }
    // Otherwise, wrap in new error
    if (error instanceof Error) {
      const wrappedError = new Error(`API Error in fetchReservationPricing: ${error.message}`);
      (wrappedError as any).apiMessage = error.message;
      throw wrappedError;
    }
    throw error;
  }
};

// Better Price API Types
export interface BetterPriceRequestParams {
  carId: number;
  reservationStartDate: string; // ISO date string
  reservationEndDate: string; // ISO date string
}

export interface BetterPriceData {
  currentPricePerDay: number;
  betterPricePerDay: number;
  discountPercentage: number;
  remainingAmount: number;
  remainingDaysToGetBetterPrice: number;
  from: string; // ISO date string
  to: string; // ISO date string
  minNumOfDaysToGetBetterPrice: number;
}

export interface BetterPriceApiResponse {
  message: string;
  data: BetterPriceData;
}

/**
 * Get better price for a car reservation
 * @param params - Better price request parameters
 * @returns Better price data from API
 */
export const fetchBetterPrice = async (
  params: BetterPriceRequestParams
): Promise<BetterPriceApiResponse> => {
  try {
    const payload = {
      carId: params.carId,
      reservationStartDate: params.reservationStartDate,
      reservationEndDate: params.reservationEndDate,
    };

    const res = await fetch(URL('/reservations/better-price'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json: BetterPriceApiResponse = await res.json();

    // Check if response is successful
    if (!res.ok || json.message !== 'SUCCESS' || !json.data) {
      const error = new Error(json.message || 'Failed to fetch better price');
      (error as any).apiMessage = json.message || 'DEFAULT';
      (error as any).status = res.status;
      throw error;
    }

    // return json;
    return null as unknown as BetterPriceApiResponse;
  } catch (error) {
    // If error already has apiMessage, re-throw as is
    if (error instanceof Error && (error as any).apiMessage) {
      throw error;
    }
    // Otherwise, wrap in new error
    if (error instanceof Error) {
      const wrappedError = new Error(`API Error in fetchBetterPrice: ${error.message}`);
      (wrappedError as any).apiMessage = error.message;
      throw wrappedError;
    }
    throw error;
  }
};

