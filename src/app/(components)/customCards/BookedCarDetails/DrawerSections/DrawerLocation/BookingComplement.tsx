import { Button } from "@/app/(components)/ui/button";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(components)/ui/select";
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import { Textarea } from "@/app/(components)/ui/textarea";
import TextAreaIcon from "@/constants/icons/profile/TextAreaIcon";
import { useComplementReasons } from "@/hooks/api/booking/useComplementReasons";
import { useCreateComplaint } from "@/hooks/api/booking/useCreateComplaint";
import { useUploadImageMutation } from "@/services/uploadImages/uploadImage.service";
import { ImagePlus } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface BookingComplementProps {
  reservationId?: number | null;
  onSubmitted?: () => void;
  onBack?: () => void;
}

const BookingComplement = ({
  reservationId,
  onSubmitted,
  onBack,
}: BookingComplementProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const BackIcon = isRTL ? ChevronRight : ChevronLeft;
  const { data: complementReasons } = useComplementReasons();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadImageMutation();
  const { mutate: createComplaint, isPending: isCreatingComplaint } =
    useCreateComplaint();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null,
  );

  const handleUploadComplaintImage = async (file: File | null) => {
    if (!file) {
      setUploadedImageName(null);
      return;
    }

    try {
      const fileName = await uploadImage(file);
      setUploadedImageName(fileName);
    } catch (error) {
      setUploadedImageName(null);
      toast.error(error instanceof Error ? error.message : "فشل في رفع الصورة");
    }
  };

  const handleCreateComplaint = () => {
    if (!reservationId) {
      toast.error("لا يوجد رقم حجز صالح", {
        position: "top-center",
      });
      return;
    }

    if (!selectedReason) {
      toast.error("اختر نوع الشكوي", {
        position: "top-center",
      });
      return;
    }

    createComplaint(
      {
        reservationId,
        reasonId: Number(selectedReason),
        comments: notes.trim(),
        complaintAttachments: uploadedImageName ? [uploadedImageName] : [],
      },
      {
        onSuccess: () => {
          setSelectedReason("");
          setNotes("");
          setUploadedImageName(null);
          toast.success("تم ارسال الشكوي بنجاح", {
            position: "top-center",
          });
          onSubmitted?.();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "فشل في ارسال الشكوي",
          );
        },
      },
    );
  };

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col bg-background animate-in fade-in slide-in-from-right duration-300"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SheetHeader className="mt-10 flex flex-row items-center gap-2 space-y-0 px-6 text-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="ارسال شكوي"
        >
          <BackIcon className="h-5 w-5" />
        </Button>
        <SheetTitle className="text-start text-xl">
          <p>ارسال شكوي</p>
        </SheetTitle>
      </SheetHeader>
      <div className="flex flex-1 flex-col px-6 pt-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-foreground leading-none">
              نوع الشكوي:
            </label>
            <Select
              dir={isRTL ? "ltr" : "rtl"}
              value={selectedReason || undefined}
              onValueChange={setSelectedReason}
            >
              <SelectTrigger size="md" className="text-sm bg-Grey100 border-0">
                <SelectValue placeholder="اختر نوع الشكوي" />
              </SelectTrigger>
              <SelectContent
                className="z-100001 cursor-pointer [&>div]:max-h-[200px] [&>div]:overflow-y-scroll relative"
                position="popper"
                sideOffset={4}
              >
                {complementReasons?.map((reason) => (
                  <SelectItem
                    dir={isRTL ? "rtl" : "ltr"}
                    className="cursor-pointer"
                    key={reason.complaintId}
                    value={reason.complaintId.toString()}
                  >
                    {reason.arabicReason}
                  </SelectItem>
                ))}
                <div className="sticky bottom-0 z-10 bg-Grey100/60 rounded-b-md p-1 h-3 text-center" />
              </SelectContent>
            </Select>
          </div>

          <Textarea
            label="الرسالة:"
            labelClassName="text-base leading-none font-medium"
            className="text-sm! min-h-[168px] bg-Grey100 border-0 pt-4"
            placeholder="اكتب ملاحظاتك في الشكوي، وسيتواصل معك فريقنا في اقرب وقت."
            startIcon={<TextAreaIcon />}
            rows={7}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <InputFileUpload
            accept="image/*"
            size="md"
            wrapperClassName="bg-Grey100 border-gray-200 h-[176px]"
            uploadIcon={
              <ImagePlus className="size-8 text-black stroke-[1.8]" />
            }
            uploadText="أضغط أو قم بالسحب لاضافة
صورة للشكوى"
            disabled={isUploadingImage}
            onFileChange={handleUploadComplaintImage}
          />
          {uploadedImageName && (
            <p className="text-xs text-Grey700">
              تم رفع الصورة: {uploadedImageName}
            </p>
          )}
        </div>
        <SheetFooter className="p-6 border-t mt-auto gap-3 flex-col sm:flex-row">
          <Button
            type="button"
            className="text-base! w-full sm:w-1/2 bg-transparent text-black border-2 border-Grey400 hover:bg-transparent"
            onClick={onBack}
          >
            رجوع
          </Button>
          <Button
            type="button"
            className="text-base! w-full sm:w-1/2 bg-transparent text-black border-2 border-Grey400 hover:bg-transparent"
            onClick={handleCreateComplaint}
            loading={isCreatingComplaint || isUploadingImage}
            disabled={
              !reservationId ||
              !selectedReason ||
              isCreatingComplaint ||
              isUploadingImage
            }
          >
            ارسال شكوي
          </Button>
        </SheetFooter>
      </div>
    </div>
  );
};

export default BookingComplement;
