import { useState } from "react";
import { Button } from "@/app/(components)/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(components)/ui/select";
import { Separator } from "@/app/(components)/ui/separator";
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import { Textarea } from "@/app/(components)/ui/textarea";
import TextAreaIcon from "@/constants/icons/profile/TextAreaIcon";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/app/(components)/ui/checkbox";
import Link from "next/link";
import { useCancelUserReservation } from "@/hooks/api/booking/useCancelUserReservation";

const CANCEL_BOOKING_REASON_KEYS = [
  "noLongerNeedsRide",
  "wrongDateTimeOrService",
  "cheaperOrFasterOption",
  "delayCommunicationOrMismatch",
  "unexpectedSituation",
] as const;

interface CancelConfirmationProps {
  setShowCancelBooking: (show: boolean) => void;
  reservationId?: number | null;
}

const CancelConfirmation = ({
  setShowCancelBooking,
  reservationId,
}: CancelConfirmationProps) => {
  const t = useTranslations("common");
  const [cancelReason, setCancelReason] = useState<string>("");
  const { mutate: cancelUserReservation } = useCancelUserReservation();

  const handleCancelBooking = () => {
    if (reservationId) {
      cancelUserReservation(reservationId, {
        onSuccess: () => {
          setShowCancelBooking(false);
        },
      });
    }
  };

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col bg-background animate-in fade-in slide-in-from-right duration-300"
      dir="rtl"
    >
      <SheetHeader className="mt-10 flex flex-row items-center gap-2 space-y-0 px-6 text-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setShowCancelBooking(false)}
          aria-label={t("backToBookingDetails")}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <SheetTitle className="text-start text-xl">
          {t("cancelBooking")}
        </SheetTitle>
      </SheetHeader>
      <div className="flex flex-1 flex-col px-6 pt-6">
        <Separator className="my-1!" />
        <div className="text-foreground text-lg font-medium mt-3">
          <p className="font-bold text-[18px]">
            هل انت متأكد من انك تريد الغاء الحجز؟
          </p>
          <span className="text-Grey700 mt-2">
            هل تريد فعلاً الغاء الحجز؟ لا يمكن التراجع عن هذه العملية.
          </span>
        </div>

        <div className="p-2 mt-3">
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-foreground">
                {t("cancelBookingReasonLabel")}
              </label>
              <Select
                value={cancelReason || undefined}
                onValueChange={setCancelReason}
              >
                <SelectTrigger size="md" className="text-sm bg-Grey100">
                  <SelectValue placeholder={t("selectCancelBookingReason")} />
                </SelectTrigger>
                <SelectContent
                  className="z-[100001] cursor-pointer"
                  position="popper"
                  sideOffset={4}
                >
                  {CANCEL_BOOKING_REASON_KEYS.map((key) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={key}
                      value={key}
                    >
                      {t(`cancelBookingReasonOptions.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Textarea
              label="ملاحظات:"
              labelClassName="text-base!"
              className="text-sm!"
              placeholder="شاركنا معلوماتك، وسيتواصل معك فريقنا في أقرب وقت."
              startIcon={<TextAreaIcon />}
              rows={10}
            />

            <div className="flex flex-wrap items-center gap-2">
              <Checkbox
                width={20}
                height={20}
                checked={false}
                onCheckedChange={() => {}}
              />
              <label className="text-sm font-bold sm:text-sm">
                <Link
                  target="_blank"
                  href="/terms-and-conditions"
                  className="underline"
                >
                  الموافقة علي الشروط و الأحكام
                </Link>
              </label>
            </div>
          </div>
        </div>
      </div>

      <SheetFooter className="p-6 border-t mt-auto ">
        <Button className="text-base! w-1/2 bg-transparent text-black border-2 border-Grey400 hover:bg-transparent">
          عرض حجوزاتي
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="text-base! w-1/2 border-2 bg-StatusRed text-white hover:bg-StatusRed/95"
          onClick={handleCancelBooking}
        >
          {t("confirmCancelBookingWithId")}
        </Button>
      </SheetFooter>
    </div>
  );
};

export default CancelConfirmation;
