"use client";

import { useLocale } from "next-intl";
import Image from "next/image";

export const PageLoader = () => {
  const locale = useLocale();
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center gap-10">
        <div className="relative h-32 w-32 flex items-center justify-center">
          {/* Animated Outer Rings */}
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#f5a600]/10 border-t-[#C62028] border-r-[#C62028]"></div>
          <div className="absolute inset-2 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-[3px] border-primary-hover/5 border-t-primary-hover border-l-primary-hover"></div>

          {/* Pulse Logo Container */}
          <div className="relative animate-pulse">
            <Image
              src="/logoSm.png"
              alt="Rental Gate"
              width={70}
              height={70}
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Loading Indicators & Labels */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="font-zain text-2xl font-bold tracking-wide text-primary-hover">
            بوابة التأجير
            </span>
            <span className="font-almarai text-xs font-semibold tracking-[0.3em] text-[#C62028] uppercase">
              RENTAL GATE
            </span>
          </div>

          <div className="flex gap-2.5">
            <div className="h-3 w-3 animate-bounce rounded-full bg-[#C62028] [animation-delay:-0.3s] shadow-[0_0_10px_#f5a60055]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-primary-hover [animation-delay:-0.15s] shadow-[0_0_10px_#11000033]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-[#C62028] shadow-[0_0_10px_#f5a60055]"></div>
          </div>
        </div>
      </div>

      {/* Decorative footer line */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 overflow-hidden w-40 h-px bg-gray-100">
        <div className="h-full bg-linear-to-r from-transparent via-[#C62028] to-transparent animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  );
};

export default PageLoader;
