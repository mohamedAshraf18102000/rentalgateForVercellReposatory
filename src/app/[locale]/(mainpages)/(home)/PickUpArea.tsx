import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import PickUpCardsSection from "./PickupCardSection";
import { HomePickUpDialog } from "../../(dialogs)/PickupDialog/HomePickUpDialog";
import { useTranslations } from "next-intl";

const PickUpArea = () => {
  const t = useTranslations("home");

  return (
    <>
      <WrapperContainer className="my-14">
        <div className="w-full flex flex-col items-center justify-center mb-8">
          <h2 className="font-bold text-3xl">{t("pickupArea.title")}</h2>
          <p className="text-Grey700 text-base font-normal">
            {t("pickupArea.description")}
          </p>
        </div>
        <PickUpCardsSection />
        <HomePickUpDialog />
      </WrapperContainer>
    </>
  );
};

export default PickUpArea;
