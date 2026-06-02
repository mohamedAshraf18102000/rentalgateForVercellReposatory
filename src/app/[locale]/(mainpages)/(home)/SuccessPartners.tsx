import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import Image from "next/image";
import PartnersIcon from "../../../../constants/icons/PartnersIcon";
import { Company } from "@/types/home/home";
import SuccessPartnersMerquee from "@/app/(components)/home/SuccessPartnersMerquee";
import { useTranslations } from "next-intl";

const SuccessPartners = ({ companiesData }: { companiesData: Company[] }) => {
  const t = useTranslations("home");
  const displayPartners = companiesData || [];

  return (
    <WrapperContainer className="flex flex-col lg:flex-row gap-6 lg:gap-10 h-auto lg:h-72 my-10 px-4 md:px-0">
      <div className="w-full lg:w-1/3 min-h-[220px] lg:h-full relative rounded-2xl overflow-hidden shadow-xl">
        <Image
          src="/successPartners/frame1.png"
          alt="frame1"
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover"
        />

        <div className="absolute inset-0 z-40 text-white p-6 md:p-8 flex flex-col justify-center items-start">
          <div className="flex items-center gap-3">
            <PartnersIcon />
            <h5 className="font-extrabold text-2xl md:text-3xl lg:text-4xl">
              {t("successPartners.title")}
            </h5>
          </div>
          <p className="text-sm md:text-base lg:text-lg w-full md:w-3/4 mt-3 opacity-90 leading-relaxed">
            {t("successPartners.description")}
          </p>
        </div>
      </div>
      <div className="w-full lg:w-2/3 h-[220px] lg:h-full relative rounded-2xl overflow-hidden flex flex-col">
        <SuccessPartnersMerquee partners={displayPartners} />
      </div>
    </WrapperContainer>
  );
};

export default SuccessPartners;
