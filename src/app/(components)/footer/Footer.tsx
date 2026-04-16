"use client";

import { Link } from "@/i18n/routing";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const footerNav = [
  { href: "/", key: "home" as const },
  { href: "/bookings", key: "booking" as const },
  { href: "/bussinessAccounts", key: "businessAccount" as const },
  { href: "/userProfile", key: "footerPersonal" as const },
  { href: "/terms&conditions", key: "termsAndConditions" as const },
];

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XTwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      fillRule="evenodd"
      viewBox="64 64 896 896"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M921 912L601.11 445.75l.55.43L890.08 112H793.7L558.74 384 372.15 112H119.37l298.65 435.31-.04-.04L103 912h96.39L460.6 609.38 668.2 912zM333.96 184.73l448.83 654.54H706.4L257.2 184.73z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="bg-[#1A1A1A] text-white mt-8 md:mt-[60px] pb-20 md:pb-0">
      {/* Main Footer Content - Single row: Brand (right) | Nav (center) | Social (left) */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          {/* Brand - Right in RTL */}
          <div className="flex flex-col items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/Logo-rentalGate.png"
                alt="Rental Gate"
                width={150}
                height={150}
                className="object-contain brightness-0 invert"
              />
            </Link>
          </div>

          {/* Nav Links - Center */}
          <nav
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 order-2 md:order-2"
            aria-label="Footer navigation"
          >
            {footerNav.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className="text-white text-sm hover:text-red-500 transition-colors"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Social Icons - Left in RTL: YouTube, Facebook, Twitter, Instagram, LinkedIn */}
          <div className="flex items-center gap-4 order-3 md:order-3">
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("visitYouTube")}
              className="text-white hover:text-red-500 transition-colors"
            >
              <YoutubeIcon className="w-6 h-6" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("visitFacebook")}
              className="text-white hover:text-red-500 transition-colors"
            >
              <Facebook className="w-6 h-6" aria-hidden="true" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("visitTwitter")}
              className="text-white hover:text-red-500 transition-colors flex items-center justify-center"
            >
              <XTwitterIcon className="w-5 h-5" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("visitInstagram")}
              className="text-white hover:text-red-500 transition-colors"
            >
              <Instagram className="w-6 h-6" aria-hidden="true" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("visitLinkedIn")}
              className="text-white hover:text-red-500 transition-colors"
            >
              <Linkedin className="w-6 h-6" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright - Centered */}
      <div className="border-t border-white/20 py-6 w-full">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-white text-xs md:text-sm text-center">
            {t("footerCopyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
