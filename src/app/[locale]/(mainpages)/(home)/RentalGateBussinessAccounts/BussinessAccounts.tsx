import { Separator } from "@/app/(components)/ui/separator";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import ShieldRight from "@/constants/icons/ShieldRight";
import { Sparkles } from "lucide-react";
import BussinessAccountForm from "./BussinessAccountForm";

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

const BussinessAccounts = () => {
  return (
    <WrapperContainer>
      <h4 className="text-3xl font-bold my-6 text-center">
        رينتال جيت لحساب الأعمال{" "}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div className=" rounded-2xl border-2  border-white">
          <div className=" bg-[url(/bussinesAccounts/img1.png)] bg-cover p-6">
            <div className=" w-1/2">
              <h6 className="font-bold text-2xl">ماهو حساب الأعمال🤔؟!!</h6>
              <p className="text-lg mt-3">
                هو حساب مصمم خصيصًا للشركات وأصحاب الأعمال
              </p>
              <BussinessAccountForm />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl">
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
        </div>
      </div>
    </WrapperContainer>
  );
};

export default BussinessAccounts;
