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

const FilterDrawer = () => {
  return (
    <Sheet>
      <SheetTrigger dir="rtl" asChild>
        <button
          type="button"
          className="border-2 border-Grey400 rounded-xl p-1.5 text-base font-bold flex items-center gap-2"
        >
          <Funnel />
          <span>تصفية </span>
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
          <Button className="w-full text-base!" variant="outline">
            إعادة للأفتراضي
          </Button>

          <Button className="w-full text-base!" type="submit">
            تطبيق
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
