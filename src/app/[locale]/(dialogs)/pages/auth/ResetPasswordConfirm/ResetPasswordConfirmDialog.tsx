"use client";

import * as React from "react";
import { Button, DialogWrapper, Input } from "@/ui";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDialog } from "../../../hooks/useDialog";
import type { ResetPasswordConfirmProps } from "./ResetPasswordConfirm.types";
import { resetPassword } from "../ForgotPassword/services/forgot-password.service";

export function ResetPasswordConfirmDialog({
  identifier,
  otpCode,
  onReset,
  onClose,
}: ResetPasswordConfirmProps) {
  const { openDialog } = useDialog();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const tValidation = useTranslations("validation.AUTH_ERRORS");
  const tForgot = useTranslations("auth.forgotPassword");

  const handleSubmit = async () => {
    if (!newPassword) {
      toast.error(
        tValidation("PASSWORD_IS_REQUIRED") || "يرجى إدخال كلمة المرور",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(
        tValidation("PASSWORDS_DO_NOT_MATCH") || "كلمات المرور غير متطابقة",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword({
        email: identifier,
        newPassword,
        otpCode,
      });

      const isSuccess =
        response.status === true || response.message === "SUCCESS";

      if (isSuccess) {
        toast.success(tForgot("messages.passwordResetSuccess"));
        onReset?.(identifier);

        setTimeout(() => {
          onClose();
          setTimeout(() => {
            openDialog("Login", {});
          }, 300);
        }, 1500);
      } else {
        throw new Error(response.message || "فشل في إعادة تعيين كلمة المرور");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      const translatedMessage = errorMessage
        ? tValidation(errorMessage as any)
        : tValidation("DEFAULT");
      toast.error(translatedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      closeOnOutsideClick={false}
      header={{
        mainTitle: tForgot("title.reset"),
        description: tForgot("description.reset"),
      }}
      content={
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Input
              label={tForgot("form.newPasswordLabel")}
              id="reset-confirm-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={tForgot("form.newPasswordPlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Input
              label={tForgot("form.confirmPasswordLabel")}
              id="reset-confirm-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={tForgot("form.confirmPasswordPlaceholder")}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-destructive mt-1">
                {tForgot("form.passwordsDoNotMatch")}
              </p>
            )}
          </div>
        </div>
      }
      footer={
        <div className="w-full space-y-4 mt-4">
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !newPassword ||
              newPassword !== confirmPassword
            }
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            {tForgot("buttons.resetPassword")}
          </Button>
        </div>
      }
      size="md"
    />
  );
}
