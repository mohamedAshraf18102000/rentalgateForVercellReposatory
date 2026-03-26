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

export interface VerifyOTPPayload {
  email: string;
  code: string;
}

export interface VerifyOTPResponse {
  status?: boolean;
  message: string;
  data?: boolean | any;
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
  password: string;
}

export interface ResetPasswordResponse {
  status?: boolean;
  message: string;
  data?: any;
}

