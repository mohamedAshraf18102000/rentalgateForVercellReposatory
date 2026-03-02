"use client";

import { useTranslations } from "next-intl";
 import { useParams } from "next/navigation";
import { InfoCard } from "@/app/(components)/template/InfoCard";
import { Link } from "@/i18n/routing";

export default function MyBookingsCard() {
  const t = useTranslations("home.bookings");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <Link href={`/profile/my-bookings`}>
      <InfoCard
        title={t("title")}
        description={t("description")}
        image="/profile/bookings.png"
        locale={locale}
      />
    </Link>
  );
}

