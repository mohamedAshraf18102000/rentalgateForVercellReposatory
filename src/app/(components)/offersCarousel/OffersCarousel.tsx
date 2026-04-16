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
import { LatestOffer, TodaysOffer } from "@/types/home/home";

interface OffersCarouselProps {
  itemsPerSlide?: 1 | 2;
  className?: string;
  offers: TodaysOffer[] | LatestOffer[];
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
                      "flex h-80 items-center justify-center relative px-0! py-0!",
                      className,
                    )}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${offer.image}`}
                        alt={offer.arabicName}
                        fill
                        className="object-cover"
                      />

                      <div className="absolute w-full h-full bg-black/50 flex items-center">
                        <div className="flex flex-col items-start justify-center w-[90%] mx-auto">
                          <p className="text-white text-3xl font-bold">
                            {offer.arabicName}
                          </p>
                          <p className="text-white text-lg font-bold mt-5">
                            {"detailsArabic" in offer
                              ? offer.detailsArabic
                              : offer.offerCarsDescription}
                          </p>
                        </div>
                      </div>
                    </div>
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
