/**
 * VerifyOTP Dialog Props
 */

import type { SignUpPayload } from "../SignUp/types/api.types";

export interface VerifyOTPProps {
  email: string;
  type: "REGISTRATION";
  payload?: SignUpPayload;
  clientId?: number;
  onSuccess?: () => void;
  onClose: () => void;
}
