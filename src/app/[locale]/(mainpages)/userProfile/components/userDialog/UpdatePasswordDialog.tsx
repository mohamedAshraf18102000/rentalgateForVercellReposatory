import { Button, DialogWrapper, Input } from "@/app/(components)";

interface UpdatePasswordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UpdatePasswordDialog = ({ open, setOpen }: UpdatePasswordDialogProps) => {
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
              تغيير كلمة المرور
            </span>
          </div>
        ),
      }}
      content={
        <div className="flex flex-col gap-3 mb-5">
          <Input
            className="text-base!"
            placeholder="أدخل كلمة المرور الحالية"
            label="كلمة المرور الحالية:"
            type="password"
            labelClassName="text-base!"
          />

          <Input
            className="text-base!"
            placeholder="أدخل كلمة المرور الجديدة"
            label="كلمة المرور الجديدة:"
            type="password"
            labelClassName="text-base!"
          />

          <Input
            className="text-base!"
            placeholder="أدخل كلمة المرور الجديدة"
            label="تأكيد كلمة المرور الجديدة:"
            type="password"
            labelClassName="text-base!"
          />
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

export default UpdatePasswordDialog;
