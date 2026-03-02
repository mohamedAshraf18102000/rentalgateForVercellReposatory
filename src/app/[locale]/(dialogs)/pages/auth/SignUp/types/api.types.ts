/**
 * API Types for SignUp
 */

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  password: string;
  channel: "EMAIL" | "WHATSAPP";
  mobile?: string;
  email?: string;
}

export interface SignUpApiResponse {
  message?: string;
  status?: boolean;
  data?: any;
}

