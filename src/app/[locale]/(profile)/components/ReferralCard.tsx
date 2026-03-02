"use client";

import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useClientStore } from "@/lib/api/stores";

export default function ReferralCard() {
  const t = useTranslations("home.referral");
  const [copied, setCopied] = useState(false);
  const { clientData } = useClientStore();

  // Use refCode from clientData or fallback to default
  const referralCode = clientData?.refCode || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("تم نسخ الكود بنجاح");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("فشل نسخ الكود");
    }
  };

  return (
    <div
      className="referral-card-wrapper rounded-[18px]"
    >
      <div
        className="referral-card-inner  referral_bg_card rounded-[18px] p-5 max-sm:p-3 overflow-hidden w-full h-full"
      >
        <div className=" z-10 flex flex-row items-start md:items-start md:justify-between gap-3 max-sm:gap-2">
          {/* Right Image - Placeholder for illustration */}
          <div className="w-30 max-sm:w-12 h-30 max-sm:h-12 shrink-0">
            <Image src="/profile/referral.png" alt="referral" width={100} height={100} className="w-full h-full object-fill" />
          </div>
          {/* Left Content */}
          <div className="flex-1 referral-card-content min-w-0">
            <h3 className="text-[18px] max-sm:text-[12px] font-bold text-black leading-tight">{t("title")}</h3>
            <p className="text-[14px] max-sm:text-[10px] text-[#1A1A1A] leading-relaxed mt-[6px] max-sm:mt-1">{t("description")}</p>

            {/* Code Section */}
            <div className="flex flex-col gap-2 mt-[10px] max-sm:mt-1">
              <span className="text-base max-sm:text-[11px] font-bold text-black whitespace-nowrap">{t("shareCode")}</span>
              <div className="flex items-center justify-between gap-2 bg-[#ECEEF2] rounded-[12px] max-sm:rounded-lg px-3 max-sm:px-2 py-2.5 max-sm:py-1.5">
                <span className="text-base max-sm:text-[11px] font-mono text-gray-900 font-medium truncate">{referralCode}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 max-sm:p-0.5 hover:bg-gray-200 rounded transition-colors shrink-0"
                  aria-label="Copy code"
                >
                  <Copy className="w-4 h-4 max-sm:w-3 max-sm:h-3 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

