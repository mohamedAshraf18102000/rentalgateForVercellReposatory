"use client";

import { useDialog } from "../../../..";
import { useLocale, useTranslations } from "next-intl";

export interface LoginHTTP423Props {
  email?: string;
  mobile?: string;
  channel: "EMAIL" | "WHATSAPP";
}

export function LoginHTTP423({ email, mobile, channel }: LoginHTTP423Props) {
  const { openDialog } = useDialog();
  const t = useTranslations("auth.login.http423");
  const locale = useLocale();

  const handleClick = () => {
    openDialog("ForgotPassword", {
      email,
      mobile,
      channel,
      isAccountRecovery: true,
    });
  };

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex flex-col gap-2 items-center text-center"
    >
      <span className="text-base font-semibold">{t("title")}</span>
      <div className="flex gap-0.5 items-center justify-center text-sm flex-wrap">
        <span>{t("reactivatePrefix")}</span>
        <button
          type="button"
          onClick={handleClick}
          className="font-medium text-primary underline underline-offset-2"
        >
          {t("reactivateAction")}
        </button>
      </div>
    </div>
  );
}
