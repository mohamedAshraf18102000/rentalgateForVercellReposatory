"use client";

import * as React from "react";
import { Button, DialogWrapper } from "@/ui";
import type { AccountDeactivatedProps } from "./AccountDeactivated.types";
import { useDialog } from "../../../hooks/useDialog";
import { useTranslations } from "next-intl";
import { WarningIcon } from "@/constants/icons";

export function AccountDeactivatedDialog({
  email,
  mobile,
  channel,
  onClose,
}: AccountDeactivatedProps) {
  const { openDialog } = useDialog();
  const t = useTranslations("auth.accountDeactivated");

  const handleRecover = () => {
    // Close current dialog and open account recovery dialog
    onClose();
    openDialog("AccountRecovery", {
      email: email || undefined,
      mobile: mobile || undefined,
      channel: channel || "EMAIL",
      onSuccess: () => {
        console.log("Account recovery successful");
      },
    });
  };

  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      closeOnOutsideClick={false}
      size="sm"
      header={{
        mainTitle: t('title'),
        icon: <WarningIcon />,
        iconBgColor: "bg-transparent",
        description: t('description'),
      }}
      content={
        <div className="text-[13px] text-gray-600 leading-relaxed font-normal text-center">
          <p>{t('message')}</p>
        </div>
      }
      footer={
        <div className="flex gap-3 w-full mt-4">
          {/* <Button variant="outline" onClick={onClose} className="flex-1" size="lg">
            {t('buttons.cancel')}
          </Button> */}
          <Button onClick={handleRecover} className="flex-1" size="lg">
            {t('buttons.recover')}
          </Button>
        </div>
      } 
    />
  );
}

