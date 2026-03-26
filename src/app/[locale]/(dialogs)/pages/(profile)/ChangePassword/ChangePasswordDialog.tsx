"use client";

import { Button, DialogWrapper, Input } from "@/app/(components)";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import { toast } from "sonner";
import { updateClientPassword } from "@/services/auth/updatePassword/updatePassword.service";
import { useTranslations } from "next-intl";
import type { ChangePasswordProps } from "./ChangePassword.types";

/**
 * Change Password Dialog
 * 
 * Secure password change using react-hook-form and Zod validation.
 * Uses the /clients/auth/change-password endpoint.
 */

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

export function ChangePasswordDialog({ onClose }: ChangePasswordProps) {
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");

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

  const onSubmit = async (values: PasswordFormValues) => {
    setApiError(null);
    setIsLoading(true);
    try {
      await updateClientPassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      toast.success("تم تغيير كلمة المرور بنجاح");
      onClose();
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
      open={true}
      onOpenChange={(open) => !open && onClose()}
      size="md"
      closeOnOutsideClick={!isLoading}
      header={{
        mainTitle: t("changePassword"),
      }}
      content={
        <form
          id="change-password-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 mb-5 mt-2"
        >
          <Input
            {...register("oldPassword")}
            className="text-base"
            placeholder="أدخل كلمة المرور الحالية"
            label="كلمة المرور الحالية:"
            type="password"
            labelClassName="text-base"
            errorMessage={errors.oldPassword?.message}
            disabled={isLoading}
          />

          <Input
            {...register("newPassword")}
            className="text-base"
            placeholder="أدخل كلمة المرور الجديدة"
            label="كلمة المرور الجديدة:"
            type="password"
            labelClassName="text-base"
            errorMessage={errors.newPassword?.message}
            disabled={isLoading}
          />

          <Input
            {...register("rePassword")}
            className="text-base"
            placeholder="أدخل كلمة المرور الجديدة"
            label="تأكيد كلمة المرور الجديدة:"
            type="password"
            labelClassName="text-base"
            errorMessage={errors.rePassword?.message}
            disabled={isLoading}
          />

          {apiError && (
            <div className="text-center text-StatusRed text-sm bg-red-50 p-3 font-semibold rounded-lg border border-red-100">
              {apiError}
            </div>
          )}
        </form>
      }
      footer={
        <div className="grid grid-cols-12 gap-4 w-full mt-5">
            <div className="col-span-4">
                <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {tCommon("cancel")}
                </Button>
            </div>
            <div className="col-span-8">
                <Button
                    className="w-full"
                    size="lg"
                    type="submit"
                    form="change-password-form"
                    disabled={isLoading}
                    loading={isLoading}
                >
                    {isLoading ? tCommon("saving") : tCommon("saveChanges")}
                </Button>
            </div>
        </div>
      }
    />
  );
}
