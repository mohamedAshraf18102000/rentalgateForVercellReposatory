import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import BussinessAccountsContent from "../BussinessAccountsContent";

const BussinessAccounts = () => {
  return (
    <WrapperContainer>
      <h4 className="text-3xl font-bold my-6 text-center">
        رينتال جيت لحساب الأعمال
      </h4>
      <BussinessAccountsContent withOutStepper={true} />
    </WrapperContainer>
  );
};

export default BussinessAccounts;
