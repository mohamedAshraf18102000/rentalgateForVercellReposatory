/**
 * Forgot Password API Types
 */

export interface ForgetPasswordPayload {
  channel: "EMAIL" | "WHATSAPP";
  email?: string;
  mobile?: string;
}

export interface ForgetPasswordResponse {
  status?: boolean;
  message: string;
  data?: number | {
    clientId: number;
  };
}

export interface ResendOTPPayload {
  email: string;
  channel: "EMAIL" | "WHATSAPP";
}

export interface ResendOTPResponse {
  status: boolean;
  message: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  otpCode: string;
}

export interface ResetPasswordResponse {
  status?: boolean;
  message: string;
  data?: any;
}

