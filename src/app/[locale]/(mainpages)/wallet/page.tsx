import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import UserReferal from "../userProfile/components/UserReferal";
import { OwnedOffersStatus } from "./components/OwnedOffersStatus";
import WalletInfo from "./components/WalletInfo";
import WalletTransactions from "./components/WalletTransactions";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <section className="w-full grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl flex flex-col">
          <WalletInfo />
          <OwnedOffersStatus value="all" />
        </div>
        <UserReferal />
      </section>

      <WalletTransactions />
    </WrapperContainer>
  );
};

export default page;
