export interface UpdateUserProfilePayload {
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
