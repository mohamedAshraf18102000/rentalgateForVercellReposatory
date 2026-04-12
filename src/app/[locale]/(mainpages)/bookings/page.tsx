import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import BookingsPanner from "./components/BookingsPanner";
import BookingBreadCrump from "./components/BookingBreadCrump";
import BookCars from "./components/BookCars/BookCars";

const BookingsPage = () => {
  return (
    <WrapperContainer exceedNav>
      <div className="flex flex-col gap-4 sm:gap-6">
        <BookingsPanner />
        <BookingBreadCrump />
        <BookCars />
      </div>
    </WrapperContainer>
  );
};

export default BookingsPage;
