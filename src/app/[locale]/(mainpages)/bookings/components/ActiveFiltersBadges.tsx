import CustomBadge from "@/app/(components)/ui/customBadge";
import { Separator } from "@/app/(components)/ui/separator";

const ActiveFiltersBadges = ({ filters, setFilter }: any) => {
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
  ].filter((b) => b.title);

  if (!badges.length) return null;

  return (
    <>
      <Separator className="my-5" />
      <div className="flex gap-3">
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
