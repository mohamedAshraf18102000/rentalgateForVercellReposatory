"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

export function DocumentDirectionSync() {
  const locale = useLocale();

  useEffect(() => {
    const isArabic = locale === "ar";
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
