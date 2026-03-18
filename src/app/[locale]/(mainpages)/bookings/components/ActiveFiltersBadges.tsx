import CustomBadge from "@/app/(components)/ui/customBadge";
import { Separator } from "@/app/(components)/ui/separator";

const ActiveFiltersBadges = ({
  filters,
  setFilter,
  fromDate,
  toDate,
  rentalDays,
  clearFromDate,
  clearToDate,
}: any) => {
  const formatShortDate = (date: Date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const badges = [
    {
      key: "priceMin",
      title: filters.priceMin ? `من: ${filters.priceMin}` : "",
      onClose: () => setFilter("priceMin", ""),
    },
    {
      key: "priceTo",
      title: filters.priceTo ? `إلى: ${filters.priceTo}` : "",
      onClose: () => setFilter("priceTo", ""),
    },
    {
      key: "brandName",
      title: filters.brandName,
      onClose: () => {
        setFilter("brandId", "");
        setFilter("brandName", "");
      },
    },
    {
      key: "rentalDuration",
      title:
        fromDate && toDate
          ? `المدة: ${formatShortDate(fromDate)} - ${formatShortDate(toDate)} (${rentalDays} يوم)`
          : fromDate
            ? `من: ${formatShortDate(fromDate)}`
            : toDate
              ? `إلى: ${formatShortDate(toDate)}`
              : "",
      onClose: () => {
        clearFromDate?.();
        clearToDate?.();
      },
    },
  ].filter((b) => b.title);

  if (!badges.length) return null;

  return (
    <>
      <div className="flex gap-3 mt-3">
        {badges.map((badge) => (
          <CustomBadge
            key={badge.key}
            title={badge.title}
            onClose={badge.onClose}
          />
        ))}
      </div>
    </>
  );
};

export default ActiveFiltersBadges;
