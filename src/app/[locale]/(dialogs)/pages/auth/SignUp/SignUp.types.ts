/**
 * SignUp Dialog Props
 */

export interface SignUpProps {
  onSignUp?: (data: { email?: string; mobile?: string; firstName: string; lastName: string; password: string; channel: "EMAIL" | "WHATSAPP" }) => void;
  onClose: () => void;
  onLogin?: () => void;
}

