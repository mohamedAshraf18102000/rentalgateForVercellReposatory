"use client";

import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { Button, DialogWrapper, Input, InputOtp } from "@/ui";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";
import { useDialog } from "../../../hooks/useDialog";
import { ConfirmationChannelTabs } from "../SignUp/components/ConfirmationChannelTabs";
import type { ForgotPasswordProps } from "./ForgotPassword.types";
import {
  forgetPassword,
  resendOTP,
  resetPassword,
} from "./services/forgot-password.service";

type Step = "request" | "verify";

export function ForgotPasswordDialog({
  onReset,
  onClose,
  email: initialEmail,
  mobile: initialMobile,
  channel: initialChannel,
  isAccountActivation = false,
  isAccountRecovery = false,
  initialStep = "request",
}: ForgotPasswordProps) {
  const [step, setStep] = React.useState<Step>(initialStep || "request");
  const [channel, setChannel] = React.useState<"EMAIL" | "WHATSAPP">(
    initialChannel || "EMAIL",
  );
  const [email, setEmail] = React.useState(initialEmail || "");
  const [mobile, setMobile] = React.useState(initialMobile || "");
  const [isPhoneValid, setIsPhoneValid] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(0);
  const tValidation = useTranslations("validation.AUTH_ERRORS");
  const t = useTranslations("auth.forgotPassword");
  const tRecovery = useTranslations("auth.accountRecovery");
  const { openDialog } = useDialog();

  // Timer for resend OTP
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Step 1: Request OTP
  const handleRequestOTP = async () => {
    if (channel === "EMAIL" && !email) {
      toast.error(
        tValidation("EMAIL_IS_REQUIRED") || "يرجى إدخال البريد الإلكتروني",
      );
      return;
    }

    if (channel === "WHATSAPP" && (!mobile || !isPhoneValid)) {
      toast.error(
        tValidation("MOBILE_IS_REQUIRED") || "يرجى إدخال رقم جوال صحيح",
      );
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        channel,
        ...(channel === "EMAIL" ? { email } : { mobile }),
      };

      const response = await forgetPassword(payload);

      // Check for success: either status is true OR message is SUCCESS or message includes success words
      const isSuccess =
        response.status === true ||
        response.message === "SUCCESS" ||
        response.message?.toLowerCase().includes("success");

      if (isSuccess) {
        onClose?.();
        openDialog("AuthVerifyOtp", {
          identifier: channel === "EMAIL" ? email : mobile,
          channel,
          onReset,
        });
        toast.success(response.message || t("messages.otpSentSuccess"));
      } else {
        throw new Error(response.message || "فشل في إرسال رمز التحقق");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";

      // Safe translation: if it looks like a key (no spaces), translate it
      // otherwise show it raw
      let translatedMessage = errorMessage;
      if (errorMessage && !errorMessage.includes(" ")) {
        try {
          translatedMessage = tValidation(errorMessage as any);
        } catch {
          translatedMessage = errorMessage;
        }
      } else if (!errorMessage) {
        translatedMessage = tValidation("DEFAULT");
      }

      toast.error(translatedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify step: new password + OTP → single reset-password request
  const handleCompleteForgotPassword = async () => {
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

    if (!otpCode || otpCode.length !== 6) {
      toast.error(tValidation("CODE_IS_REQUIRED") || "يرجى إدخال رمز التحقق");
      return;
    }

    setIsLoading(true);

    try {
      const currentEmail = channel === "EMAIL" ? email : mobile;
      const response = await resetPassword({
        email: currentEmail,
        newPassword,
        otpCode,
      });

      const isSuccess =
        response.status === true || response.message === "SUCCESS";

      if (isSuccess) {
        toast.success(t("messages.passwordResetSuccess"));
        onReset?.(email || mobile);

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

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);

    try {
      const currentEmail = channel === "EMAIL" ? email : mobile;
      await resendOTP({
        email: currentEmail,
        channel,
      });

      setResendTimer(5);
      toast.success(t("messages.otpResentSuccess"));
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderStepContent = () => {
    switch (step) {
      case "request":
        return (
          <div className="grid gap-4 mt-2">
            <ConfirmationChannelTabs
              value={channel}
              onValueChange={setChannel}
            />

            {channel === "EMAIL" ? (
              <div className="grid gap-2 mt-3">
                <Input
                  label={t("form.emailLabel")}
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("form.emailPlaceholder")}
                />
              </div>
            ) : (
              <div className="grid gap-2 mt-3">
                <CountryPhone
                  value={mobile}
                  onChange={setMobile}
                  placeholder={t("form.mobilePlaceholder")}
                  defaultCountry="sa"
                  showValidation={true}
                  onValidationChange={setIsPhoneValid}
                  label={t("form.mobileLabel")}
                />
              </div>
            )}
          </div>
        );

      case "verify":
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                label={t("form.newPasswordLabel")}
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("form.newPasswordPlaceholder")}
              />
            </div>

            <div className="grid gap-2">
              <Input
                label={t("form.confirmPasswordLabel")}
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("form.confirmPasswordPlaceholder")}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {t("form.passwordsDoNotMatch")}
                </p>
              )}
            </div>

            <div className="flex justify-center items-center" dir="ltr">
              <InputOtp
                length={6}
                value={otpCode}
                onValueChange={setOtpCode}
                onComplete={handleCompleteForgotPassword}
                disabled={isLoading}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (step) {
      case "request":
        return (
          <div className="w-full mt-3">
            <Button
              onClick={handleRequestOTP}
              disabled={
                isLoading ||
                (channel === "EMAIL" ? !email : !mobile || !isPhoneValid)
              }
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              {t("buttons.send")}
            </Button>
          </div>
        );

      case "verify":
        return (
          <div className="w-full space-y-4 mt-4">
            <Button
              onClick={handleCompleteForgotPassword}
              disabled={
                isLoading ||
                otpCode.length !== 6 ||
                !newPassword ||
                newPassword !== confirmPassword
              }
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              {t("buttons.resetPassword")}
            </Button>
            <div className="flex items-center justify-center">
              {resendTimer > 0 ? (
                <p className="text-sm  text-Grey700">
                  {t("messages.resendAfter")} {formatTime(resendTimer)}
                </p>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm text-gray-600">
                    {t("messages.didNotReceive")}
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-[#1A1A1A] text-sm font-semibold underline hover:text-primary-hover/80 disabled:opacity-50"
                  >
                    {t("buttons.resend")}
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    if (isAccountRecovery) {
      switch (step) {
        case "request":
          return tRecovery("title.request");
        case "verify":
          return tRecovery("title.verify");
        default:
          return tRecovery("title.request");
      }
    }
    if (isAccountActivation) {
      switch (step) {
        case "request":
          return t("title.activationRequest");
        case "verify":
          return t("title.activationVerify");
        default:
          return t("title.activationRequest");
      }
    }
    switch (step) {
      case "request":
        return t("title.request");
      case "verify":
        return t("title.verify");
      default:
        return t("title.request");
    }
  };

  const getSize = () => {
    switch (step) {
      case "request":
        return "md";
      case "verify":
        return "md";
      default:
        return "sm";
    }
  };

  const getHeaderDescription = () => {
    if (isAccountRecovery) {
      switch (step) {
        case "request":
          return tRecovery("description.request");
        case "verify":
          return tRecovery("description.verify");
        default:
          return "";
      }
    }
    if (isAccountActivation) {
      switch (step) {
        case "request":
          return t("description.activationRequest");
        case "verify":
          return t("description.activationVerify");
        default:
          return "";
      }
    }
    switch (step) {
      case "request":
        return t("description.request");
      case "verify":
        return t("description.verify");
      default:
        return "";
    }
  };

  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      closeOnOutsideClick={false}
      header={{
        mainTitle: getHeaderTitle(),
        description: getHeaderDescription(),
      }}
      content={renderStepContent()}
      footer={<div className="mt-5 w-full">{renderFooter()}</div>}
      size={getSize()}
    />
  );
}
