"use client";

import { useEffect } from "react";
import { Input } from "@/app/(components)";
import { validatePromoCode } from "@/services/promotion/promotion.service";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { Button } from "@base-ui/react";
import { ChevronLeft, TicketPercent, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const couponSchema = z.object({
  code: z.string().min(1, "يرجى إدخال كود الخصم"),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponProps {
  onApplied?: () => void;
  isCalculating?: boolean;
}

const Coupon = ({ onApplied, isCalculating }: CouponProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
    },
  });

  const { setFormField, formData } = useBookedCarDetailsStore();

  useEffect(() => {
    const code = formData.promoData?.code || formData.referalcode || "";
    if (code) {
      setValue("code", code);
    }
  }, [formData.promoData, formData.referalcode, setValue]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: validatePromoCode,
    onSuccess: (res) => {
      if (res.PromoCodeValid) {
        if (res.promo.code.trim().toLowerCase().startsWith("rf")) {
          setFormField("referalcode", res.promo.code);
          setFormField("promoData", null);
          toast.success("تم تفعيل كود الإحالة بنجاح", {
            position: "top-center",
          });
        } else {
          setFormField("promoData", {
            code: res.promo.code,
            codeType: res.promo.codeType,
            discountValue: res.promo.discountValue,
          });
          setFormField("referalcode", null);
          toast.success("تم تفعيل كود الخصم بنجاح", { position: "top-center" });
        }
        onApplied?.();
      } else {
        toast.error("كود الخصم غير صحيح", { position: "top-center" });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ ما أثناء التحقق من كود الخصم", {
        position: "top-center",
      });
    },
  });

  const onSubmit = (values: CouponFormValues) => {
    mutate(values.code);
  };

  return (
    <>
      <p className="text-base font-bold mb-2">أدخل كود الخصم:</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-start gap-8"
      >
        <div className="flex-1 relative">
          <Input
            {...register("code")}
            startIcon={<TicketPercent />}
            placeholder="أدخل كود الخصم الخاص بك"
            className="h-12! text-sm! bg-Grey100!"
            disabled={isPending}
            errorMessage={errors.code?.message}
          />
          <button
            onClick={() => {
              reset();
              setFormField("promoData", null);
              setFormField("referalcode", null);
              onApplied?.();
            }}
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-2 rtl:left-2 rtl:right-auto"
          >
            <X className="size-4" />
          </button>
        </div>
        <Button
          type="submit"
          className="underline underline-offset-2 flex items-center disabled:opacity-50 shrink-0 mt-3"
          disabled={isPending || isCalculating}
        >
          {isPending || isCalculating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span>تأكيد</span>
              <ChevronLeft className="h-5 w-5 mt-1" />
            </>
          )}
        </Button>
      </form>
      {formData.promoData && (
        <p className="text-StatusDarkGreen text-sm mt-1">
          تم تطبيق كود الخصم بقيمة {formData.promoData.discountValue}{" "}
          {formData.promoData.codeType === 1 ? "%" : "ريال"}
        </p>
      )}
      {formData.referalcode && (
        <p className="text-StatusDarkGreen text-sm mt-1">
          تم تفعيل كود الإحالة بنجاح ({formData.referalcode})
        </p>
      )}
      {isError && <p className="text-red-600 mt-2">{error?.message}</p>}
    </>
  );
};

export default Coupon;
