"use client";
import FavCategoryComponent from "@/app/(components)/rentalBooking/FavCategory/FavCategoryComponent";
import RentPeriodComponent from "@/app/(components)/rentalBooking/RentPeriod/RentPeriodComponent";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";

const RentalBookingSearchSection = () => {
  return (
    <WrapperContainer>
      <div className="w-3/4 mx-auto h-[500px]  my-8 grid grid-cols-2 gap-16">
        <RentPeriodComponent value="daily" onValueChange={() => {}} />
        <FavCategoryComponent value="small" onValueChange={() => {}} />
      </div>
    </WrapperContainer>
  );
};

export default RentalBookingSearchSection;
