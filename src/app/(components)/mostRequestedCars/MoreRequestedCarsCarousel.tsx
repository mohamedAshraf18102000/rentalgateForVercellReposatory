import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/app/(components)/ui/carousel";
import { useLocale } from "next-intl";
import CarsCard from "../customCards/CarsCard/CarsCard";

const MoreRequestedCarsCarousel = () => {
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
        <CarouselContent className="py-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/4">
              <CarsCard />
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

export default MoreRequestedCarsCarousel;
