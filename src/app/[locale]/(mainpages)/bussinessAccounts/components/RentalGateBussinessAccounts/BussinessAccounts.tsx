import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import ResponsiblePersonForm from "./forms/ResponsiblePersonForm";
import BussinessAccountFeatures from "./BussinessAccountFeatures";

const BussinessAccounts = () => {
  return (
    <WrapperContainer>
      <h4 className="text-3xl font-bold my-6 text-center">
        رينتال جيت لحساب الأعمال{" "}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border-2 border-white overflow-hidden">
          <div className=" bg-[url(/bussinesAccounts/img1.png)] bg-cover p-6">
            <div className=" w-1/2">
              <h6 className="font-bold text-2xl">ماهو حساب الأعمال🤔؟!!</h6>
              <p className="text-lg mt-3">
                هو حساب مصمم خصيصًا للشركات وأصحاب الأعمال
              </p>
              <ResponsiblePersonForm />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <BussinessAccountFeatures />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default BussinessAccounts;
