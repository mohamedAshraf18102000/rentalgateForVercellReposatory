"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useHomeStore } from "@/lib/stores/useHomeStore";

const HomeSlider = () => {
  const banners = useHomeStore((state) => state.data?.banners);

  return (
    <section>
      <div className="relative w-full min-h-[100dvh] min-h-[100vh]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          {banners?.map((banner) => (
            <Image
              key={banner.bannerId}
              src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${banner.image}`}
              alt={banner.bannerName}
              fill
              className="object-cover"
              priority
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeSlider;
