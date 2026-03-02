"use client";

import * as React from "react";
import { DialogWrapper } from "@/ui";
import { useTranslations } from "next-intl";
import { useSharedStore } from "@/lib/api/stores";

interface TermsAndPrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "terms" | "privacy";
  locale: string;
}

export function TermsAndPrivacyDialog({
  open,
  onOpenChange,
  type,
  locale,
}: TermsAndPrivacyDialogProps) {
  const isArabic = locale === "ar";
  const { sharedData } = useSharedStore();

  // Get about data from sharedData
  // about[0] = Privacy Policy
  // about[1] = Terms and Conditions
  const aboutData = sharedData?.about;
  const privacyData = aboutData?.[0]; // First item is privacy
  const termsData = aboutData?.[1]; // Second item is terms

  // Get content based on type
  const content = type === "terms"
    ? (isArabic ? termsData?.arabicText : termsData?.englishText) || ""
    : (isArabic ? privacyData?.arabicPrivacy : privacyData?.englishPrivacy) || "";

  // Get title based on type
  const title = type === "terms" ?  (isArabic ? "الشروط والأحكام" : "Terms and Conditions")   :   (isArabic ? "سياسة الخصوصية" : "Privacy Policy");

  // If no content from API, show fallback message
  const displayContent = content || (isArabic 
    ? "لا يوجد محتوى متاح حالياً"
    : "No content available at the moment");

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      header={{
        mainTitle: title,
      }}
      scrollableContent={true}
      maxScrollHeight="60vh"
      content={
        <div 
          className="text-sm text-gray-700 leading-relaxed" 
          dir={isArabic ? "rtl" : "ltr"}
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      }
    />
  );
}
