"use client";

import { Button, DialogWrapper } from "@/ui";
import type { ApiErrorProps } from "./ApiError.types";
import { CircleX } from "lucide-react";
import { useTranslations } from "next-intl";

export function ErrorDialog({ message, onClose, onClick }: ApiErrorProps) {
  const t = useTranslations("common");

  return (
    <DialogWrapper
      className="overflow-x-hidden! max-w-lg!"
      open={true}
      onOpenChange={(open) => !open && onClose()}
      closeOnOutsideClick={false}
      header={{
        mainTitle: t("apiErrorDialog.title"),
      }}
      content={
        <div className="flex flex-col items-center justify-center max-h-[500px] overflow-y-auto">
          <CircleX className="w-10 h-10 text-red-500" />
          <div className="text-sm my-2">
            <span>{message}</span>
          </div>
        </div>
      }
      footer={
        <Button
          className="w-full mt-5 "
          onClick={() => {
            onClick?.();
            onClose();
          }}
        >
          {t("apiErrorDialog.confirmButton")}
        </Button>
      }
    />
  );
}
