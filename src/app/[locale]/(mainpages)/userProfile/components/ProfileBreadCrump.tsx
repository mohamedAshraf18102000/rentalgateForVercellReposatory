import { BreadcrumbNav } from "@/app/(components)/template/BreadcrumbNav";

const ProfileBreadCrump = () => {
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
          label: "الملف الشخصي",
          href: "/userProfile",
        },
      ]}
    />
  );
};

export default ProfileBreadCrump;
