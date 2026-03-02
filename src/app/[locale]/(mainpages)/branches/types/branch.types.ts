/**
 * Branch Types
 */

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
  bcode: string | null;
  googlePlaceId: string | null;
  notes: string | null;
  workingHoures?: string;
}

export interface BranchesApiResponse {
  message: string;
  data: Branch[];
}

