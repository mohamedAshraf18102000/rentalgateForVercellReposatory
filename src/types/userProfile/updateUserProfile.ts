export interface CompleteUserProfilePayload {
  identityExpiryDate: string;
  email?: string;
  fullName?: string;
  mobile?: string;
  countryId?: number;
  cityId?: number;
  profileImage?: string;
  notes?: string;

  licenseExpirationDate: string;
  licenseImage: string;
  nationality: string;
  residenceType: number;
  personalId: string | null;
  passportNumber: string | null;
  borderNumber: string | null;
}

export interface UpdateUserProfilePayload {
  email?: string;
  fullName?: string;
  mobile?: string;
  countryId?: number;
  cityId?: number;
  identityExpiryDate?: string;
  residenceType?: number;
  nationality?: string;
  licenseExpirationDate?: string;
  licenseImage?: string;
  profileImage?: string;
  personalId?: string;
  borderNumber?: string;
  passportNumber?: string;
  notes?: string;
}
