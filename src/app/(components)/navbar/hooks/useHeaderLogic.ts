// ============================================================================
// Hooks - Header Logic
// ============================================================================

import { usePathname, useRouter } from "@/i18n/routing";
import { useClientStore } from "@/lib/api/stores";
import { logout } from "@/util/auth";
import { useLocale } from "next-intl";
import * as React from "react";
import { WHATSAPP_MESSAGE } from "../constants";
import { getWhatsAppUrl, isHomePage } from "../utils";
import { useAuth } from "./useAuth";

/**
 * Custom hook that handles all Header component logic
 */
export function useHeaderLogic() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { isClient, authenticated, userData, isLoading } = useAuth();
  const { clearClientData } = useClientStore();

  // Handlers
  const handleLogout = React.useCallback(() => {
    router.push("/");
    logout();
    clearClientData();
    setTimeout(() => {
      localStorage.removeItem("booked-car-details-storage");
      sessionStorage.removeItem("user-prefered-filters-storage");
      localStorage.removeItem("user-prefered-filters-storage");
      window.location.reload();
    }, 1000);
  }, [router, clearClientData]);

  const handleLanguageChange = React.useCallback(() => {
    const newLocale = locale === "ar" ? "en" : "ar";
    router.push(pathname, { locale: newLocale });
  }, [locale, pathname, router]);

  const handleProfileClick = React.useCallback(() => {
    router.push("/userProfile");
  }, [router]);

  const handleBookingsClick = React.useCallback(() => {
    router.push("/myBookings");
  }, [router]);

  // Computed values - Get WhatsApp from contacts
  const whatsappUrl = React.useMemo(() => {
    // Use whatsapp, mobile, or phone from contact, fallback to default
    const whatsappPhone = "";
    // Remove non-numeric characters (in case whatsapp contains URL)
    const cleanPhone = whatsappPhone;
    return getWhatsAppUrl(cleanPhone, WHATSAPP_MESSAGE);
  }, []);

  const homePageActive = React.useMemo(
    () => isHomePage(pathname, locale),
    [pathname, locale],
  );

  return {
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
  };
}
