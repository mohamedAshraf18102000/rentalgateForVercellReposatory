import { getTranslations, getLocale } from "next-intl/server";
import { HomeLink } from "./components/HomeLink";
import { Logo } from "./components/Logo";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { MobileHeader } from "./components/MobileHeader";
import { NAVBAR_STYLES, BUTTON_STYLES } from "./constants";
import { NavbarActions } from "./components/NavbarActions";
import ClearData from "./ClearData";

export default async function Header() {
  const t = await getTranslations("common");
  const locale = await getLocale();

  // Translations for the client component
  const translations = {
    profile: t("profile") || "Profile",
    myBookings: t("myBookings") || "My Bookings",
    logout: t("logout") || "تسجيل الخروج",
    login: t("login"),
    home: t("home"),
    talkToUs: t("talkToUs"),
    updateLocationPrefix: t("updateLocationPrefix"),
    updateLocationLink: t("updateLocationLink"),
    updateLocationSuffix: t("updateLocationSuffix"),
  };

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
                isActive={false} // Will be handled by client hydration or CSS if needed
                className={BUTTON_STYLES.navLink}
              />

              <HomeLink
                href="/bookings"
                label={locale === "ar" ? "الحجز" : "Bookings"}
                isActive={false}
                className={BUTTON_STYLES.navLink}
              />

              <HomeLink
                href="/bussinessAccounts"
                label={locale === "ar" ? "حساب الاعمال" : "Bussiness Account"}
                isActive={false}
                className={BUTTON_STYLES.navLink}
              />

              <HomeLink
                href="/userProfile"
                label={locale === "ar" ? "الملف الشخصي" : "Profile"}
                isActive={false}
                className={BUTTON_STYLES.navLink}
              />
            </div>

            <ClearData />

            {/* Right Section */}
            <div className={NAVBAR_STYLES.rightSection}>
              <NavbarActions translations={translations} />
            </div>
          </div>
        </div>
      </header>
      <MobileBottomNav />
    </>
  );
}
