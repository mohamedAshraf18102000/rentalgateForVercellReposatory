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

const OffersCarousel = () => {
  const locale = useLocale();

  const isRtl = locale === "ar";
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
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2">
              <div className="p-1">
                <Card className="p-0 m-0 rounded-2xl overflow-hidden">
                  <CardContent className="flex h-72 items-center justify-center relative">
                    <Image
                      src="/panners/offers/img1.png"
                      alt="bgApp2"
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
