/**
 * Account Deactivated Dialog Props
 */

export interface AccountDeactivatedProps {
  email?: string;
  mobile?: string;
  channel?: "EMAIL" | "WHATSAPP";
  onClose: () => void;
}

