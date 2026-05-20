import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CustomCarouselDots,
} from "@/app/(components)/ui/carousel";
import { Banner } from "@/types/home/home";
import { normalizeImageUrl } from "@/util";

const sliderHeightClass =
  "h-[min(42svh,22rem)] min-h-[12.5rem] " +
  "sm:h-[500px] md:h-screen lg:h-screen xl:h-screen 2xl:h-screen";

const HomeSlider = ({ bannersData }: { bannersData: Banner[] }) => {
  return (
    <section dir="ltr" className="w-full">
      <div className={`relative w-full overflow-hidden ${sliderHeightClass}`}>
        <Carousel
          className="h-full w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className={`ml-0 ${sliderHeightClass}`}>
            {bannersData?.map((image: any, index: number) => (
              <CarouselItem key={index} className="relative h-full pl-0">
                <div className="relative h-full w-full">
                  <Image
                    src={normalizeImageUrl(image.image)}
                    alt={image.bannerName}
                    fill
                    sizes="100vw"
                    className="object-cover object-center bg-Grey100/90"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 absolute bottom-7 left-0 w-full">
            <CustomCarouselDots className="py-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default HomeSlider;
