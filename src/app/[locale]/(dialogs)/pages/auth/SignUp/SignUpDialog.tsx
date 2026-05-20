"use client";

import * as React from "react";
import { Button, Input, DialogWrapper, Checkbox } from "@/ui";
import { useDialog } from "../../..";
import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import type { SignUpProps } from "./SignUp.types";
import { signup as signUpUser } from "@/services/auth/signup/signup.service";
import type { SignUpPayload } from "./types/api.types";
import { setShowWelcomePointsFlag } from "@/hooks/useWelcomePoints";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import WarningMessage from "@/app/(components)/WarningMessage";
import Link from "next/link";

export function SignUpDialog({ onSignUp, onClose, onLogin }: SignUpProps) {
  const { openDialog } = useDialog();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPhoneValid, setIsPhoneValid] = React.useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = React.useState(false);

  const tValidation = useTranslations("validation.AUTH_ERRORS");
  const t = useTranslations("auth.signUp");

  const handleSignUp = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!isTermsAccepted) {
      toast.error(tValidation("TERMS_MUST_BE_ACCEPTED"));
      return;
    }

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

    if (!email) {
      toast.error(
        tValidation("EMAIL_IS_REQUIRED") || "يرجى إدخال البريد الإلكتروني",
      );
      return;
    }

    if (!mobile || !isPhoneValid) {
      toast.error(
        tValidation("MOBILE_IS_REQUIRED") || "يرجى إدخال رقم جوال صحيح",
      );
      return;
    }

    setIsLoading(true);

    try {
      const payload: SignUpPayload = {
        clientName: `${firstName} ${lastName}`.trim(),
        countryId: 1,
        mobile: mobile,
        email: email,
        password: password,
      };

      const response = await signUpUser(payload);

      // Check if status and valid are true
      if (response.status && response.valid) {
        // Show success message from response
        toast.success(response.message);

        // Set flag to show welcome points popup after login
        setShowWelcomePointsFlag();

        // Close signup dialog and open OTP verification dialog
        onClose();
        openDialog("VerifyOTP", {
          email,
          payload,
          type: "REGISTRATION",
          onSuccess: () => {
            onSignUp?.({
              email,
              mobile,
              firstName,
              lastName,
              password,
              channel: "EMAIL",
            });
          },
        });
      } else if (response.message) {
        // Show error message if status/valid is false
        toast.error(response.message);
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
          channel: "EMAIL",
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
          channel: "EMAIL",
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

  const isBaseFormValid =
    firstName &&
    lastName &&
    password &&
    passwordsMatch &&
    email &&
    mobile &&
    isPhoneValid;

  const isFormValid = isBaseFormValid && isTermsAccepted;

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
        contentContainerClassName="rounded-none"
        maxScrollHeight="350px"
        content={
          <form
            id="signup-form"
            onSubmit={(e) => void handleSignUp(e)}
            className="grid gap-4"
          >
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

            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="signup-terms-and-conditions"
                  checked={isTermsAccepted}
                  onCheckedChange={(checked) =>
                    setIsTermsAccepted(checked === true)
                  }
                />
                <label
                  htmlFor="signup-terms-and-conditions"
                  className="text-sm text-[#1A1A1A] font-medium leading-[130%] cursor-pointer underline underline-offset-2"
                >
                  <Link href={"/terms&conditions#terms-and-conditions"} target="_blank">
                    {t("form.termsAndConditionsLabel")}
                  </Link>
                </label>
              </div>
              {isBaseFormValid && !isTermsAccepted && (
                <WarningMessage
                  message={t("form.termsRequired")}
                  removeIcon={true}
                  className="mx-6 mt-0!"
                />
              )}
            </div>
          </form>
        }
        footer={
          <div className="w-full space-y-4 mt-8">
            <Button
              type="submit"
              form="signup-form"
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
    </>
  );
}
