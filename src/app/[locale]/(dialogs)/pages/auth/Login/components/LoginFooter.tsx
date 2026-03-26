"use client";

import * as React from "react";
import { Button } from "@/ui";
import { useTranslations } from "next-intl";

interface LoginFooterProps {
  isLoading: boolean;
  isFormValid: boolean;
  onLogin: () => void;
  onSignUp: () => void;
}

export const LoginFooter: React.FC<LoginFooterProps> = ({
  isLoading,
  isFormValid,
  onLogin,
  onSignUp,
}) => {
  const t = useTranslations("auth.login");
  const tFooter = useTranslations("auth.login.footer");

  return (
    <div className="flex flex-col gap-2 w-full mt-5">
      <Button
        onClick={onLogin}
        className="w-full"
        size="lg"
        loading={isLoading}
      >
        {isLoading ? t("loggingIn") : t("loginButton")}
      </Button>
      <div className="text-center text-sm mt-3 text-[#595959] leading-[130%]">
        {tFooter("noAccount")}{" "}
        <button
          type="button"
          onClick={onSignUp}
          className="text-sm text-[#1A1A1A] underline font-medium   underline-offset-2  "
        >
          {tFooter("createAccount")}
        </button>
      </div>
    </div>
  );
};
