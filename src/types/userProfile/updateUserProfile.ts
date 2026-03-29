export interface UpdateUserProfilePayload {
  licenseExpirationDate: string;
  licenseImage: string;
  nationality: string;
  residenceType: number;
  personalId: string | null;
  passportNumber: string | null;
  borderNumber: string | null;
}
