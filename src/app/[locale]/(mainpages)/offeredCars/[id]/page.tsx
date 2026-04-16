import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import BookingsPanner from "../../bookings/components/BookingsPanner";
import OfferedCars from "../components/offeredCars";
import OfferedCarsBreadCrump from "../components/OfferedCarsBreadCrump";

const BookingsPage = () => {
  return (
    <WrapperContainer exceedNav>
      <div className="flex flex-col gap-4 sm:gap-6">
        <BookingsPanner />
        <OfferedCarsBreadCrump />
        <OfferedCars />
      </div>
    </WrapperContainer>
  );
};

export default BookingsPage;
