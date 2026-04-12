"use client";

import { Button, DialogWrapper } from "@/ui";
import { Textarea } from "@/app/(components)/ui/textarea";
import TextAreaIcon from "@/constants/icons/profile/TextAreaIcon";
import type { UserSuggestionProps } from "./UserSuggestion.types";

export function UserSuggestionDialog({ onClose }: UserSuggestionProps) {
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
