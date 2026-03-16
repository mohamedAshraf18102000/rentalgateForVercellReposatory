"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import CarsDetailsBreadCrump from "../components/CarsDetailsBreadCrump";
import CarDetailsCard from "@/app/(components)/customCards/CarsCard/CarDetailsCard";
import ServiceCard from "@/app/(components)/customCards/ServiceCard";
import Panner from "../components/panner/Panner";
import { useQuery } from "@tanstack/react-query";
import { getCompanyCarsByID } from "@/services/companyCars/carById.service";
import { useParams } from "next/navigation";
import { getCarServices } from "@/services/companyCars/carServices.service";
import { Skeleton } from "@/app/(components)/ui/skeleton";

const page = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["company-cars-id", id],
    queryFn: () => getCompanyCarsByID(Number(id)),
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["company-cars-services", id],
    queryFn: () => getCarServices(Number(id)),
  });

  console.log("services", services);

  console.log(data);

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
      </WrapperContainer>
    );

  return (
    <WrapperContainer exceedNav>
      <CarsDetailsBreadCrump />
      <CarDetailsCard
        car={data?.car}
        company={data?.company}
        extraKmPrice={data?.extraKmPrice}
        unlimitedKm={data?.unlimitedKm}
      />
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
      <Panner />
    </WrapperContainer>
  );
};

export default page;
