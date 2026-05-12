"use client";
import { MessageCircle } from "lucide-react";

const SideToChat = () => {
  return (
    <div
      className="fixed right-0 top-[15%] z-99 flex min-h-12 w-12 cursor-pointer touch-manipulation items-center justify-center rounded-l-lg bg-[#00602E]/80 py-3 shadow-md transition-colors hover:bg-[#2aaf6a] active:bg-[#2aaf6a]/90 sm:top-[18%] md:top-[20%] md:h-44 md:w-10 md:min-h-0 md:py-0 md:shadow-none"
      role="button"
      tabIndex={0}
      aria-label="تحويل إلى محادثة"
      onClick={() => {
        window.open("https://wa.me/+0201115893336", "_blank");
      }}
    >
      <p className="hidden font-bold text-white md:flex md:-rotate-90 md:items-center md:gap-2 md:whitespace-nowrap">
        <MessageCircle
          className="size-6 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
        <span className="text-sm">تحويل إلى محادثة</span>
      </p>
      <p className="block font-bold text-white md:hidden">
        <MessageCircle
          className="size-6 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
      </p>
    </div>
  );
};

export default SideToChat;
