"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import styles from "./hangedOffer.module.css";

const HangedOfferIcon = () => {
  const t = useTranslations("carDetails");

  return (
    <div className={styles.object}>
      <div className={styles.hanger}>
        <div className={styles.ropeCaret} aria-hidden>
          <div className={cn(styles.ropeLeg, styles.ropeLegLeft)} />
          <div className={cn(styles.ropeLeg, styles.ropeLegRight)} />
        </div>
        <div
          className={cn(
            styles.objectKnot,
            "h-2.5 w-2.5 bg-StatusRed rounded-full border-2 border-[#2A2A2A]",
          )}
        />

        <div
          className={cn(
            styles.objectShape,
            "bg-[#2A2A2A]/90 w-12 rounded-md flex flex-col text-center",
          )}
        >
          <span className="text-[9px] text-white font-normal">
            {t("hangedOfferTop")}
          </span>
          <span className="text-[11px] text-primary-red font-extrabold -mt-1">
            {t("hangedOfferBottom")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HangedOfferIcon;
