"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, DialogWrapper } from "@/ui";
import { Textarea } from "@/app/(components)/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(components)/ui/select";
import TextAreaIcon from "@/constants/icons/profile/TextAreaIcon";
import type { UserSuggestionProps } from "./UserSuggestion.types";

const CANCELLATION_REASON_KEYS = [
  "tripCancelled",
  "betterOffer",
  "noLongerNeeded",
  "wrongDetails",
  "serviceIssue",
  "other",
] as const;

export function UserSuggestionDialog({ onClose }: UserSuggestionProps) {
  const t = useTranslations("profile");
  const [cancellationReason, setCancellationReason] = useState<string>("");

  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      size="md"
      closeOnOutsideClick={false}
      scrollableContent={true}
      maxScrollHeight="350px"
      header={{
        mainTitle: (
          <div className="flex items-center justify-between w-full">
            <span className="text-black flex-1 text-center">
              الدعم و المقترحات
            </span>
          </div>
        ),
      }}
      content={
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-foreground">
              {t("cancellationReason")}
            </label>
            <Select
              value={cancellationReason || undefined}
              onValueChange={setCancellationReason}
            >
              <SelectTrigger size="md" className="text-sm">
                <SelectValue placeholder={t("selectReason")} />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_REASON_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(`cancellationReasonOptions.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            label="الرسالة:"
            labelClassName="text-base!"
            className="text-sm!"
            placeholder="شاركنا معلوماتك، وسيتواصل معك فريقنا في أقرب وقت."
            startIcon={<TextAreaIcon />}
            rows={10}
          />
        </div>
      }
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button
            size="lg"
            className="w-fit text-black hover:bg-white underline py-3 border-none px-5 bg-white text-base"
            onClick={onClose}
          >
            إغلاق
          </Button>
          <Button
            size="lg"
            className="w-fit text-white py-3 border-none px-10 text-base"
          >
            حفظ
          </Button>
        </div>
      }
    />
  );
}
