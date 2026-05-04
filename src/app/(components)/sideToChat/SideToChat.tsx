"use client";
import { MessageCircle } from "lucide-react";

const SideToChat = () => {
  return (
    <div
      className="fixed right-0 top-[15%] z-99 flex min-h-14 w-14 cursor-pointer touch-manipulation items-center justify-center rounded-l-xl bg-[#00602E]/60 py-3 shadow-md transition-colors hover:bg-[#2aaf6a] active:bg-[#2aaf6a]/90 sm:top-[18%] md:top-[20%] md:h-44 md:w-12 md:min-h-0 md:py-0 md:shadow-none"
      role="button"
      tabIndex={0}
      aria-label="تحويل إلى محادثة"
      onClick={() => {
        window.open("https://wa.me/+0201115893336", "_blank");
      }}
    >
      <p className="flex flex-col items-center justify-center gap-1 font-bold text-white md:hidden">
        <MessageCircle
          className="size-7 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
      </p>
      <p className="hidden font-bold text-white md:flex md:-rotate-90 md:items-center md:gap-2 md:whitespace-nowrap">
        <MessageCircle
          className="size-6 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
        <span className="text-sm lg:text-base">تحويل إلى محادثة</span>
      </p>
    </div>
  );
};

export default SideToChat;
