// ============================================================================
// Hooks - Header Logic
// ============================================================================

import { usePathname, useRouter } from "@/i18n/routing";
import { useClientStore, useSharedStore } from "@/lib/api/stores";
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
  const { sharedData } = useSharedStore();

  // Get first contact from contacts array
  const contact = sharedData?.contacts?.[0];

  // Handlers
  const handleLogout = React.useCallback(() => {
    logout();
    clearClientData(); // Clear client data from Zustand store
    router.push("/");
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
    const whatsappPhone = contact?.whatsapp || "";
    // Remove non-numeric characters (in case whatsapp contains URL)
    const cleanPhone = whatsappPhone;
    return getWhatsAppUrl(cleanPhone, WHATSAPP_MESSAGE);
  }, [contact]);

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
