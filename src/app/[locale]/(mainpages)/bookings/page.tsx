import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import BookingsPanner from "./components/BookingsPanner";
import BookingBreadCrump from "./components/BookingBreadCrump";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <BookingsPanner />
      <BookingBreadCrump />
    </WrapperContainer>
  );
};

export default page;
