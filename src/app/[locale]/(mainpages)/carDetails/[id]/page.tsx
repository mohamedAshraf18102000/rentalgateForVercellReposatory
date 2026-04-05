"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import CarsDetailsBreadCrump from "../components/CarsDetailsBreadCrump";
import ServiceCard from "@/app/(components)/customCards/ServiceCard";
import Panner from "../components/panner/Panner";
import { useQuery } from "@tanstack/react-query";
import { getCompanyCarsByID } from "@/services/companyCars/carById.service";
import { useParams } from "next/navigation";
import { getCarServices } from "@/services/companyCars/carServices.service";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import { useEffect, useMemo } from "react";
import { calculateDiscount } from "@/lib/utils/calculateDiscount";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import CarDetailsCard from "@/app/(components)/customCards/CarsCard/CarDetailsCard";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import {
  calculateRentalPrice,
  PricingType,
} from "@/lib/utils/calculateRentalPrice";
import DriverCard from "@/app/(components)/customCards/DriverCard";

const pricingTypeLabels: Record<PricingType, string> = {
  DAILY: "يومي",
  WEEKLY: "أسبوعي",
  HALF_MONTHLY: "نصف شهري",
  MONTHLY: "شهري",
  YEARLY: "سنوي",
};

const page = () => {
  const { id } = useParams();
  const setCarDetails = useBookedCarDetailsStore((s) => s.setCarDetails);
  const setFormData = useBookedCarDetailsStore((s) => s.setFormData);
  const setServices = useBookedCarDetailsStore((s) => s.setServices);
  const { filters } = useUserPreferedFiltersStore();

  const { data, isLoading } = useQuery({
    queryKey: ["company-cars-id", id],
    queryFn: () => getCompanyCarsByID(Number(id)),
  });

  useEffect(() => {
    if (data) {
      setCarDetails(data);
      setFormData({
        company_id: data.company.companyId,
        carDetails: {
          unlimitedKm: data.unlimitedKm,
          unlimitedKmPrice: data.unlimitedKmPrice,
          ccbId: data.ccbId,
        },
      });
    }
  }, [data, setCarDetails, setFormData]);

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["company-cars-services", id],
    queryFn: () => getCarServices(Number(id)),
  });

  useEffect(() => {
    if (services) {
      setServices(services);
    }
  }, [services, setServices]);

  const rentalDays = useMemo(() => {
    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      const diffTime = Math.abs(to.getTime() - from.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [filters.fromDate, filters.toDate]);

  const pricing = useMemo(() => {
    const effectiveDays = rentalDays > 0 ? rentalDays : 1;
    return calculateRentalPrice({
      days: effectiveDays,
      dailyPrice: data?.dailyPrice ?? 0,
      weeklyPrice: data?.weeklyPrice ?? 0,
      halfMonthlyPrice: data?.halfMonthPrice ?? 0,
      monthlyPrice: data?.monthlyPrice ?? 0,
      yearlyPrice: data?.yearlyPrice ?? 0,
      offerDailyPrice: data?.offerDailyPrice ?? 0,
      offerWeeklyPrice: data?.offerWeeklyPrice ?? 0,
      offerHalfMonthlyPrice: data?.offerHalfMonthPrice ?? 0,
      offerMonthlyPrice: data?.offerMonthlyPrice ?? 0,
      offerYearlyPrice: data?.offerYearlyPrice ?? 0,
    });
  }, [data, rentalDays]);

  const originalPricing = useMemo(() => {
    const effectiveDays = rentalDays > 0 ? rentalDays : 1;
    return calculateRentalPrice({
      days: effectiveDays,
      dailyPrice: data?.dailyPrice ?? 0,
      weeklyPrice: data?.weeklyPrice ?? 0,
      halfMonthlyPrice: data?.halfMonthPrice ?? 0,
      monthlyPrice: data?.monthlyPrice ?? 0,
      yearlyPrice: data?.yearlyPrice ?? 0,
      offerDailyPrice: 0,
      offerWeeklyPrice: 0,
      offerHalfMonthlyPrice: 0,
      offerMonthlyPrice: 0,
      offerYearlyPrice: 0,
    });
  }, [data, rentalDays]);

  const pricingType = pricing.pricingType;

  const { discountPercentage } = useMemo(
    () =>
      calculateDiscount({
        originalPrice:
          pricingType === "DAILY"
            ? (data?.dailyPrice ?? 0)
            : pricingType === "WEEKLY"
              ? (data?.weeklyPrice ?? 0)
              : pricingType === "HALF_MONTHLY"
                ? (data?.halfMonthPrice ?? 0)
                : pricingType === "MONTHLY"
                  ? (data?.monthlyPrice ?? 0)
                  : (data?.yearlyPrice ?? 0),
        offerPrice:
          pricingType === "DAILY"
            ? (data?.offerDailyPrice ?? 0)
            : pricingType === "WEEKLY"
              ? (data?.offerWeeklyPrice ?? 0)
              : pricingType === "HALF_MONTHLY"
                ? (data?.offerHalfMonthPrice ?? 0)
                : pricingType === "MONTHLY"
                  ? (data?.offerMonthlyPrice ?? 0)
                  : (data?.offerYearlyPrice ?? 0),
      }),
    [pricingType, data],
  );

  const discountBadge =
    discountPercentage > 0
      ? `خصم ${discountPercentage}% - ${pricingTypeLabels[pricingType]}`
      : "";

  if (isLoading || !data)
    return (
      <WrapperContainer exceedNav>
        <Skeleton className="h-[50px] w-full rounded-2xl mt-5" />
        <Skeleton className="h-[500px] w-full rounded-2xl mt-5" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[100px] w-full rounded-2xl mt-5"
            />
          ))}
        </div>
        <Skeleton className="h-[600px] w-full rounded-2xl mt-5" />
      </WrapperContainer>
    );

  return (
    <WrapperContainer exceedNav>
      <CarsDetailsBreadCrump />
      <div className="mt-10">
        <CarDetailsCard
          car={data?.car}
          company={data?.company}
          extraKmPrice={data?.extraKmPrice}
          unlimitedKm={data?.unlimitedKm}
          ccbId={data.ccbId}
          carPrice={pricing.pricePerDay}
          priceBeforeOffer={originalPricing.pricePerDay}
          originalPrice={originalPricing.pricePerDay}
          firstBadgeTitle={discountBadge}
          firstBadgeColor="green"
          pricingType={pricingType}
          totalPrice={pricing.totalPrice}
          originalTotalPrice={originalPricing.totalPrice}
          rentalDays={rentalDays}
        />
      </div>

      {services && services.length > 0 && (
        <div className="my-8 grid grid-cols-4 gap-4">
          <h3 className="col-span-4 font-bold text-2xl my-4">
            الخدمات المقدمة
          </h3>
          {services?.map((service) => (
            <ServiceCard key={service.csId} service={service} />
          ))}
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        <DriverCard
          image={"/driver/driverImage.png"}
          serviceName={"خدمة سائق"}
          status={data?.company?.driverServiceOutside === "active"}
          badgeTitle={"خارج المدينة"}
        />

        <DriverCard
          image={"/driver/driverImage.png"}
          serviceName={"خدمة سائق"}
          status={data?.company?.driverService === "active"}
          badgeTitle={"داخل المدينة"}
        />
      </div>
      <Panner />
    </WrapperContainer>
  );
};

export default page;
