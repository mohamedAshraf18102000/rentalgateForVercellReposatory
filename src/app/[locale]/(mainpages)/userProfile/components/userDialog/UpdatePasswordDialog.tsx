"use client";

import { Button, DialogWrapper, Input } from "@/app/(components)";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateClientPassword } from "@/services/auth/updatePassword/updatePassword.service";
import { useTranslations } from "next-intl";

interface UpdatePasswordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
      .string()
      .min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
    rePassword: z.string().min(1, "تأكيد كلمة المرور مطلوبة"),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["rePassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const UpdatePasswordDialog = ({ open, setOpen }: UpdatePasswordDialogProps) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("profile");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      rePassword: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset();
      setApiError(null);
    }
  }, [open, reset]);

  const onSubmit = async (values: PasswordFormValues) => {
    setApiError(null);
    setIsLoading(true);
    try {
      await updateClientPassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      toast.success("تم تغيير كلمة المرور بنجاح");
      setOpen(false);
      reset();
    } catch (error: any) {
      let errorMessage = error.message || "حدث خطأ أثناء تغيير كلمة المرور";
      if (errorMessage === "Invalid old password") {
        errorMessage = "كلمه السر الحالية غير صحيحه";
      }
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      size="md"
      forceDialog={true}
      contentClassName=""
      closeOnOutsideClick={true}
      header={{
        mainTitle: (
          <div className="flex items-center justify-between w-full">
            <span className="text-black  flex-1 text-center font-bold">
              تغيير كلمة المرور
            </span>
          </div>
        ),
      }}
      content={
        <form
          id="change-password-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 mb-5"
        >
          <Input
            {...register("oldPassword")}
            className="text-base!"
            placeholder="أدخل كلمة المرور الحالية"
            label="كلمة المرور الحالية:"
            type="password"
            labelClassName="text-base!"
            errorMessage={errors.oldPassword?.message}
          />

          <Input
            {...register("newPassword")}
            className="text-base!"
            placeholder="أدخل كلمة المرور الجديدة"
            label="كلمة المرور الجديدة:"
            type="password"
            labelClassName="text-base!"
            errorMessage={errors.newPassword?.message}
          />

          <Input
            {...register("rePassword")}
            className="text-base!"
            placeholder="أدخل كلمة المرور الجديدة"
            label="تأكيد كلمة المرور الجديدة:"
            type="password"
            labelClassName="text-base!"
            errorMessage={errors.rePassword?.message}
          />

          {apiError && (
            <div className="text-center text-StatusRed text-sm bg-red-200 p-2 font-bold rounded-lg">
              {apiError}
            </div>
          )}
        </form>
      }
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button
            size="lg"
            className="w-fit text-black hover:bg-white underline py-3 border-none px-5 bg-white text-base"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            إغلاق
          </Button>
          <Button
            type="submit"
            form="change-password-form"
            size="lg"
            className="w-fit text-white py-3 border-none px-10 text-base"
            disabled={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </div>
      }
    />
  );
};

export default UpdatePasswordDialog;
