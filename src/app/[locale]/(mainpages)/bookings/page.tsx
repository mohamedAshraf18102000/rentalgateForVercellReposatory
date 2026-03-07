import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import BookingsPanner from "./components/BookingsPanner";
import BookingBreadCrump from "./components/BookingBreadCrump";
import BookCars from "./components/BookCars/BookCars";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <BookingsPanner />
      <BookingBreadCrump />
      <BookCars />
    </WrapperContainer>
  );
};

export default page;
