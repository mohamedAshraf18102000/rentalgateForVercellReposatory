import GoogleMapsLocation from "../mapsLocation/GoogleMapsLocation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WrapperContainer from "../wrapperContainer/WrapperContainer";
import SearchPickUpDialog from "./SearchPickUpDialog";
import { ChevronLeft } from 'lucide-react';


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

          <TabsContent className="w-full h-full mt-0! flex" value="currentLocation">
            {/* CONTENT */}
            <div className="w-full h-full">
              <GoogleMapsLocation />
            </div>

            <div className="absolute px-4 py-3 bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-primary shadow-2xl border border-Grey100 w-[94%] rounded-2xl z-20">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-bold text-base">العناوين المسجلة</h5>
                <button className="font-bold text-sm border-2 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-Grey200 transition-colors">
                  عرض الكل <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white border border-Grey100 p-3 rounded-xl hover:border-primary/30 transition-all cursor-pointer shadow-sm group">
                    <p className="font-bold text-xs mb-1 group-hover:text-primary">فرع العمل رقم {index + 1}</p>
                    <p className="line-clamp-1 text-Grey600 text-[10px] leading-tight">{index + 1} شارع فاطمة الزهراء حي...</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </WrapperContainer>
    </Tabs>
  );
};

export default CarPickupDialogTabs;
