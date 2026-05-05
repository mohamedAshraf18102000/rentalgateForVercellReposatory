import type { ReactNode } from "react";

export interface ApiErrorProps {
  message: ReactNode;
  onClose: () => void;
  onClick?: () => void;
}
