/**
 * API Types for Login
 */

export interface LoginApiResponse {
  message?: string;
  status?: boolean;
  data?: LoginUserData;
}

export interface LoginUserData {
  clientId?: number;
  clientName?: string;
  creationDate?: string;
  mobile?: string;
  email?: string;
  country?: {
    countryId?: number;
    englishName?: string;
    arabicName?: string;
    currency?: {
      currencyId?: number;
      englishName?: string;
      arabicName?: string;
      symbole?: string;
      lastPrice?: number;
      notes?: string;
      name?: string;
    };
    latitude?: number | null;
    longitude?: number | null;
    flag?: string;
    notes?: string;
    name?: string;
  };
  city?: any;
  residenceType?: any;
  nationality?: any;
  licenseExpirationDate?: any;
  licenseImage?: any;
  profileImage?: any;
  personalId?: any;
  borderNumber?: any;
  passportNumber?: any;
  referralCode?: any;
  notes?: any;
  status?: string;
  bearerToken?: string;
  [key: string]: any;
}

export interface LoginPayload {
  mobile: string;
  password: string;
}
