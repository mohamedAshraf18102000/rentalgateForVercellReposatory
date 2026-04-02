// ============================================================================
// Components - MobileBottomNav
// ============================================================================

"use client";

import React from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import {
  Home,
  Car,
  ClipboardList,
  Menu,
  User,
  LogOut,
  Globe,
  Briefcase,
  X,
  UserCircle,
  Coins,
  CreditCard,
  Gift,
  MessageCircle,
  Users,
  Phone,
  Shield,
  FileText,
  Ticket,
  LogIn,
  Building2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useAuth } from "../hooks/useAuth";
import { logout } from "@/util/auth";
import { useClientStore } from "@/lib/api/stores";
import { useDialog } from "@/app/[locale]/(dialogs)";
import { ContactUsDialog } from "@/app/(components)/ContactUsDialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/app/(components)/ui/drawer";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  labelKey: string;
}

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("common");
  const { authenticated, userData } = useAuth();
  const { clearClientData } = useClientStore();
  const { openDialog } = useDialog();
  const [contactDialogOpen, setContactDialogOpen] = React.useState(false);
  const [languageDrawerOpen, setLanguageDrawerOpen] = React.useState(false);

  // Navigation items - order matters for RTL (right to left)
  const navItems: NavItem[] = [
    {
      href: "/",
      icon: Home,
      label: t("home"),
      labelKey: "home",
    },
    {
      href: "/bookings",
      icon: ClipboardList,
      label: locale === "ar" ? "الحجز" : "Bookings",
      labelKey: "bookings",
    },
    {
      href: "/bussinessAccounts",
      icon: Building2,
      label: locale === "ar" ? "حساب الاعمال" : "Bussiness Account",
      labelKey: "bussinessAccounts",
    },
  ];

  const isActive = (href: string): boolean => {
    // Normalize pathname - remove locale if present
    const normalizedPath = pathname.replace(`/${locale}`, "") || "/";

    if (href === "/") {
      return normalizedPath === "/" || normalizedPath === "";
    }

    // Check exact match or if pathname starts with the href
    return normalizedPath === href || normalizedPath.startsWith(`${href}/`);
  };

  const handleLanguageChange = () => {
    setLanguageDrawerOpen(true);
  };

  const handleSelectLanguage = (selectedLocale: "ar" | "en") => {
    router.push(pathname, { locale: selectedLocale });
    setLanguageDrawerOpen(false);
  };

  const handleLogin = () => {
    openDialog("Login", {
      onSuccess: () => {
        // Login success handled by dialog
      },
    });
  };

  const handleLogout = () => {
    logout();
    clearClientData();
    router.push("/");
  };

  const handleProfileClick = () => {
    router.push("/userProfile");
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  // All menu items matching Al-Ghazal design
  const allMenuItems = [
    {
      href: "/userProfile",
      icon: UserCircle,
      label: locale === "ar" ? "الملف الشخصي" : "Profile",
      labelKey: "profile",
      onClick: handleProfileClick,
      showOnlyWhenAuthenticated: true,
    },
    {
      href: "/myBookings",
      icon: Car,
      label: locale === "ar" ? "حجوزاتي" : "My Bookings",
      labelKey: "myBookings",
      showOnlyWhenAuthenticated: true,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2 max-w-3xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 py-2 active:scale-95 ${
                active ? "text-primary" : "text-gray-600"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 transition-all duration-200 ${
                  active
                    ? "text-primary stroke-primary"
                    : "text-gray-600 stroke-gray-600"
                }`}
                strokeWidth={active ? 1.5 : 1.5}
                fill="none"
              />
              <span
                className={`text-[11px] font-medium leading-tight transition-all duration-200 ${
                  active ? "text-primary font-" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Menu Button with Drawer */}
        <Drawer>
          <DrawerTrigger asChild>
            <button className="flex flex-col items-center justify-center flex-1 h-full transition-colors py-2 text-gray-600">
              <Menu
                className="w-5 h-5 mb-1 transition-colors text-gray-600 stroke-gray-600"
                strokeWidth={1.5}
              />
              <span className="text-[11px] font-medium leading-tight text-gray-600">
                {t("menu") || "Menu"}
              </span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            {/* Menu Content with white container */}
            <div className="flex-1 overflow-y-auto bg-white mx-3 mb-3">
              <div className="py-4 pt-6 px-4">
                {/* Menu Items */}
                <div className="flex flex-col">
                  {allMenuItems
                    .filter(
                      (item) =>
                        !item.showOnlyWhenAuthenticated || authenticated,
                    )
                    .map((item) => {
                      const Icon = item.icon;
                      const handleClick =
                        item.onClick || (() => handleNavigation(item.href));

                      return (
                        <React.Fragment key={item.labelKey}>
                          <DrawerClose asChild>
                            <button
                              onClick={handleClick}
                              className={`w-full flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors py-3  `}
                            >
                              <div className="w-5 h-5 shrink-0 text-[#606060]">
                                <Icon
                                  className="w-full h-full"
                                  strokeWidth={1}
                                />
                              </div>
                              <span
                                className={`flex-1 ${locale === "ar" ? "text-right" : "text-left"}`}
                              >
                                {item.label}
                              </span>
                            </button>
                          </DrawerClose>
                          <hr className="border-gray-200 my-1" />
                        </React.Fragment>
                      );
                    })}

                  {/* Login / Logout */}
                  {authenticated ? (
                    <DrawerClose asChild>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors cursor-pointer py-3 ${locale === "ar" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <span
                          className={`flex-1 ${locale === "ar" ? "text-right" : "text-left"}`}
                        >
                          {t("logout")}
                        </span>
                        <LogOut className="w-5 h-5 shrink-0 text-[#606060]" />
                      </button>
                    </DrawerClose>
                  ) : (
                    <DrawerClose asChild>
                      <button
                        onClick={handleLogin}
                        className={`w-full flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors cursor-pointer py-3 ${locale === "ar" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <span
                          className={`flex-1 ${locale === "ar" ? "text-right" : "text-left"}`}
                        >
                          {t("login")}
                        </span>
                        <LogIn
                          className="w-5 h-5 shrink-0 text-[#606060]"
                          strokeWidth={1}
                        />
                      </button>
                    </DrawerClose>
                  )}
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Contact Us Dialog */}
      <ContactUsDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />

      {/* Language Selection Drawer */}
      <Drawer open={languageDrawerOpen} onOpenChange={setLanguageDrawerOpen}>
        <DrawerContent>
          <div className="px-4 pb-4">
            <div className="py-4">
              <h2 className={`text-lg font-semibold mb-4  text-center`}>
                {locale === "ar" ? "اختر اللغة" : "Select Language"}
              </h2>
              <div className="space-y-2">
                {/* Arabic Option */}
                <button
                  onClick={() => handleSelectLanguage("ar")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    locale === "ar"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="text-xl">🇸🇦</span>
                  <span
                    className={`flex-1 font-medium ${locale === "ar" ? "text-right" : "text-left"}`}
                  >
                    العربية
                  </span>
                  {locale === "ar" && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </button>

                {/* English Option */}
                <button
                  onClick={() => handleSelectLanguage("en")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    locale === "en"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="text-xl">🇬🇧</span>
                  <span
                    className={`flex-1 font-medium ${locale === "ar" ? "text-right" : "text-left"}`}
                  >
                    English
                  </span>
                  {locale === "en" && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  );
};
