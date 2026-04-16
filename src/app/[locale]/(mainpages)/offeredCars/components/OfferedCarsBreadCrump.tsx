import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";

const OfferedCarsBreadCrump = () => {
  return (
    <BreadcrumbNav
      className="mt-3 sm:mt-5"
      textColor="text-[var(--color-primary)]"
      items={[
        {
          label: "الرئيسية",
          href: "/",
        },
        {
          isCurrentPage: true,
          label: "قائمة السيارات",
          href: "/bookings",
        },
      ]}
    />
  );
};

export default OfferedCarsBreadCrump;
