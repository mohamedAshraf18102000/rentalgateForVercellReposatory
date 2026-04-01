"use client";

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

const Coupon = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
    },
  });

  const { setFormField } = useBookedCarDetailsStore();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: validatePromoCode,
    onSuccess: (isValid, variables) => {
      if (isValid) {
        setFormField("promoCode", variables);
        toast.success("تم تفعيل كود الخصم بنجاح", { position: "top-center" });
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
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span>تأكيد</span>
              <ChevronLeft className="h-5 w-5 mt-1" />
            </>
          )}
        </Button>
      </form>
      {isError && <p className="text-red-600 mt-2">{error?.message}</p>}
    </>
  );
};

export default Coupon;
