"use client";
import ProfileActionCard from "../ProfileActionCard";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useDialog } from "@/app/[locale]/(dialogs)/hooks/useDialog";

const UserProfileActions = () => {
  const { openDialog } = useDialog();
  const t = useTranslations("profile.profileActions");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    router.push(pathname, { locale: newLocale });
  };

  const handleChangePassword = () => {
    openDialog("ChangePassword", {});
  };

  const handleDeleteAccount = () => {
    openDialog("UserDeleteAccount", {});
  };

  return (
    <>
      <ProfileActionCard
        onClick={handleChangePassword}
        title={t("passwordTitle")}
        description={t("passwordDescription")}
        icon="/profile/actionIcons/password.webp"
      />
      <ProfileActionCard
        onClick={handleLanguageChange}
        title={t("languageTitle")}
        description={t("languageDescription")}
        icon="/profile/actionIcons/language.webp"
      />

      <ProfileActionCard
        onClick={handleDeleteAccount}
        title={t("deleteAccountTitle")}
        description={t("deleteAccountDescription")}
        icon="/profile/actionIcons/trash.webp"
      />

      {/* <ProfileActionCard
        onClick={() => openDialog("UserSuggestion", {})}
        title={t("supportTitle")}
        description={t("supportDescription")}
        icon="/profile/actionIcons/customerService.webp"
      /> */}
    </>
  );
};

export default UserProfileActions;
