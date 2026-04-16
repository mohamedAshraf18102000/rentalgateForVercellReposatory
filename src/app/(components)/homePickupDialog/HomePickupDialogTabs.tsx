import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WrapperContainer from "../wrapperContainer/WrapperContainer";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import HomeUserCurrentLocation from "./TabsContent/HomeUserCurrentLocation";
import HomeAirportLocations from "./TabsContent/HomeAirportLocations";
import HomeTrainLocations from "./TabsContent/HomeTrainLocations";
import HomeBranchesLocations from "./TabsContent/HomeBranchesLocations";

const HomePickupDialogTabs = ({
  customDefaultValue,
}: {
  customDefaultValue: string;
}) => {
  const { setActiveTab } = usePickupDialogStore();

  return (
    <Tabs
      dir="rtl"
      className="w-full bg-transparent"
      defaultValue={customDefaultValue}
      onValueChange={(value) => {
        setActiveTab(value as any);
      }}
    >
      <WrapperContainer className="w-full">
        <TabsList className="text-base! flex items-start justify-center mx-auto">
          <TabsTrigger value="currentLocation">موقعك الخاصHome</TabsTrigger>
          <TabsTrigger value="airport">مطارHome</TabsTrigger>
          <TabsTrigger value="trainStation">محطة قطارHome</TabsTrigger>
          <TabsTrigger value="branches">الفروعHome</TabsTrigger>
        </TabsList>

        <div className="relative min-h-[450px] max-h-[450px] rounded-2xl overflow-auto border border-Grey100 shadow-sm mt-3">
          <TabsContent
            className="w-full h-full mt-0! flex"
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
