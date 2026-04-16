import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import PickUpCardsSection from "./PickupCardSection";
import { HomePickUpDialog } from "../../(dialogs)/PickupDialog/HomePickUpDialog";

const PickUpArea = () => {
  return (
    <>
      <WrapperContainer className="my-14">
        <div className="w-full flex flex-col items-center justify-center mb-8">
          <h2 className="font-bold text-3xl">مكان الأستلام</h2>
          <p className="text-Grey700 text-base font-normal">
            أينما تكن, سياراتك ستكون في إنتظارك
          </p>
        </div>
        <PickUpCardsSection />
        <HomePickUpDialog />
      </WrapperContainer>
    </>
  );
};

export default PickUpArea;
