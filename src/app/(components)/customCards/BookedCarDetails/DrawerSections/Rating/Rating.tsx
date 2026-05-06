import { Button } from "@/app/(components)/ui/button";
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import { ArrowLeft, ArrowRight, Car, UserStar } from "lucide-react";
import { useState } from "react";
import { useLocale } from "next-intl";
import RComponent from "./RComponent";
import { Textarea } from "@/app/(components)/ui/textarea";
import { Label } from "@/app/(components)/ui/label";
import TextAreaIcon from "@/constants/icons/profile/TextAreaIcon";
import { useCreateRating } from "@/hooks/api/booking/useCreateRating";
import { toast } from "sonner";

interface RatingProps {
  onBack?: () => void;
  reservationId?: number | null;
}

const Rating = ({ onBack, reservationId }: RatingProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const [driverRating, setDriverRating] = useState(5);
  const [carRating, setCarRating] = useState(5);
  const [comments, setComments] = useState("");
  const { mutate: createRating, isPending: isCreatingRating } =
    useCreateRating();

  const handleSubmitRating = () => {
    if (!reservationId) {
      toast.error("لا يوجد رقم حجز صالح", {
        position: "top-center",
      });
      return;
    }

    createRating(
      {
        reservationId,
        rate: carRating,
        companyRate: driverRating,
        comments: comments.trim(),
      },
      {
        onSuccess: () => {
          toast.success("تم ارسال التقييم بنجاح", {
            position: "top-center",
          });
          onBack?.();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "فشل في ارسال التقييم",
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
          onClick={onBack}
          aria-label="العودة لتفاصيل الحجز"
        >
          <BackIcon className="h-5 w-5" />
        </Button>
        <SheetTitle className="text-start text-xl">أضافة تقييم</SheetTitle>
      </SheetHeader>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-6">
        <RComponent
          title="تقييمك للشركة"
          description="ساعدنا على معرفة مستوى الشركة لتحسين الخدمه المقدمة لك"
          rating={driverRating}
          onRating={setDriverRating}
          icon={<UserStar className="w-8 h-8" />}
        />

        <RComponent
          title="تقييمك للسيارة"
          description="ساعدنا على معرفة مستوى السيارات لتحسين الخدمه المقدمة لك"
          rating={carRating}
          onRating={setCarRating}
          icon={<Car className="w-8 h-8" />}
        />

        <Label className="text-base text-Grey700 font-bold! my-2">
          ملاحظات:
        </Label>
        <Textarea
          startIcon={<TextAreaIcon />}
          name="message"
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          placeholder="اكتب تقييمك للسيارة"
          required
          disabled={isCreatingRating}
          className="min-h-28 text-base! bg-Grey100 border-2 pt-4"
        />
      </div>

      <SheetFooter className="mt-auto flex-col gap-3 border-t p-6 sm:flex-row">
        <Button
          type="button"
          className="text-base! w-full sm:w-1/2 bg-transparent text-black border-2 border-Grey400 hover:bg-transparent"
          onClick={onBack}
          disabled={isCreatingRating}
        >
          رجوع
        </Button>
        <Button
          type="button"
          className="text-base! w-full sm:w-1/2"
          onClick={handleSubmitRating}
          loading={isCreatingRating}
          disabled={!reservationId || isCreatingRating}
        >
          ارسال التقييم
        </Button>
      </SheetFooter>
    </div>
  );
};

export default Rating;
