import { Button } from "@/app/(components)/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/(components)/ui/sheet";
import { Funnel } from "lucide-react";
import DrawerAccordion from "./DrawerAccordion/DrawerAccordion";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

const FilterDrawer = () => {
  const { resetFilters, filters, applyFilters } = useUserPreferedFiltersStore();

  const activeFiltersCount = [
    !!filters.rentPeriod,
    !!filters.carCategory,
    filters.priceMin !== "",
    filters.priceTo !== "",
    filters.categoryId !== "",
    filters.pickupId !== "" && filters.pickupId !== "current-location",
  ].filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger dir="rtl" asChild>
        <button
          type="button"
          className="flex min-h-10 shrink-0 touch-manipulation items-center gap-1.5 rounded-xl border-2 border-Grey400 p-2 text-sm font-bold sm:min-h-11 sm:gap-2 sm:p-2 sm:text-base"
        >
          <div className="relative flex items-center justify-center gap-1.5 px-1.5 sm:gap-2 sm:px-2 w-full">
            <Funnel className="size-4 shrink-0 sm:size-4.5" aria-hidden />
            <span>تصفية </span>
            {activeFiltersCount > 0 && (
              <div className="absolute -top-1 -end-1 flex size-5 items-center justify-center rounded-full bg-StatusRedBG/90 text-[11px] font-bold text-white sm:text-[12px]">
                {activeFiltersCount}
              </div>
            )}
          </div>
        </button>
      </SheetTrigger>
      <SheetContent
        dir="rtl"
        className="flex h-dvh max-h-dvh w-full max-w-full flex-col gap-0 p-0 sm:max-w-md md:max-w-lg"
      >
        <SheetHeader className="mt-8 px-4 text-start! sm:mt-10 sm:px-6">
          <SheetTitle className="text-base sm:text-lg">تصفية حسب</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-2 sm:px-4 sm:pb-3">
          <div className="w-full p-1 sm:p-2">
            <DrawerAccordion />
          </div>
        </div>
        <SheetFooter className="mt-auto grid w-full max-w-none grid-cols-1 gap-2 border-t-2 p-3 shadow-[0px_-13px_15px_0px_#01250514] sm:grid-cols-2 sm:gap-3 sm:p-5">
          <Button
            className="w-full min-h-11 text-sm! sm:text-base!"
            variant="outline"
            onClick={resetFilters}
          >
            إعادة للأفتراضي
          </Button>

          <SheetClose asChild>
            <Button
              className="w-full min-h-11 text-sm! sm:text-base!"
              type="submit"
              onClick={applyFilters}
            >
              تطبيق
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
