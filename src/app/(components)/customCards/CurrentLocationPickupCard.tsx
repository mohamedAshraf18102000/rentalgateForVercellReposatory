import Image from "next/image";
import { Button, Input } from "@/app/(components)";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

const CurrentLocationPickupCard = ({
  image,
  title,
  description,
  onClick,
  onShowResultsClick,
}: {
  image: string;
  title: string;
  description: string;
  onClick: () => void;
  onShowResultsClick: () => void;
}) => {
  const t = useTranslations("home");
  const filterPickupName = useUserPreferedFiltersStore(
    (s) => s.filters.pickupName,
  );

  return (
    <div className="w-full px-4 md:px-0">
      <div className="bg-white w-full max-w-5xl mt-6 md:mt-10 mx-auto rounded-[18px] grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-xl border-2 border-white min-h-[350px]">
        <div className="relative h-48 md:h-full min-h-[250px]">
          <Image src={image} alt="bgApp2" fill className="object-cover" />
        </div>
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full">
            <h3 className="font-bold text-xl md:text-2xl text-center md:text-start">
              {title}
            </h3>
            <p className="text-Grey700 text-sm md:text-base font-normal mt-3 md:mt-4 text-center md:text-start">
              {description}
            </p>

            <div className="mt-6 md:mt-8">
              <label className="text-sm md:text-base font-normal text-primary block text-start mb-2">
                {t("pickupCards.currentLocation.formLabel")}
              </label>
              <Input
                className="text-sm! md:text-base! rounded-xl cursor-pointer"
                type="search"
                placeholder={t("pickupCards.currentLocation.placeholder")}
                startIcon={
                  <MapPin className="w-5! h-5! md:w-6! md:h-6! text-primary" />
                }
                readOnly
                value={filterPickupName}
                onClick={onClick}
              />

              <div className="flex justify-center md:justify-end">
                <Button
                  onClick={onShowResultsClick}
                  className="text-sm md:text-base font-normal mt-5 md:mt-6 w-full md:w-auto"
                >
                  {t("pickupDialog.showResults")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentLocationPickupCard;
