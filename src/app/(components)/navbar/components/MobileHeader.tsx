// ============================================================================
// Components - MobileHeader
// ============================================================================

"use client";

import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Logo } from "./Logo";
import {
  LocationTrigger,
  type LocationTriggerTranslations,
} from "./LocationTrigger";

interface MobileHeaderProps {
  translations: LocationTriggerTranslations;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ translations }) => {
  const locale = useLocale();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-[60px]">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 h-14 py-8 bg-white text-white relative shadow-sm">
        {/* Center - Title and Logo */}
        <div className={`flex items-center gap-3`}>
          {/* Logo */}
          <div className="w-[45px] bg-white h-[45px] flex items-center justify-center   z-10 rounded-full navbar-logo-shadow-mobile">
            <Logo
              href="/"
              src="/logo-rental.png"
              alt="logo"
              className="w-full h-full bg-white p-1.5 rounded-full"
            />
          </div>
          <Link href="/" className="flex flex-col items-start">
            <h1 className="text-[#1A1A1A] font-bold text-sm leading-tight">
              {locale === "ar" ? "رينتال جيت" : "Rental Gate"}
            </h1>
            <p className="text-[#1A1A1A]/80 text-xs leading-tight">
              {locale === "ar" ? "لتأجير السيارات" : "Car Rental"}
            </p>
          </Link>
        </div>
        <LocationTrigger
          translations={translations}
          className="max-w-42 text-black"
          labelClassName="max-w-[6.5rem] text-xs"
        />
      </div>
    </header>
  );
};
