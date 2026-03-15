"use client";

import { Card, CardContent } from "@/app/(components)/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/app/(components)/ui/carousel";
import { useLocale } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LatestOffer } from "@/types/home/home";

interface OffersCarouselProps {
  itemsPerSlide?: 1 | 2;
  className?: string;
  offers: LatestOffer[];
}

const OffersCarousel = ({
  itemsPerSlide = 2,
  className,
  offers,
}: OffersCarouselProps) => {
  const locale = useLocale();



  const isRtl = locale === "ar";
  const basisClass = itemsPerSlide === 1 ? "basis-full" : "basis-1/2";
  return (
    <div className="mt-6">
      <Carousel
        lang={locale}
        opts={{
          align: "start",
          direction: isRtl ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <CarouselContent>
          {offers.map((offer) => (
            <CarouselItem key={offer.offerId} className={basisClass}>
              <div className="p-1">
                <Card className="p-0 m-0 rounded-2xl overflow-hidden">
                  <CardContent
                    className={cn(
                      "flex h-72 items-center justify-center relative",
                      className
                    )}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${offer.image}`}
                      alt={offer.arabicName}
                      fill
                      className="object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex items-center justify-center gap-4 mt-4">
          <CarouselPrevious />
          <CarouselDots />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default OffersCarousel;
