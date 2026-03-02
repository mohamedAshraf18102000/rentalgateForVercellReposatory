/**
 * Client Data Types
 */

export interface ClientData {
  clientId: number;
  clientNumber: number;
  firstName: string;
  lastName: string;
  clientType: number | null;
  clientStatus: string; // "ACTIVE" | "INACTIVE" etc.
  mobile: string;
  email: string;
  image: string | null;
  nationality: string | null;
  nationalId: string | null;
  copyNum: string | null;
  gender: number | null;
  cityId: number | null;
  cityName: string | null;
  zipCode: string | null;
  countryId: number | null;
  countryEnName: string | null;
  countryArName: string | null;
  countryCode: string | null;
  address: string | null;
  membershipId: number | null;
  membershipName: string | null;
  membershipArName: string | null;
  membershipIcon: string | null;
  addedDate: string;
  birthdate: string | null;
  licenseType: string | null;
  licenseExpiration: string;
  licenseNumber: string | null;
  refCode: string;
  pointsCalculation: string;
  totalPoints: number;
}

export interface ClientDataApiResponse {
  message: string;
  status: boolean;
  data: ClientData;
}

