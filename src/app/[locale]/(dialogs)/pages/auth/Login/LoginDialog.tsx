"use client";

import * as React from "react";
import { DialogWrapper } from "@/ui";
import { useDialog } from "../../..";
import type { LoginProps } from "./Login.types";
import FormLogin from "./FormLogin";
import { useLogin } from "./hooks/useLogin";
import { LoginTabs } from "./components/LoginTabs";
import { LoginFooter } from "./components/LoginFooter";
import { useTranslations } from "next-intl";

export function LoginDialog({
  redirectTo,
  onSuccess,
  onClose,
}: LoginProps) {
  const { openDialog } = useDialog();
  const t = useTranslations('auth');

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
  } = useLogin({
    onSuccess,
    onClose,
    redirectTo,
    onClientInactive: (email, mobile, channel) => {
      // Close login dialog and open forgot password dialog for account activation
      onClose();
      openDialog("ForgotPassword", {
        email: email || undefined,
        mobile: mobile || undefined,
        channel: channel || "EMAIL",
        isAccountActivation: true,
        onReset: (emailOrMobile) => {
          console.log("Account activation successful for:", emailOrMobile);
        },
      });
    },
    onClientDeactivated: (email, mobile, channel) => {
      // Close login dialog and open account deactivated dialog
      onClose();
      openDialog("AccountDeactivated", {
        email: email || undefined,
        mobile: mobile || undefined,
        channel: channel || "EMAIL",
      });
    },
  });

  const handleForgotPassword = () => {
    onClose();
    openDialog("ForgotPassword", {
      onReset: (email: string) => {
        console.log(t('passwordReset.resetFor'), email);
      },
    });
  };

  const handleSignUp = () => {
    onClose();
    openDialog("SignUp", {
      onSignUp: (data: { email?: string; mobile?: string; firstName: string; lastName: string; password: string; channel: "EMAIL" | "WHATSAPP"   }) => {  
        console.log(t('accountCreated.created'), data);
      },
    });
  };

  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      size="md"
      closeOnOutsideClick={false}
      header={{
        mainTitle: t('login.title'),
      }}
      content={
        <div className="grid gap-4 0">
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
            handleForgotPassword={handleForgotPassword}
          />
        </div>
      }
      footer={
        <LoginFooter
          isLoading={isLoading}
          isFormValid={isFormValid}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
        />
      }
    />
  );
}

