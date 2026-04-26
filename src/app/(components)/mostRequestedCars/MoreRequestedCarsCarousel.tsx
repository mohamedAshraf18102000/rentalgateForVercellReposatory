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
import { type CarCardData } from "@/constants/api";

interface MoreRequestedCarsCarouselProps {
  cars: CarCardData[];
}

const MoreRequestedCarsCarousel = ({
  cars,
}: MoreRequestedCarsCarouselProps) => {
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
          {cars.map((car) => (
            <CarouselItem key={car.id} className="basis-1/4">
              <CarsCard
                carImage={car.image}
                carName={car.title}
                carBrand={car.brandName || car.categoryEn || car.category}
                companyLogo="/logos/company-logo.png"
                companyName="Rental Gate"
                freeKm={car.mileage}
                carPrice={car.currentPrice}
                priceBeforeOffer={car.oldPrice}
                firstBadgeTitle={car.hasDiscount ? "Offer" : undefined}
                firstBadgeColor={car.hasDiscount ? "green" : undefined}
                showTax
              />
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
