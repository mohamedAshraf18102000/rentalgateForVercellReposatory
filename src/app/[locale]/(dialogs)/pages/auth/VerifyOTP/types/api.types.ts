/**
 * VerifyOTP API Types
 */

export interface VerifyOTPPayload {
  clientId: number;
  code: string;
}

export interface VerifyOTPResponse {
  message: string;
  data?: boolean | any;
}

