/**
 * VerifyOTP Dialog Props
 */

import type { SignUpPayload } from "../SignUp/types/api.types";

export interface VerifyOTPProps {
  email: string;
  type: "REGISTRATION" | "FORGOT_PASSWORD";
  payload?: SignUpPayload;
  clientId?: number;
  channel?: "EMAIL" | "WHATSAPP";
  onSuccess?: () => void;
  onClose: () => void;
}
