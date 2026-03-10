import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";

const ReservationBreadCrump = () => {
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
          label: "تفاصيل السيارة",
          href: "/carDetails",
        },
        {
          isCurrentPage: true,
          label: "حجز سيارة",
          href: "/reservation",
        },
      ]}
    />
  );
};

export default ReservationBreadCrump;
