import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import MyBookingsBreadCrump from "./components/MyBookingsBreadCrump";
import UserBookingsDetails from "./components/UserBookingsDetails";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <MyBookingsBreadCrump />
      <UserBookingsDetails />
    </WrapperContainer>
  );
};

export default page;
