/**
 * VerifyOTP API Types
 */

export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  status: boolean;
  clientId: string | null;
  welcomePoints: number | null;
  valid: boolean;
  data?: boolean | any;
}
