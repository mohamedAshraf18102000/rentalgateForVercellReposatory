import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";
import { useTranslations } from "next-intl";

const OfferedCarsBreadCrump = () => {
  const t = useTranslations("common");

  return (
    <BreadcrumbNav
      className="mt-3 sm:mt-5"
      textColor="text-[var(--color-primary)]"
      items={[
        {
          label: t("home"),
          href: "/",
        },
        {
          isCurrentPage: true,
          label: t("carList"),
          href: "/bookings",
        },
      ]}
    />
  );
};

export default OfferedCarsBreadCrump;
