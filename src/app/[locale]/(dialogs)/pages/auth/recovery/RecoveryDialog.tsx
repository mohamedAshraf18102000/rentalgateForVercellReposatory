"use client";

import * as React from "react";
import { Button, Input, DialogWrapper, InputOtp } from "@/ui";
import type { AccountRecoveryProps } from "./Recovery.types";
import { accountRecovery, verifyAccountRecovery, resetPasswordVerification } from "./services/recovery.service";
import { resetPassword } from "../ForgotPassword/services/forgot-password.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ConfirmationChannelTabs } from "../SignUp/components/ConfirmationChannelTabs";
import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { useDialog } from "../../../hooks/useDialog";

type Step = "request" | "verify" | "reset";

export function AccountRecoveryDialog({
  email: initialEmail,
  mobile: initialMobile,
  channel: initialChannel,
  onSuccess,
  onClose,
}: AccountRecoveryProps) {
  const { openDialog } = useDialog();
  const [step, setStep] = React.useState<Step>("request");
  const [channel, setChannel] = React.useState<"EMAIL" | "WHATSAPP">(initialChannel || "EMAIL");
  const [email, setEmail] = React.useState(initialEmail || "");
  const [mobile, setMobile] = React.useState(initialMobile || "");
  const [isPhoneValid, setIsPhoneValid] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [clientId, setClientId] = React.useState<number | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(0);
  const tValidation = useTranslations("validation.AUTH_ERRORS");
  const t = useTranslations("auth.accountRecovery");

  // Timer for resend OTP
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Step 1: Request Recovery OTP
  const handleRequestRecovery = async () => {
    if (channel === "EMAIL" && !email) {
      toast.error(tValidation("EMAIL_IS_REQUIRED") || "يرجى إدخال البريد الإلكتروني");
      return;
    }

    if (channel === "WHATSAPP" && (!mobile || !isPhoneValid)) {
      toast.error(tValidation("MOBILE_IS_REQUIRED") || "يرجى إدخال رقم جوال صحيح");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        channel,
        ...(channel === "EMAIL" ? { email } : { mobile }),
      };

      const response = await accountRecovery(payload);

      console.log('Account Recovery Response:', response);

      // Check for success: either status is true OR message is SUCCESS
      const isSuccess = response.status === true || response.message === "SUCCESS";

      if (isSuccess) {
        // Extract clientId from response.data (similar to ForgotPassword)
        const clientIdValue = typeof response.data === 'number'
          ? response.data
          : response.data?.clientId;

        if (clientIdValue) {
          setClientId(clientIdValue);
        }

        setStep("verify");
        setResendTimer(60); // 60 seconds timer
        toast.success(t('messages.otpSentSuccess'));
      } else {
        throw new Error(response.message || "فشل في إرسال رمز التحقق");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      const translatedMessage = errorMessage ? tValidation(errorMessage as any) : tValidation("DEFAULT");
      toast.error(translatedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Recovery OTP
  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error(tValidation("CODE_IS_REQUIRED") || "يرجى إدخال رمز التحقق");
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        code: otpCode,
      };

      // Include email and/or mobile if available
      if (email) {
        payload.email = email;
      }
      if (mobile && isPhoneValid) {
        payload.mobile = mobile;
      }

      const response = await verifyAccountRecovery(payload);

      console.log('Verify Account Recovery Response:', response);

      // Check for success: either status is true OR message is SUCCESS
      const isSuccess = response.status === true || response.message === "SUCCESS";

      // If message is SUCCESS but data is false, OTP is incorrect
      if (isSuccess && response.data === false) {
        setOtpCode(""); // Clear OTP input
        throw new Error("INVALID_OTP_CODE");
      }

      if (isSuccess) {
        // If we don't have clientId yet, try to get it from response
        if (!clientId && typeof response.data === 'object' && response.data !== null) {
          const clientIdValue = response.data.clientId;
          
          if (clientIdValue) {
            setClientId(clientIdValue);
          }
        }

        // Move to reset step if we have clientId, otherwise show error
        if (clientId) {
          setStep("reset");
          toast.success(t('messages.otpVerifiedSuccess'));
        } else {
          throw new Error("لم يتم العثور على معرف العميل");
        }
      } else {
        setOtpCode(""); // Clear OTP input on error
        throw new Error(response.message || "INVALID_OTP_CODE");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      const translatedMessage = errorMessage ? tValidation(errorMessage as any) : tValidation("DEFAULT");
      toast.error(translatedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error(tValidation("PASSWORD_IS_REQUIRED") || "يرجى إدخال كلمة المرور");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(tValidation("PASSWORDS_DO_NOT_MATCH") || "كلمات المرور غير متطابقة");
      return;
    }

    if (!clientId) {
      toast.error(tValidation("CLIENT_ID_IS_REQUIRED") || "خطأ في البيانات");
      return;
    }

    if (!otpCode) {
      toast.error(tValidation("CODE_IS_REQUIRED") || "يرجى إدخال رمز التحقق");
      return;
    }

    setIsLoading(true);

    try {
      // First, verify the code with reset-password-verification
      const verificationResponse = await resetPasswordVerification({
        clientId,
        code: otpCode,
      });

      console.log('Reset Password Verification Response:', verificationResponse);

      // Check for success
      const isVerificationSuccess = verificationResponse.status === true || verificationResponse.message === "SUCCESS";

      if (isVerificationSuccess) {
        // Then reset the password
        const response = await resetPassword({
          clientId,
          password: newPassword,
        });

        console.log('Reset Password Response:', response);

        // Check for success: either status is true OR message is SUCCESS
        const isSuccess = response.status === true || response.message === "SUCCESS";

        if (isSuccess) {
          toast.success(t('messages.passwordResetSuccess'));
          onSuccess?.();
          
          // Close current dialog and open login after a short delay
          setTimeout(() => {
            onClose();
            setTimeout(() => {
              openDialog("Login", {});
            }, 300);
          }, 1500);
        } else {
          throw new Error(response.message || "فشل في إعادة تعيين كلمة المرور");
        }
      } else {
        throw new Error(verificationResponse.message || "فشل في التحقق من الرمز");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      const translatedMessage = errorMessage ? tValidation(errorMessage as any) : tValidation("DEFAULT");
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
            <ConfirmationChannelTabs value={channel} onValueChange={setChannel} />

            {channel === "EMAIL" ? (
              <div className="grid gap-2 mt-3">
                <Input
                  label={t('form.emailLabel')}
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('form.emailPlaceholder')}
                />
              </div>
            ) : (
              <div className="grid gap-2 mt-3">
                <CountryPhone
                  value={mobile}
                  onChange={setMobile}
                  placeholder={t('form.mobilePlaceholder')}
                  defaultCountry="sa"
                  showValidation={true}
                  onValidationChange={setIsPhoneValid}
                  label={t('form.mobileLabel')}
                />
              </div>
            )}
          </div>
        );

      case "verify":
        return (
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
          </div>
        );

      case "reset":
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                label={t('form.newPasswordLabel')}
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('form.newPasswordPlaceholder')}
              />
            </div>

            <div className="grid gap-2">
              <Input
                label={t('form.confirmPasswordLabel')}
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('form.confirmPasswordPlaceholder')}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {t('form.passwordsDoNotMatch')}
                </p>
              )}
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
              onClick={handleRequestRecovery}
              disabled={isLoading || (channel === "EMAIL" ? !email : (!mobile || !isPhoneValid))}
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              {t('buttons.send')}
            </Button>
          </div>
        );

      case "verify":
        return (
          <div className="w-full space-y-4 mt-4">
            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || otpCode.length !== 6}
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              {t('buttons.confirm')}
            </Button>
            <div className="flex items-center justify-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-[#595959]">
                  {t('messages.resendAfter')} {formatTime(resendTimer)}
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  {t('messages.didNotReceive')}{" "}
                  <button
                    type="button"
                    onClick={handleRequestRecovery}
                    disabled={isLoading}
                    className="text-[#1A1A1A] text-sm font-semibold underline hover:text-[#DC340A]/80 disabled:opacity-50"
                  >
                    {t('buttons.resend')}
                  </button>
                </p>
              )}
            </div>
          </div>
        );

      case "reset":
        return (
          <div className="w-full mt-4">
            <Button
              onClick={handleResetPassword}
              disabled={isLoading || !newPassword || newPassword !== confirmPassword}
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              {t('buttons.resetPassword')}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    switch (step) {
      case "request":
        return t('title.request');
      case "verify":
        return t('title.verify');
      case "reset":
        return t('title.reset');
      default:
        return t('title.request');
    }
  };

  const getSize = () => {
    switch (step) {
      case "request":
        return "md";
      case "verify":
        return "sm";
      case "reset":
        return "md";
      default:
        return "sm";
    }
  };

  const getHeaderDescription = () => {
    switch (step) {
      case "request":
        return t('description.request');
      case "verify":
        return t('description.verify');
      case "reset":
        return t('description.reset');
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
      footer={
        <div className="mt-5 w-full">
          {renderFooter()}
        </div>
      }
      size={getSize()}
    />
  );
}

