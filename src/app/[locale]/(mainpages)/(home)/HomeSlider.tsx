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

const HomeSlider = () => {
  const { data } = useHomeStore();
  const plugin = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: false }),
  );

  const imagesList = [
    { src: "/banner_ar.png", alt: "banner 1" },
    { src: "/banner.png", alt: "banner 2" },
  ];

  return (
    <section dir="ltr">
      <div className="relative w-full h-dvh">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="h-dvh ml-0">
            {data?.banners.map((image, index) => (
              <CarouselItem key={index} className="pl-0 h-full relative">
                <div className="relative w-full h-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${image.image}`}
                    alt={image.bannerName}
                    fill
                    className="object-cover"
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
