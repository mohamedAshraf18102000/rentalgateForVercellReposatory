import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const CarPickupDialogTabs = () => {
  return (
    <Tabs
      className="w-full bg-transparent flex items-center justify-center"
      defaultValue="Data1"
    >
      <TabsList className="text-base! w-[95%]">
        <TabsTrigger value="Data1">الفروع</TabsTrigger>
        <TabsTrigger value="Data2">محطة قطار</TabsTrigger>
        <TabsTrigger value="Data3">مطار</TabsTrigger>
        <TabsTrigger value="Data4">موقعك الخاص</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CarPickupDialogTabs;
