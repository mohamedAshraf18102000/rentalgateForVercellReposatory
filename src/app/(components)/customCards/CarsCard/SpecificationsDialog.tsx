"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Specification } from "@/types/companyCars/carDetails";
import { DialogWrapper } from "../../ui/dialog-wrapper";

interface SpecificationsDialogProps {
  specifications: Specification[];
  legacySpecsText: string;
}

const SpecificationsDialog = ({
  specifications,
  legacySpecsText,
}: SpecificationsDialogProps) => {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const isRTL = locale === "ar";
  const useStructuredSpecs = specifications.length > 0;

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      size="lg"
      className="max-w-2xl rounded-2xl border-0 p-0 shadow-2xl"
      contentClassName="p-0"
      trigger={
        <button className="text-sm text-Grey600 underline underline-offset-4">
          <span className="relative z-10">{t("viewSpecifications")}</span>
        </button>
      }
      header={{
        mainTitle: t("specificationsTitle"),
      }}
      content={
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="max-h-[65vh] overflow-y-auto px-6 pb-5"
        >
          {useStructuredSpecs && (
            <p className="mb-3 text-xs text-zinc-400 text-start">
              {t("specificationsCount", { count: specifications.length })}
            </p>
          )}
          {useStructuredSpecs ? (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {specifications.map((spec, index) => {
                const label = isRTL
                  ? spec.arabicName || spec.englishName || spec.name
                  : spec.englishName || spec.arabicName || spec.name;

                return (
                  <li
                    key={spec.specificationId}
                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-100 transition-shadow hover:shadow-md"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-50 ring-1 ring-zinc-100">
                      {spec.icon ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${spec.icon}`}
                          alt={label}
                          width={20}
                          height={20}
                          className="h-5 w-5 object-contain"
                        />
                      ) : (
                        <CheckCircle2
                          size={16}
                          className="text-zinc-400"
                          strokeWidth={1.5}
                        />
                      )}
                    </span>
                    <span className="text-sm font-medium leading-snug text-zinc-700">
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex items-start gap-3 rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-zinc-100">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-zinc-400"
                strokeWidth={1.5}
              />
              <p className="text-sm leading-relaxed text-zinc-600">
                {legacySpecsText}
              </p>
            </div>
          )}
        </div>
      }
      footer={
        <div className="flex items-center justify-end border-t border-zinc-100 w-full pt-3">
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-zinc-700 active:scale-[0.98]"
          >
            {t("closeDialog")}
          </button>
        </div>
      }
    />
  );
};

export default SpecificationsDialog;
