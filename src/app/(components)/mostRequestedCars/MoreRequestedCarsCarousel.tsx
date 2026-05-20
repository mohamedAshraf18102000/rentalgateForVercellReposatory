import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/app/(components)/ui/carousel";
import { useLocale, useTranslations } from "next-intl";
import CarsCard from "../customCards/CarsCard/CarsCard";
import { useRouter } from "next/navigation";
import { type LastSeen } from "@/types/home/home";
import { normalizeImageUrl } from "@/util";
import { calculateDiscount } from "@/lib/utils/calculateDiscount";

interface MoreRequestedCarsCarouselProps {
  data: LastSeen[];
}

const MoreRequestedCarsCarousel = ({
  data,
}: MoreRequestedCarsCarouselProps) => {
  const locale = useLocale();
  const t = useTranslations("carDetails");
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
              <CarouselItem
                key={item.historyId}
                className="basis-[90%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <CarsCard
                  className="h-full w-full min-w-0"
                  onClick={() => {
                    router.push(`/carDetails/${item.companyCarBranch.ccbId}`);
                  }}
                  carImage={normalizeImageUrl(car.image)}
                  carName={`${car.brandName} ${car.typeName} ${car.year}`}
                  carBrand={car.brandName || car.categoryNameEnglish}
                  companyLogo={branch.company.logo}
                  companyName={branch.company.name}
                  freeKm={branch.allowedKm}
                  carPrice={
                    hasDiscount ? branch.offerDailyPrice : branch.dailyPrice
                  }
                  priceBeforeOffer={branch.dailyPrice}
                  showTax
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="hidden md:flex items-center justify-center gap-4 mt-4">
          <CarouselPrevious />
          <CarouselDots />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default MoreRequestedCarsCarousel;
