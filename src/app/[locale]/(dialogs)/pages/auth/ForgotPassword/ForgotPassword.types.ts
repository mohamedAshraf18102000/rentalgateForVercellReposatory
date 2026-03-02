/**
 * ForgotPassword Dialog Props
 */

export interface ForgotPasswordProps {
  onReset?: (email: string) => void;
  onClose: () => void;
  email?: string;
  mobile?: string;
  channel?: "EMAIL" | "WHATSAPP";
  isAccountActivation?: boolean; // If true, shows "Complete Account Activation" instead of "Forgot Password"
}

