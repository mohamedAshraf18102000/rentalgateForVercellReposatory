import { Button, DialogWrapper } from "@/app/(components)";
import { DatePicker } from "@/app/(components)/ui/datePicker";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";

interface UpdatePasswordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UpdateLicenceDialog = ({ open, setOpen }: UpdatePasswordDialogProps) => {
  return (
    <DialogWrapper
      className="overflow-hidden!"
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
              بيانات الرخصة
            </span>
          </div>
        ),
      }}
      content={
        <div className="flex flex-col gap-3 mb-5">
          <InputFileUpload
            className="text-base!"
            label="صورة الرخصة:"
            labelClassName="text-base!"
          />
          <DatePicker label="تاريخ إنتهاء الرخصة:" />
        </div>
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

export default UpdateLicenceDialog;
