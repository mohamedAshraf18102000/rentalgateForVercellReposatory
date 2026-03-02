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
  clientId: number;
  code: string;
}

export interface VerifyOTPResponse {
  status?: boolean;
  message: string;
  data?: boolean | any;
}

export interface ResendOTPPayload {
  clientId: number;
  channel: "EMAIL" | "WHATSAPP";
}

export interface ResendOTPResponse {
  status: boolean;
  message: string;
}

export interface ResetPasswordPayload {
  clientId: number;
  password: string;
}

export interface ResetPasswordResponse {
  status?: boolean;
  message: string;
  data?: any;
}

