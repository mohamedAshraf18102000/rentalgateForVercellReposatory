import { Button, DialogWrapper, Input } from "@/app/(components)";
import ProfileActionCard from "../ProfileActionCard";
import {
  Building2,
  ChevronRight,
  LocateFixed,
  MapPin,
  MapPinPlusInside,
} from "lucide-react";
import { useEffect, useState } from "react";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";

interface UpdatePasswordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UpdateUserSavedLocationDialog = ({
  open,
  setOpen,
}: UpdatePasswordDialogProps) => {
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowAddForm(false);
    }
  }, [open]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      size="lg"
      forceDialog={true}
      closeOnOutsideClick={true}
      header={{
        mainTitle: (
          <div className="flex items-center justify-between w-full">
            {showAddForm && (
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-Grey100 rounded-full transition-all active:scale-95"
                aria-label="Back"
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>
            )}
            <span className="text-black  flex-1 text-center">
              {showAddForm ? "إضافة عنوان جديد" : "العناوين المسجلة"}
            </span>
            {showAddForm && <div className="w-8" />}
          </div>
        ),
      }}
      content={
        <div
          key={showAddForm ? "add-form" : "location-list"}
          className="animate-page-in"
        >
          {!showAddForm ? (
            <>
              <div className="w-full flex justify-end">
                <Button
                  className="bg-transparent border-2 border-Grey200 hover:bg-transparent text-black mb-3 text-sm!"
                  startIcon={<MapPinPlusInside className="w-5! h-5!" />}
                  onClick={() => setShowAddForm(true)}
                >
                  أضافة عنوان جديد
                </Button>
              </div>
              <div className="flex flex-col gap-3 mb-5">
                <ProfileActionCard
                  bg_gray
                  title="المنزل"
                  description="123 شارع فاطمة الزهراء حي الملز الرياض"
                />
                <ProfileActionCard
                  bg_gray
                  title="فرع العمل رقم 1"
                  description="123 شارع فاطمة الزهراء حي الملز الرياض"
                />
              </div>
            </>
          ) : (
            <div className="mb-5">
              <Input
                startIcon={<MapPin />}
                labelClassName="text-base!"
                className="text-sm! bg-Grey100!"
                placeholder="أدخل العنوان"
                label="العنوان:"
              />
              <div className="w-full my-5 h-[300px] rounded-xl overflow-hidden">
                <GoogleMapsLocation />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  startIcon={<Building2 />}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder="رقم المبني"
                  label="المبنى:"
                />
                <Input
                  startIcon={<LocateFixed />}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder="اسم الحي"
                  label="المنطقة: "
                />
              </div>
            </div>
          )}
        </div>
      }
      footer={
        <div className="flex w-full justify-end gap-2">
          {!showAddForm ? (
            <>
              <Button
                size="lg"
                className="w-fit text-black hover:bg-white underline py-3 border-none px-5 bg-white text-base"
                onClick={() => setOpen(false)}
              >
                إغلاق
              </Button>
              <Button
                size="lg"
                className="w-fit text-white  py-3 border-none px-10 text-base"
              >
                حفظ
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                className="w-fit text-black hover:bg-white underline py-3 border-none px-5 bg-white text-base"
                onClick={() => setShowAddForm(false)}
              >
                إلغاء
              </Button>
              <Button
                size="lg"
                className="w-fit text-white  py-3 border-none px-10 text-base"
              >
                إضافة
              </Button>
            </>
          )}
        </div>
      }
    />
  );
};

export default UpdateUserSavedLocationDialog;
