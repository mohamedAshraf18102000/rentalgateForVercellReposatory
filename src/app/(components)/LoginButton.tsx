"use client";

import { useDialog } from "../[locale]/(dialogs)";
import { Button } from "@/ui";

interface LoginButtonProps {
  redirectTo?: string;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
  children?: React.ReactNode;
}

export function LoginButton({
  redirectTo,
  className,
  variant = "default",
  size = "lg",
  children = "Login",
}: LoginButtonProps) {
  const { openDialog } = useDialog();

  const handleLoginClick = () => {
    openDialog("Login", {
      redirectTo,
      onSuccess: (user: { id: string; email: string }) => {
        console.log("تم تسجيل الدخول بنجاح:", user);
        // هنا يمكنك إضافة منطق إضافي بعد تسجيل الدخول
        // مثلاً: تحديث الحالة، إعادة التوجيه، إلخ
      },
    });
  };

  return (
    <Button
      onClick={handleLoginClick}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  );
}
