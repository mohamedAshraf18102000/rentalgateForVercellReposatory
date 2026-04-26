import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";
import { getTranslations } from "next-intl/server";

const BookingBreadCrump = async () => {
  const t = await getTranslations("home");

  return (
    <BreadcrumbNav
      className="mt-3 sm:mt-5"
      textColor="text-[var(--color-primary)]"
      items={[
        {
          label: t("bookings.breadcrumb.home"),
          href: "/",
        },
        {
          isCurrentPage: true,
          label: t("bookings.breadcrumb.currentPage"),
          href: "/bookings",
        },
      ]}
    />
  );
};

export default BookingBreadCrump;
