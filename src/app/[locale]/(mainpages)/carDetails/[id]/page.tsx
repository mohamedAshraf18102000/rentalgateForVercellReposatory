import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import CarsDetailsBreadCrump from "../components/CarsDetailsBreadCrump";
import CarDetailsCard from "@/app/(components)/customCards/CarsCard/CarDetailsCard";
import HomeMockups from "../../(home)/HomeMockups";
import ServiceCard from "@/app/(components)/customCards/ServiceCard";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <CarsDetailsBreadCrump />
      <CarDetailsCard />
      <div className="bg-red-400 my-8 grid grid-cols-4">
        <ServiceCard />
      </div>
      <HomeMockups />
    </WrapperContainer>
  );
};

export default page;
