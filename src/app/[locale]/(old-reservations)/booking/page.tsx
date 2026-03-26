import { getTranslations } from "next-intl/server";
import BookingContent from "./components/BookingContent";
import { BookingHeader } from "./components/booking-header";

const page = async ({ params }: { params: { locale: string } }) => {
  const { locale } = await params;
  const tCommon = await getTranslations("common");

  const breadcrumbItems = [
    {
      label: tCommon("home"),
      href: "/",
    },
    {
      label: tCommon("cars"),
      href: "/cars",
    },
    {
      label: tCommon("booking"),
      href: `/booking`,
      isCurrentPage: true,
    },
  ];

  return (
    <div>
      <BookingHeader
        locale={locale}
        imageSrc="/shared/bgHeader.png"
        imageAlt="booking"
        breadcrumbItems={breadcrumbItems}
      />
      <BookingContent />
    </div>
  );
};

export default page;
