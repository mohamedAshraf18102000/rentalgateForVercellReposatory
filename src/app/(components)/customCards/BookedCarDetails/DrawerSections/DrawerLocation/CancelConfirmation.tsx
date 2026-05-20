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
import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCancelUserReservation } from "@/hooks/api/booking/useCancelUserReservation";
import { UseGetCancelReasons } from "@/hooks/api/booking/UseGetCancelReasons";
import type { FormEvent } from "react";
import { Checkbox } from "@/app/(components)/ui/checkbox";
import { Link } from "@/i18n/routing";
import { CheckedState } from "@radix-ui/react-checkbox";

interface CancelConfirmationProps {
  setShowCancelBooking: (show: boolean) => void;
  reservationId?: number | null;
}

const CancelConfirmation = ({
  setShowCancelBooking,
  reservationId,
}: CancelConfirmationProps) => {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const [cancelReason, setCancelReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { mutate: cancelUserReservation, isPending } =
    useCancelUserReservation();
  const { data: cancelReasons } = UseGetCancelReasons();

  const handleTermsCheckChange = (checked: CheckedState) => {
    setIsTermsAccepted(checked === true);
  };

  const handleCancelBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (reservationId) {
      cancelUserReservation(
        {
          reservationID: reservationId,
          reasonId: Number(cancelReason),
          notes: notes.trim(),
        },
        {
          onSuccess: () => {
            setShowCancelBooking(false);
            router.push("/myBookings");
          },
        },
      );
    }
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
          onClick={() => setShowCancelBooking(false)}
          aria-label={t("backToBookingDetails")}
        >
          <BackIcon className="h-5 w-5" />
        </Button>
        <SheetTitle className="text-start text-xl">
          {t("cancelBooking")}
        </SheetTitle>
      </SheetHeader>
      <form className="flex flex-1 flex-col" onSubmit={handleCancelBooking}>
        <div className="flex flex-1 flex-col px-6 pt-6">
          <Separator className="my-1!" />
          <div className="text-foreground text-lg font-medium mt-3">
            <p className="font-bold text-[18px]">
              {t("myBookingsDrawer.cancelConfirmation.title")}
            </p>
            <span className="text-Grey700 mt-2 text-sm">
              {t("myBookingsDrawer.cancelConfirmation.description")}
            </span>
          </div>

          <div className="p-2 mt-3">
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-foreground">
                  {t("cancelBookingReasonLabel")}
                </label>
                <Select
                  dir={isRTL ? "ltr" : "rtl"}
                  value={cancelReason || undefined}
                  onValueChange={setCancelReason}
                >
                  <SelectTrigger size="md" className="text-sm bg-Grey100">
                    <SelectValue placeholder={t("selectCancelBookingReason")} />
                  </SelectTrigger>
                  <SelectContent
                    className="z-100001 cursor-pointer [&>div]:max-h-[200px] [&>div]:overflow-y-scroll relative"
                    position="popper"
                    sideOffset={4}
                  >
                    {cancelReasons?.content.map((reason) => (
                      <SelectItem
                        dir={isRTL ? "rtl" : "ltr"}
                        className="cursor-pointer"
                        key={reason.reasonId}
                        value={reason.reasonId.toString()}
                      >
                        {reason.reason}
                      </SelectItem>
                    ))}
                    <div className="sticky bottom-0 z-10 bg-Grey100/60 rounded-b-md p-1 h-3 text-center" />
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                label={t("myBookingsDrawer.cancelConfirmation.notesLabel")}
                labelClassName="text-base!"
                className="text-sm!"
                placeholder={t(
                  "myBookingsDrawer.cancelConfirmation.notesPlaceholder",
                )}
                startIcon={<TextAreaIcon />}
                rows={10}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />

              <div className="flex flex-wrap items-center gap-2">
                <Checkbox
                  width={20}
                  height={20}
                  checked={isTermsAccepted}
                  onCheckedChange={handleTermsCheckChange}
                />
                <label className="text-sm font-bold sm:text-sm">
                  <Link
                    target="_blank"
                    href="/terms&conditions#terms-and-conditions"
                    className="underline"
                  >
                    {t("myBookingsDrawer.cancelConfirmation.termsLinkText")}
                  </Link>
                </label>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-auto gap-3 border-t p-6 flex-col sm:flex-row">
          <Button
            variant="destructive"
            type="button"
            className="text-base! w-full sm:w-1/2 bg-transparent text-black font-bold! border-2 border-Grey400 hover:bg-transparent"
          >
            {t("myBookings")}
          </Button>
          <Button
            type="submit"
            variant="destructive"
            className="text-base! w-full sm:w-1/2 border-2 bg-StatusRed text-white hover:bg-StatusRed/95"
            disabled={
              !reservationId || !cancelReason || !isTermsAccepted || isPending
            }
          >
            {t("confirmCancelBookingWithId", {
              reservationId: reservationId ?? "",
            })}
          </Button>
        </SheetFooter>
      </form>
    </div>
  );
};

export default CancelConfirmation;
