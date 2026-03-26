export interface ForgotPasswordProps {
  onReset?: (email: string) => void;
  onClose: () => void;
  email?: string;
  mobile?: string;
  channel?: "EMAIL" | "WHATSAPP";
  isAccountActivation?: boolean;
  initialStep?: "request" | "verify" | "reset";
  initialClientId?: number | null;
}
