import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";

const MyBookingsBreadCrump = () => {
  return (
    <BreadcrumbNav
      className="mt-5 min-w-0"
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
          label: "الملف الشخصي",
          href: "/userProfile",
        },
        {
          isCurrentPage: true,
          label: "حجوزاتي",
          href: "/myBookings",
        },
      ]}
    />
  );
};

export default MyBookingsBreadCrump;
