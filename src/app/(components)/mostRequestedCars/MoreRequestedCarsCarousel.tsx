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
import { useRouter } from "next/navigation";
import { type LastSeen } from "@/types/home/home";

interface MoreRequestedCarsCarouselProps {
  data: LastSeen[];
}

const MoreRequestedCarsCarousel = ({
  data,
}: MoreRequestedCarsCarouselProps) => {
  const locale = useLocale();
  const router = useRouter();
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
          {data.map((item) => {
            const car = item.companyCarBranch.car;
            const branch = item.companyCarBranch;
            const hasDiscount =
              Boolean(branch.offerDailyPrice) &&
              branch.offerDailyPrice < branch.dailyPrice;

            return (
              <CarouselItem key={item.historyId} className="basis-1/4">
                <CarsCard
                  onClick={() => {
                    router.push(`/carDetails/${item.companyCarBranch.ccbId}`);
                  }}
                  carImage={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${car.image}`}
                  carName={`${car.brandName} ${car.typeName} ${car.year}`}
                  carBrand={car.brandName || car.categoryNameEnglish}
                  companyLogo={branch.company.logo}
                  companyName={branch.company.name}
                  freeKm={branch.allowedKm}
                  carPrice={
                    hasDiscount ? branch.offerDailyPrice : branch.dailyPrice
                  }
                  priceBeforeOffer={branch.dailyPrice}
                  firstBadgeTitle={hasDiscount ? "Offer" : undefined}
                  firstBadgeColor={hasDiscount ? "green" : undefined}
                  showTax
                />
              </CarouselItem>
            );
          })}
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
