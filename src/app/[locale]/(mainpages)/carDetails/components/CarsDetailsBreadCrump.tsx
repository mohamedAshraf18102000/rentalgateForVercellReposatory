import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";

const CarsDetailsBreadCrump = () => {
  return (
    <BreadcrumbNav
      className="mt-5"
      textColor="text-[var(--color-primary)]"
      items={[
        {
          label: "الرئيسية",
          href: "/",
        },
        {
          label: "قائمة السيارات",
          href: "/bookings",
        },
        {
          isCurrentPage: true,
          label: "تفاصيل السيارة",
          href: "/bookings",
        },
      ]}
    />
  );
};

export default CarsDetailsBreadCrump;
