"use client";

import { Button, DialogWrapper } from "@/ui";
import type { ApiErrorProps } from "./ApiError.types";
import { CircleX } from "lucide-react";
import { useTranslations } from "next-intl";

export function ErrorDialog({ message, onClose, onClick }: ApiErrorProps) {
  const t = useTranslations("common");

  return (
    <DialogWrapper
      className="z-999999"
      open={true}
      onOpenChange={(open) => !open && onClose()}
      closeOnOutsideClick={false}
      size="md"
      header={{
        mainTitle: t("apiErrorDialog.title"),
      }}
      content={
        <div className="flex min-h-0 w-full max-w-full flex-col items-center justify-center gap-2 px-1 py-1 sm:gap-3 sm:px-2 max-h-[min(500px,calc(100dvh-12rem))] overflow-y-auto overscroll-contain">
          <CircleX className="h-9 w-9 shrink-0 text-red-500 sm:h-10 sm:w-10" />
          <div className="w-full max-w-full text-center text-sm leading-relaxed text-foreground sm:text-base">
            <span className="inline-block max-w-full wrap-break-word">
              {message}
            </span>
          </div>
        </div>
      }
      footer={
        <Button
          className="mt-4 w-full sm:mt-5"
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
