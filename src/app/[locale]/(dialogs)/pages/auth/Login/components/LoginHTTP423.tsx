"use client";

import { useDialog } from "../../../..";

export interface LoginHTTP423Props {
  email?: string;
  mobile?: string;
  channel: "EMAIL" | "WHATSAPP";
}

export function LoginHTTP423({ email, mobile, channel }: LoginHTTP423Props) {
  const { openDialog } = useDialog();

  const handleClick = () => {
    openDialog("ForgotPassword", {
      email,
      mobile,
      channel,
    });
  };

  return (
    <div dir="rtl" className="flex flex-col gap-2 items-center text-center">
      <span className="text-base font-semibold">قد تم ايقاف الحساب</span>
      <div className="flex gap-0.5 items-center justify-center text-sm flex-wrap">
        <span>لاعادة استخدام الحساب الرجاء</span>
        <button
          type="button"
          onClick={handleClick}
          className="font-medium text-primary underline underline-offset-2"
        >
          الضغط هنا
        </button>
      </div>
    </div>
  );
}
