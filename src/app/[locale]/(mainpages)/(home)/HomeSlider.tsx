"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/app/(components)/ui/carousel";
import { useHomeStore } from "@/lib/stores/useHomeStore";

const sliderHeightClass =
  "h-[min(42svh,22rem)] min-h-[12.5rem] " +
  "sm:h-[min(48svh,26rem)] sm:min-h-[14rem] " +
  "md:h-[min(56svh,32rem)] md:min-h-[16rem] " +
  "lg:h-[min(68svh,40rem)] " +
  "xl:h-[min(82svh,48rem)] " +
  "2xl:h-dvh 2xl:max-h-dvh";

const HomeSlider = () => {
  const { data } = useHomeStore();
  const plugin = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: false }),
  );

  return (
    <section dir="ltr" className="w-full">
      <div className={`relative w-full overflow-hidden ${sliderHeightClass}`}>
        <Carousel
          plugins={[plugin.current]}
          className="h-full w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className={`ml-0 ${sliderHeightClass}`}>
            {data?.banners.map((image, index) => (
              <CarouselItem key={index} className="relative h-full pl-0">
                <div className="relative h-full w-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${image.image}`}
                    alt={image.bannerName}
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default HomeSlider;
