"use client";

import { Button, DialogWrapper, Input } from "@/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import { toast } from "sonner";
import { updateClientPassword } from "@/services/auth/updatePassword/updatePassword.service";
import { useLocale, useTranslations } from "next-intl";
import type { ChangePasswordProps } from "./ChangePassword.types";

/**
 * Change Password Dialog
 *
 * Secure password change using react-hook-form and Zod validation.
 * Uses the /clients/auth/change-password endpoint.
 */

type PasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  rePassword: string;
};

export function ChangePasswordDialog({ onClose }: ChangePasswordProps) {
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const locale = useLocale();
  const t = useTranslations("profile.changePasswordDialog");
  const tVal = useTranslations("profile.changePasswordDialog.validation");
  const tCommon = useTranslations("common");

  const passwordSchema = React.useMemo(
    () =>
      z
        .object({
          oldPassword: z.string().min(1, tVal("oldPasswordRequired")),
          newPassword: z.string().min(8, tVal("newPasswordMin")),
          rePassword: z.string().min(1, tVal("confirmRequired")),
        })
        .refine((data) => data.newPassword === data.rePassword, {
          message: tVal("passwordsMismatch"),
          path: ["rePassword"],
        }),
    [tVal, locale],
  );

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

      toast.success(t("toastSuccess"));
      onClose();
      reset();
    } catch (error: any) {
      let errorMessage: string = error.message || t("errorGeneric");
      if (errorMessage === "Invalid old password") {
        errorMessage = t("errorInvalidOldPassword");
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
      closeOnOutsideClick={false}
      scrollableContent={true}
      maxScrollHeight="350px"
      header={{
        mainTitle: t("title"),
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
            placeholder={t("oldPasswordPlaceholder")}
            label={t("oldPasswordLabel")}
            type="password"
            labelClassName="text-base"
            errorMessage={errors.oldPassword?.message}
            disabled={isLoading}
          />

          <Input
            {...register("newPassword")}
            className="text-base"
            placeholder={t("newPasswordPlaceholder")}
            label={t("newPasswordLabel")}
            type="password"
            labelClassName="text-base"
            errorMessage={errors.newPassword?.message}
            disabled={isLoading}
          />

          <Input
            {...register("rePassword")}
            className="text-base"
            placeholder={t("confirmPasswordPlaceholder")}
            label={t("confirmPasswordLabel")}
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
              className="w-full text-base"
              size="lg"
              onClick={onClose}
              disabled={isLoading}
            >
              {tCommon("cancel")}
            </Button>
          </div>
          <div className="col-span-8">
            <Button
              className="w-full text-base"
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
