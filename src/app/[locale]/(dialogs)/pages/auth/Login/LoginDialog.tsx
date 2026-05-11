"use client";

import { DialogWrapper, Button } from "@/ui";
import { useTranslations } from "next-intl";
import { useDialog } from "../../..";
import { useLogin } from "./hooks/useLogin";
import FormLogin from "./FormLogin";
import { LoginTabs } from "./components/LoginTabs";
import { LoginFooter } from "./components/LoginFooter";
import { LoginError } from "./components/LoginError";
import type { LoginProps } from "./Login.types";

export function LoginDialog({ onSuccess, onClose, redirectTo }: LoginProps) {
  const { openDialog } = useDialog();
  const t = useTranslations("auth.login");

  const {
    loginType,
    setLoginType,
    email,
    setEmail,
    mobile,
    setMobile,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    handleLogin,
    isFormValid,
    error,
  } = useLogin({
    onSuccess,
    onClose,
    redirectTo,
    onClientInactive: (email, mobile, channel) => {
      onClose();
      openDialog("ForgotPassword", {
        email,
        mobile,
        channel,
        isAccountActivation: true,
      });
    },
    onClientDeactivated: (email, mobile, channel) => {
      onClose();
      openDialog("AccountDeactivated", {
        email,
        mobile,
        channel,
      });
    },
  });

  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      size="md"
      closeOnOutsideClick={!isLoading}
      header={{
        mainTitle: t("title"),
      }}
      content={
        <div className="grid gap-4">
          <LoginTabs value={loginType} onValueChange={setLoginType} />

          <FormLogin
            loginType={loginType}
            email={email}
            mobile={mobile}
            password={password}
            rememberMe={rememberMe}
            setEmail={setEmail}
            setMobile={setMobile}
            setPassword={setPassword}
            setRememberMe={setRememberMe}
            handleForgotPassword={() => {
              onClose();
              openDialog("ForgotPassword", {
                email,
                mobile,
                channel: loginType === "email" ? "EMAIL" : "WHATSAPP",
              });
            }}
          />

          {error && <LoginError error={error} />}
        </div>
      }
      footer={
        <div className="w-full space-y-4">
          <LoginFooter
            isLoading={isLoading}
            isFormValid={isFormValid}
            onLogin={handleLogin}
            onSignUp={() => {
              onClose();
              openDialog("SignUp", {});
            }}
          />
        </div>
      }
    />
  );
}
