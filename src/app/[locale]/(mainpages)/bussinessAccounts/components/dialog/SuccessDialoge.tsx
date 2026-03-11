import { Button, DialogWrapper } from "@/app/(components)";
import Image from "next/image";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessDialoge = ({ open, onOpenChange }: SuccessDialogProps) => {
  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      header={{
        mainTitle: "رسالة تأكيد",
      }}
      content={
        <div className="text-center flex flex-col items-center justify-center">
          <div className="relative w-[80px] h-[80px] bg-Grey100 rounded-full">
            <Image
              src="/bussinesAccounts/dialogeSuccessImage.png"
              alt=""
              fill
            />
          </div>
          <div className="mt-5">
            <p className="text-base! font-bold">تم إستلام طلبك بنجاح</p>
            <p className="text-sm text-Grey700 my-2">
              سيتواصل معك فريقنا في أقرب وقت.
            </p>
          </div>
        </div>
      }
      footer={
        <Button
          type="button"
          onClick={() => onOpenChange(false)}
          className="mt-4 text-base! w-fit px-10 font-normal"
          size="lg"
        >
          أكمل مشاهدتك
        </Button>
      }
    />
  );
};

export default SuccessDialoge;
