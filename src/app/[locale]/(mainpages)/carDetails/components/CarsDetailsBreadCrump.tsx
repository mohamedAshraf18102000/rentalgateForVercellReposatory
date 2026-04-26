"use client";
import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";
import { useTranslations } from "next-intl";

const CarsDetailsBreadCrump = () => {
  const t = useTranslations("carDetails");

  return (
    <BreadcrumbNav
      className="mt-5"
      textColor="text-[var(--color-primary)]"
      items={[
        {
          label: t("breadcrumb.home"),
          href: "/",
        },
        {
          label: t("breadcrumb.carList"),
          href: "/bookings",
        },
        {
          isCurrentPage: true,
          label: t("breadcrumb.currentPage"),
          href: "/bookings",
        },
      ]}
    />
  );
};

export default CarsDetailsBreadCrump;
