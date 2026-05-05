import { emitAppNavigate, emitCloseDialog } from "../errorDialogEvents";

export type ErrorRule = {
  keywords: string[];
  message: React.ReactNode;
  toastMessage?: string;
};

export const errorMessageRules: ErrorRule[] = [
  {
    keywords: ["رخصتك", "licence"],
    message: (
      <div className="text-center leading-6">
        رخصتك منتهية
        <br />
        برجاء تحديث بياناتك الشخصية حتى تتمكن من إكمال الحجز
        <button
          type="button"
          className="mt-3 block w-full text-primary underline"
          onClick={() => {
            const locale = window.location.pathname.split("/")[1];
            const localePrefix =
              locale === "en" || locale === "ar" ? `/${locale}` : "";
            emitCloseDialog();
            emitAppNavigate({ href: `${localePrefix}/userProfile` });
          }}
        >
          الذهاب للملف الشخصي
        </button>
      </div>
    ),
    toastMessage:
      "رخصتك منتهية .. برجاء تحديث بياناتك الشخصية حتى تتمكن من إكمال الحجز",
  },
];
