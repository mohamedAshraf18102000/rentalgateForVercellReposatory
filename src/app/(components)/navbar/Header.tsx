import { getTranslations, getLocale } from "next-intl/server";
import { HomeLink } from "./components/HomeLink";
import { ProfileNavLink } from "./components/ProfileNavLink";
import { Logo } from "./components/Logo";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { MobileHeader } from "./components/MobileHeader";
import { NAVBAR_STYLES, BUTTON_STYLES } from "./constants";
import { NavbarActions } from "./components/NavbarActions";
import { Separator } from "../ui/separator";
import { LanguageSwitcher } from "./components";
import { cn } from "@/lib/utils";
import ClearData from "./ClearData";

export default async function Header() {
  const t = await getTranslations("common");
  const locale = await getLocale();

  // Translations for the client component
  const translations = {
    profile: t("profile") || "Profile",
    userNavGreeting: t("userNavGreeting"),
    myBookings: t("myBookings") || "My Bookings",
    logout: t("logout") || "تسجيل الخروج",
    login: t("login"),
    home: t("home"),
    talkToUs: t("talkToUs"),
    updateLocationPrefix: t("updateLocationPrefix"),
    updateLocationLink: t("updateLocationLink"),
    updateLocationSuffix: t("updateLocationSuffix"),
    selectPickupLocation: t("selectPickupLocation"),
    locationPermissionGranted: t("locationPermissionGranted"),
    detectingLocation: t("detectingLocation"),
  };

  return (
    <>
      <MobileHeader translations={translations} />
      <header className={NAVBAR_STYLES.header}>
        <div className={NAVBAR_STYLES.container}>
          <div className={NAVBAR_STYLES.navbar}>
            {/* Left Section */}
            <div className={NAVBAR_STYLES.leftSection}>
              {/* Center Section - Logo */}
              <div className={cn("w-[150px]")}>
                <Logo
                  href="/"
                  src="/RentalGateNewLogo.webp"
                  alt="rental gate logo"
                />
              </div>

              <HomeLink
                href="/"
                label={translations.home}
                isActive={false}
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

              <ProfileNavLink />

              <Separator orientation="vertical" />

              <LanguageSwitcher />
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
