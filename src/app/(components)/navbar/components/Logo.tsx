// ============================================================================
// Components - Logo
// ============================================================================

import React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { BUTTON_STYLES } from "../constants";

interface LogoProps {
  href: string;
  src: string;
  alt: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ href, src, alt, className }) => (
  <Link href={href} className={className || BUTTON_STYLES.logo}>
    <Image
      src={src}
      alt={alt}
      width={50}
      height={50}
      className="w-full h-full object-contain rounded-full"
    />
  </Link>
);
