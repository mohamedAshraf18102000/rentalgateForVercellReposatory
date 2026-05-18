export interface ForgotPasswordProps {
  onReset?: (email: string) => void;
  onClose: () => void;
  email?: string;
  mobile?: string;
  channel?: "EMAIL" | "WHATSAPP";
  isAccountActivation?: boolean;
  /** Opened from login HTTP 423 (suspended account reactivation) */
  isAccountRecovery?: boolean;
  initialStep?: "request" | "verify";
  initialClientId?: number | null;
}
