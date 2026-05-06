import FavCategoryComponent from "@/app/(components)/rentalBooking/FavCategory/FavCategoryComponent";
import RentPeriodComponent from "@/app/(components)/rentalBooking/RentPeriod/RentPeriodComponent";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { HomeResponse } from "@/types/home/home";

const RentalBookingSearchSection = ({
  homeData,
}: {
  homeData: HomeResponse | null;
}) => {
  return (
    <WrapperContainer className="my-10 md:my-16">
      <div className="w-full max-w-6xl mx-auto min-h-[500px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-4 md:px-0">
        <RentPeriodComponent />
        <FavCategoryComponent categories={homeData?.carCategories ?? []} />
      </div>
    </WrapperContainer>
  );
};

export default RentalBookingSearchSection;
