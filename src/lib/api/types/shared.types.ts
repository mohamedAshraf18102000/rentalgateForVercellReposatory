/**
 * Shared Data Types
 */

export interface CarModel {
  carModelId: number;
  carBrandId: number;
  englishName: string;
  arabicName: string;
  notes: string | null;
}

export interface CarBrand {
  brandId: number;
  brandName: string;
  arabicName: string;
  logo: string | null;
  notes: string | null;
}

export interface CarType {
  typeId: number;
  forbiddenToForeigners: boolean;
  arabicName: string;
  notes: string | null;
  englishName: string;
  freeDelivery: boolean | null;
  carCount: number;
  icon: string;
}

export interface City {
  cityId: number;
  cityEnName: string; // API الجديد يستخدم cityEnName
  cityArName: string;
  latitude: number;
  longitude: number;
  zipCode: string;
  notes: string;
  // للتوافق مع الكود القديم
  cityName?: string;
}

export interface CarYear {
  yearId: number;
  year: number;
  notes: string | null;
}

export interface Branch {
  branchId: number;
  cityId: number;
  branchName: string;
  branchArName: string;
  latitude: number;
  longitude: number;
  mobile: string;
  email: string;
  phone1: string;
  phone2: string | null;
  addressEnglish: string;
  addressArabic: string;
  googlePlaceId: string | null;
  bcode: string | null;
  notes: string | null;
  // الحقول القديمة (اختيارية للتوافق)
  whId?: number;
  workingHoures?: string;
  asconBranchCode?: string | null;
}

export interface Contact {
  contactId: number;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  snapchat: string;
  tiktok: string;
  whatsapp: string;
  androidLink: string;
  iosLink: string;
  notes: string | null;
}

export interface Membership {
  memberId: number;
  memberName: string;
  arabicName: string;
  details: string;
  arabicDetails: string;
  icon: string;
  startPoints: number;
  endPoints: number;
  discountPercentage: number;
  maxDiscount: number;
  maxLateHours: number;
  anotherBranch: number;
  preOrderAllowed: number;
  hoursPreOrder: number;
  freeKm: number;
  luxuryCars: number;
  typeId: number | null;
  luxuryCarsDiscount: number;
  luxuryCarsMaxDiscount: number;
  maxRentLuxuryCars: number;
  notes: string | null;
}

export interface About {
  aboutId: number;
  arabicPrivacy: string;
  englishPrivacy: string;
  arabicText: string;
  englishText: string;
  arabicTitle: string;
  englishTitle: string;
  notes: string | null;
}

export interface SharedData {
  settings: Record<string, string>;
  city: City[];
  branch: Branch[];
  carTypes: CarType[];
  contacts: Contact[];
  about?: About[]; // Array of about data (first is privacy, second is terms)
  // الحقول القديمة (اختيارية - قد لا تكون موجودة في API الجديد)
  carModels?: CarModel[];
  carBrands?: CarBrand[];
  carYears?: CarYear[];
  memberships?: Membership[];
}

export interface SharedDataApiResponse {
  message: string;
  data: SharedData;
}

