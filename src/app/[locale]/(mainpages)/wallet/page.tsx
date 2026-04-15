"use client";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import UserReferal from "../userProfile/components/UserReferal";
import { OwnedOffersStatus } from "./components/OwnedOffersStatus";
import WalletInfo from "./components/WalletInfo";
import WalletTransactions from "./components/WalletTransactions";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <section className="mt-4 grid w-full min-w-0 grid-cols-1 gap-4 sm:mt-6 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col rounded-2xl bg-white p-3 sm:p-4">
          <WalletInfo />
          <OwnedOffersStatus value="all" />
        </div>
        <div className="min-w-0">
          <UserReferal />
        </div>
      </section>

      <WalletTransactions />
    </WrapperContainer>
  );
};

export default page;
