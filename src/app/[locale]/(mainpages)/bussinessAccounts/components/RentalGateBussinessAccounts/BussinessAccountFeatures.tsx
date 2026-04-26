import ShieldRight from "@/constants/icons/ShieldRight";
import { Separator } from "@base-ui/react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

const featurePoints = [
  {
    title: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر ",
  },
  {
    title: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر ",
  },
  {
    title: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر ",
  },
  {
    title: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر ",
  },
];

const BussinessAccountFeatures = () => {
  const t = useTranslations("companyQuotation");

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="bg-primary w-fit rounded-[8px] p-2 sm:p-2.5 md:p-3">
          <Sparkles color="#FFF" className="size-4 sm:size-5 md:size-6" />
        </div>
        <p className="text-lg font-bold sm:text-xl md:text-2xl">
          {t("businessAccount.featuresTitle")}
        </p>
      </div>
      <Separator className="my-3! bg-[#E3ECED] sm:my-4!" />
      {featurePoints.map((item, index) => (
        <div
          key={index}
          className="mt-4 flex items-start gap-2 sm:mt-5 md:mt-6"
        >
          <span className="mt-1 shrink-0 scale-90 sm:scale-100">
            <ShieldRight />
          </span>
          <p className="text-sm leading-7 text-Grey600 sm:text-base md:text-lg">
            {item.title}
          </p>
        </div>
      ))}
    </>
  );
};

export default BussinessAccountFeatures;
