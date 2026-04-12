import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import MyBookingsBreadCrump from "./components/MyBookingsBreadCrump";
import UserBookingsDetails from "./components/UserBookingsDetails";

const page = () => {
  return (
    <WrapperContainer exceedNav className="min-w-0 max-w-full pb-8 sm:pb-10">
      <MyBookingsBreadCrump />
      <UserBookingsDetails />
    </WrapperContainer>
  );
};

export default page;
