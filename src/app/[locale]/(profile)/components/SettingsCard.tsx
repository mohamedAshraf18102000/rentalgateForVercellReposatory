"use client";

import { ArrowIcon } from "@/constants/icons";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useClientStore } from "@/lib/api/stores";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { logout } from "@/util/auth";
import { useDialog } from "@/app/[locale]/(dialogs)/hooks/useDialog";

interface SettingsRowProps {
  label: string;
  value?: string;
  href?: string;
  onClick?: () => void;
  lastRow?: boolean;
}

function SettingsRow({ label, value, href, onClick, lastRow = false }: SettingsRowProps) {
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";

  const content = (
    <div className={`flex items-center justify-between cursor-pointer py-5  flex-row-reverse ${isRTL ? "flex-row-reverse" : ""}`}>
      {/* Left side - Value and Arrow */}
      <div className={`flex items-center gap-4 ${isRTL ? "ml-3" : "mr-3"}`}>
        {value && (
          <div className={`flex-1`}>
            <span className="text-[16px] max-sm:text-[14px] font-medium text-[#595959]">{value}</span>
          </div>
        )}
        <ArrowIcon
          className={`w-5 h-5 max-sm:w-4 max-sm:h-4 text-[#595959] ${isRTL ? "" : "rotate-180"}`}
        />
      </div>

      {/* Right side - Label */}
      <div className={`flex-1`}>
        <span className="text-[16px] max-sm:text-[14px] text-[#0D0D0D]">{label}</span>
      </div>
    </div>
  );

  const wrapper = href ? (
    <Link href={href}>{content}</Link>
  ) : (
    <div onClick={onClick}>{content}</div>
  );

  return (
    <>
      {wrapper}
      {!lastRow && <div className="h-px bg-[#ECEEF2]" />}
    </>
  );
}

export default function SettingsCard() {
  const t = useTranslations("common");
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const { clearClientData } = useClientStore();
  const router = useRouter();
  const { openDialog } = useDialog();

  // Get current language display name
  const currentLanguage = locale === "ar" ? t("arabicLanguage") : t("englishLanguage");

  // Handlers
  const handleLogout = useCallback(() => {
    logout();
    clearClientData(); // Clear client data from Zustand store
    router.push('/');
  }, [router, clearClientData]);

  const handleChangePassword = useCallback(() => {
    openDialog("ChangePassword", {});
  }, [openDialog]);


  return (
    <div className="mt-[24px]">
      {/* Header */}
      <h3 className={`text-[18px] font-bold text-[#1A1A1A] mb-4 ${isRTL ? "text-right" : "text-left"}`}>
        {t("settings")}:
      </h3>

      {/* Settings Card */}
      <div className="referral-card-wrapper rounded-[18px]">
        <div className="referral-card-inner rounded-[18px] overflow-hidden w-full h-full">
          <div className="space-y-0 px-3">
            <SettingsRow
              label={t("language")}
              value={currentLanguage}
              href={`/${locale === "ar" ? "en" : "ar"}/profile`}
            />
            <SettingsRow
              label={t("changePassword")}
              onClick={handleChangePassword}
              lastRow={true}
            />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleLogout}
          className="text-[16px] text-primary underline font-medium hover:text-primary-hover transition-colors"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}

