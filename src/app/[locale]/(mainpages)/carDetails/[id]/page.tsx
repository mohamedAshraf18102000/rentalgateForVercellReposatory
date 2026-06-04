"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import CarsDetailsBreadCrump from "../components/CarsDetailsBreadCrump";
import ServiceCard from "@/app/(components)/customCards/ServiceCard";
import Panner from "../components/panner/Panner";
import { useQuery } from "@tanstack/react-query";
import { getCompanyCarsByID } from "@/services/companyCars/carById.service";
import { addCarToHistory } from "@/services/companyCars/addCarToHistory.service";
import { useParams } from "next/navigation";
import { getCarServices } from "@/services/companyCars/carServices.service";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import { useEffect, useMemo } from "react";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import type { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";
import { initialLocationSlice } from "@/lib/booking/normalizeReservationFormData";
import CarDetailsCard from "@/app/(components)/customCards/CarsCard/CarDetailsCard";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { calculateRentalPrice } from "@/lib/utils/calculateRentalPrice";
import DriverCard from "@/app/(components)/customCards/DriverCard";
import { useTranslations } from "next-intl";
import OffersCard from "@/app/(components)/customCards/OffersCard";
import KMPackageCard from "@/app/(components)/customCards/KMPackageCard";
import type { ServiceCardBase } from "@/types/companyCars/carServices";
import { Info } from "lucide-react";

const page = () => {
  const t = useTranslations("carDetails");
  const { id } = useParams();
  const setCarDetails = useBookedCarDetailsStore((s) => s.setCarDetails);
  const setFormData = useBookedCarDetailsStore((s) => s.setFormData);
  const setServices = useBookedCarDetailsStore((s) => s.setServices);
  const setAirports = useBookedCarDetailsStore((s) => s.setAirports);
  const setTrainStations = useBookedCarDetailsStore((s) => s.setTrainStations);
  const showPricesWithTax = useBookedCarDetailsStore(
    (s) => s.showPricesWithTax,
  );
  const { filters } = useUserPreferedFiltersStore();

  const { data, isLoading } = useQuery({
    queryKey: ["company-cars-id", id],
    queryFn: () => getCompanyCarsByID(Number(id)),
  });

  console.log("data", data);

  useEffect(() => {
    if (id == null || id === "") return;
    const ccbId = Number(id);
    if (Number.isNaN(ccbId)) return;
    void addCarToHistory({ ccbId }).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (data) {
      setCarDetails(data);
      setAirports(data.airports ?? []);
      setTrainStations(data.trainStations ?? []);

      const previousCcbId =
        useBookedCarDetailsStore.getState().formData.carDetails?.ccbId;
      const metadata: Partial<ReservationFormData> = {
        company_id: data.company.companyId,
        branchId: data.branchId,
        carDetails: {
          unlimitedKm: data.unlimitedKm,
          unlimitedKmPrice: data.unlimitedKmPrice ?? 0,
          ccbId: data.ccbId,
        },
      };

      if (previousCcbId !== data.ccbId) {
        setFormData({
          ...metadata,
          ...initialLocationSlice(),
        });
      } else {
        setFormData(metadata);
      }
    }
  }, [data, setCarDetails, setFormData, setAirports, setTrainStations]);

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

  if (isLoading || !data)
    return (
      <WrapperContainer exceedNav>
        <Skeleton className="h-[50px] w-full rounded-2xl mt-5" />
        <Skeleton className="h-[500px] w-full rounded-2xl mt-5" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    <>
      <WrapperContainer exceedNav className="sm:w-[75%]">
        <CarsDetailsBreadCrump />
        <div className="mt-10">
          <CarDetailsCard
            daysForFreeDelivery={data?.daysForFreeDelivery}
            rate={data?.company?.averageRating ?? 0}
            workingTime={data?.workingHours}
            dailyPrice={data?.dailyPrice}
            freeKm={data.allowedKm}
            car={data?.car}
            company={data?.company}
            specifications={data.specifications ?? []}
            extraKmPrice={data?.extraKmPrice}
            unlimitedKm={data?.unlimitedKm}
            unlimitedKmPrice={data?.unlimitedKmPrice ?? 0}
            ccbId={data.ccbId}
            carPrice={pricing.pricePerDay}
            priceBeforeOffer={originalPricing.pricePerDay}
            originalPrice={originalPricing.pricePerDay}
            pricingType={pricingType}
            totalPrice={pricing.totalPrice}
            originalTotalPrice={originalPricing.totalPrice}
            rentalDays={rentalDays}
            showRating={data.showRating}
            showTax={showPricesWithTax}
          />
        </div>

        <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services && services.length > 0 && (
            <h3 className="col-span-1 my-4 text-xl font-bold sm:col-span-2 lg:col-span-4 lg:text-2xl">
              {t("providedServices")}
            </h3>
          )}

          {(data.insuranceWithDeductible ?? 0) > 0 && (
            <ServiceCard
              key="full-insurance"
              service={{
                price: data.insuranceWithDeductible ?? 0,
                serviceArabicName: t("fullInsuranceWithDeductible"),
                serviceEnglishName: t("fullInsuranceWithDeductible"),
              }}
              showTax={showPricesWithTax}
              extraIcon={
                <Info className="stroke-2 stroke-primary  rounded-full fill-[#FFC971] w-15 h-15" />
              }
            />
          )}

          {services?.map((service) => (
            <ServiceCard
              showTax={showPricesWithTax}
              key={service.csId}
              service={service}
            />
          ))}
          <DriverCard
            image={"/driver/driverImage.png"}
            serviceName={t("driverService")}
            status={data?.company?.driverServiceOutside === "active"}
            badgeTitle={t("driverOutsideCity")}
          />

          <DriverCard
            image={"/driver/driverImage.png"}
            serviceName={t("driverService")}
            status={data?.company?.driverService === "active"}
            badgeTitle={t("driverInsideCity")}
          />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          {(data.offerPackages.length > 0 ||
            data.kilometerPackages.length > 0) && (
            <h3 className="col-span-1 my-4 text-xl font-bold sm:col-span-2 lg:col-span-4 lg:text-xl">
              {t("reservation.stepOne.offersTitle")}
            </h3>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4!">
            {data.offerPackages.map((offer) => (
              <OffersCard key={offer.ccoId} offerPackage={offer} />
            ))}
            {data.kilometerPackages.map((pack) => (
              <KMPackageCard key={pack.cceId} kilometerPackage={pack} />
            ))}
          </div>
        </div>

        <Panner />
      </WrapperContainer>
    </>
  );
};

export default page;
