/**
 * Login Dialog Props
 */

export interface LoginProps {
  redirectTo?: string;
  onSuccess?: (user: { id: string; email: string }) => void;
  onClose: () => void;
}

