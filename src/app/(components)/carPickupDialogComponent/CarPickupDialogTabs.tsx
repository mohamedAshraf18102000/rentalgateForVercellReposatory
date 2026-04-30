import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WrapperContainer from "../wrapperContainer/WrapperContainer";
import UserCurrentLocation from "./TabsContent/UserCurrentLocation";
import AirportLocations from "./TabsContent/AirportLocations";
import TrainLocations from "./TabsContent/TrainLocations";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useLocale, useTranslations } from "next-intl";
import BranchesLocations from "./TabsContent/BranchesLocations";

const CarPickupDialogTabs = ({
  customDefaultValue,
}: {
  customDefaultValue: string;
}) => {
  const { activeTab, setActiveTab, isCurrentLocationTabDisabled } =
    usePickupDialogStore();
  const t = useTranslations("home");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <Tabs
      dir={dir}
      className="w-full h-full bg-transparent flex flex-col"
      value={activeTab}
      defaultValue={customDefaultValue}
      onValueChange={(value) => {
        setActiveTab(value as any);
      }}
    >
      <WrapperContainer className="w-full h-full flex flex-col">
        <TabsList className="flex items-start justify-center mx-auto text-sm md:text-base w-full">
          <TabsTrigger
            className={"text-xs md:text-sm"}
            value="currentLocation"
            disabled={isCurrentLocationTabDisabled}
          >
            {t("pickupDialog.tabs.currentLocation")}
          </TabsTrigger>

          <TabsTrigger className={"text-xs md:text-sm"} value="airport">
            {t("pickupDialog.tabs.airport")}
          </TabsTrigger>
          <TabsTrigger className={"text-xs md:text-sm "} value="trainStation">
            {t("pickupDialog.tabs.trainStation")}
          </TabsTrigger>
          <TabsTrigger
            className="text-xs md:text-sm"
            value="branches"
          >
            {t("pickupDialog.tabs.branches")}
          </TabsTrigger>
        </TabsList>

        <div className="relative h-[450px] rounded-2xl overflow-hidden border border-Grey100 shadow-sm mt-3 flex flex-col">
          <TabsContent
            className="w-full flex-1 min-h-0 mt-0! flex flex-col"
            value="currentLocation"
          >
            <UserCurrentLocation />
          </TabsContent>

          <TabsContent
            className="w-full flex-1 min-h-0 mt-0! flex flex-col"
            value="airport"
          >
            <AirportLocations />
          </TabsContent>

          <TabsContent
            className="w-full flex-1 min-h-0 mt-0! flex flex-col"
            value="trainStation"
          >
            <TrainLocations />
          </TabsContent>

          <TabsContent
            className="w-full flex-1 min-h-0 mt-0! flex flex-col"
            value="branches"
          >
            <BranchesLocations />
          </TabsContent>
        </div>
      </WrapperContainer>
    </Tabs>
  );
};

export default CarPickupDialogTabs;
