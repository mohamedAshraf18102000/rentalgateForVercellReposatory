import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WrapperContainer from "../wrapperContainer/WrapperContainer";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import HomeUserCurrentLocation from "./TabsContent/HomeUserCurrentLocation";
import HomeAirportLocations from "./TabsContent/HomeAirportLocations";
import HomeTrainLocations from "./TabsContent/HomeTrainLocations";
import HomeBranchesLocations from "./TabsContent/HomeBranchesLocations";
import { useLocale, useTranslations } from "next-intl";

const HomePickupDialogTabs = ({
  customDefaultValue,
}: {
  customDefaultValue: string;
}) => {
  const { isCurrentLocationTabDisabled, activeTab, setActiveTab } =
    usePickupDialogStore();
  const t = useTranslations("home");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const tabValue = activeTab || customDefaultValue;

  return (
    <Tabs
      dir={dir}
      className="w-full bg-transparent"
      value={tabValue}
      defaultValue={customDefaultValue}
      onValueChange={(value) => {
        setActiveTab(value as "currentLocation" | "airport" | "trainStation" | "branches");
      }}
    >
      <WrapperContainer className="w-full">
        <TabsList className="flex items-start justify-center mx-auto text-sm md:text-base">
          <TabsTrigger
            value="currentLocation"
            disabled={isCurrentLocationTabDisabled}
            className={
              isCurrentLocationTabDisabled
                ? "text-xs md:text-sm cursor-not-allowed opacity-60"
                : "text-xs md:text-sm"
            }
          >
            {t("pickupDialog.tabs.currentLocation")}
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="airport">
            {t("pickupDialog.tabs.airport")}
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="trainStation">
            {t("pickupDialog.tabs.trainStation")}
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="branches">
            {t("pickupDialog.tabs.branches")}
          </TabsTrigger>
        </TabsList>

        <div className="relative min-h-[420px] max-h-[420px] rounded-2xl overflow-hidden border border-Grey100 shadow-sm mt-3 flex flex-col 3xl:max-h-[450px]!">
          <TabsContent
            className="w-full h-full min-h-0 mt-0! flex flex-col"
            value="currentLocation"
          >
            <HomeUserCurrentLocation />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col"
            value="airport"
          >
            <HomeAirportLocations />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col"
            value="trainStation"
          >
            <HomeTrainLocations />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col pt-2"
            value="branches"
          >
            <HomeBranchesLocations />
          </TabsContent>
        </div>
      </WrapperContainer>
    </Tabs>
  );
};

export default HomePickupDialogTabs;
