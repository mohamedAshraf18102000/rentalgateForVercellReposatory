import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import Image from "next/image";
import PartnersIcon from "../../../../../public/successPartners/PartnersIcon";

const SuccessPartners = () => {
  return (
    <WrapperContainer className="flex gap-10 h-64 my-10">
      <div className="w-1/3 relative rounded-2xl overflow-hidden">
        <Image
          src="/successPartners/frame1.png"
          alt="frame1"
          fill
          className="object-fill"
        />

        <div className="absolute top-0 right-0 z-40 text-white  p-4 w-full h-full">
          <div className="flex items-center gap-2">
            <PartnersIcon />
            <h5 className="font-extrabold text-3xl">شركائنا في النجاح</h5>
          </div>
          <p className="text-lg w-1/2 mt-2">
            نجاحنا لا يكتمل إلا بشركائنا الذين نعتز بثقتهم وتعاونهم
          </p>
        </div>
      </div>
      <div className="w-2/3 relative rounded-2xl overflow-hidden">
        <div className="relative w-full h-full mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <Image
            src="/successPartners/frame21.png"
            alt="frame2"
            fill
            className="object-fill"
          />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default SuccessPartners;
