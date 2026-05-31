import { Button } from "@/app/(components)/ui/button";
import { Separator } from "@/app/(components)/ui/separator";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const RatingContainer = ({
  setActiveView,
}: {
  setActiveView: (view: string) => void;
}) => {
  const t = useTranslations("common.myBookingsDrawer.rating");

  return (
    <div className="bg-[#F2F2F2] p-2 my-2 text-center flex flex-col gap-2 items-center rounded-xl">
      <Image src="/ratingIcon.webp" alt={t("iconAlt")} width={50} height={50} />
      <p className="text-base font-bold">{t("containerTitle")}</p>
      <p className="text-sm text-Grey700">{t("containerDescription")}</p>
      <Separator className="my-3" />
      <Button
        variant="outline"
        className="bg-white text-base flex gap-2 border-2!"
        onClick={() => setActiveView("rating")}
      >
        <Star className="w-4! h-4!" />
        <span className="px-2">{t("addRatingButton")}</span>
      </Button>
    </div>
  );
};

export default RatingContainer;
