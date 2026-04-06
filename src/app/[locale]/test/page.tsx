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
      companyCarBranchId: formData.carDetails?.ccbId,
      startDate: formData.fromDate,
      endDate: formData.toDate,
      ...(formData.promoData?.code && { promoCode: formData.promoData.code }),
      ...(formData.referalcode && { referralCode: formData.referalcode }),
      deliver: {
        type: formData.pickupType,
        ...(formData.pickupLat && { latitude: formData.pickupLat }),
        ...(formData.pickupLong && { longitude: formData.pickupLong }),
        ...(formData.pickupId && { addressId: formData.pickupId }),
      },
      receive: {
        type: formData.returnType,
        ...(formData.returnLat && { latitude: formData.returnLat }),
        ...(formData.returnLong && { longitude: formData.returnLong }),
        ...(formData.carReturnLocationId && {
          addressId: formData.carReturnLocationId,
        }),
      },
      ...(formData.services &&
        formData.services.length > 0 && { servicesIds: formData.services }),
      ...(formData.driver && {
        driver: {
          driverRequested: !!formData.driver,
          outOfCity: formData.driver?.type === "out",
          driverHours: formData.driver?.hours,
          driverDays: formData.driver?.days,
        },
      }),
      countryId: 1,
      ...(formData.points?.type && {
        points: {
          type: formData.points.type,
          pointsPkId: formData.points.pointsPkId,
        },
      }),
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
