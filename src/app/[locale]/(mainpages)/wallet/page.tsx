import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import UserReferal from "../userProfile/components/UserReferal";
import { OwnedOffersStatus } from "./components/OwnedOffersStatus";
import WalletInfo from "./components/WalletInfo";
import VoucherCard from "./components/VoucherCard";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <section className="w-full grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl flex flex-col justify-between">
          <WalletInfo />
          <OwnedOffersStatus value="all" />
        </div>
        <UserReferal referalCode="A123A" />
      </section>

      <section className="w-full mt-8">
        <p className="my-2 font-bold">24 أكتوبر 2025:</p>
        <div className="grid grid-cols-2 gap-5">
          <VoucherCard />
          <VoucherCard />
          <VoucherCard />
          <VoucherCard />
        </div>
      </section>
    </WrapperContainer>
  );
};

export default page;
