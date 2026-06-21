import { useAuth } from "@/app/(components)/navbar/hooks/useAuth";
import { CheckCircle, Copy, Info } from "lucide-react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import ReferralCodeTermsDialog from "./referalCodeTermsDialog/ReferralCodeTermsDialog";

const UserReferal = () => {
  const t = useTranslations("profile.profilePage.userReferral");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { userData: storeUserData, isClient } = useAuth();
  const handleCopy = async () => {
    if (!storeUserData?.referralCode) return;
    try {
      await navigator.clipboard.writeText(storeUserData.referralCode);
      toast(
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="text-green-800 w-5 h-5" />
          <span>{t("copySuccess")}</span>
        </div>,
        {
          position: "top-center",
          className: "rounded-xl",
          style: {
            backgroundColor: "#E3FCEC",
            border: "none",
          },
        },
      );
    } catch {
      toast.error(t("copyError"));
    }
  };

  return (
    <div className="flex h-auto min-h-[220px] w-full flex-col justify-center rounded-2xl border-2 border-white bg-[url(/profile/panner.png)] bg-cover p-2 text-white sm:min-h-[250px] md:h-[270px] md:min-h-0">
      <div
        className={`w-full max-w-full p-2 sm:p-3 ${
          isArabic
            ? "md:w-[85%] lg:w-[60%]"
            : "md:ms-auto md:w-[75%] lg:w-[55%]"
        }`}
      >
        <h4 className="text-base font-extrabold sm:text-lg">{t("title")}</h4>

        <p className="mt-1 max-w-full text-sm sm:max-w-[90%] md:w-3/4">
          {t("description")}
        </p>
      </div>

      <div
        className={`mt-3 w-full max-w-full p-2 sm:mt-5 sm:p-3 ${
          isArabic
            ? "md:w-[85%] lg:w-[60%]"
            : "md:ms-auto md:w-[75%] lg:w-[55%]"
        }`}
      >
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-extrabold">{t("shareCodeTitle")}</h4>
          <ReferralCodeTermsDialog />
        </div>

        <div className="mt-2 flex min-w-0 items-center justify-between gap-2 rounded-xl bg-white p-2 px-3 text-black sm:px-4">
          <p className="min-w-0 truncate text-sm sm:text-base">
            {isClient ? storeUserData?.referralCode : ""}
          </p>

          <Copy
            size={24}
            className="text-Grey700 cursor-pointer"
            onClick={handleCopy}
          />
        </div>
      </div>
    </div>
  );
};

export default UserReferal;
