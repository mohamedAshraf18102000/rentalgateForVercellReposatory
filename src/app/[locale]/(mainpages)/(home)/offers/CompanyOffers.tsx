"use client";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useSharedStore } from "@/lib/api/stores";

function CompanyOffers() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { sharedData } = useSharedStore();

  const contact = sharedData?.contacts?.[0];
  console.log(contact);

  return (
    <div className="container-custom mt-10 rounded-2xl overflow-hidden">
      <h4 className="text-3xl font-bold mb-4 text-center">عروض رينتال جيت</h4>

      <div className="relative w-full h-[500px] border-2 rounded-3xl overflow-hidden">
        <Image
          src="/Panners/offers/img1.png"
          alt="Phone"
          width={1000}
          quality={100}
          height={1000}
          className="w-full h-full object-fill"
          priority
        />
      </div>
    </div>
  );
}

export default CompanyOffers;
