"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useClientStore, useSharedStore } from "@/lib/api/stores";
import { WHATSAPP_PHONE, WHATSAPP_MESSAGE } from "@/app/(components)/navbar/constants";
import { getWhatsAppUrl } from "@/app/(components)/navbar/utils";
import Link from "next/link";
import { PointsIcon, PriceIcon, WhatsAppProfileIcon } from "@/constants/icons";

function WhatsAppCard() {
  const t = useTranslations("common");
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const whatsappUrl = getWhatsAppUrl(WHATSAPP_PHONE, WHATSAPP_MESSAGE);

  return (
    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <div className="referral-card-wrapper rounded-[18px] cursor-pointer hover:opacity-90 transition-opacity">
        <div className="referral-card-inner rounded-[18px] p-5 overflow-hidden w-full h-full">
          <div className="flex flex-col items-center text-center space-y-3">
            <WhatsAppProfileIcon className="w-8 h-8 max-sm:w-6 max-sm:h-6 text-black" />
            <div className="space-y-1 mt-[8px]">
              <h3 className="text-base font-bold text-black max-sm:text-[14px]">{t("talkToUsNow")}</h3>
              <p className="text-sm text-[#757575]  mt-[10px] max-sm:text-[11px]">{t("contactViaWhatsApp")}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PointsCard() {
  const t = useTranslations("common");
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const { clientData } = useClientStore();
  const { sharedData } = useSharedStore();
  const pointsSpentPerSAR = parseFloat(sharedData?.settings?.POINTS_SPENT_PER_SAR || '0');

  const pointsCalculation = clientData?.pointsCalculation || "0";
  const pointsCalculationNum = parseFloat(pointsCalculation) || 0;
  const pointsValue = Math.round((pointsCalculationNum / pointsSpentPerSAR));

  return (
    <div className="referral-card-wrapper rounded-[18px]">
      <div className="referral-card-inner rounded-[18px] p-5 overflow-hidden w-full h-full">
        <div className="flex flex-col items-center text-center space-y-3">
          <PointsIcon className="w-8 h-8 max-sm:w-6 max-sm:h-6 text-black" />
          <div className="space-y-1 mt-[8px]">
            <h3 className="text-base font-bold text-black max-sm:text-[14px]">{t("yourSpecialPoints")}</h3>
            <p className="text-sm text-[#757575] mt-[10px] max-sm:text-[11px] flex items-center gap-1">
              {pointsCalculationNum.toLocaleString()} {t("points")}

              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.728 0.0767996C9.89867 -0.0512 9.984 -0.0191998 9.984 0.1728V1.4848C9.984 1.69813 9.97333 1.8688 9.952 1.9968C9.93067 2.1248 9.84533 2.2528 9.696 2.3808C9.35467 2.67947 9.00267 2.90347 8.64 3.0528C8.27733 3.1808 7.82933 3.2448 7.296 3.2448C6.69867 3.2448 6.144 3.15947 5.632 2.9888C5.14133 2.81813 4.66133 2.64747 4.192 2.4768C3.744 2.30613 3.264 2.2208 2.752 2.2208C2.24 2.2208 1.80267 2.2848 1.44 2.4128C1.09867 2.5408 0.714667 2.80747 0.288 3.2128C0.245333 3.25547 0.181333 3.2768 0.0960001 3.2768C0.032 3.2768 0 3.23413 0 3.1488V1.7728C0 1.3888 0.096 1.11147 0.288 0.9408C1.03467 0.343467 1.856 0.0448 2.752 0.0448C3.328 0.0448 3.86133 0.130133 4.352 0.3008C4.84267 0.471467 5.32267 0.6528 5.792 0.8448C6.28267 1.01547 6.784 1.1008 7.296 1.1008C7.78667 1.1008 8.20267 1.0368 8.544 0.9088C8.90667 0.759467 9.30133 0.482133 9.728 0.0767996Z" fill="#595959" />
                <rect y="5.27734" width="9.984" height="2" fill="#595959" />
              </svg>

              {pointsValue.toLocaleString()} <PriceIcon className="w-4 h-4 text-[#1A1A1A]" />

            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileActionCards() {
  return (
    <div className="grid grid-cols-2 gap-4 max-sm:gap-2 mt-4">
      <PointsCard />
      <WhatsAppCard />
    </div>
  );
}

