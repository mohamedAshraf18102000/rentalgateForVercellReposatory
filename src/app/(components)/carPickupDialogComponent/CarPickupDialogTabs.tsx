import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WrapperContainer from "../wrapperContainer/WrapperContainer";
import SearchPickUpDialog from "./SearchPickUpDialog";
import UserCurrentLocation from "./TabsContent/UserCurrentLocation";
import AirportLocations from "./TabsContent/AirportLocations";
import TrainLocations from "./TabsContent/TrainLocations";
import BranchesLocations from "./TabsContent/BranchesLocations";

const CarPickupDialogTabs = ({
  customDefaultValue,
}: {
  customDefaultValue: string;
}) => {
  return (
    <Tabs
      dir="rtl"
      className="w-full bg-transparent"
      defaultValue={customDefaultValue}
    >
      <WrapperContainer className="w-full">
        <TabsList className="text-base! flex items-start justify-center mx-auto">
          <TabsTrigger value="currentLocation">موقعك الخاص</TabsTrigger>
          <TabsTrigger value="airport">مطار</TabsTrigger>
          <TabsTrigger value="trainStation">محطة قطار</TabsTrigger>
          <TabsTrigger value="branches">الفروع</TabsTrigger>
        </TabsList>

        <div className="relative h-[450px] my-2 rounded-2xl overflow-hidden border border-Grey100 shadow-sm">
          <div className="absolute top-4 left-4 right-4 z-10 pointer-events-auto">
            <SearchPickUpDialog />
          </div>

          <TabsContent
            className="w-full h-full mt-0! flex"
            value="currentLocation"
          >
            <UserCurrentLocation />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col pt-17"
            value="airport"
          >
            <AirportLocations />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col pt-17"
            value="trainStation"
          >
            <TrainLocations />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col pt-17"
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
