"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/(components)/ui/breadcrumb";

type BreadcrumbNavItem = {
  label: string;
  href: string;
  isCurrentPage?: boolean;
};

type BreadcrumbNavProps = {
  items: BreadcrumbNavItem[];
  className?: string;
  textColor?: string;
};

export function BreadcrumbNav({
  items,
  className,
  textColor = "white",
}: BreadcrumbNavProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const SeparatorIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList
        className="text-xs sm:text-sm flex-wrap"
        style={{
          color: textColor,
        }}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage
                  className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none underline"
                  style={{ color: textColor }}
                >
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none"
                  style={{ color: textColor, opacity: 0.9 }}
                >
                  {item.label}
                </Link>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator style={{ color: textColor, opacity: 0.7 }}>
                <SeparatorIcon className="size-3 sm:size-3.5" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
