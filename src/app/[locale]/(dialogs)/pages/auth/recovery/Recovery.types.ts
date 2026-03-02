/**
 * Account Recovery Dialog Props
 */

export interface AccountRecoveryProps {
  email?: string;
  mobile?: string;
  channel?: "EMAIL" | "WHATSAPP";
  onSuccess?: () => void;
  onClose: () => void;
}

