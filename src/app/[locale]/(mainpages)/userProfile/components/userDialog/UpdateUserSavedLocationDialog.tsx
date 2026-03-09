import { Button, DialogWrapper } from "@/app/(components)";
import ProfileActionCard from "../ProfileActionCard";
import { LocationEdit, MapPinPlusInside } from "lucide-react";

interface UpdatePasswordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UpdateUserSavedLocationDialog = ({
  open,
  setOpen,
}: UpdatePasswordDialogProps) => {
  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      size="md"
      forceDialog={true}
      contentClassName=""
      closeOnOutsideClick={true}
      header={{
        mainTitle: (
          <div className="flex items-center justify-between w-full">
            <span className="text-black  flex-1 text-center">
              العناوين المسجلة
            </span>
          </div>
        ),
      }}
      content={
        <>
          <div className="w-full flex justify-end">
            <Button
              className="bg-transparent border-2 border-Grey200 hover:bg-transparent text-black my-3 text-sm!"
              startIcon={<MapPinPlusInside size={30} />}
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
      }
      footer={
        <div className="flex w-full justify-end gap-2">
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
        </div>
      }
    />
  );
};

export default UpdateUserSavedLocationDialog;
