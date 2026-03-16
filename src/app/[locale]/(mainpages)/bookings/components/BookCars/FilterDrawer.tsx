import { Button } from "@/app/(components)/ui/button";
import { Input } from "@/app/(components)/ui/input";
import { Label } from "@/app/(components)/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/(components)/ui/sheet";
import { Funnel } from "lucide-react";
import DrawerAccordion from "./DrawerAccordion/DrawerAccordion";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

const FilterDrawer = () => {
  const { resetFilters, filters } = useUserPreferedFiltersStore();

  const activeFiltersCount = [
    !!filters.rentPeriod,
    !!filters.carCategory,
    filters.priceMin !== "",
    filters.priceTo !== "",
    filters.categoryId !== "",
    filters.pickupId !== "",
  ].filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger dir="rtl" asChild>
        <button
          type="button"
          className="border-2 border-Grey400 rounded-xl p-1.5 text-base font-bold flex items-center gap-2"
        >
          <div className="flex items-center gap-2 relative px-2">
            <Funnel />
            <span>تصفية </span>
            {activeFiltersCount > 0 && (
              <div className="absolute -top-1 -right-1 text-[12px] w-5 h-5 flex items-center justify-center text-white font-bold rounded-full bg-StatusRedBG/90">
                {activeFiltersCount}
              </div>
            )}
          </div>
        </button>
        
      </SheetTrigger>
      <SheetContent dir="rtl" className="flex flex-col p-0">
        <SheetHeader className="text-start! mt-10 px-6 ">
          <SheetTitle>تصفية حسب</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <div className="w-full p-2">
            <DrawerAccordion />
          </div>
        </div>
        <SheetFooter className="justify-start! mt-auto grid grid-cols-2 gap-3 border-t-2 p-5 shadow-[0px_-13px_15px_0px_#01250514]">
          <Button
            className="w-full text-base!"
            variant="outline"
            onClick={resetFilters}
          >
            إعادة للأفتراضي
          </Button>

          <SheetClose asChild>
            <Button className="w-full text-base!" type="submit">
              تطبيق
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
