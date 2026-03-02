"use client";

import * as React from "react";
import { Button, Input, DialogWrapper } from "@/ui";
import type { ChangePasswordProps } from "./ChangePassword.types";
import { useTranslations } from "next-intl";
import { changePassword } from "@/lib/api/services/client.service";
import { toast } from "sonner";

export function ChangePasswordDialog({
  onClose,
}: ChangePasswordProps) {
  const t = useTranslations("common");
  const tProfile = useTranslations("profile");
  const [isLoading, setIsLoading] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSave = async () => {
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("تم تغيير كلمة المرور بنجاح");
      onClose();
      // Reset form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error instanceof Error ? error.message : "فشل في تغيير كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = oldPassword && newPassword && confirmPassword && newPassword === confirmPassword;

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
        <div className="space-y-4">
          {/* Current Password */}
          <Input
            label="كلمة المرور الحالية:"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="أدخل كلمة المرور الحالية"
            disabled={isLoading}
          />

          {/* New Password */}
          <Input
            label="كلمة المرور الجديدة:"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="أدخل كلمة المرور الجديدة"
            disabled={isLoading}
          />

          {/* Confirm New Password */}
          <Input
            label="تأكيد كلمة المرور الجديدة:"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="أكد كلمة المرور الجديدة"
            disabled={isLoading}
          />

          {/* Password mismatch warning */}
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-destructive">
              كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين
            </p>
          )}
        </div>
      }
      footer={
        <div className="grid grid-cols-12 gap-4 w-full mt-8">
          <div className="col-span-4">
            <Button variant="outline" className="w-full" size="lg" onClick={onClose} disabled={isLoading}>
              {t("cancel")}
            </Button>
          </div>
          <div className="col-span-8">
            <Button
              className="w-full bg-primary hover:bg-primary-hover text-white"
              size="lg"
              onClick={handleSave}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </div>
      }
    />
  );
}

