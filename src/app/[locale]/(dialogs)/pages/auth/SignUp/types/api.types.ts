/**
 * API Types for SignUp
 */

export interface SignUpPayload {
  clientName: string;
  countryId: number;
  mobile: string;
  password: string;
  email: string;
}

export interface SignUpApiResponse {
  message?: string;
  status?: boolean;
  data?: any;
}
