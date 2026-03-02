"use client";

import * as React from "react";
import { Button, DialogWrapper, InputOtp } from "@/ui";
import type { VerifyOTPProps } from "./VerifyOTP.types";
import { verifyOTP } from "./services/verify-otp.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useDialog } from "../../..";

export function VerifyOTPDialog({
  clientId,
  onSuccess,
  onClose,
}: VerifyOTPProps) {
  const { openDialog } = useDialog();
  const [otpCode, setOtpCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("validation.AUTH_ERRORS");

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error(t("CODE_IS_REQUIRED") || "يرجى إدخال رمز التحقق");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOTP({
        clientId,
        code: otpCode,
      });

      // If we reach here, verification was successful
      if (response.message === "SUCCESS") {
        toast.success("تم التحقق من الرمز بنجاح");
        onSuccess?.();
        onClose();
        // Open login dialog after successful verification
        openDialog("Login", {
          onSuccess: (user: { id: string; email: string }) => {
            console.log("تم تسجيل الدخول:", user);
          },
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";
      const translatedMessage = errorMessage ? t(errorMessage as any) : t("DEFAULT");
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

