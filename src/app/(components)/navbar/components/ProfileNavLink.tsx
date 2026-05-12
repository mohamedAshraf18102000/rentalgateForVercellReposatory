"use client";

import { useLocale } from "next-intl";
import { HomeLink } from "./HomeLink";
import { BUTTON_STYLES } from "../constants";
import { useAuth } from "../hooks/useAuth";

export function ProfileNavLink() {
  const locale = useLocale();
  const { isClient, authenticated } = useAuth();

  if (!isClient || !authenticated) return null;

  return (
    <HomeLink
      href="/userProfile"
      label={locale === "ar" ? "الملف الشخصي" : "Profile"}
      isActive={false}
      className={BUTTON_STYLES.navLink}
    />
  );
}
