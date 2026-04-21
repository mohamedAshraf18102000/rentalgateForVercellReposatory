import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WrapperContainer from "../wrapperContainer/WrapperContainer";
import UserCurrentLocation from "./TabsContent/UserCurrentLocation";
import AirportLocations from "./TabsContent/AirportLocations";
import TrainLocations from "./TabsContent/TrainLocations";
import BranchesLocations from "./TabsContent/BranchesLocations";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";

const CarPickupDialogTabs = ({
  customDefaultValue,
}: {
  customDefaultValue: string;
}) => {
  const { target, setActiveTab } = usePickupDialogStore();

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
        <TabsList className="flex items-start justify-center mx-auto text-sm md:text-base">
          <TabsTrigger className="text-xs md:text-sm" value="currentLocation">
            موقعك الخاص
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="airport">
            مطار
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="trainStation">
            محطة قطار
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="branches">
            الفروع
          </TabsTrigger>
        </TabsList>

        <div className="relative min-h-[450px] max-h-[450px] rounded-2xl overflow-hidden border border-Grey100 shadow-sm mt-3">
          <TabsContent
            className="w-full h-full mt-0! flex"
            value="currentLocation"
          >
            <UserCurrentLocation />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col"
            value="airport"
          >
            <AirportLocations />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col"
            value="trainStation"
          >
            <TrainLocations />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col pt-2"
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
