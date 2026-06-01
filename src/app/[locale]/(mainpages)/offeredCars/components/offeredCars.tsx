"use client";

import { Skeleton } from "@/app/(components)/ui/skeleton";
import CarsGrid from "../../bookings/components/CarsGrid";
import { useGetOfferedCars } from "@/hooks/api/useGetOfferedCars";
import { useParams } from "next/navigation";
import { CarContent } from "@/types/companyCars/cars";
import { OfferCar } from "@/types/offeredCars/offeredCars";
import EmptyState from "@/app/(components)/EmptyState";

const mapOfferCarToCarContent = (
  car: OfferCar,
  offerType: number | null,
  offerValue: number | null,
): CarContent => ({
  ccbId: car.ccbId,
  carNameEn:
    `${car.car.brandNameEnglish} ${car.car.typeNameEnglish} ${car.car.year}`.trim() ||
    car.car.carName,
  carNameAr:
    `${car.car.brandNameArabic} ${car.car.typeNameArabic} ${car.car.year}`.trim() ||
    car.car.carName,
  companyName: car.company.name,
  companyNameAr: car.company.arabicName,
  carImage: car.car.image,
  companyCarCode: car.companyCarCode || "",
  price: car.dailyPrice ?? null,
  companyCarStatus: car.companyCarStatus || "",
  ccId: car.ccId ?? 0,
  companyLogo: car.company.logo,
  brandNameEnglish: car.car.brandNameEnglish,
  brandNameArabic: car.car.brandNameArabic,
  typeNameEnglish: car.car.typeNameEnglish,
  typeNameArabic: car.car.typeNameArabic,
  brandName: car.car.brandName,
  typeName: car.car.typeName,
  categoryNameEnglish: car.car.categoryNameEnglish,
  categoryNameArabic: car.car.categoryNameArabic,
  categoryIcon: car.car.categoryIcon,
  year: car.car.year,
  otherSpecs: car.car.otherSpecs || "",
  otherSpecsEnglish: car.car.otherSpecsEnglish || "",
  daysForFreeDelivery: car.daysForFreeDelivery ?? null,
  allowedKm: car.allowedKm ?? null,
  unlimitedKm: car.unlimitedKm ?? null,
  unlimitedKmPrice: car.unlimitedKmPrice ?? null,
  deliveryInMinutes: null,
  totalBranches: null,
  totalCarsInBranches: null,
  dailyPrice: car.dailyPrice ?? null,
  offerDailyPrice: car.offerDailyPrice ?? null,
  weeklyPrice: car.weeklyPrice ?? null,
  offerWeeklyPrice: car.offerWeeklyPrice ?? null,
  halfMonthPrice: car.halfMonthPrice ?? null,
  offerHalfMonthPrice: car.offerHalfMonthPrice ?? null,
  monthlyPrice: car.monthlyPrice ?? null,
  offerMonthlyPrice: car.offerMonthlyPrice ?? null,
  yearlyPrice: car.yearlyPrice ?? null,
  offerYearlyPrice: car.offerYearlyPrice ?? null,
  serviceIds: car.serviceIds || [],
  offerType: offerType?.toString() ?? null,
  offerValue,
  categoryName: car.car.categoryName,
  branchId: car.branchId,
  branchName: car.branchName ?? null,
  branchEnglishName: car.branchEnglishName ?? null,
  branchArabicName: car.branchArabicName ?? null,
});

const OfferedCars = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetOfferedCars(Number(id));
  const cars: CarContent[] = (data?.cars ?? []).map((car) =>
    mapOfferCarToCarContent(
      car,
      data?.offerType ?? null,
      data?.offerValue ?? null,
    ),
  );

  return (
    <section className="mt-6">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[450px] rounded-2xl" />
          ))}
        </div>
      ) : cars.length > 0 ? (
        <>
          <CarsGrid cars={cars} isLoading={isLoading} rentalDays={0} />
        </>
      ) : (
        <EmptyState
          title="لا توجد سيارات حالياً"
          description="لا توجد سيارات حالياً"
        />
      )}
    </section>
  );
};

export default OfferedCars;
