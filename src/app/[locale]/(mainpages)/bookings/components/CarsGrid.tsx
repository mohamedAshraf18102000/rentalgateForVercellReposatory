import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import Link from "next/link";

const CarsGrid = ({ cars, isLoading }: any) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-8 mt-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[450px] rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-8 mt-10">
      {cars.map((car: any) => (
        <Link key={car.ccbId} href={`/carDetails/${car.ccbId}`}>
          <CarsCard
            carImage={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${car.carImage}`}
            carName={car.carName}
            advancedCard
            carBrand={car.brandName}
            companyLogo={car.companyLogo}
            companyName={car.companyName}
            deliveryInMinutes={car.deliveryInMinutes}
          />
        </Link>
      ))}
    </div>
  );
};

export default CarsGrid;
