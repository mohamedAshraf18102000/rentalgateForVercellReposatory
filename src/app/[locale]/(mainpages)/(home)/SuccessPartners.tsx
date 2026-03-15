"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import Image from "next/image";
import PartnersIcon from "../../../../constants/icons/PartnersIcon";
import SuccessPartnersMerquee from "@/app/(components)/home/SuccessPartnersMerquee";
import { useHomeStore } from "@/lib/stores/useHomeStore";

const SuccessPartners = () => {
  const partners = useHomeStore((state) => state.data?.companies);
  const displayPartners = partners || [];


  return (
    <WrapperContainer className="flex gap-10 h-64 my-10">
      <div className="w-1/3 relative rounded-2xl overflow-hidden">
        <Image
          src="/successPartners/frame1.png"
          alt="frame1"
          fill
          className="object-fill"
        />

        <div className="absolute top-0 right-0 z-40 text-white p-4 w-full h-full">
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
        <SuccessPartnersMerquee partners={displayPartners} />
      </div>

    </WrapperContainer>
  );
};

export default SuccessPartners;
