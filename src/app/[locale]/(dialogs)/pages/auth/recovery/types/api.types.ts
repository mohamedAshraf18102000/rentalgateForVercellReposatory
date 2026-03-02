/**
 * Account Recovery API Types
 */

export interface AccountRecoveryPayload {
  channel: "EMAIL" | "WHATSAPP";
  email?: string;
  mobile?: string;
}

export interface AccountRecoveryResponse {
  status?: boolean;
  message: string;
  data?: number | {
    clientId: number;
  };
}

export interface VerifyAccountRecoveryPayload {
  mobile?: string;
  email?: string;
  code: string;
}

export interface VerifyAccountRecoveryResponse {
  status?: boolean;
  message: string;
  data?: boolean | {
    clientId: number;
  };
}

export interface ResetPasswordVerificationPayload {
  clientId: number;
  code: string;
}

export interface ResetPasswordVerificationResponse {
  status?: boolean;
  message: string;
  data?: any;
}

