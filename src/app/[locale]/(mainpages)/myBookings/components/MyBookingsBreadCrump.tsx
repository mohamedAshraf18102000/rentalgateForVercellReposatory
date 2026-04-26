import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";
import { useTranslations } from "next-intl";

const MyBookingsBreadCrump = () => {
  const t = useTranslations("common");

  return (
    <BreadcrumbNav
      className="mt-5 min-w-0"
      textColor="text-[var(--color-primary)]"
      items={[
        {
          label: t("home"),
          href: "/",
        },
        {
          label: t("carList"),
          href: "/bookings",
        },
        {
          label: t("profile"),
          href: "/userProfile",
        },
        {
          isCurrentPage: true,
          label: t("myBookings"),
          href: "/myBookings",
        },
      ]}
    />
  );
};

export default MyBookingsBreadCrump;
