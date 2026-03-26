"use client";

import * as React from "react";
import { Button, Input, DialogWrapper, Checkbox } from "@/ui";
import { useDialog } from "../../..";
import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { ConfirmationChannelTabs } from "./components/ConfirmationChannelTabs";
import { TermsAndPrivacyDialog } from "./components/TermsAndPrivacyDialog";
import type { SignUpProps } from "./SignUp.types";
import { signUpUser } from "./services/signup.service";
import type { SignUpPayload } from "./types/api.types";
import { setShowWelcomePointsFlag } from "@/hooks/useWelcomePoints";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export function SignUpDialog({ onSignUp, onClose, onLogin }: SignUpProps) {
  const { openDialog } = useDialog();
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [channel, setChannel] = React.useState<"EMAIL" | "WHATSAPP">("EMAIL");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPhoneValid, setIsPhoneValid] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = React.useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<"terms" | "privacy">(
    "terms",
  );
  const tValidation = useTranslations("validation.AUTH_ERRORS");
  const t = useTranslations("auth.signUp");

  const handleSignUp = async () => {
    if (!firstName || !lastName) {
      toast.error(
        tValidation("FIRST_NAME_IS_REQUIRED") || "يرجى إدخال الاسم بالكامل",
      );
      return;
    }

    if (!password || password !== confirmPassword) {
      toast.error(
        tValidation("PASSWORDS_DO_NOT_MATCH") || "كلمات المرور غير متطابقة",
      );
      return;
    }

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
      // Build payload based on channel
      // EMAIL: email is required, mobile is optional if provided and valid
      // WHATSAPP: mobile is required, email is optional if provided
      // Always send email/mobile if provided, regardless of channel
      const payload: SignUpPayload = {
        firstName,
        lastName,
        password,
        channel,
      };

      // Always include email if provided (regardless of channel)
      if (email) {
        payload.email = email;
      }

      // Always include mobile if provided and valid (regardless of channel)
      if (mobile && isPhoneValid) {
        payload.mobile = mobile;
      }

      const response = await signUpUser(payload);

      // Check if message is "SUCCESS"
      if (response.message === "SUCCESS") {
        // Extract clientId from response.data
        const clientId =
          typeof response.data === "number"
            ? response.data
            : response.data?.clientId;

        // Set flag to show welcome points popup after login
        setShowWelcomePointsFlag();

        if (clientId) {
          // Close signup dialog and open OTP verification dialog
          onClose();
          openDialog("VerifyOTP", {
            clientId,
            onSuccess: () => {
              onSignUp?.({
                email: channel === "EMAIL" ? email : undefined,
                mobile: channel === "WHATSAPP" ? mobile : undefined,
                firstName,
                lastName,
                password,
                channel,
              });
            },
          });
        } else {
          // Fallback if no clientId (shouldn't happen but handle gracefully)
          onSignUp?.({
            email: channel === "EMAIL" ? email : undefined,
            mobile: channel === "WHATSAPP" ? mobile : undefined,
            firstName,
            lastName,
            password,
            channel,
          });
          onClose();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "";

      // Check if error is CLIENT_DATA_EXISTS_IN_ALGHAZAL or CLIENT_DATA_EXISTS_IN_ALMAQAM
      if (
        errorMessage === "CLIENT_DATA_EXISTS_IN_ALGHAZAL" ||
        errorMessage === "CLIENT_DATA_EXISTS_IN_ALMAQAM"
      ) {
        // Close signup dialog and open account recovery dialog
        onClose();
        openDialog("AccountRecovery", {
          email: email || undefined,
          mobile: mobile && isPhoneValid ? mobile : undefined,
          channel: channel,
          onSuccess: () => {
            // After successful recovery, user can login
            console.log("Account recovery successful");
          },
        });
      } else if (errorMessage === "CLIENT_INACTIVE") {
        // Show toast explaining the issue
        const translatedMessage =
          tValidation("CLIENT_INACTIVE") ||
          "هذه البيانات غير مؤكدة برجاء تأكيد الحساب";
        toast.error(translatedMessage);

        // Close signup dialog and open forgot password dialog for account activation
        onClose();
        openDialog("ForgotPassword", {
          email: email || undefined,
          mobile: mobile && isPhoneValid ? mobile : undefined,
          channel: channel,
          isAccountActivation: true,
          onReset: (emailOrMobile) => {
            console.log("Account activation successful for:", emailOrMobile);
          },
        });
      } else {
        const translatedMessage = errorMessage
          ? tValidation(errorMessage as any)
          : tValidation("DEFAULT");
        toast.error(translatedMessage);
      }
      console.log("SignUp error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password === confirmPassword;

  // Validation logic:
  // - If EMAIL: email is required, mobile is optional
  // - If WHATSAPP: mobile is required and must be valid, email is optional
  // - Terms acceptance is required
  const isFormValid =
    firstName &&
    lastName &&
    password &&
    passwordsMatch &&
    termsAccepted &&
    (channel === "EMAIL"
      ? email // Email is required when channel is EMAIL
      : mobile && isPhoneValid); // Mobile is required and must be valid when channel is WHATSAPP

  return (
    <>
      <DialogWrapper
        open={true}
        onOpenChange={(open) => !open && onClose()}
        closeOnOutsideClick={false}
        header={{
          mainTitle: t("title"),
        }}
        scrollableContent={true}
        maxScrollHeight="350px"
        content={
          <div className="grid gap-4">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="signup-firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("form.firstNamePlaceholder")}
                label={t("form.firstNameLabel")}
              />
              <Input
                id="signup-lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t("form.lastNamePlaceholder")}
                label={t("form.lastNameLabel")}
              />
            </div>

            {/* Mobile Number */}
            <CountryPhone
              value={mobile}
              onChange={setMobile}
              placeholder={t("form.mobilePlaceholder")}
              defaultCountry="sa"
              showValidation={true}
              onValidationChange={setIsPhoneValid}
              label={t("form.mobileLabel")}
            />

            {/* Email */}
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("form.emailPlaceholder")}
              label={t("form.emailLabel")}
            />

            {/* Password */}
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("form.passwordPlaceholder")}
              label={t("form.passwordLabel")}
            />

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("form.confirmPasswordPlaceholder")}
                label={t("form.confirmPasswordLabel")}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-sm text-destructive mt-1">
                  {t("form.passwordsDoNotMatch")}
                </p>
              )}
            </div>
          </div>
        }
        footer={
          <div className="w-full space-y-4 mt-8">
            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="terms-acceptance"
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked === true)
                }
              />
              <label
                htmlFor="terms-acceptance"
                className="text-sm text-[#595959] cursor-pointer select-none"
              >
                {locale === "ar" ? "أوافق على " : "I agree to "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDialogType("terms");
                    setTermsDialogOpen(true);
                  }}
                  className="text-[#1A1A1A] underline underline-offset-2 hover:no-underline"
                >
                  {locale === "ar" ? "جميع الشروط" : "all terms"}
                </button>
                {locale === "ar" ? " و " : " and "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDialogType("privacy");
                    setPrivacyDialogOpen(true);
                  }}
                  className="text-[#1A1A1A] underline underline-offset-2 hover:no-underline"
                >
                  {locale === "ar" ? "سياسة الخصوصية" : "privacy policy"}
                </button>
              </label>
            </div>
            <Button
              onClick={handleSignUp}
              disabled={!isFormValid || isLoading}
              className="w-full"
              loading={isLoading}
              size="lg"
            >
              {t("buttons.createAccount")}
            </Button>
            <div className="text-center text-sm">
              <span className="text-[#595959]">{t("footer.haveAccount")} </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openDialog("Login", {
                    onSuccess: (user: { id: string; email: string }) => {
                      console.log("تم تسجيل الدخول:", user);
                    },
                  });
                }}
                className="text-sm text-[#1A1A1A] underline font-medium   underline-offset-2  "
              >
                {t("footer.login")}
              </button>
            </div>
          </div>
        }
      />
      {/* Terms and Privacy Dialogs - Outside main dialog to prevent closing */}
      <TermsAndPrivacyDialog
        open={termsDialogOpen}
        onOpenChange={setTermsDialogOpen}
        type="terms"
        locale={locale}
      />
      <TermsAndPrivacyDialog
        open={privacyDialogOpen}
        onOpenChange={setPrivacyDialogOpen}
        type="privacy"
        locale={locale}
      />
    </>
  );
}
