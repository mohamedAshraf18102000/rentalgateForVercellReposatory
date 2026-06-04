import { Button } from "@/app/(components)/ui/button";
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import { ArrowLeft, ArrowRight, Car, UserStar } from "lucide-react";
import { useLocale } from "next-intl";
import RComponent from "./RComponent";
import { Textarea } from "@/app/(components)/ui/textarea";
import { Label } from "@/app/(components)/ui/label";
import TextAreaIcon from "@/constants/icons/profile/TextAreaIcon";
import ServiceRateIcon from "../../../../../../../public/extraSVGIcons/ServiceRateIcon";
import { Controller } from "react-hook-form";
import CompanyRateIcon from "../../../../../../../public/extraSVGIcons/CompanyRateIcon";
import { useRating } from "./RatingExtras/useRating";
interface RatingProps {
  onBack?: () => void;
  reservationId?: number | null;
  reservation_deliver_type?: string;
  reservation_receive_type?: string;
  driver_price?: number;
}
const Rating = ({
  onBack,
  reservationId,
  reservation_deliver_type,
  reservation_receive_type,
  driver_price,
}: RatingProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const { control, handleSubmit, onSubmit, isCreatingRating, visibility } =
    useRating({
      onBack,
      reservationId,
      reservation_deliver_type,
      reservation_receive_type,
      driver_price,
    });
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
      <form
        id="rating-form"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="companyRate"
          control={control}
          render={({ field }) => (
            <RComponent
              title="تقييمك للشركة"
              description="ساعدنا على معرفة مستوى الشركة لتحسين الخدمه المقدمة لك"
              value={field.value}
              onChange={field.onChange}
              icon={<CompanyRateIcon />}
            />
          )}
        />
        <Controller
          name="rate"
          control={control}
          render={({ field }) => (
            <RComponent
              title="تقييمك للسيارة"
              description="ساعدنا على معرفة مستوى السيارات لتحسين الخدمه المقدمة لك"
              value={field.value}
              onChange={field.onChange}
              icon={<Car className="w-8 h-8" />}
            />
          )}
        />
        {visibility.showDeliveryDriver && (
          <Controller
            name="deliveryDriverRate"
            control={control}
            render={({ field }) => (
              <Controller
                name="deliveryDriverComments"
                control={control}
                render={({ field: commentField }) => (
                  <RComponent
                    title=" تقييمك للسائق (تسليم)"
                    description="ساعدنا على معرفة مستوى السائق لتحسين الخدمه المقدمة لك"
                    value={field.value}
                    onChange={field.onChange}
                    icon={<UserStar className="w-8 h-8" />}
                    includeComment
                    commentValue={commentField.value}
                    onCommentChange={commentField.onChange}
                    commentDisabled={isCreatingRating}
                  />
                )}
              />
            )}
          />
        )}
        {visibility.showPickupDriver && (
          <Controller
            name="pickupDriverRate"
            control={control}
            render={({ field }) => (
              <Controller
                name="pickupDriverComments"
                control={control}
                render={({ field: commentField }) => (
                  <RComponent
                    title=" تقييمك للسائق (استلام)"
                    description="ساعدنا على معرفة مستوى السائق لتحسين الخدمه المقدمة لك"
                    value={field.value}
                    onChange={field.onChange}
                    icon={<UserStar className="w-8 h-8" />}
                    includeComment
                    commentValue={commentField.value}
                    onCommentChange={commentField.onChange}
                    commentDisabled={isCreatingRating}
                  />
                )}
              />
            )}
          />
        )}
        {visibility.showServiceDriver && (
          <Controller
            name="serviceDriverRate"
            control={control}
            render={({ field }) => (
              <Controller
                name="serviceDriverComments"
                control={control}
                render={({ field: commentField }) => (
                  <RComponent
                    title="تقييمك للخدمة"
                    description="ساعدنا على معرفة مستوى الخدمة لتحسين الخدمه المقدمة لك"
                    value={field.value}
                    onChange={field.onChange}
                    icon={<ServiceRateIcon />}
                    includeComment
                    commentValue={commentField.value}
                    onCommentChange={commentField.onChange}
                    commentDisabled={isCreatingRating}
                  />
                )}
              />
            )}
          />
        )}
        <Controller
          name="comments"
          control={control}
          render={({ field }) => (
            <>
              <Label className="text-base text-Grey700 font-bold! my-2">
                ملاحظات اخري:
              </Label>
              <Textarea
                startIcon={<TextAreaIcon />}
                name="message"
                value={field.value}
                onChange={field.onChange}
                placeholder="اكتب ملاحظاتك"
                disabled={isCreatingRating}
                className="min-h-28 text-base! bg-Grey100 border-2 pt-4"
              />
            </>
          )}
        />
      </form>
      <SheetFooter className="mt-auto flex-col gap-3 border-t p-6 sm:flex-row">
        <Button
          variant={"ghost"}
          type="button"
          className="text-base! w-full sm:w-1/2 bg-transparent text-black border-2 border-Grey400 hover:bg-transparent"
          onClick={onBack}
          disabled={isCreatingRating}
        >
          رجوع
        </Button>
        <Button
          type="submit"
          form="rating-form"
          className="text-base! w-full sm:w-1/2"
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
