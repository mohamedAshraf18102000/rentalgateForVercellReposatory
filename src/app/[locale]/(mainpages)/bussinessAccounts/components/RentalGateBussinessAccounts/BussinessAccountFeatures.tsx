import ShieldRight from "@/constants/icons/ShieldRight";
import { Separator } from "@base-ui/react";
import { Sparkles } from "lucide-react";

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
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="bg-primary p-3 w-fit rounded-[8px]">
          <Sparkles color="#FFF" />
        </div>
        <p className="font-bold text-2xl">المميزات</p>
      </div>
      <Separator className="my-4! bg-[#E3ECED]" />
      {featurePoints.map((item, index) => (
        <div key={index} className="flex items-start mt-6 gap-2">
          <ShieldRight />
          <p className="text-lg text-Grey600">{item.title}</p>
        </div>
      ))}
    </>
  );
};

export default BussinessAccountFeatures;
