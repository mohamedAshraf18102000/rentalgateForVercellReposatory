export interface AuthVerifyOtpProps {
  /** Email address or mobile number (same identifier used by forget-password / reset APIs). */
  identifier: string;
  channel: "EMAIL" | "WHATSAPP";
  onReset?: (identifier: string) => void;
  onClose: () => void;
}
