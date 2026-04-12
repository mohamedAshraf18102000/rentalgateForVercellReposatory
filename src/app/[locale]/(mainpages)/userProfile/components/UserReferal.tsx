"use client";

import { useAuth } from "@/app/(components)/navbar/hooks/useAuth";
import { CheckCircle, Copy } from "lucide-react";
import { toast } from "sonner";

const UserReferal = () => {
  const { userData: storeUserData, isClient } = useAuth();
  const handleCopy = async () => {
    if (!storeUserData?.referralCode) return;
    try {
      await navigator.clipboard.writeText(storeUserData.referralCode);
      toast(
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="text-green-800 w-5 h-5" />
          <span>تم نسخ الكود بنجاح</span>
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
      toast.error("فشل نسخ الكود");
    }
  };

  return (
    <div className="flex h-auto min-h-[220px] w-full flex-col justify-center rounded-2xl border-2 border-white bg-[url(/profile/panner.png)] bg-cover p-2 text-white sm:min-h-[250px] md:h-[270px] md:min-h-0">
      <div className="w-full max-w-full p-2 sm:p-3 md:w-[85%] lg:w-[60%]">
        <h4 className="text-base font-extrabold sm:text-lg">تحب تكسب خصومات؟!!</h4>
        <p className="mt-1 max-w-full text-sm sm:max-w-[90%] md:w-3/4">
          لكل حد هترشحه هتكسب 50% خصم على مدة الإيجار
        </p>
      </div>

      <div className="mt-3 w-full max-w-full p-2 sm:mt-5 sm:p-3 md:w-[85%] lg:w-[60%]">
        <h4 className="text-lg font-extrabold">شارك الكود:</h4>

        <div className="mt-2 flex min-w-0 items-center justify-between gap-2 rounded-xl bg-white p-2 px-3 text-black sm:px-4">
          <p className="min-w-0 truncate text-sm sm:text-base">
            {isClient ? storeUserData?.referralCode : ""}
          </p>

          <div className="flex items-center gap-2">
            <Copy
              size={24}
              className="text-Grey700 cursor-pointer"
              onClick={handleCopy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReferal;
