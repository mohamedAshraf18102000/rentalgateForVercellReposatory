import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import CarsDetailsBreadCrump from "../components/CarsDetailsBreadCrump";
import CarDetailsCard from "@/app/(components)/customCards/CarsCard/CarDetailsCard";
import HomeMockups from "../../(home)/HomeMockups";
import ServiceCard from "@/app/(components)/customCards/ServiceCard";
import Image from "next/image";
import { cn } from "@/lib/utils";
import GooglePlay_AppStore from "@/app/(components)/getOnGooglePlay_AppStore/GooglePlay_AppStore";
import Panner from "../components/panner/Panner";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <CarsDetailsBreadCrump />
      <CarDetailsCard />
      <div className="my-8 grid grid-cols-4 gap-4">
        <h3 className="col-span-4 font-bold text-2xl my-4">الخدمات المقدمة</h3>
        {Array.from({ length: 5 }).map((_, index) => (
          <ServiceCard key={index} />
        ))}
      </div>
      <Panner />
    </WrapperContainer>
  );
};

export default page;
