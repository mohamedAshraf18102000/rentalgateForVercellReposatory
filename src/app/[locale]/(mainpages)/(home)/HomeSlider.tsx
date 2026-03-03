"use client";

import type { Banner } from "@/constants/api";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface HomeSliderProps {
  banners?: Banner[];
}

const HomeSlider = ({ banners = [] }: HomeSliderProps) => {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section>
      <div className="relative w-full min-h-[100dvh] min-h-[100vh]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={"/banner.png"}
            alt={"banner"}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HomeSlider;
