"use client";

import { Button } from "@/app/(components)/ui/button";
import { SheetHeader, SheetTitle } from "@/app/(components)/ui/sheet";
import { Textarea } from "@/app/(components)/ui/textarea";
import { useRequestMaintenance } from "@/hooks/api/booking/useRequestMaintenance";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WarningMessage from "@/app/(components)/WarningMessage";
import { toast } from "sonner";

const maintenanceRequestSchema = z.object({
  requestComment: z
    .string()
    .min(5, { message: "يجب أن تكون الطلب 5 أحرف على الأقل" })
    .max(500, { message: "يجب ألا يتجاوز الطلب 500 حرف" })
    .trim(),
});

type MaintenanceRequestForm = z.infer<typeof maintenanceRequestSchema>;

const SUCCESS_REDIRECT_SECONDS = 5;

const MaintenanceContent = ({
  onBack,
  reservationId,
}: {
  onBack: () => void;
  reservationId: number | undefined;
}) => {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceRequestForm>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: { requestComment: "" },
  });
  const {
    mutate: createMaintenanceRequest,
    isPending,
    isError,
    error,
    isSuccess,
  } = useRequestMaintenance();

  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isSuccessBannerFading, setIsSuccessBannerFading] = useState(false);
  const [secondsUntilRedirect, setSecondsUntilRedirect] = useState(
    SUCCESS_REDIRECT_SECONDS,
  );
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!isSuccess) return;

    setShowSuccessBanner(true);
    setIsSuccessBannerFading(false);
    setSecondsUntilRedirect(SUCCESS_REDIRECT_SECONDS);

    const intervalId = window.setInterval(() => {
      setSecondsUntilRedirect((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isSuccess]);

  useEffect(() => {
    if (!isSuccess || secondsUntilRedirect > 0) return;

    setIsSuccessBannerFading(true);
    onBackRef.current();
  }, [isSuccess, secondsUntilRedirect]);

  const onSubmit = (data: MaintenanceRequestForm) => {
    if (!reservationId) return;
    createMaintenanceRequest(
      {
        reservationId: reservationId as number,
        requestComment: data.requestComment,
        notes: "",
      },
      {
        onSuccess: () => {
          toast.success(t("myBookingsDrawer.maintenanceSuccess"), {
            position: "top-center",
          });
        },
      },
    );
  };
  return (
    <div className="animate-in fade-in slide-in-from-right duration-300">
      <SheetHeader className="mt-10 flex flex-row items-center gap-2 space-y-0 px-6 text-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onBack}
          aria-label={t("backToBookingDetails")}
        >
          {isRTL ? (
            <ArrowRight className="h-5 w-5" />
          ) : (
            <ArrowLeft className="h-5 w-5" />
          )}
        </Button>
        <SheetTitle className="text-start text-xl">
          {t("myBookingsDrawer.requestMaintenance")}
        </SheetTitle>
      </SheetHeader>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto min-h-0 w-full flex-1 overflow-y-auto px-6 pt-6"
      >
        <Textarea
          {...register("requestComment")}
          placeholder={
            isRTL ? "اكتب تفاصيل المشكلة..." : "Write problem details..."
          }
          disabled={isPending}
          className={`min-h-24 text-sm! bg-white ${errors.requestComment?.message ? "border-StatusRed outline-0! focus:border-2" : ""}`}
        />

        {showSuccessBanner && (
          <div
            className={cn(
              "mt-3 w-full rounded-lg bg-green-200 p-2 text-center font-sm text-green-800",
              isSuccessBannerFading
                ? "animate-out fade-out duration-500"
                : "animate-in fade-in duration-300",
            )}
          >
            <p>{t("myBookingsDrawer.maintenanceSuccess")}</p>
            <p className="mt-1 text-sm text-green-700">
              {t("myBookingsDrawer.maintenanceRedirectCountdown", {
                seconds: secondsUntilRedirect,
              })}
            </p>
          </div>
        )}

        {errors.requestComment && (
          <WarningMessage
            className="mt-0!"
            message={errors.requestComment?.message || ""}
          />
        )}

        <div className="mt-4 w-full p-2 flex justify-end">
          <Button
            variant={"outline"}
            type="submit"
            size="sm"
            className="text-base! bg-black! text-white! px-4! py-5!"
            loading={isPending}
            disabled={!reservationId || isPending}
          >
            {isRTL ? "إرسال الطلب" : "Send Request"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceContent;
