"use client";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import React from "react";
import { BUTTON_STYLES } from "../constants";

interface HomeLinkProps {
  href: string;
  label: string;
  isActive?: boolean;
  className?: string;
}

export const HomeLink: React.FC<HomeLinkProps> = ({
  href,
  label,
  isActive: manualIsActive,
  className,
}) => {
  const pathname = usePathname();
  const isActive = manualIsActive || pathname === href;

  return (
    <Link href={href}>
      <div
        className={cn(
          BUTTON_STYLES.homeLink,
          isActive
            ? BUTTON_STYLES.homeLinkActive
            : BUTTON_STYLES.homeLinkInactive,
        )}
      >
        <span
          className={cn(
            className || BUTTON_STYLES.navLink,
            isActive && "text-gray-800 font-semibold!",
          )}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};
