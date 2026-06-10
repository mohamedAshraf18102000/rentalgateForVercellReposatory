"use client";

import { useEffect } from "react";
import { Input } from "@/app/(components)";
import { validatePromoCode } from "@/services/promotion/promotion.service";
import { Button } from "@base-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  TicketPercent,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocale, useTranslations } from "next-intl";

interface ExtensionCouponProps {
  promoCode?: string | null;
  promoCodeType?: number | null;
  promoDiscountValue?: number | null;
  onApplied?: (code: string, codeType: number, discountValue: number) => void;
  onCleared?: () => void;
  isCalculating?: boolean;
}

type CouponFormValues = { code: string };

const ExtensionCoupon = ({
  promoCode,
  promoCodeType,
  promoDiscountValue,
  onApplied,
  onCleared,
  isCalculating,
}: ExtensionCouponProps) => {
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const ChevronIcon = locale === "ar" ? ChevronLeft : ChevronRight;

  const couponSchema = z.object({
    code: z.string().min(1, t("reservation.coupon.validation.requiredCode")),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (promoCode) setValue("code", promoCode);
  }, [promoCode, setValue]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: validatePromoCode,
    onSuccess: (res) => {
      if (res.PromoCodeValid) {
        onApplied?.(res.promo.code, res.promo.codeType, res.promo.discountValue);
        toast.success(t("reservation.coupon.toast.discountApplied"), {
          position: "top-center",
        });
      } else {
        toast.error(t("reservation.coupon.toast.invalidCode"), {
          position: "top-center",
        });
      }
    },
    onError: (err: Error) => {
      toast.error(
        err.message || t("reservation.coupon.toast.validationErrorFallback"),
        { position: "top-center" },
      );
    },
  });

  const onSubmit = (values: CouponFormValues) => mutate(values.code);

  return (
    <>
      <p className="text-base font-bold mb-2">
        {t("reservation.coupon.title")}
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:gap-4"
      >
        <div className="flex-1 relative">
          <Input
            {...register("code")}
            startIcon={<TicketPercent />}
            placeholder={t("reservation.coupon.placeholder")}
            className="h-12! text-sm! bg-Grey100!"
            disabled={isPending}
            errorMessage={errors.code?.message}
          />
          <button
            type="button"
            onClick={() => {
              reset();
              onCleared?.();
            }}
            className="absolute top-1/2 -translate-y-1/2 right-2 rtl:left-2 rtl:right-auto"
          >
            <X className="size-4" />
          </button>
        </div>
        <Button
          type="submit"
          className="mt-0 flex shrink-0 items-center underline underline-offset-2 disabled:opacity-50 sm:mt-3"
          disabled={isPending || isCalculating}
        >
          {isPending || isCalculating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span>{t("reservation.coupon.confirmButton")}</span>
              <ChevronIcon className="h-5 w-5 mt-1" />
            </>
          )}
        </Button>
      </form>

      {promoCode && promoCodeType != null && promoDiscountValue != null && (
        <p className="text-StatusDarkGreen text-sm mt-1">
          {t("reservation.coupon.appliedDiscountMessage", {
            value: promoDiscountValue,
            unit:
              promoCodeType === 1
                ? t("reservation.coupon.percentUnit")
                : t("reservation.coupon.currencyUnit"),
          })}
        </p>
      )}

      {isError && error?.message && (
        <p className="text-red-600 mt-2">{error.message}</p>
      )}
    </>
  );
};

export default ExtensionCoupon;
