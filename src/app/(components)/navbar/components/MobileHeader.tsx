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
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MobileHeaderProps {
  translations: LocationTriggerTranslations;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ translations }) => {
  const locale = useLocale();
  const router = useRouter();
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-[60px]">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 h-14 py-8 bg-white text-white relative shadow-sm">
        {/* Center - Title and Logo */}
        <div className={`flex items-center gap-3`}>
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className=" flex! items-center! justify-center! z-10 rounded-full overflow-hidden"
          >
            <Image
              src="/RentalGateNewLogo.webp"
              alt="rental gate logo"
              width={150}
              height={150}
              className="object-contain scale-80"
            />
          </div>
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
