export interface ResetPasswordConfirmProps {
  identifier: string;
  otpCode: string;
  onReset?: (identifier: string) => void;
  onClose: () => void;
}
