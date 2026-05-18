"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { Button, DialogWrapper, AlertDialogWrapper } from "@/ui";
import { useRemoveUserAccount } from "@/hooks/api/useRemoveUserAccount";
import { useRouter } from "@/i18n/routing";
import { useClientStore } from "@/lib/api/stores";
import type { UserDeleteAccountProps } from "./UserDeleteAccount.types";
import { useDeleteAccountWarningItems } from "./WarningItems";

export function UserDeleteAccountDialog({ onClose }: UserDeleteAccountProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("profile.deleteAccountDialog");
  const tCommon = useTranslations("common");
  const warningItems = useDeleteAccountWarningItems();
  const { clearClientData } = useClientStore();
  const { mutateAsync: removeAccount, isPending } = useRemoveUserAccount();

  const handleConfirmDeactivate = async () => {
    try {
      await removeAccount();
      clearClientData();
      toast.success(t("toast.success"), { position: "top-center" });
      setConfirmOpen(false);
      onClose();
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("toast.error");
      toast.error(message, { position: "top-center" });
    }
  };

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <>
      <AlertDialogWrapper
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="error"
        header={{
          mainTitle: t("confirm.title"),
          description: t("confirm.description"),
        }}
        footer={{
          showCancel: true,
          cancelText: tCommon("cancel"),
          confirmText: isPending ? t("confirm.confirming") : t("confirm.confirm"),
          onCancel: () => setConfirmOpen(false),
          onConfirm: handleConfirmDeactivate,
        }}
      />
      <DialogWrapper
        open={true}
        onOpenChange={(open) => !open && onClose()}
        size="lg"
        closeOnOutsideClick={false}
        scrollableContent={true}
        maxScrollHeight="400px"
        header={{
          mainTitle: (
            <div className="flex items-center justify-between w-full">
              <span className="text-black flex-1 text-center">{t("title")}</span>
            </div>
          ),
        }}
        content={
          <div dir={dir} className="flex flex-col gap-5 mb-5 px-1">
            {/* Banner */}
            <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-red-100 shrink-0 mt-0.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-red-600"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-red-700 text-sm">
                  {t("bannerTitle")}
                </p>
                <p className="text-red-600/80 text-sm leading-relaxed">
                  {t("bannerDescription")}
                </p>
              </div>
            </div>

            {/* Important notes */}
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4 text-slate-500"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                {t("importantNotesTitle")}
              </p>

              <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/60 overflow-hidden">
                {warningItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-4 py-3 text-sm text-slate-600 leading-relaxed"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        footer={
          <div className="flex w-full justify-end gap-2 mt-3" dir={dir}>
            <Button
              variant="outline"
              size="lg"
              className="w-fit text-black hover:bg-white underline py-3 border-none px-5 bg-white text-base underline-offset-4"
              onClick={onClose}
              disabled={isPending}
            >
              {t("closeButton")}
            </Button>
            <Button
              size="lg"
              className="w-fit bg-red-600 hover:bg-red-700 text-white py-3 border-none px-10 text-base rounded-lg"
              onClick={() => setConfirmOpen(true)}
              disabled={isPending}
              loading={isPending}
            >
              {t("deactivateButton")}
            </Button>
          </div>
        }
      />
    </>
  );
}
