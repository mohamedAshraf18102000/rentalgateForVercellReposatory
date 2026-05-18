import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";
import { useTranslations } from "next-intl";

const ProfileBreadCrump = () => {
  const t = useTranslations("home");

  return (
    <BreadcrumbNav
      className="mt-5"
      textColor="text-[var(--color-primary)]"
      items={[
        {
          label: t("bookings.breadcrumb.home"),
          href: "/",
        },
        {
          label: t("bookings.breadcrumb.currentPage"),
          href: "/bookings",
        },
        {
          isCurrentPage: true,
          label: t("userProfile.breadcrumb.currentPage"),
          href: "/userProfile",
        },
      ]}
    />
  );
};

export default ProfileBreadCrump;
