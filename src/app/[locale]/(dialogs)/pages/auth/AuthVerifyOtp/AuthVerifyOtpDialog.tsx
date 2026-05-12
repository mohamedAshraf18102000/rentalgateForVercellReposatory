"use client";

import * as React from "react";
import { Button, DialogWrapper, InputOtp } from "@/ui";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDialog } from "../../../hooks/useDialog";
import type { AuthVerifyOtpProps } from "./AuthVerifyOtp.types";
import {
  resendOTP,
  verifyAuthOtp,
} from "../ForgotPassword/services/forgot-password.service";

export function AuthVerifyOtpDialog({
  identifier,
  channel,
  onReset,
  onClose,
}: AuthVerifyOtpProps) {
  const { openDialog } = useDialog();
  const [otpCode, setOtpCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(60);
  const t = useTranslations("validation.AUTH_ERRORS");
  const tForgot = useTranslations("auth.forgotPassword");

  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    setError("");
    try {
      await resendOTP({
        email: identifier,
        channel,
      });
      toast.success(t("OTP_RESENT") || "تم إعادة إرسال رمز التحقق");
      setResendTimer(60);
      setOtpCode("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      setError(t(errorMessage as any) || t("DEFAULT"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error(t("CODE_IS_REQUIRED") || "يرجى إدخال رمز التحقق");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await verifyAuthOtp({
        email: identifier,
        otpCode,
      });

      toast.success(
        tForgot("messages.otpVerifiedSuccess") ||
          "تم التحقق من الرمز بنجاح",
      );

      onClose();
      openDialog("ResetPasswordConfirm", {
        identifier,
        otpCode,
        onReset,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      setError(t(errorMessage as any) || t("DEFAULT"));
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
        mainTitle: tForgot("title.verify"),
        description: tForgot("description.verifyCodeOnly"),
      }}
      content={
        <div className="grid gap-4">
          <div className="flex justify-center items-center" dir="ltr">
            <InputOtp
              length={6}
              value={otpCode}
              onValueChange={setOtpCode}
              onComplete={handleVerify}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading || resendTimer > 0}
              className={`font-medium transition-colors font-zain text-sm underline ${
                resendTimer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary hover:underline"
              }`}
            >
              {resendTimer > 0
                ? `${t("resendIn")} ${resendTimer}s`
                : t("resendCode")}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-center font-zain text-sm">
              {error}
            </p>
          )}
        </div>
      }
      footer={
        <div className="w-full space-y-4 mt-4">
          <Button
            onClick={handleVerify}
            disabled={isLoading || otpCode.length !== 6}
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            {tForgot("buttons.confirm")}
          </Button>
        </div>
      }
      size="sm"
    />
  );
}
