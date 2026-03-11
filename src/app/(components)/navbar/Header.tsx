// ============================================================================
// Main Component - Header
// ============================================================================

"use client";

import { ContactUsDialog } from "@/app/(components)/ContactUsDialog";
import { useTranslations } from "next-intl";
import * as React from "react";
import { LoginButton } from "../LoginButton";
import { HomeLink } from "./components/HomeLink";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Logo } from "./components/Logo";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { MobileHeader } from "./components/MobileHeader";
import { UserMenu } from "./components/UserMenu";
import { BUTTON_STYLES, NAVBAR_STYLES } from "./constants";
import { useHeaderLogic } from "./hooks/useHeaderLogic";

export default function Header() {
  const t = useTranslations("common");
  const tContact = useTranslations("contact");
  const {
    isClient,
    authenticated,
    userData,
    isLoading,
    locale,
    pathname,
    whatsappUrl,
    homePageActive,
    handleLogout,
    handleLanguageChange,
    handleProfileClick,
    handleBookingsClick,
  } = useHeaderLogic();
  const [contactDialogOpen, setContactDialogOpen] = React.useState(false);

  // Translations
  const translations = React.useMemo(
    () => ({
      profile: t("profile") || "Profile",
      myBookings: t("myBookings") || "My Bookings",
      logout: t("logout") || "تسجيل الخروج",
      login: t("login"),
      home: t("home"),
      talkToUs: t("talkToUs"),
    }),
    [t],
  );

  return (
    <>
      <MobileHeader />
      <header className={NAVBAR_STYLES.header}>
        <div className={NAVBAR_STYLES.container}>
          <div className={NAVBAR_STYLES.navbar}>
            {/* Left Section */}
            <div className={NAVBAR_STYLES.leftSection}>
              {/* Center Section - Logo */}
              <div className={NAVBAR_STYLES.centerSection}>
                <Logo href="/" src="/logo-rental.png" alt="logo" />
              </div>
              <HomeLink
                href="/"
                label={translations.home}
                isActive={homePageActive}
                className={BUTTON_STYLES.navLink}
              />

              <HomeLink
                href="/bookings"
                label={locale === "ar" ? "الحجز" : "Bookings"}
                isActive={pathname === "/bookings"}
                className={BUTTON_STYLES.navLink}
              />

              <HomeLink
                href="/branches"
                label={locale === "ar" ? "الفروع" : "Branches"}
                isActive={pathname === "/branches"}
                className={BUTTON_STYLES.navLink}
              />

              <HomeLink
                href="/bussinessAccounts"
                label={locale === "ar" ? "حساب الاعمال" : "Bussiness Account"}
                isActive={pathname === "/bussinessAccounts"}
                className={BUTTON_STYLES.navLink}
              />

              <HomeLink
                href="/userProfile"
                label={locale === "ar" ? "الملف الشخصي" : "Profile"}
                isActive={pathname === "/userProfile"}
                className={BUTTON_STYLES.navLink}
              />
            </div>

            {/* Right Section */}
            <div className={NAVBAR_STYLES.rightSection}>
              <div className={NAVBAR_STYLES.actionsWrapper}>
                {/* <button
                  onClick={() => setContactDialogOpen(true)}
                  className={cn(
                    BUTTON_STYLES.homeLink,
                    BUTTON_STYLES.homeLinkInactive,
                    BUTTON_STYLES.navLink
                  )}
                >
                  {tContact('title')}
                </button> */}
                <LanguageSwitcher
                  currentLocale={locale}
                  onToggle={handleLanguageChange}
                />

                {isClient && authenticated ? (
                  <UserMenu
                    userData={userData}
                    isLoading={isLoading}
                    onLogout={handleLogout}
                    onProfileClick={handleProfileClick}
                    onBookingsClick={handleBookingsClick}
                    translations={translations}
                  />
                ) : (
                  <LoginButton
                    className={BUTTON_STYLES.primary}
                    variant="default"
                  >
                    {translations.login}
                  </LoginButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileBottomNav />
      <ContactUsDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />
    </>
  );
}
