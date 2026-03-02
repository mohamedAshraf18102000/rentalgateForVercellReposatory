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
  clientNumber?: number;
  firstName?: string;
  lastName?: string;
  clientType?: number | null;
  clientStatus?: string;
  mobile?: string;
  email?: string;
  image?: string | null;
  nationality?: string | null;
  nationalId?: string | null;
  copyNum?: string | null;
  gender?: number | null;
  cityId?: number | null;
  address?: string | null;
  points?: number | null;
  membership?: string | null;
  addedDate?: string;
  birthdate?: string | null;
  licenseExpiration?: string;
  licenseNumber?: string;
  cityName?: string | null;
  refCode?: string;
  countryId?: number | null;
  bearerToken?: string;
  [key: string]: any;
}

export interface LoginPayload {
  username: string;
  password: string;
}

