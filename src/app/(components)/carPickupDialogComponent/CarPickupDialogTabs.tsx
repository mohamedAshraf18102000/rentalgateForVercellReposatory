import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WrapperContainer from "../wrapperContainer/WrapperContainer";
import SearchPickUpDialog from "./SearchPickUpDialog";

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

        <div className="relative bg-red-100 h-[500px] my-2 rounded-2xl p-2">
          <SearchPickUpDialog />

          <TabsContent className="w-full flex" value="currentLocation">
            <p>موقعك الخاص</p>
            <div className="absolute px-2 bottom-8 left-1/2 -translate-x-1/2 bg-red-950 w-[95%] text-white rounded-lg">
              Mohamed
            </div>
          </TabsContent>

          <TabsContent className="w-full bg-amber-100" value="airport">
            <p>المطار</p>
          </TabsContent>

          <TabsContent className="w-full bg-amber-100" value="trainStation">
            <p>محطة القطار</p>
          </TabsContent>

          <TabsContent className="w-full bg-amber-100" value="branches">
            <p>الفروع</p>
          </TabsContent>
        </div>
      </WrapperContainer>
    </Tabs>
  );
};

export default CarPickupDialogTabs;
