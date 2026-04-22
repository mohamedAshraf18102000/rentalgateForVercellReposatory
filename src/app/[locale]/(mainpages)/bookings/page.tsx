import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import BookingsPanner from "./components/BookingsPanner";
import BookingBreadCrump from "./components/BookingBreadCrump";
import BookCars from "./components/BookCars/BookCars";
import { HomePickUpDialog } from "../../(dialogs)/PickupDialog/HomePickUpDialog";

const BookingsPage = () => {
  return (
    <WrapperContainer exceedNav>
      <div className="flex flex-col gap-4 sm:gap-6">
        <BookingsPanner />
        <BookingBreadCrump />
        <BookCars />
        <HomePickUpDialog />
      </div>
    </WrapperContainer>
  );
};

export default BookingsPage;
