"use client";

import * as React from "react";
import { Button, DialogWrapper, InputOtp } from "@/ui";
import type { VerifyOTPProps } from "./VerifyOTP.types";
import {
  verifyOTP,
  resendRegistrationOTP,
} from "./services/verify-otp.service";
import {
  verifyOTP as verifyForgotOTP,
  resendOTP as resendForgotOTP,
} from "../ForgotPassword/services/forgot-password.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useDialog } from "../../..";

export function VerifyOTPDialog({
  email,
  type,
  payload,
  clientId,
  channel = "EMAIL",
  onSuccess,
  onClose,
}: VerifyOTPProps) {
  const { openDialog } = useDialog();
  const [otpCode, setOtpCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(60);
  const t = useTranslations("validation.AUTH_ERRORS");

  // Countdown timer for resend
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
      let response;
      if (type === "REGISTRATION" && payload) {
        response = await resendRegistrationOTP(payload);
      } else if (type === "FORGOT_PASSWORD" && email) {
        response = await resendForgotOTP({
          email,
          channel: channel || "EMAIL",
        });
      }

      if (response && response.status) {
        toast.success(t("OTP_RESENT") || "تم إعادة إرسال رمز التحقق");
        setResendTimer(60);
        setOtpCode("");
      } else if (response) {
        setError(response.message || t("DEFAULT"));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      setError(t(errorMessage as any) || t("DEFAULT"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error(t("CODE_IS_REQUIRED") || "يرجى إدخال رمز التحقق");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let response;
      if (type === "REGISTRATION") {
        response = await verifyOTP({
          email,
          otp: otpCode,
        });
      } else if (type === "FORGOT_PASSWORD" && email) {
        response = await verifyForgotOTP({
          email,
          code: otpCode,
        });
      }

      // Check both valid (from registration) and status (from forgot-password)
      const isVerified =
        response &&
        ((response as any).valid ||
          response.status === true ||
          (response as any).data === true);

      if (isVerified) {
        toast.success("تم التحقق من الرمز بنجاح");
        onSuccess?.();

        if (type === "REGISTRATION") {
          onClose();
          openDialog("Login", {
            onSuccess: (user: { id: string; email: string }) => {
              console.log("تم تسجيل الدخول:", user);
            },
          });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      const translatedMessage = errorMessage
        ? t(errorMessage as any)
        : t("DEFAULT");
      setError(translatedMessage);
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
        mainTitle: "التحقق من الرمز",
        description: "أدخل الرمز الذي قمنا بإرساله إليك",
      }}
      content={
        <div className="grid gap-4">
          <div className="flex justify-center items-center" dir="ltr">
            <InputOtp
              length={6}
              value={otpCode}
              onValueChange={setOtpCode}
              onComplete={handleVerifyOTP}
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-center font-zain text-sm">
              {error}
            </p>
          )}

          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-600 font-zain text-lg">
              {t("didntReceiveCode")}
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading || resendTimer > 0}
              className={`font-medium transition-colors font-zain text-lg ${
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
        </div>
      }
      footer={
        <div className="w-full space-y-4 mt-4">
          <Button
            onClick={handleVerifyOTP}
            disabled={isLoading || otpCode.length !== 6}
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            تأكيد
          </Button>
        </div>
      }
      size="sm"
    />
  );
}
