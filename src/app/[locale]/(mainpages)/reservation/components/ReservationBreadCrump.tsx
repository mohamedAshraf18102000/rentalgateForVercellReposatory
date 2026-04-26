"use client";
import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";
import { useTranslations } from "next-intl";

const ReservationBreadCrump = ({ carId }: { carId?: number }) => {
  const t = useTranslations("carDetails");

  return (
    <BreadcrumbNav
      className="mt-5"
      textColor="text-[var(--color-primary)]"
      items={[
        {
          label: t("reservation.breadcrumb.home"),
          href: "/",
        },
        {
          label: t("reservation.breadcrumb.carList"),
          href: "/bookings",
        },
        {
          label: t("reservation.breadcrumb.carDetails"),
          href: carId ? `/carDetails/${carId}` : "/carDetails",
        },
        {
          isCurrentPage: true,
          label: t("reservation.breadcrumb.currentPage"),
          href: "/reservation",
        },
      ]}
    />
  );
};

export default ReservationBreadCrump;
