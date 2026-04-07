"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { useCalculateQuotePrice } from "@/hooks/api/useCalculateQuotePrice";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { Button } from "@base-ui/react";

const page = () => {
  const formData = useBookedCarDetailsStore((s) => s.formData);
  const { mutate } = useCalculateQuotePrice();
  console.log(formData);

  const handleCalculateQuotePrice = () => {
    // mutate({
    //   startDate: formData.fromDate,
    //   endDate: formData.toDate,
    //   companyCarBranchId: formData.carDetails?.ccbId,
    //   promoCode: formData.promoData?.code,
    //   deliver: {
    //     pickupType: formData.pickupType,
    //     latitude: formData.pickupLat,
    //     longitude: formData.pickupLong,
    //   },
    // });
    console.log({
      companyCarBranchId: formData.carDetails?.ccbId,
      startDate: formData.fromDate,
      endDate: formData.toDate,
      promoCode: formData.promoData?.code,
      referralCode: formData.referalcode,
      deliver: {
        pickupType: formData.pickupType,
        latitude: formData.pickupLat,
        longitude: formData.pickupLong,
      },
      receive: {
        pickupType: formData.returnType,
        latitude: formData.returnLat,
        longitude: formData.returnLong,
      },
      servicesIds: formData.services,
      driver: formData.driver && {
        driverRequested: !!formData.driver,
        outOfCity: formData.driver?.type === "out",
        driverHours: formData.driver?.hours,
        driverDays: formData.driver?.days,
      },
      countryId: 1,
      points: {
        type: formData.points?.type,
        pointsPkId: formData.points?.pointsPkId,
      },
    });
    mutate({
      companyCarBranchId: formData.carDetails?.ccbId ?? null,
      startDate: formData.fromDate ?? null,
      endDate: formData.toDate ?? null,
      promoCode: formData.promoData?.code ?? null,
      referralCode: formData.referalcode ?? null,
      deliver: {
        type: formData.pickupType ?? null,
        latitude: formData.pickupLat ?? null,
        longitude: formData.pickupLong ?? null,
        addressId: formData.carReturnLocationId
          ? Number(formData.carReturnLocationId)
          : null,
      },
      receive: {
        type: formData.returnType ?? null,
        latitude: formData.returnLat ?? null,
        longitude: formData.returnLong ?? null,
        addressId: formData.carReturnLocationId
          ? Number(formData.carReturnLocationId)
          : null,
      },
      servicesIds:
        formData.services && formData.services.length > 0
          ? formData.services
          : null,
      driver: {
        driverRequested: !!formData.driver,
        outOfCity: formData.driver?.type === "out" ? true : false,
        driverHours: formData.driver?.hours ?? null,
        driverDays: formData.driver?.days ?? null,
      },
      points: formData.points?.type
        ? {
            type: formData.points.type,
            pointsPkId: formData.points.pointsPkId ?? null,
          }
        : null,

      extraKm: {
        extraKmApplied: false,
        extraKmType: "UNLIMITED",
        extraKmQuotaId: null,
      },
    });
  };

  const handlelogformdata = () => {
    console.log(formData);
  };

  return (
    <WrapperContainer exceedNav className="bg-red-950 text-white h-[500px]">
      <div className="">page</div>
      <Button onClick={handleCalculateQuotePrice}>Calculate Quote Price</Button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <Button onClick={handlelogformdata}>log form data</Button>
    </WrapperContainer>
  );
};

export default page;
